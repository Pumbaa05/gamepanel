import React from 'react';
import Icon from '@/components/elements/Icon';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import styles from './style.module.css';
import useFitText from 'use-fit-text';
import CopyOnClick from '@/components/elements/CopyOnClick';

interface StatBlockProps {
    title: string;
    copyOnClick?: string;
    color?: string | undefined;
    icon: IconDefinition;
    children: React.ReactNode;
    className?: string;
}

// The details block passes a Tailwind background class to flag a warning (yellow) or
// critical (red) value. Map those onto Lucent's tinted glass tones.
const tones = (color?: string) => {
    if (color === 'bg-red-500') {
        return {
            block: 'ring-1 ring-inset ring-rose-400/40 shadow-[0_0_30px_-12px_rgba(244,63,94,0.8)]',
            icon: 'bg-gradient-to-br from-rose-400/40 to-rose-600/30 text-rose-100',
            bar: 'bg-rose-400',
        };
    }
    if (color === 'bg-yellow-500') {
        return {
            block: 'ring-1 ring-inset ring-amber-300/35',
            icon: 'bg-gradient-to-br from-amber-300/40 to-amber-600/25 text-amber-50',
            bar: 'bg-amber-300',
        };
    }

    return {
        block: '',
        icon: 'bg-gradient-to-br from-cyan-400/20 to-violet-500/25 text-cyan-100',
        bar: 'bg-violet-400/60',
    };
};

export default ({ title, copyOnClick, icon, color, className, children }: StatBlockProps) => {
    const { fontSize, ref } = useFitText({ minFontSize: 8, maxFontSize: 500 });
    const tone = tones(color);

    return (
        <CopyOnClick text={copyOnClick}>
            <div className={classNames(styles.stat_block, 'glass', tone.block, className)}>
                <div className={classNames(styles.status_bar, tone.bar)} />
                <div className={classNames(styles.icon, tone.icon)}>
                    <Icon icon={icon} />
                </div>
                <div className={'flex flex-col justify-center overflow-hidden w-full'}>
                    <p className={'eyebrow !tracking-[0.14em] leading-tight'}>{title}</p>
                    <div
                        ref={ref}
                        className={'mt-0.5 h-[1.6rem] w-full font-header font-semibold text-gray-50 truncate'}
                        style={{ fontSize }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </CopyOnClick>
    );
};
