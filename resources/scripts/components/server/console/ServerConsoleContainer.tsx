import React, { memo } from 'react';
import { ServerContext } from '@/state/server';
import Can from '@/components/elements/Can';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import isEqual from 'react-fast-compare';
import Spinner from '@/components/elements/Spinner';
import Features from '@feature/Features';
import Console from '@/components/server/console/Console';
import StatGraphs from '@/components/server/console/StatGraphs';
import PowerButtons from '@/components/server/console/PowerButtons';
import ServerDetailsBlock from '@/components/server/console/ServerDetailsBlock';
import { Alert } from '@/components/elements/alert';
import ServerTile from '@/components/elements/ServerTile';
import StatusPill from '@/components/elements/StatusPill';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

const ServerConsoleContainer = () => {
    const name = ServerContext.useStoreState((state) => state.server.data!.name);
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const node = ServerContext.useStoreState((state) => state.server.data!.node);
    const description = ServerContext.useStoreState((state) => state.server.data!.description);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const isInstalling = ServerContext.useStoreState((state) => state.server.isInstalling);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState((state) => state.server.data!.eggFeatures, isEqual);
    const isNodeUnderMaintenance = ServerContext.useStoreState((state) => state.server.data!.isNodeUnderMaintenance);

    return (
        <ServerContentBlock title={'Console'}>
            {(isNodeUnderMaintenance || isInstalling || isTransferring) && (
                <Alert type={'warning'} className={'mb-4'}>
                    {isNodeUnderMaintenance
                        ? 'The node of this server is currently under maintenance and all actions are unavailable.'
                        : isInstalling
                        ? 'This server is currently running its installation process and most actions are unavailable.'
                        : 'This server is currently being transferred to another node and all actions are unavailable.'}
                </Alert>
            )}
            <div className={'glass mb-4 flex flex-col gap-4 overflow-hidden p-4 sm:p-5 md:flex-row md:items-center'}>
                <div
                    className={
                        'pointer-events-none absolute -left-16 -top-24 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl'
                    }
                />
                <div className={'relative flex min-w-0 flex-1 items-center gap-4'}>
                    <ServerTile uuid={uuid} name={name} size={'lg'} className={'hidden sm:flex'} />
                    <div className={'min-w-0 flex-1'}>
                        <div className={'flex flex-wrap items-center gap-x-3 gap-y-1'}>
                            <h1
                                className={
                                    'min-w-0 truncate font-header text-2xl font-semibold leading-tight text-gray-50'
                                }
                            >
                                {name}
                            </h1>
                            <StatusPill state={status || 'loading'} />
                        </div>
                        <p className={'mt-1 truncate text-sm text-neutral-400'}>
                            {description || <span className={'text-neutral-500'}>Running on {node}</span>}
                        </p>
                    </div>
                </div>
                <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                    <PowerButtons className={'relative flex gap-2 md:justify-end'} />
                </Can>
            </div>
            <div className={'mb-4 grid grid-cols-4 gap-3 sm:gap-4'}>
                <div className={'col-span-4 flex lg:col-span-3'}>
                    <Spinner.Suspense>
                        <Console />
                    </Spinner.Suspense>
                </div>
                <ServerDetailsBlock className={'order-last col-span-4 lg:order-none lg:col-span-1'} />
            </div>
            <div className={'grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3'}>
                <Spinner.Suspense>
                    <StatGraphs />
                </Spinner.Suspense>
            </div>
            <Features enabled={eggFeatures} />
        </ServerContentBlock>
    );
};

export default memo(ServerConsoleContainer, isEqual);
