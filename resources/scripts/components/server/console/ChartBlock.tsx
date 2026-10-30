import React from 'react';
import classNames from 'classnames';
import styles from '@/components/server/console/style.module.css';

interface ChartBlockProps {
    title: string;
    value?: React.ReactNode;
    legend?: React.ReactNode;
    children: React.ReactNode;
}

export default ({ title, value, legend, children }: ChartBlockProps) => (
    <div className={classNames(styles.chart_container, 'glass group')}>
        <div className={'flex items-center justify-between gap-3 px-4 pt-3 pb-1'}>
            <div className={'min-w-0'}>
                <h3 className={'eyebrow transition-colors duration-100 group-hover:text-neutral-200'}>{title}</h3>
                {value !== undefined && (
                    <p className={'mt-0.5 truncate font-header text-lg font-semibold text-gray-50'}>{value}</p>
                )}
            </div>
            {legend && <div className={'flex flex-shrink-0 items-center gap-3 text-xs'}>{legend}</div>}
        </div>
        <div className={'z-10 px-1 pb-1'}>{children}</div>
    </div>
);
