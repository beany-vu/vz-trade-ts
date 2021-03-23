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

const CheckboxUnCheckedIcon: FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <Icon className={className}>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g
          transform="translate(-469.000000, -404.000000)"
          fill="#FFFFFF"
          stroke="#9DB891"
        >
          <g transform="translate(432.000000, 221.918883)">
            <g transform="translate(0.000000, 55.000000)">
              <g transform="translate(37.000000, 127.500000)">
                <rect x="0.5" y="0.5" width="17" height="17" rx="5" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </Icon>
  );
};

export default CheckboxUnCheckedIcon;
