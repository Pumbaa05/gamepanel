import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';
// @ts-expect-error untyped font file
import inter from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2';
// @ts-expect-error untyped font file
import spaceGrotesk from '@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2';
// @ts-expect-error untyped font file
import jetbrainsMono from '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2';

const latin =
    'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

export default createGlobalStyle`
    @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-display: swap;
        font-weight: 100 900;
        src: url(${inter}) format('woff2-variations');
        unicode-range: ${latin};
    }

    @font-face {
        font-family: 'Space Grotesk';
        font-style: normal;
        font-display: swap;
        font-weight: 300 700;
        src: url(${spaceGrotesk}) format('woff2-variations');
        unicode-range: ${latin};
    }

    @font-face {
        font-family: 'JetBrains Mono';
        font-style: normal;
        font-display: swap;
        font-weight: 100 800;
        src: url(${jetbrainsMono}) format('woff2-variations');
        unicode-range: ${latin};
    }

    html {
        background-color: #05070c;
    }

    body {
        ${tw`font-sans text-neutral-200 antialiased`};
        min-height: 100vh;
        letter-spacing: 0.005em;
        background-color: #05070c !important;
        background-image:
            radial-gradient(60rem 40rem at 6% -14%, rgba(34, 211, 238, 0.24), transparent 62%),
            radial-gradient(56rem 42rem at 98% -6%, rgba(122, 92, 255, 0.32), transparent 60%),
            radial-gradient(52rem 36rem at 55% 115%, rgba(168, 85, 247, 0.2), transparent 62%),
            radial-gradient(40rem 30rem at 88% 58%, rgba(34, 211, 238, 0.1), transparent 62%),
            radial-gradient(46rem 34rem at 8% 72%, rgba(122, 92, 255, 0.15), transparent 62%),
            linear-gradient(180deg, #070a14 0%, #05070c 100%);
        background-attachment: fixed;
    }

    /* Faint futuristic grid that fades out towards the bottom of the screen. */
    body::before {
        content: '';
        position: fixed;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        background-image:
            linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
        background-size: 56px 56px;
        mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 0%, transparent 75%);
        -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 0%, transparent 75%);
    }

    #app {
        position: relative;
        isolation: isolate;
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-tight font-header`};
    }

    p {
        ${tw`text-neutral-200 leading-snug font-sans`};
    }

    form {
        ${tw`m-0`};
    }

    ::selection {
        background: rgba(122, 92, 255, 0.45);
        color: #fff;
    }

    textarea, select, input, button, button:focus, button:focus-visible {
        ${tw`outline-none`};
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* Scroll Bar Style */
    * {
        scrollbar-color: rgba(255, 255, 255, 0.16) transparent;
    }

    ::-webkit-scrollbar {
        background: none;
        width: 12px;
        height: 12px;
    }

    ::-webkit-scrollbar-thumb {
        background-clip: padding-box;
        border: 3px solid transparent;
        border-radius: 999px;
        background-color: rgba(255, 255, 255, 0.14);
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: rgba(255, 255, 255, 0.24);
    }

    ::-webkit-scrollbar-track-piece {
        margin: 4px 0;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }
`;
