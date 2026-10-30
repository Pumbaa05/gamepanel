import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEthernet } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import Spinner from '@/components/elements/Spinner';
import classNames from 'classnames';
import StatusPill, { PillState } from '@/components/elements/StatusPill';
import ServerTile from '@/components/elements/ServerTile';

interface MeterProps {
    label: string;
    value: string;
    limit: string;
    percent: number | null;
    alarm: boolean;
}

const Meter = ({ label, value, limit, percent, alarm }: MeterProps) => (
    <div className={'min-w-0'}>
        <p className={'eyebrow !tracking-[0.14em]'}>{label}</p>
        <p className={'mt-1 truncate font-header text-sm font-semibold text-gray-50'}>
            {value}
            <span className={'ml-1 text-2xs font-normal text-neutral-500'}>/ {limit}</span>
        </p>
        <div className={'mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]'}>
            <div
                className={classNames(
                    'h-full rounded-full transition-all duration-700',
                    alarm
                        ? 'bg-gradient-to-r from-amber-400 to-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.7)]'
                        : 'bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_10px_rgba(122,92,255,0.6)]'
                )}
                style={{ width: `${percent === null ? 0 : Math.max(2, Math.min(100, percent))}%` }}
            />
        </div>
    </div>
);

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        // Don't waste a HTTP request if there is nothing important to show to the user because
        // the server is suspended.
        if (isSuspended) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const percentOf = (bytes: number, limitMb: number) => (limitMb > 0 ? (bytes / mbToBytes(limitMb)) * 100 : null);

    const cpuPercent = stats && server.limits.cpu > 0 ? (stats.cpuUsagePercent / server.limits.cpu) * 100 : null;
    const memoryPercent = stats ? percentOf(stats.memoryUsageInBytes, server.limits.memory) : null;
    const diskPercent = stats ? percentOf(stats.diskUsageInBytes, server.limits.disk) : null;

    const address = server.allocations
        .filter((alloc) => alloc.isDefault)
        .map((allocation) => `${allocation.alias || ip(allocation.ip)}:${allocation.port}`)
        .join(', ');

    let pill: PillState = stats?.status || 'loading';
    let notice: string | null = null;
    if (isSuspended) {
        pill = 'suspended';
        notice = server.status === 'suspended' ? 'This server is suspended.' : 'Could not reach the node.';
    } else if (server.isTransferring || server.status) {
        notice = server.isTransferring
            ? 'Transferring to another node…'
            : server.status === 'installing'
            ? 'Installing…'
            : server.status === 'restoring_backup'
            ? 'Restoring a backup…'
            : 'Currently unavailable.';
        if (!stats) pill = 'unavailable';
    }

    return (
        <Link
            to={`/server/${server.id}`}
            className={classNames('glass glass-hover group flex flex-col p-5 no-underline', className)}
        >
            <div className={'flex items-start gap-4'}>
                <ServerTile uuid={server.uuid} name={server.name} />
                <div className={'min-w-0 flex-1'}>
                    <p className={'truncate font-header text-lg font-semibold leading-tight text-gray-50'}>
                        {server.name}
                    </p>
                    <p className={'mt-1 truncate text-sm text-neutral-400'}>{server.description || server.node}</p>
                </div>
                <StatusPill state={pill} className={'flex-shrink-0'} />
            </div>

            <div className={'glass-inset mt-4 flex items-center gap-2 px-3 py-2 font-mono text-xs text-neutral-300'}>
                <FontAwesomeIcon icon={faEthernet} className={'text-cyan-300/80'} />
                <span className={'truncate'}>{address || 'No allocation'}</span>
                <FontAwesomeIcon
                    icon={faArrowRight}
                    className={
                        'ml-auto -translate-x-1 text-neutral-500 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-violet-300 group-hover:opacity-100'
                    }
                />
            </div>

            <div className={'mt-4 min-h-[3.25rem]'}>
                {notice ? (
                    <p className={'flex h-full items-center text-sm text-neutral-400'}>{notice}</p>
                ) : !stats ? (
                    <div className={'flex h-[3.25rem] items-center justify-center'}>
                        <Spinner size={'small'} />
                    </div>
                ) : (
                    <div
                        className={classNames(
                            'grid grid-cols-3 gap-4 transition-opacity',
                            stats.status === 'offline' && 'opacity-50'
                        )}
                    >
                        <Meter
                            label={'CPU'}
                            value={`${stats.cpuUsagePercent.toFixed(0)}%`}
                            limit={server.limits.cpu > 0 ? `${server.limits.cpu}%` : '∞'}
                            percent={cpuPercent}
                            alarm={cpuPercent !== null && cpuPercent >= 90}
                        />
                        <Meter
                            label={'Memory'}
                            value={stats.memoryUsageInBytes < 1 ? '—' : bytesToString(stats.memoryUsageInBytes, 1)}
                            limit={server.limits.memory > 0 ? bytesToString(mbToBytes(server.limits.memory), 0) : '∞'}
                            percent={memoryPercent}
                            alarm={memoryPercent !== null && memoryPercent >= 90}
                        />
                        <Meter
                            label={'Disk'}
                            value={stats.diskUsageInBytes < 1 ? '—' : bytesToString(stats.diskUsageInBytes, 1)}
                            limit={server.limits.disk > 0 ? bytesToString(mbToBytes(server.limits.disk), 0) : '∞'}
                            percent={diskPercent}
                            alarm={diskPercent !== null && diskPercent >= 90}
                        />
                    </div>
                )}
            </div>
        </Link>
    );
};
