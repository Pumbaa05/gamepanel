import React, { useEffect, useRef } from 'react';
import { ServerContext } from '@/state/server';
import { SocketEvent } from '@/components/server/events';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import { Line } from 'react-chartjs-2';
import { chartColors, gradientFill, useChart, useChartTickLabel } from '@/components/server/console/chart';
import { bytesToString, mbToBytes } from '@/lib/formatters';
import ChartBlock from '@/components/server/console/ChartBlock';

export default () => {
    const status = ServerContext.useStoreState((state) => state.status.value);
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);
    const previous = useRef<Record<'tx' | 'rx', number>>({ tx: -1, rx: -1 });

    const cpu = useChartTickLabel('CPU', limits.cpu, '%', 0, chartColors.cyan);
    const memory = useChart('Memory', {
        sets: 1,
        options: {
            scales: {
                y: {
                    suggestedMax: limits.memory,
                    ticks: {
                        callback(value) {
                            const mb = typeof value === 'string' ? parseInt(value, 10) : value;
                            return mb > 0 ? bytesToString(mbToBytes(mb), 0) : '0';
                        },
                    },
                },
            },
        },
        callback: (opts) => ({
            ...opts,
            borderColor: chartColors.violet.line,
            backgroundColor: gradientFill(chartColors.violet.rgb),
        }),
    });
    const network = useChart('Network', {
        sets: 2,
        options: {
            scales: {
                y: {
                    ticks: {
                        callback(value) {
                            return bytesToString(typeof value === 'string' ? parseInt(value, 10) : value);
                        },
                    },
                },
            },
        },
        // The first data set is outbound (tx) traffic and the second is inbound (rx).
        callback(opts, index) {
            const color = !index ? chartColors.fuchsia : chartColors.cyan;
            return {
                ...opts,
                label: !index ? 'Network Out' : 'Network In',
                borderColor: color.line,
                backgroundColor: gradientFill(color.rgb),
            };
        },
    });

    useEffect(() => {
        if (status === 'offline') {
            cpu.clear();
            memory.clear();
            network.clear();
        }
    }, [status]);

    useWebsocketEvent(SocketEvent.STATS, (data: string) => {
        let values: any = {};
        try {
            values = JSON.parse(data);
        } catch (e) {
            return;
        }
        cpu.push(values.cpu_absolute);
        memory.push(Math.floor(values.memory_bytes / 1024 / 1024));
        network.push([
            previous.current.tx < 0 ? 0 : Math.max(0, values.network.tx_bytes - previous.current.tx),
            previous.current.rx < 0 ? 0 : Math.max(0, values.network.rx_bytes - previous.current.rx),
        ]);

        previous.current = { tx: values.network.tx_bytes, rx: values.network.rx_bytes };
    });

    const latest = (data: (number | null | unknown)[]) => {
        const value = data[data.length - 1];
        return typeof value === 'number' && value >= 0 ? value : null;
    };
    const cpuNow = latest(cpu.props.data.datasets[0].data);
    const memoryNow = latest(memory.props.data.datasets[0].data);
    const txNow = latest(network.props.data.datasets[0].data);
    const rxNow = latest(network.props.data.datasets[1].data);
    const offline = !status || status === 'offline';

    return (
        <>
            <ChartBlock
                title={'CPU Load'}
                value={
                    offline || cpuNow === null ? (
                        <span className={'text-neutral-500'}>&mdash;</span>
                    ) : (
                        <>
                            {cpuNow.toFixed(1)}%
                            {limits.cpu > 0 && (
                                <span className={'ml-1 text-xs font-normal text-neutral-500'}>/ {limits.cpu}%</span>
                            )}
                        </>
                    )
                }
            >
                <Line {...cpu.props} />
            </ChartBlock>
            <ChartBlock
                title={'Memory'}
                value={
                    offline || memoryNow === null ? (
                        <span className={'text-neutral-500'}>&mdash;</span>
                    ) : (
                        <>
                            {bytesToString(mbToBytes(memoryNow), 1)}
                            {limits.memory > 0 && (
                                <span className={'ml-1 text-xs font-normal text-neutral-500'}>
                                    / {bytesToString(mbToBytes(limits.memory), 0)}
                                </span>
                            )}
                        </>
                    )
                }
            >
                <Line {...memory.props} />
            </ChartBlock>
            <ChartBlock
                title={'Network'}
                value={
                    offline || rxNow === null || txNow === null ? (
                        <span className={'text-neutral-500'}>&mdash;</span>
                    ) : (
                        <span className={'text-base'}>
                            <span className={'text-cyan-300'}>&darr;</span> {bytesToString(rxNow, 1)}
                            <span className={'ml-3 text-fuchsia-300'}>&uarr;</span> {bytesToString(txNow, 1)}
                        </span>
                    )
                }
                legend={
                    <>
                        <span className={'inline-flex items-center gap-1.5 text-neutral-400'}>
                            <span
                                className={'h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]'}
                            />
                            In
                        </span>
                        <span className={'inline-flex items-center gap-1.5 text-neutral-400'}>
                            <span
                                className={'h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_6px_rgba(232,121,249,0.9)]'}
                            />
                            Out
                        </span>
                    </>
                }
            >
                <Line {...network.props} />
            </ChartBlock>
        </>
    );
};
