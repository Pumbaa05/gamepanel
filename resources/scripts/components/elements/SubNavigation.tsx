import styled from 'styled-components/macro';
import tw from 'twin.macro';

/**
 * Secondary navigation (server tabs, account tabs). Renders as a floating glass
 * pill bar under the main navigation with a glowing active tab.
 */
const SubNavigation = styled.div`
    ${tw`w-full mt-3 px-3 sm:px-4`};

    & > div {
        ${tw`flex items-center text-sm mx-auto p-1.5 gap-1 overflow-x-auto`};
        max-width: 1200px;
        border-radius: 1rem;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
        border: 1px solid rgba(255, 255, 255, 0.07);
        box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(16px) saturate(140%);
        -webkit-backdrop-filter: blur(16px) saturate(140%);
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }

        & > a,
        & > div {
            ${tw`inline-flex items-center py-2 px-3.5 rounded-xl text-neutral-300 font-medium no-underline whitespace-nowrap transition-all duration-150`};

            &:hover {
                ${tw`text-neutral-50`};
                background: rgba(255, 255, 255, 0.06);
            }

            &:active,
            &.active {
                ${tw`text-white`};
                background: linear-gradient(110deg, rgba(34, 211, 238, 0.2), rgba(122, 92, 255, 0.28));
                box-shadow: inset 0 0 0 1px rgba(167, 139, 250, 0.32), 0 6px 20px -8px rgba(122, 92, 255, 0.7);
            }
        }
    }
`;

export default SubNavigation;
