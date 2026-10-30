import React, { useEffect, useState } from 'react';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import { PowerAction } from '@/components/server/console/ServerConsoleContainer';
import { Dialog } from '@/components/elements/dialog';
import classNames from 'classnames';
import { PlayIcon, RefreshIcon, StopIcon } from '@heroicons/react/solid';

interface PowerButtonProps {
    className?: string;
}

const base =
    'inline-flex flex-1 md:flex-none items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold ' +
    'transition-all duration-150 focus-visible:ring-2 focus-visible:ring-violet-400/60 ' +
    'disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none';

const variants = {
    start:
        'text-white bg-gradient-to-r from-emerald-400 to-cyan-500 shadow-[0_8px_24px_-8px_rgba(16,185,129,0.8)] ' +
        'hover:brightness-110 hover:shadow-[0_10px_30px_-6px_rgba(34,211,238,0.8)]',
    restart:
        'text-neutral-100 bg-white/[0.07] ring-1 ring-inset ring-white/10 hover:bg-white/[0.12] hover:ring-white/20',
    stop:
        'text-rose-100 bg-rose-500/15 ring-1 ring-inset ring-rose-400/30 hover:bg-rose-500/25 hover:ring-rose-400/50 ' +
        'hover:shadow-[0_8px_24px_-10px_rgba(244,63,94,0.8)]',
};

export default ({ className }: PowerButtonProps) => {
    const [open, setOpen] = useState(false);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);

    const killable = status === 'stopping';
    const onButtonClick = (
        action: PowerAction | 'kill-confirmed',
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
        e.preventDefault();
        if (action === 'kill') {
            return setOpen(true);
        }

        if (instance) {
            setOpen(false);
            instance.send('set state', action === 'kill-confirmed' ? 'kill' : action);
        }
    };

    useEffect(() => {
        if (status === 'offline') {
            setOpen(false);
        }
    }, [status]);

    return (
        <div className={className}>
            <Dialog.Confirm
                open={open}
                hideCloseIcon
                onClose={() => setOpen(false)}
                title={'Forcibly Stop Process'}
                confirm={'Continue'}
                onConfirmed={onButtonClick.bind(this, 'kill-confirmed')}
            >
                Forcibly stopping a server can lead to data corruption.
            </Dialog.Confirm>
            <Can action={'control.start'}>
                <button
                    className={classNames(base, variants.start)}
                    disabled={status !== 'offline'}
                    onClick={onButtonClick.bind(this, 'start')}
                >
                    <PlayIcon className={'h-4 w-4'} />
                    Start
                </button>
            </Can>
            <Can action={'control.restart'}>
                <button
                    className={classNames(base, variants.restart)}
                    disabled={!status}
                    onClick={onButtonClick.bind(this, 'restart')}
                >
                    <RefreshIcon className={'h-4 w-4'} />
                    Restart
                </button>
            </Can>
            <Can action={'control.stop'}>
                <button
                    className={classNames(base, variants.stop)}
                    disabled={status === 'offline'}
                    onClick={onButtonClick.bind(this, killable ? 'kill' : 'stop')}
                >
                    <StopIcon className={'h-4 w-4'} />
                    {killable ? 'Kill' : 'Stop'}
                </button>
            </Can>
        </div>
    );
};
