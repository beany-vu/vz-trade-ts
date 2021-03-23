import React, { FC } from 'react';
import styled from 'styled-components';

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 13px;
  height: 13px;
  vertical-align: text-top;
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
`;

const ExpandOpen: FC<{ className?: string }> = ({ className = '' }) => {
  return <Icon className={className}>+</Icon>;
};

export default ExpandOpen;
