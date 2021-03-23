import React, { FC } from 'react';
import styled from 'styled-components';

const Icon = styled.div`
  position: relative;
  width: 13px;
  height: 13px;
  vertical-align: text-top;
  border-radius: 50%;
  border: 1px solid var(--color-accent);
  rect {
    width: 15px;
    height: 15px;
  }
  &:before {
    position: absolute;
    content: '';
    top: 50%;
    left: 50%;
    border-radius: 50%;
    background: var(--color-accent);
    width: 60%;
    height: 60%;
    transform: translate(-50%, -50%);
  }
`;

const RadioCheckedIcon: FC<{ className?: string }> = ({ className = '' }) => {
  return <Icon className={className} />;
};

export default RadioCheckedIcon;
