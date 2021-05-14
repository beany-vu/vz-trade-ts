import React, { FC, ReactNode } from 'react';
import { TooltipStyled, Label } from './Styled';

export interface ITooltipContentProps {
  useDefaultStyle: boolean;
  title: ReactNode | string | null;
  content: ReactNode | string | null;
}

const TooltipContent: FC<ITooltipContentProps> = ({
  useDefaultStyle = true,
  title = null,
  content = null,
}) => {
  if (useDefaultStyle) {
    return (
      <TooltipStyled>
        {title && <Label>{title}</Label>}
        {content && <div>{content}</div>}
      </TooltipStyled>
    );
  }
  return (
    <>
      {title && <Label>{title}</Label>}
      {content && <div>{content}</div>}
    </>
  );
};

export default TooltipContent;
