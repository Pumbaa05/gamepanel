const colors = require('tailwindcss/colors');

// Lucent: cool, deep-space greys. The darker steps are used for surfaces and the
// lighter steps for text, so the whole panel picks up the new tone automatically.
const gray = {
    50: '#f4f6fb',
    100: '#e6e9f2',
    200: '#c8cedd',
    300: '#a2abc2',
    400: '#7c87a3',
    500: '#5a6482',
    600: '#3b4361',
    700: '#252b43',
    800: '#151a2c',
    900: '#0b0e1a',
};

// Lucent accent: electric violet. Replaces the stock blue everywhere "primary" or
// "blue" is used (buttons, links, focus rings).
const violet = {
    50: '#f2f0ff',
    100: '#e5e1ff',
    200: '#cec6ff',
    300: '#ae9fff',
    400: '#8f7cff',
    500: '#7a5cff',
    600: '#6842f5',
    700: '#5733d6',
    800: '#472bab',
    900: '#3a2687',
};

module.exports = {
    content: [
        './resources/scripts/**/*.{js,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
                header: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
            },
            colors: {
                black: '#05070c',
                // "primary" and "neutral" are deprecated, prefer the use of "blue" and "gray"
                // in new code.
                primary: violet,
                blue: violet,
                gray: gray,
                neutral: gray,
                cyan: colors.cyan,
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: theme => ({
                default: theme('colors.neutral.400', 'currentColor'),
            }),
            boxShadow: {
                glow: '0 0 0 1px rgba(122, 92, 255, 0.35), 0 8px 30px -6px rgba(122, 92, 255, 0.45)',
                'glow-cyan': '0 0 0 1px rgba(34, 211, 238, 0.35), 0 8px 30px -6px rgba(34, 211, 238, 0.4)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ]
};
