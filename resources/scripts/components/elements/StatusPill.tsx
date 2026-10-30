import React from 'react';
import classNames from 'classnames';

export type PillState = 'running' | 'starting' | 'stopping' | 'offline' | 'suspended' | 'unavailable' | 'loading';

const styles: Record<PillState, { label: string; text: string; dot: string; ring: string; pulse: boolean }> = {
    running: {
        label: 'Online',
        text: 'text-emerald-200',
        dot: 'bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.75)]',
        ring: 'bg-emerald-400/10 ring-emerald-400/25',
        pulse: true,
    },
    starting: {
        label: 'Starting',
        text: 'text-amber-100',
        dot: 'bg-amber-400 shadow-[0_0_10px_2px_rgba(251,191,36,0.7)]',
        ring: 'bg-amber-400/10 ring-amber-400/25',
        pulse: true,
    },
    stopping: {
        label: 'Stopping',
        text: 'text-amber-100',
        dot: 'bg-amber-400 shadow-[0_0_10px_2px_rgba(251,191,36,0.7)]',
        ring: 'bg-amber-400/10 ring-amber-400/25',
        pulse: true,
    },
    offline: {
        label: 'Offline',
        text: 'text-rose-200',
        dot: 'bg-rose-400 shadow-[0_0_8px_1px_rgba(251,113,133,0.55)]',
        ring: 'bg-rose-400/10 ring-rose-400/20',
        pulse: false,
    },
    suspended: {
        label: 'Suspended',
        text: 'text-rose-200',
        dot: 'bg-rose-500',
        ring: 'bg-rose-500/10 ring-rose-500/25',
        pulse: false,
    },
    unavailable: {
        label: 'Unavailable',
        text: 'text-neutral-300',
        dot: 'bg-neutral-400',
        ring: 'bg-white/5 ring-white/10',
        pulse: false,
    },
    loading: {
        label: 'Checking',
        text: 'text-neutral-300',
        dot: 'bg-neutral-400 animate-pulse',
        ring: 'bg-white/5 ring-white/10',
        pulse: false,
    },
};

const StatusPill = ({ state, className }: { state: PillState; className?: string }) => {
    const style = styles[state] || styles.loading;

    return (
        <span
            className={classNames(
                'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
                style.ring,
                style.text,
                className
            )}
        >
            <span className={'relative flex h-2 w-2'}>
                {style.pulse && (
                    <span
                        className={classNames(
                            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-60',
                            style.dot
                        )}
                    />
                )}
                <span className={classNames('relative inline-flex h-2 w-2 rounded-full', style.dot)} />
            </span>
            {style.label}
        </span>
    );
};

export default StatusPill;
