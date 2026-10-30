import { css } from 'styled-components/macro';

// Mirrors the `.glass` class in tailwind.css for use inside styled-components.
export const glass = css`
    position: relative;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.085) 0%, rgba(255, 255, 255, 0.03) 100%);
    border: 1px solid rgba(255, 255, 255, 0.09);
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.07), 0 24px 48px -28px rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(20px) saturate(150%);
    -webkit-backdrop-filter: blur(20px) saturate(150%);
`;
