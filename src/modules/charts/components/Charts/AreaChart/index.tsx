import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AreaStack } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { timeFormat } from 'd3-time-format';
import { GridRows } from '@visx/grid';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { defaultConfig } from '../../../helpers';
import { Label, TickPlain, TickYear } from '../../Axes';
import Tooltip, { ITooltipTrendProps } from '../../Tooltips/TooltipTrend';

const Styled = styled.div`
  contain: layout;
`;

const Area = styled.path`
  stroke: #fff;
  stroke-width: 1px;
  transition: opacity 0.1s ease-in-out;

  &.disabled {
    opacity: 0.2;
  }
`;

const DataPoints = styled.g`
  opacity: 0;
  transition: opacity 0.1s ease-in-out;
  pointer-events: none;

  &.highlighted {
    opacity: 1;
    pointer-events: auto;
  }
`;

const DataPoint = styled.circle`
  stroke-width: 3px;
  stroke: rgba(255, 255, 255, 0.9);
`;

// const colors = {
//   Processed: ['#144F73', 'rgba(20,79,115,0.60)'],
//   'Semi-processed': ['#AEC7E8', 'rgba(174,199,232,0.60)'],
//   Raw: ['#FFAC00', 'rgba(255,172,0,0.60)'],
// };

let tooltipTimeout: number;

interface IAreaChartProps {
  seriesData: Record<string, any>[];
  className: string;
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
  title?: string | ReactNode | null;
  tickFormat: { value: string; date: string; currency?: string };
  tooltip: string | ReactNode | null;
  tooltipDefaultStyle: boolean;
  dataKeys: string[];
  colors: Record<string, any[]>;
}

const AreaChart: FC<IAreaChartProps> = ({
  className = '',
  width = 900,
  height = 500,
  seriesData = [],
  padding = {},
  domainAxisY = null,
  domainAxisX = null,
  title = '',
  showAxisX = true,
  showAxisY = true,
  tickFormat = {
    ...defaultConfig.tickFormat,
    value: '{v}%',
  },
  tooltip = null,
  tooltipDefaultStyle = true,
  dataKeys = ['Processed', 'Raw', 'Semi-processed'],
  colors = {},
}) => {
  const config = {
    padding: {
      ...defaultConfig.padding,
      ...padding,
    },
  };
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<ITooltipTrendProps>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  });

  const getDate = (d) => d.data.date;
  const getY0 = (d) => d[0] / 100;
  const getY1 = (d) => d[1] / 100;
  const xAxisValues = seriesData.map((d) => d.date);

  const highlightArea = (e, key) => {
    const parentNode: HTMLElement = e.target.parentNode as HTMLElement;
    const areas: NodeListOf<SVGPathElement> = parentNode.querySelectorAll(
      'path'
    );
    const dataPointsGroups: NodeListOf<SVGCircleElement> = parentNode.querySelectorAll(
      '.data-points'
    );

    Array.from(areas).forEach((area) => {
      if (area.isSameNode(e.target)) {
        area.classList.remove('disabled');
        area.classList.add('highlighted');
      } else {
        area.classList.remove('highlighted');
        area.classList.add('disabled');
      }
    });

    Array.from(dataPointsGroups).forEach((group) => {
      if (group.classList.contains(`data-points-${key}`)) {
        group.classList.add('highlighted');
      } else {
        group.classList.remove('highlighted');
      }
    });
  };

  const resetHighlightArea = (e) => {
    const svgEl = e.currentTarget as SVGElement;

    Array.from(svgEl.querySelectorAll('.area-data')).forEach((area) => {
      area.classList.remove('disabled');
    });

    Array.from(svgEl.querySelectorAll('.data-points')).forEach((area) => {
      area.classList.remove('highlighted');
    });
  };

  const xScale = scaleBand<number>({
    domain: domainAxisX || xAxisValues,
    paddingOuter: 0,
    paddingInner: 1,
    padding: 0.1,
    range: [config.padding.left, width - config.padding.right],
  });

  const yScale = scaleLinear<number>({
    zero: true,
    nice: true,
    clamp: true,
    range: [height - config.padding.bottom, config.padding.top],
  });

  return (
    <Styled>
      <svg
        ref={containerRef}
        className={className}
        width={width}
        height={height}
        onMouseLeave={(e) => resetHighlightArea(e)}
      >
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#fff"
          style={{ pointerEvents: 'none' }}
        />
        <Label x={5} y={25}>
          {title}
        </Label>
        <defs>
          {Object.keys(colors).map((key) => (
            <linearGradient
              key={`overlay-gradient-${key}`}
              id={`overlay-gradient-${key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={colors[key][0]} stopOpacity="1" />
              <stop offset="100%" stopColor={colors[key][1]} stopOpacity="1" />
            </linearGradient>
          ))}
        </defs>
        {showAxisY && (
          <AxisLeft
            top={0}
            left={30}
            scale={yScale}
            stroke="transparent"
            hideTicks
            tickComponent={TickPlain}
            tickFormat={(v: any) =>
              tickFormat.value.replace('{v}', String(v * 100))
            }
          />
        )}
        {showAxisX && (
          <AxisBottom
            top={height - 50}
            left={0}
            scale={xScale}
            stroke="transparent"
            tickComponent={TickYear}
            hideTicks
            // numTicks={xAxisValues.length}
            tickFormat={(v: any) => timeFormat(tickFormat.date)(new Date(v))}
            tickLabelProps={() => ({
              fill: '#000',
              fontSize: 11,
              textAnchor: 'middle',
              width,
            })}
          />
        )}
        <GridRows
          scale={yScale}
          width={width - config.padding.right - config.padding.left + 10}
          strokeDasharray="2,2"
          top={0}
          left={config.padding.left - 5}
          stroke="#d3d3d3"
        />
        <g>
          <AreaStack
            curve={curveMonotoneX}
            top={config.padding.top}
            left={config.padding.left}
            keys={dataKeys}
            data={seriesData}
            x={(d) => xScale(getDate(d)) ?? 0}
            y0={(d) => yScale(getY0(d)) ?? 0}
            y1={(d) => yScale(getY1(d)) ?? 0}
          >
            {({ stacks, path }) => (
              <>
                {stacks.map((stack) => (
                  <Area
                    className="area-data"
                    key={`stack-${stack.key}`}
                    d={path(stack) || ''}
                    fill={`url(#overlay-gradient-${stack.key})`}
                    onMouseMove={(e) => highlightArea(e, stack.key)}
                  />
                ))}

                {stacks.map((stack) => (
                  <DataPoints
                    className={`data-points data-points-${stack.key}`}
                    key={`stack-group-${stack.key}`}
                  >
                    {stack.map((point, i) => (
                      <DataPoint
                        key={`point-${stack.key}-${i}`}
                        cx={xScale(getDate(point)) ?? 0}
                        cy={yScale(getY1(point)) ?? 0}
                        r={3}
                        stroke="#fff"
                        strokeWidth={1}
                        fill={colors[stack.key][0]}
                        onMouseLeave={(event) => {
                          tooltipTimeout = window.setTimeout(() => {
                            hideTooltip();
                          }, 300);
                        }}
                        onMouseMove={(event) => {
                          event.preventDefault();
                          if (tooltipTimeout) clearTimeout(tooltipTimeout);
                          const eventSvgCoords = localPoint(event);
                          // @ts-ignore
                          const left = xScale(getDate(point));
                          showTooltip({
                            tooltipData: {
                              label: stack.key,
                              date: getDate(point),
                              value: point.data[stack.key],
                              dataSeries: seriesData.map((d) => ({
                                date: d.date,
                                value: d[stack.key],
                              })),
                              tickFormat,
                            },
                            tooltipTop: eventSvgCoords?.y,
                            tooltipLeft: left,
                          });
                        }}
                      />
                    ))}
                  </DataPoints>
                ))}
              </>
            )}
          </AreaStack>
        </g>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...defaultStyles, boxShadow: 'none', padding: 0 }}
        >
          <Tooltip
            label={tooltipData.label}
            date={tooltipData.date}
            value={tooltipData.value}
            dataSeries={tooltipData.dataSeries}
            tickFormat={tickFormat}
          />
        </TooltipInPortal>
      )}
    </Styled>
  );
};

export default AreaChart;
