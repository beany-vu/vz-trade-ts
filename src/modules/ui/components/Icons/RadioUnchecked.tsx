import React, { FC } from 'react';
import styled from 'styled-components';

const Icon = styled.div`
  width: 13px;
  height: 13px;
  vertical-align: text-top;
  border-radius: 50%;
  border: 1px solid var(--color-accent);
  rect {
    width: 15px;
    height: 15px;
  }
`;

const RadioUnchecked: FC<{ className?: string }> = ({ className = '' }) => {
  return <Icon className={className} />;
};

export default RadioUnchecked;
