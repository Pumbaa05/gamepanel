import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';
import classNames from 'classnames';

interface Props {
    icon?: IconProp;
    title: string | React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

const TitledGreyBox = ({ icon, title, children, className }: Props) => (
    <div className={classNames('glass', className)}>
        <div className={'border-b border-white/[0.06] px-4 py-3'}>
            {typeof title === 'string' ? (
                <p className={'eyebrow flex items-center !text-neutral-300'}>
                    {icon && <FontAwesomeIcon icon={icon} css={tw`mr-2 text-cyan-300`} />}
                    {title}
                </p>
            ) : (
                title
            )}
        </div>
        <div css={tw`p-4`}>{children}</div>
    </div>
);

export default memo(TitledGreyBox, isEqual);
