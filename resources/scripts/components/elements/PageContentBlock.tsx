import React, { useEffect } from 'react';
import ContentContainer from '@/components/elements/ContentContainer';
import { CSSTransition } from 'react-transition-group';
import tw from 'twin.macro';
import FlashMessageRender from '@/components/FlashMessageRender';
import { useStoreState } from '@/state/hooks';
import LucentLogo from '@/components/elements/LucentLogo';

export interface PageContentBlockProps {
    title?: string;
    className?: string;
    showFlashKey?: string;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, showFlashKey, className, children }) => {
    const name = useStoreState((state) => state.settings.data?.name);

    useEffect(() => {
        if (title) {
            document.title = name ? `${title} · ${name}` : title;
        }
    }, [title, name]);

    return (
        <CSSTransition timeout={150} classNames={'fade'} appear in>
            <>
                <ContentContainer css={tw`my-5 sm:my-8`} className={className}>
                    {showFlashKey && <FlashMessageRender byKey={showFlashKey} css={tw`mb-4`} />}
                    {children}
                </ContentContainer>
                <ContentContainer css={tw`mb-6`}>
                    <p className={'flex items-center justify-center gap-2 text-center text-xs text-neutral-500'}>
                        <LucentLogo className={'h-3.5 w-3.5 opacity-70'} />
                        <span>{name}</span>
                        <span className={'text-neutral-600'}>&middot;</span>
                        <a
                            rel={'noopener nofollow noreferrer'}
                            href={'https://pterodactyl.io'}
                            target={'_blank'}
                            className={'text-neutral-500 no-underline hover:text-neutral-300'}
                        >
                            Powered by Pterodactyl&reg;
                        </a>
                    </p>
                </ContentContainer>
            </>
        </CSSTransition>
    );
};

export default PageContentBlock;
