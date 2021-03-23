import React, { FC, useContext } from 'react';
import { timeFormat } from 'd3-time-format';
import styled from 'styled-components';
import { ThemeContext } from '../../../../themes/default';

export interface ITooltipContent {
  label: string;
  date: string;
  value: number;
  unit: string;
  dataSeries: any[];
  valueFormat?: any;
}

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border: 1px solid #efeae0;
  box-shadow: 5px 5px 0 0 #efeae0;
  border-radius: 5px;
  padding: 25px 15px;

  .separator {
    position: relative;
    border: 1px solid #706d6d;
    margin: 10px auto;
    width: 170px;

    .middle-point {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #706d6d;
    }

    &:after,
    &:before {
      position: absolute;
      display: block;
      content: '';
      top: 50%;
      transform: translate(0, -50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #706d6d;
    }

    &:before {
      left: -6px;
    }

    &:after {
      right: -6px;
    }
  }
`;

const Value = styled.span`
  display: block;
  font-family: var(--font-sans-serif-primary);
  font-weight: bold;
  font-size: 26px;
  color: #554f44;
  text-align: center;
  line-height: 19px;
`;

const Label = styled.span`
  font-family: var(--font-sans-serif-primary);
  font-weight: bold;
  font-size: 10px;
  color: #554f44;
  text-align: center;
  line-height: 22px;
  text-transform: uppercase;
`;

const DateFormatted = styled.span`
  display: block;
  font-family: var(--font-sans-serif-primary);
  font-size: 10px;
  color: #706d6d;
  line-height: 19px;
`;

const Difference = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  text-align: center;
`;

const Trend = styled.div<{ trend: string }>`
  text-align: center;
  font-family: var(--font-sans-serif-primary);
  font-size: 10px;
  font-weight: bold;
  color: ${(props) => (props.trend === 'upward' ? '#3BAF33' : '#FF4646')};
`;

const TooltipContent: FC<ITooltipContent> = ({
  label,
  date,
  value,
  unit,
  dataSeries = [],
  valueFormat = '',
}) => {
  const { cssVars } = useContext(ThemeContext);
  const getTrend = (value: number, unit: string) => {
    return (
      <Trend trend={value >= 0 ? 'upward' : 'download'}>
        <span className="vl">
          {value.toFixed(2)}
          {unit}
        </span>
        <span className="arrow">
          {value >= 0 ? <>&#8599;</> : <>&#8600;</>}
        </span>
      </Trend>
    );
  };

  const getFigureDifference = (
    date: string,
    dataSeries: any[],
    offset: number
  ) => {
    if (dataSeries.length === 0) return null;
    const time = new Date(date).getTime();
    const dataOffset = dataSeries.filter((d) =>
      offset === -1
        ? new Date(d.date).getTime() < time
        : new Date(d.date).getTime() > time
    );
    const closestTime =
      offset === -1
        ? Math.max(...dataOffset.map((d) => new Date(d.date).getTime()))
        : Math.min(...dataOffset.map((d) => new Date(d.date).getTime()));
    const closestData = dataOffset.find(
      (d) => new Date(d.date).getTime() === closestTime
    );

    if (!closestData) return null;

    return (
      <div style={{ ...cssVars }}>
        <DateFormatted>
          {timeFormat('%b %Y')(new Date(closestData.date))}
        </DateFormatted>
        <Value style={{ fontSize: 16 }}>
          {valueFormat && valueFormat.replace('{v}', parseFloat(closestData.value).toFixed(2))}
          {valueFormat === '' && (
            <>{parseFloat(closestData.value).toFixed(2)}</>
          )}
        </Value>
        {getTrend(
          offset === 1 ? closestData.value - value : value - closestData.value,
          unit
        )}
      </div>
    );
  };

  return (
    <Styled style={{ ...cssVars }}>
      <Value>
        {valueFormat && valueFormat.replace('{v}', value)}
        {valueFormat === '' && <>{value}</>}
      </Value>
      <Label>{label}</Label>
      <DateFormatted>{timeFormat('%b %Y')(new Date(date))}</DateFormatted>
      <div className="separator">
        <span className="middle-point" />
      </div>
      <Difference>
        <div>{getFigureDifference(date, dataSeries, -1)}</div>
        <div>{getFigureDifference(date, dataSeries, 1)}</div>
      </Difference>
    </Styled>
  );
};

export default TooltipContent;
