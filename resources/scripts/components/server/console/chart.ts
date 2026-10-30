import {
    Chart as ChartJS,
    Plugin,
    ScriptableContext,
    ChartData,
    ChartDataset,
    ChartOptions,
    Filler,
    LinearScale,
    LineElement,
    PointElement,
} from 'chart.js';
import { DeepPartial } from 'ts-essentials';
import { useState } from 'react';
import { deepmerge, deepmergeCustom } from 'deepmerge-ts';
import { theme } from 'twin.macro';

// Soft neon glow under each line, using the dataset's own colour.
const glow: Plugin<'line'> = {
    id: 'lucentGlow',
    beforeDatasetDraw(chart, args) {
        const dataset = chart.data.datasets[args.index];
        chart.ctx.save();
        chart.ctx.shadowColor =
            typeof dataset.borderColor === 'string' ? dataset.borderColor : 'rgba(122, 92, 255, 0.8)';
        chart.ctx.shadowBlur = 14;
        chart.ctx.shadowOffsetY = 4;
    },
    afterDatasetDraw(chart) {
        chart.ctx.restore();
    },
};

ChartJS.register(LineElement, PointElement, Filler, LinearScale, glow);

export interface ChartColor {
    line: string;
    // RGB triplet, e.g. "34, 211, 238", used for the gradient fill.
    rgb: string;
}

export const chartColors: Record<'cyan' | 'violet' | 'fuchsia', ChartColor> = {
    cyan: { line: '#22d3ee', rgb: '34, 211, 238' },
    violet: { line: '#a78bfa', rgb: '139, 92, 246' },
    fuchsia: { line: '#e879f9', rgb: '232, 121, 249' },
};

// Vertical gradient that fades from the line colour to transparent.
export const gradientFill =
    (rgb: string) =>
    (context: ScriptableContext<'line'>): CanvasGradient | string => {
        const { ctx, chartArea } = context.chart;
        if (!chartArea) {
            return `rgba(${rgb}, 0.15)`;
        }
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, `rgba(${rgb}, 0.55)`);
        gradient.addColorStop(0.65, `rgba(${rgb}, 0.12)`);
        gradient.addColorStop(1, `rgba(${rgb}, 0)`);
        return gradient;
    };

const options: ChartOptions<'line'> = {
    responsive: true,
    animation: false,
    plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: { enabled: false },
    },
    layout: {
        padding: 0,
    },
    scales: {
        x: {
            min: 0,
            max: 19,
            type: 'linear',
            grid: {
                display: false,
                drawBorder: false,
            },
            ticks: {
                display: false,
            },
        },
        y: {
            min: 0,
            type: 'linear',
            grid: {
                display: true,
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false,
            },
            ticks: {
                display: true,
                count: 3,
                color: theme('colors.gray.400'),
                font: {
                    family: theme('fontFamily.mono'),
                    size: 10,
                    weight: '400',
                },
            },
        },
    },
    elements: {
        point: {
            radius: 0,
        },
        line: {
            tension: 0.35,
            borderWidth: 2,
        },
    },
};

function getOptions(opts?: DeepPartial<ChartOptions<'line'>> | undefined): ChartOptions<'line'> {
    return deepmerge(options, opts || {});
}

type ChartDatasetCallback = (value: ChartDataset<'line'>, index: number) => ChartDataset<'line'>;

function getEmptyData(label: string, sets = 1, callback?: ChartDatasetCallback | undefined): ChartData<'line'> {
    const next = callback || ((value) => value);

    return {
        labels: Array(20)
            .fill(0)
            .map((_, index) => index),
        datasets: Array(sets)
            .fill(0)
            .map((_, index) =>
                next(
                    {
                        fill: true,
                        label,
                        data: Array(20).fill(-5),
                        borderColor: chartColors.cyan.line,
                        backgroundColor: gradientFill(chartColors.cyan.rgb),
                    },
                    index
                )
            ),
    };
}

const merge = deepmergeCustom({ mergeArrays: false });

interface UseChartOptions {
    sets: number;
    options?: DeepPartial<ChartOptions<'line'>> | number | undefined;
    callback?: ChartDatasetCallback | undefined;
}

function useChart(label: string, opts?: UseChartOptions) {
    const options = getOptions(
        typeof opts?.options === 'number' ? { scales: { y: { min: 0, suggestedMax: opts.options } } } : opts?.options
    );
    const [data, setData] = useState(getEmptyData(label, opts?.sets || 1, opts?.callback));

    const push = (items: number | null | (number | null)[]) =>
        setData((state) =>
            merge(state, {
                datasets: (Array.isArray(items) ? items : [items]).map((item, index) => ({
                    ...state.datasets[index],
                    data: state.datasets[index].data
                        .slice(1)
                        .concat(typeof item === 'number' ? Number(item.toFixed(2)) : item),
                })),
            })
        );

    const clear = () =>
        setData((state) =>
            merge(state, {
                datasets: state.datasets.map((value) => ({
                    ...value,
                    data: Array(20).fill(-5),
                })),
            })
        );

    return { props: { data, options }, push, clear };
}

function useChartTickLabel(label: string, max: number, tickLabel: string, roundTo?: number, color?: ChartColor) {
    return useChart(label, {
        sets: 1,
        callback: color
            ? (opts) => ({ ...opts, borderColor: color.line, backgroundColor: gradientFill(color.rgb) })
            : undefined,
        options: {
            scales: {
                y: {
                    suggestedMax: max,
                    ticks: {
                        callback(value) {
                            return `${roundTo ? Number(value).toFixed(roundTo) : value}${tickLabel}`;
                        },
                    },
                },
            },
        },
    });
}

export { useChart, useChartTickLabel, getOptions, getEmptyData };
