import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { scaleQuantile, scaleLinear } from '@visx/scale';
import { extent } from 'd3-array';
import { orderBy } from 'lodash';
import { GridRows, GridColumns } from '@visx/grid';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { defaultConfig } from '../../../helpers';
import { TickPlain, Label } from '../../Axes';
import Tooltip, { ITooltipContentProps } from '../../Tooltips/ToolipContent';

const Styled = styled.div`
  contain: layout;
`;

const LegendTitle = styled.div`
  font-family: var(--font-sans-serif-primary);
  font-weight: 600;
  font-size: 1em;
  color: #918b86;
`;

const LegendText = styled.text`
  fill: #918b86;
  font-family: var(--font-sans-serif-primary);
  font-weight: 600;
  font-size: 0.625em;
`;

const LegendArc = styled.path`
  stroke: #918b86;
  fill: none;
`;

interface IData {
  label: string;
  x: number;
  y: number;
  d: number;
  color?: string;
}

let tooltipTimeout: number;

interface IScatterPlotChartProps {
  className: string;
  seriesData: IData[];
  width: number;
  height: number;
  padding: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  domainAxisX?: number[] | null;
  domainAxisY?: number[] | null;
  showAxisX: boolean;
  showAxisY: boolean;
  axisXLbl?: string | ReactNode | null;
  axisYLbl?: string | ReactNode | null;
  tickFormat: { value: string; date: string; currency?: string };
  legendTitle?: string | ReactNode | null;
  tooltip: string | ReactNode | null;
  tooltipDefaultStyle: boolean;
}

const ScatterPlotChart: FC<IScatterPlotChartProps> = ({
  className = '',
  width = 900,
  height = 500,
  seriesData = [],
  padding = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  },
  domainAxisY = null,
  domainAxisX = null,
  axisYLbl = 'Preferential margin',
  axisXLbl = 'Utilization rate',
  legendTitle = null,
  showAxisX = true,
  showAxisY = true,
  tickFormat = {
    ...defaultConfig.tickFormat,
    value: '{v}%',
  },
  tooltip = null,
  tooltipDefaultStyle = true,
}) => {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<ITooltipContentProps>();
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  });

  const diameterScale = scaleQuantile({
    domain: (extent(seriesData.map(({ d }) => d)) as unknown) as [
      number,
      number
    ],
    range: [6, 15, 25, 35, 45, 55],
  });

  const yScale = scaleLinear({
    domain:
      domainAxisY ||
      ((extent(seriesData.map(({ y }) => y)).reverse() as unknown) as [
        number,
        number
      ]),
    range: [padding?.top, height - (padding?.bottom || 0)],
    zero: true,
    nice: true,
    clamp: true,
  });

  const xScale = scaleLinear({
    domain:
      domainAxisX ||
      ((extent(seriesData.map(({ x }) => x)) as unknown) as [number, number]),
    range: [padding?.left, width - (padding?.right || 0)],
    zero: true,
    nice: true,
    clamp: true,
  });

  return (
    <Styled>
      <svg
        className={className}
        width={width}
        height={height}
        ref={containerRef}
      >
        <rect x={0} y={0} width={width} height={height} fill="#fff" />
        {axisYLbl && (
          <Label x={5} y={25}>
            {axisYLbl}
          </Label>
        )}
        {axisXLbl && (
          <Label x={35} y={height - 10}>
            {axisXLbl}
          </Label>
        )}
        <GridRows
          scale={yScale}
          width={width - (padding.right || 0) - (padding.left || 0)}
          strokeDasharray="1,3"
          top={0}
          left={padding.left || 0}
          stroke="#d3d3d3"
        />
        <GridColumns
          scale={xScale}
          height={height - (padding.top || 0) - (padding.bottom || 0)}
          strokeDasharray="1,3"
          left={0}
          top={padding.top || 0}
          stroke="#d3d3d3"
        />
        {showAxisY && (
          <AxisLeft
            top={0}
            left={(padding.left || 0) - 15}
            scale={yScale}
            stroke="transparent"
            hideTicks
            tickComponent={TickPlain}
            tickFormat={(v) => tickFormat.value.replace('{v}', String(v))}
          />
        )}
        {showAxisX && (
          <AxisBottom
            top={height - (padding?.bottom || 0)}
            left={0}
            scale={xScale}
            stroke="transparent"
            tickComponent={TickPlain}
            hideTicks
            tickFormat={(v) => tickFormat.value.replace('{v}', String(v))}
          />
        )}
        {seriesData &&
          orderBy(seriesData, ['d'], ['desc']).map((d, i) => (
            <circle
              key={`circle-${i}`}
              cx={xScale(d.x)}
              cy={yScale(d.y)}
              r={diameterScale(d.d) / 2}
              fill={d.color}
              onMouseLeave={(event) => {
                tooltipTimeout = window.setTimeout(() => {
                  hideTooltip();
                }, 300);
              }}
              onMouseMove={(event) => {
                event.preventDefault();
                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                const eventSvgCoords = localPoint(event);
                const left = xScale(d.x);

                showTooltip({
                  tooltipData: {
                    useDefaultStyle: tooltipDefaultStyle,
                    title: d.label,
                    content: (
                      <ul>
                        <li>
                          Trade value:
                          {d.d}
                        </li>
                        <li>
                          {axisYLbl}:{`${d.y}%`}
                        </li>
                        <li>
                          {axisXLbl}:{`${d.x}%`}
                        </li>
                      </ul>
                    ),
                  },
                  tooltipTop: eventSvgCoords?.y,
                  tooltipLeft: left,
                });
              }}
            />
          ))}
        <g>
          <foreignObject
            x={width - 180}
            y={height - 180}
            width={170}
            height={50}
          >
            <LegendTitle>
              Trade value in UGX
              <br />
              (Uganda Shilling)
            </LegendTitle>
          </foreignObject>
          <LegendArc d="M740,430 A55,35 1 0,1 740,375" />
          <LegendText x={742} y={378}>
            - 10 bn
          </LegendText>
          <LegendArc d="M740,430 A45,30 1 0,1 740,385" />
          <LegendArc d="M740,430 A30,23 1 0,1 740,395" />
          <LegendText x={742} y={398}>
            - 6 bn
          </LegendText>
          <LegendArc d="M740,430 A25,19 1 0,1 740,405" />
          <LegendText x={742} y={419}>
            - 2 bn
          </LegendText>
          <LegendArc d="M740,430 A15,11 1 0,1 740,415" />
          <LegendText x={748} y={431}>
            0
          </LegendText>
          <circle cx={742} cy={427} r={3} fill="none" stroke="#918b86" />
        </g>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...defaultStyles, boxShadow: 'none', padding: 0 }}
        >
          <Tooltip
            title={tooltipData.title}
            content={tooltipData.content}
            useDefaultStyle={tooltipData.useDefaultStyle}
          />
        </TooltipInPortal>
      )}
    </Styled>
  );
};

export default ScatterPlotChart;
