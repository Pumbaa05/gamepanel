import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';
import { useStoreState } from '@/state/hooks';
import LucentLogo from '@/components/elements/LucentLogo';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

const Container = styled.div`
    ${breakpoint('sm')`
        ${tw`w-4/5 mx-auto`}
    `};

    ${breakpoint('md')`
        ${tw`p-10`}
    `};

    ${breakpoint('lg')`
        ${tw`w-3/5`}
    `};

    ${breakpoint('xl')`
        ${tw`w-full`}
        max-width: 700px;
    `};
`;

const Brand = () => {
    const name = useStoreState((state) => state.settings.data?.name);

    return (
        <div
            className={
                'flex flex-col items-center justify-center px-6 text-center md:w-56 md:border-r md:border-white/[0.06]'
            }
        >
            <div className={'relative'}>
                <div className={'absolute inset-0 -m-6 rounded-full bg-violet-500/30 blur-2xl'} />
                <LucentLogo
                    className={'relative h-20 w-20 drop-shadow-[0_0_24px_rgba(122,92,255,0.6)] md:h-24 md:w-24'}
                />
            </div>
            <p className={'mt-5 font-header text-2xl font-semibold tracking-tight text-gradient'}>{name}</p>
            <p className={'mt-1 text-xs text-neutral-400'}>Game server control</p>
        </div>
    );
};

export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
    <Container>
        {title && (
            <h2 className={'py-4 text-center font-header text-3xl font-semibold tracking-tight text-neutral-50'}>
                {title}
            </h2>
        )}
        <FlashMessageRender css={tw`mb-2 px-1`} />
        <Form {...props} ref={ref}>
            <div className={'glass mx-1 w-full gap-2 p-6 md:flex md:p-8 md:pl-2'}>
                <div className={'mb-8 flex-none select-none self-center md:mb-0'}>
                    <Brand />
                </div>
                <div className={'flex-1 md:pl-8'}>{props.children}</div>
            </div>
        </Form>
        <p className={'mt-4 text-center text-xs text-neutral-500'}>
            <a
                rel={'noopener nofollow noreferrer'}
                href={'https://pterodactyl.io'}
                target={'_blank'}
                className={'text-neutral-500 no-underline hover:text-neutral-300'}
            >
                Powered by Pterodactyl&reg;
            </a>
        </p>
    </Container>
));
