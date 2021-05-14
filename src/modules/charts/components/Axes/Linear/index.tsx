import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

const TickStyled = styled.text`
  position: relative;
  font-family: var(--font-sans-serif-primary);
  font-size: 0.8125em;
  font-weight: bold;
  fill: #7e7a7a;
`;

const TickPlain: FC<{
  formattedValue: string | undefined;
  x: number;
  y: number;
  children?: ReactNode;
}> = ({ x, y, formattedValue = '', children }) => {
  return (
    <>
      <TickStyled x={x} y={y} textAnchor="middle">
        {formattedValue}
      </TickStyled>
    </>
  );
};

export default TickPlain;
