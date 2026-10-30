import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';
import LucentLogo from '@/components/elements/LucentLogo';

const RightNavigation = styled.div`
    & > a,
    & > button,
    & > .navigation-link {
        ${tw`relative flex items-center justify-center w-10 h-10 rounded-xl no-underline text-neutral-300 cursor-pointer transition-all duration-150`};

        &:hover {
            ${tw`text-neutral-50`};
            background: rgba(255, 255, 255, 0.07);
        }

        &.active {
            ${tw`text-neutral-50`};
            background: rgba(122, 92, 255, 0.16);
            box-shadow: inset 0 0 0 1px rgba(167, 139, 250, 0.28);

            &::after {
                content: '';
                ${tw`absolute rounded-full`};
                bottom: 3px;
                left: 50%;
                width: 14px;
                height: 2px;
                transform: translateX(-50%);
                background: linear-gradient(90deg, #22d3ee, #a78bfa);
                box-shadow: 0 0 8px rgba(122, 92, 255, 0.9);
            }
        }
    }
`;

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const username = useStoreState((state: ApplicationStore) => state.user.data!.username);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <div className={'sticky top-0 z-40 w-full px-3 pt-3 sm:px-4'}>
            <SpinnerOverlay visible={isLoggingOut} />
            <nav className={'glass-strong mx-auto flex h-14 w-full max-w-[1200px] items-center px-2 sm:px-3'}>
                <div id={'logo'} className={'flex min-w-0 flex-1 items-center'}>
                    <Link
                        to={'/'}
                        className={
                            'group flex min-w-0 items-center gap-2.5 rounded-xl px-2 py-1.5 no-underline transition-colors duration-150 hover:bg-white/5'
                        }
                    >
                        <LucentLogo
                            className={
                                'h-7 w-7 flex-shrink-0 drop-shadow-[0_0_10px_rgba(122,92,255,0.55)] transition-transform duration-300 group-hover:rotate-[30deg]'
                            }
                        />
                        <span className={'truncate font-header text-lg font-semibold tracking-tight text-gray-50'}>
                            {name}
                        </span>
                    </Link>
                </div>
                <RightNavigation className={'flex h-full items-center gap-1'}>
                    <SearchContainer />
                    <Tooltip placement={'bottom'} content={'Dashboard'}>
                        <NavLink to={'/'} exact>
                            <FontAwesomeIcon icon={faLayerGroup} />
                        </NavLink>
                    </Tooltip>
                    {rootAdmin && (
                        <Tooltip placement={'bottom'} content={'Admin'}>
                            <a href={'/admin'} rel={'noreferrer'}>
                                <FontAwesomeIcon icon={faCogs} />
                            </a>
                        </Tooltip>
                    )}
                    <span className={'mx-1 hidden h-6 w-px bg-white/10 sm:block'} />
                    <Tooltip placement={'bottom'} content={'Account Settings'}>
                        <NavLink to={'/account'} className={'!w-auto gap-2 px-1.5 sm:pr-3'}>
                            <span className={'flex h-7 w-7 items-center rounded-full ring-2 ring-white/10'}>
                                <Avatar.User />
                            </span>
                            <span className={'hidden max-w-[9rem] truncate text-sm font-medium md:block'}>
                                {username}
                            </span>
                        </NavLink>
                    </Tooltip>
                    <Tooltip placement={'bottom'} content={'Sign Out'}>
                        <button onClick={onTriggerLogout} className={'hover:!text-rose-300'}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </Tooltip>
                </RightNavigation>
            </nav>
        </div>
    );
};
