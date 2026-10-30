import React from 'react';
import classNames from 'classnames';

// Gradient pairs for server tiles. Each server gets a stable one based on its UUID so
// lists are easy to scan at a glance.
const gradients = [
    'from-cyan-400 to-violet-600',
    'from-violet-500 to-fuchsia-500',
    'from-sky-400 to-indigo-500',
    'from-emerald-400 to-cyan-600',
    'from-amber-400 to-rose-500',
    'from-fuchsia-500 to-indigo-600',
];

const gradientFor = (uuid: string) =>
    gradients[uuid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length];

export const initials = (name: string) =>
    name
        .split(/[\s\-_]+/)
        .filter((part) => /^[a-z0-9]/i.test(part) && part.toLowerCase() !== 'x')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || '?';

interface Props {
    uuid: string;
    name: string;
    size?: 'md' | 'lg';
    className?: string;
}

const ServerTile = ({ uuid, name, size = 'md', className }: Props) => (
    <div
        className={classNames(
            'relative flex flex-shrink-0 items-center justify-center bg-gradient-to-br font-header font-bold text-white',
            size === 'lg'
                ? 'h-14 w-14 rounded-2xl text-lg shadow-[0_10px_30px_-8px_rgba(122,92,255,0.7)]'
                : 'h-12 w-12 rounded-xl text-base shadow-[0_8px_24px_-8px_rgba(122,92,255,0.6)]',
            gradientFor(uuid),
            className
        )}
    >
        <span
            className={classNames(
                'absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-60 ring-1 ring-inset ring-white/25',
                size === 'lg' ? 'rounded-2xl' : 'rounded-xl'
            )}
        />
        <span className={'relative drop-shadow'}>{initials(name)}</span>
    </div>
);

export default ServerTile;
