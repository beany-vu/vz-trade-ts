import React, { FC } from 'react';
import styled from 'styled-components';

const Icon = styled.svg`
  width: 17px;
  height: 17px;
  vertical-align: text-top;
  rect {
    width: 15px;
    height: 15px;
  }
`;

const CheckboxCheckedIcon: FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <Icon className={className}>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect
          stroke="#9DB891"
          fill="#9DB891"
          x="0.5"
          y="0.5"
          width="17"
          height="17"
          rx="5"
        />
        <g
          transform="translate(4.000000, 5.000000)"
          fill="#FFFFFF"
          fillRule="nonzero"
        >
          <g>
            <path d="M8.3534072,0.0734094836 L2.65956368,5.92225186 L0.646592801,3.85448352 C0.551307367,3.75660421 0.396809133,3.75660421 0.301503365,3.85448352 L0.0714640754,4.09078499 C-0.0238213585,4.1886643 -0.0238213585,4.34736831 0.0714640754,4.44526851 L2.48702913,6.92659052 C2.58231456,7.02446983 2.73681279,7.02446983 2.83211856,6.92659052 L8.92853592,0.664215357 C9.02382136,0.566336046 9.02382136,0.407632032 8.92853592,0.309731833 L8.6984763,0.0734094836 C8.60319087,-0.0244698279 8.44869263,-0.0244698279 8.3534072,0.0734094836 Z" />
          </g>
        </g>
      </g>
    </Icon>
  );
};

export default CheckboxCheckedIcon;
