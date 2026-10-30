import React from 'react';

let counter = 0;

/**
 * The Lucent mark: a faceted glass crystal. Each facet is lit from the top left so the
 * shape reads as a translucent prism on dark backgrounds.
 */
const LucentLogo = ({ className }: { className?: string }) => {
    const id = React.useMemo(() => `lucent-${++counter}`, []);

    return (
        <svg viewBox={'0 0 32 32'} className={className} fill={'none'} aria-hidden={'true'}>
            <defs>
                <linearGradient id={`${id}-a`} x1={'4'} y1={'2'} x2={'28'} y2={'30'} gradientUnits={'userSpaceOnUse'}>
                    <stop stopColor={'#67e8f9'} />
                    <stop offset={'0.55'} stopColor={'#7a5cff'} />
                    <stop offset={'1'} stopColor={'#c026d3'} />
                </linearGradient>
                <linearGradient id={`${id}-b`} x1={'16'} y1={'2'} x2={'16'} y2={'16'} gradientUnits={'userSpaceOnUse'}>
                    <stop stopColor={'#ffffff'} stopOpacity={'0.95'} />
                    <stop offset={'1'} stopColor={'#a5f3fc'} stopOpacity={'0.35'} />
                </linearGradient>
            </defs>
            {/* Base crystal */}
            <path d={'M16 2 28 9v14l-12 7-12-7V9l12-7Z'} fill={`url(#${id}-a)`} />
            {/* Facets */}
            <path d={'M16 2 4 9l12 7 12-7-12-7Z'} fill={`url(#${id}-b)`} opacity={'0.55'} />
            <path d={'M4 9v14l12 7V16L4 9Z'} fill={'#0b1030'} opacity={'0.18'} />
            <path d={'M28 9v14l-12 7V16l12-7Z'} fill={'#05010f'} opacity={'0.38'} />
            {/* Glass edges */}
            <path
                d={'M16 2 28 9v14l-12 7-12-7V9l12-7Z M4 9l12 7 12-7 M16 16v14'}
                stroke={'#ffffff'}
                strokeOpacity={'0.45'}
                strokeWidth={'0.9'}
                strokeLinejoin={'round'}
            />
        </svg>
    );
};

export default LucentLogo;
