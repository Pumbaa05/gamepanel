import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ITerminalOptions, Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';
import { SearchBarAddon } from 'xterm-addon-search-bar';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { ScrollDownHelperAddon } from '@/plugins/XtermScrollDownHelperAddon';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { ServerContext } from '@/state/server';
import { usePermissions } from '@/plugins/usePermissions';
import { theme as th } from 'twin.macro';
import useEventListener from '@/plugins/useEventListener';
import { debounce } from 'debounce';
import { usePersistedState } from '@/plugins/usePersistedState';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import classNames from 'classnames';
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { useStoreState } from '@/state/hooks';

import 'xterm/css/xterm.css';
import styles from './style.module.css';

const theme = {
    background: 'rgba(0, 0, 0, 0)',
    cursor: 'transparent',
    black: th`colors.black`.toString(),
    red: '#fb7185',
    green: '#4ade80',
    yellow: '#fcd34d',
    blue: '#818cf8',
    magenta: '#c084fc',
    cyan: '#22d3ee',
    white: '#d6dbe8',
    brightBlack: 'rgba(255, 255, 255, 0.25)',
    brightRed: '#fda4af',
    brightGreen: '#86efac',
    brightYellow: '#fde68a',
    brightBlue: '#a5b4fc',
    brightMagenta: '#d8b4fe',
    brightCyan: '#67e8f9',
    brightWhite: '#ffffff',
    selection: 'rgba(122, 92, 255, 0.45)',
};

// Load the console font before xterm measures its character grid, otherwise the
// columns are sized for the fallback font.
const fontReady: Promise<unknown> =
    typeof document !== 'undefined' && document.fonts
        ? document.fonts.load('400 12px "JetBrains Mono"').catch(() => null)
        : Promise.resolve();

const terminalProps: ITerminalOptions = {
    disableStdin: true,
    cursorStyle: 'underline',
    allowTransparency: true,
    fontSize: 12,
    lineHeight: 1.25,
    fontFamily: th('fontFamily.mono'),
    rows: 30,
    theme: theme,
};

export default () => {
    const panelName = useStoreState((state) => state.settings.data?.name || 'pterodactyl');
    const TERMINAL_PRELUDE = `\u001b[1m\u001b[35mcontainer@${panelName.toLowerCase().replace(/\s+/g, '-')}~ \u001b[0m`;
    const ref = useRef<HTMLDivElement>(null);
    const terminal = useMemo(() => new Terminal({ ...terminalProps }), []);
    const fitAddon = new FitAddon();
    const searchAddon = new SearchAddon();
    const searchBar = new SearchBarAddon({ searchAddon });
    const webLinksAddon = new WebLinksAddon();
    const unicode11Addon = new Unicode11Addon();
    const scrollDownHelperAddon = new ScrollDownHelperAddon();
    const { connected, instance } = ServerContext.useStoreState((state) => state.socket);
    const [canSendCommands] = usePermissions(['control.console']);
    const serverId = ServerContext.useStoreState((state) => state.server.data!.id);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const [history, setHistory] = usePersistedState<string[]>(`${serverId}:command_history`, []);
    const [historyIndex, setHistoryIndex] = useState(-1);
    // SearchBarAddon has hardcoded z-index: 999 :(
    const zIndex = `
    .xterm-search-bar__addon {
        z-index: 10;
    }`;

    const handleConsoleOutput = (line: string, prelude = false) =>
        terminal.writeln((prelude ? TERMINAL_PRELUDE : '') + line.replace(/(?:\r\n|\r|\n)$/im, '') + '\u001b[0m');

    const handleTransferStatus = (status: string) => {
        switch (status) {
            // Sent by either the source or target node if a failure occurs.
            case 'failure':
                terminal.writeln(TERMINAL_PRELUDE + 'Transfer has failed.\u001b[0m');
                return;
        }
    };

    const handleDaemonErrorOutput = (line: string) =>
        terminal.writeln(
            TERMINAL_PRELUDE + '\u001b[1m\u001b[41m' + line.replace(/(?:\r\n|\r|\n)$/im, '') + '\u001b[0m'
        );

    const handlePowerChangeEvent = (state: string) =>
        terminal.writeln(TERMINAL_PRELUDE + 'Server marked as ' + state + '...\u001b[0m');

    const handleCommandKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            const newIndex = Math.min(historyIndex + 1, history!.length - 1);

            setHistoryIndex(newIndex);
            e.currentTarget.value = history![newIndex] || '';

            // By default up arrow will also bring the cursor to the start of the line,
            // so we'll preventDefault to keep it at the end.
            e.preventDefault();
        }

        if (e.key === 'ArrowDown') {
            const newIndex = Math.max(historyIndex - 1, -1);

            setHistoryIndex(newIndex);
            e.currentTarget.value = history![newIndex] || '';
        }

        const command = e.currentTarget.value;
        if (e.key === 'Enter' && command.length > 0) {
            setHistory((prevHistory) => [command, ...prevHistory!].slice(0, 32));
            setHistoryIndex(-1);

            instance && instance.send('send command', command);
            e.currentTarget.value = '';
        }
    };

    useEffect(() => {
        if (!connected) return;

        fontReady.then(() => {
            if (!ref.current || terminal.element) return;

            terminal.loadAddon(fitAddon);
            terminal.loadAddon(searchAddon);
            terminal.loadAddon(searchBar);
            terminal.loadAddon(webLinksAddon);
            terminal.loadAddon(unicode11Addon);
            terminal.loadAddon(scrollDownHelperAddon);

            terminal.open(ref.current);

            // Activate Unicode 11 for proper emoji and special character width handling
            terminal.unicode.activeVersion = '11';

            fitAddon.fit();
            searchBar.addNewStyle(zIndex);

            // Add support for capturing keys
            terminal.attachCustomKeyEventHandler((e: KeyboardEvent) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                    document.execCommand('copy');
                    return false;
                } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                    e.preventDefault();
                    searchBar.show();
                    return false;
                } else if (e.key === 'Escape') {
                    searchBar.hidden();
                }
                return true;
            });
        });
    }, [terminal, connected]);

    useEventListener(
        'resize',
        debounce(() => {
            if (terminal.element) {
                fitAddon.fit();
            }
        }, 100)
    );

    useEffect(() => {
        const listeners: Record<string, (s: string) => void> = {
            [SocketEvent.STATUS]: handlePowerChangeEvent,
            [SocketEvent.CONSOLE_OUTPUT]: handleConsoleOutput,
            [SocketEvent.INSTALL_OUTPUT]: handleConsoleOutput,
            [SocketEvent.TRANSFER_LOGS]: handleConsoleOutput,
            [SocketEvent.TRANSFER_STATUS]: handleTransferStatus,
            [SocketEvent.DAEMON_MESSAGE]: (line) => handleConsoleOutput(line, true),
            [SocketEvent.DAEMON_ERROR]: handleDaemonErrorOutput,
        };

        if (connected && instance) {
            // Do not clear the console if the server is being transferred.
            if (!isTransferring) {
                terminal.clear();
            }

            Object.keys(listeners).forEach((key: string) => {
                instance.addListener(key, listeners[key]);
            });
            instance.send(SocketRequest.SEND_LOGS);
        }

        return () => {
            if (instance) {
                Object.keys(listeners).forEach((key: string) => {
                    instance.removeListener(key, listeners[key]);
                });
            }
        };
    }, [connected, instance]);

    return (
        <div className={classNames(styles.terminal, 'glass relative')}>
            <div className={'flex items-center gap-3 border-b border-white/[0.06] px-4 py-2.5'}>
                <span className={'flex gap-1.5'}>
                    <span className={'h-2.5 w-2.5 rounded-full bg-rose-400/70'} />
                    <span className={'h-2.5 w-2.5 rounded-full bg-amber-300/70'} />
                    <span className={'h-2.5 w-2.5 rounded-full bg-emerald-400/70'} />
                </span>
                <p className={'eyebrow'}>Console</p>
                <span
                    className={classNames(
                        'ml-auto inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-wider',
                        connected ? 'text-emerald-300' : 'text-neutral-500'
                    )}
                >
                    <span
                        className={classNames(
                            'h-1.5 w-1.5 rounded-full',
                            connected
                                ? 'animate-pulse bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]'
                                : 'bg-neutral-500'
                        )}
                    />
                    {connected ? 'Live' : 'Connecting'}
                </span>
            </div>
            <SpinnerOverlay visible={!connected} size={'large'} />
            <div className={classNames(styles.container, styles.overflows_container)}>
                <div className={'h-full'}>
                    <div id={styles.terminal} ref={ref} />
                </div>
            </div>
            {canSendCommands && (
                <div className={classNames('relative', styles.overflows_container)}>
                    <input
                        className={classNames('peer', styles.command_input)}
                        type={'text'}
                        placeholder={'Type a command...'}
                        aria-label={'Console command input.'}
                        disabled={!instance || !connected}
                        onKeyDown={handleCommandKeyDown}
                        autoCorrect={'off'}
                        autoCapitalize={'none'}
                    />
                    <div
                        className={classNames(
                            'text-violet-300 peer-focus:text-cyan-300 peer-focus:animate-pulse',
                            styles.command_icon
                        )}
                    >
                        <ChevronDoubleRightIcon className={'w-4 h-4'} />
                    </div>
                </div>
            )}
        </div>
    );
};
