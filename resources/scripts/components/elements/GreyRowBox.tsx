import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { glass } from '@/assets/css/glass';

export default styled.div<{ $hoverable?: boolean }>`
    ${glass};
    ${tw`flex no-underline text-neutral-200 items-center p-4 overflow-hidden`};
    border-radius: 0.875rem;
    transition: border-color 150ms ease, background 150ms ease;

    ${(props) =>
        props.$hoverable !== false &&
        `
        &:hover {
            border-color: rgba(167, 139, 250, 0.32);
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.035));
        }
    `};

    & .icon {
        ${tw`rounded-xl w-12 h-12 flex flex-shrink-0 items-center justify-center p-3 text-cyan-200`};
        background: linear-gradient(135deg, rgba(34, 211, 238, 0.18), rgba(122, 92, 255, 0.22));
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    }
`;
