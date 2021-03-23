import React, { FC, useEffect, useRef } from 'react';
import { LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { scaleLinear, scaleTime } from '@visx/scale';
import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { extent } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import styled from 'styled-components';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import colors from '../../constants/colors';
import { Label, TickPlain, TickYear } from '../Axis';
import Tooltip, { ITooltipContent } from '../TooltipContent';
import { TIMELINE } from '../../../../constants';

export interface DateValue {
  date: Date | string;
  value: number;
}

const Styled = styled.div`
  display: flex;
  flex-direction: column;

  line.base-line {
    stroke-dasharray: none;
    stroke-width: 2px;
  }

  .data-segment {
    //transition: opacity 0.05s ease-out;
    &.inactive {
      opacity: 0.1;
      pointer-events: none;
    }
  }
`;

const DataGroup = styled.g`
  path {
    position: relative;
  }

  path + g {
    opacity: 0;
  }

  path:hover {
    z-index: 1;
  }

  path:hover + g {
    opacity: 1;
  }
`;

const highlightSegmentOnHover = false;

let tooltipTimeout: number;

const LineChart: FC<{
  series: any[];
  unit: string;
  tickFormat: { value: string; date: string };
  timeLine: string;
  title: string | React.ReactNode;
  width: number;
  height: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}> = ({
  series = [],
  unit,
  tickFormat = { value: '', date: '' },
  timeLine = TIMELINE.YEARLY,
  title = '',
  height = 500,
  width = 900,
  padding = {
    top: 50,
    right: 30,
    bottom: 50,
    left: 40,
  },
}) => {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<ITooltipContent>();
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  const getX = (d: DateValue) =>
    timeLine === TIMELINE.YEARLY ? d.date : new Date(d.date);
  const getY = (d: DateValue) => d.value;

  const yAxisValues = series.reduce(
    (result: number[], cur: any) => [
      ...result,
      ...cur.data.map((d) => d?.value),
    ],
    []
  );

  const xAxisValues = series.reduce(
    (result: any[], cur: any) => [
      ...result,
      ...cur.data.map((d) =>
        timeLine === TIMELINE.YEARLY ? d?.date : new Date(d?.date).getTime()
      ),
    ],
    []
  );

  const xScale =
    timeLine === TIMELINE.YEARLY
      ? scaleLinear<number>({
        // @ts-ignore
        domain: extent(xAxisValues) as [string, string],
      })
      : scaleTime<number>({
          domain: extent(xAxisValues) as [Date, Date],
        });

  const yScale = scaleLinear<number>({
    domain: (extent(yAxisValues) as unknown) as [number, number],
  });

  const ref = useRef(null);

  const formatYAxis = (v: string) => {
    if (tickFormat.date.length === 0) return v;
    return timeFormat('%Y')(new Date(v));
  };

  xScale.range([padding.left, width - padding.right]);
  yScale.range([height - 50, 50]);

  const highlightDataSegment = (e: MouseEvent, className: string) => {
    const svg = ref.current as HTMLElement | null;
    if (svg) {
      const lines: HTMLCollectionOf<Element> = svg.getElementsByClassName(
        'data-segment'
      );
      Array.from(lines).forEach((line: Element) => {
        if (!line.classList.contains(className)) {
          line.classList.add('inactive');
        }
      });
    }
  };

  const resetDataSegment = () => {
    const svg = ref.current as HTMLElement | null;
    if (svg) {
      const lines: HTMLCollectionOf<Element> = svg.getElementsByClassName(
        'data-segment'
      );

      Array.from(lines).forEach((line: Element) => {
        line.classList.remove('inactive');
      });
    }
  };

  useEffect(() => {
    if (ref.current) {
      const svg = ref.current as SVGElement | null;
      const y0 = yScale(0);

      if (svg) {
        const gridRows: SVGLineElement[] = Array.from(
          svg.querySelectorAll('.visx-rows .visx-line')
        );

        gridRows.forEach((row) => {
          if (row?.y2?.baseVal?.value?.toFixed(2) === y0.toFixed(2)) {
            row.classList.add('base-line');
          }
        });
      }
    }
  }, [ref]);

  // @ts-ignore
  return (
    <Styled>
      <svg
        ref={containerRef}
        width={width}
        height={height}
        style={{ fontSize: width > 600 ? '1em' : '0.75em' }}
      >
        <g ref={ref}>
          <rect x={0} y={0} width={width} height={height} fill="#fff" />
          <Label x={5} y={25}>
            {title}
          </Label>

          <GridRows
            ref={ref}
            scale={yScale}
            width={width - padding.right - padding.left}
            height={10}
            strokeDasharray="2,2"
            top={0}
            left={padding.left}
            stroke="#d3d3d3"
          />

          <AxisLeft
            top={0}
            left={padding.left - 15}
            scale={yScale}
            // numTicks={5}
            stroke="transparent"
            hideTicks
            tickComponent={TickPlain}
            tickFormat={(v) => tickFormat.value.replace('{v}', String(v))}
          />

          {timeLine === TIMELINE.YEARLY && (
            <AxisBottom
              top={height - padding.bottom}
              left={0}
              scale={xScale}
              stroke="transparent"
              tickComponent={TickPlain}
              hideTicks
              // numTicks={xAxisNumberTick + 1}
              tickFormat={(v: any) => `${parseInt(v)}`}
            />
          )}
          {timeLine === TIMELINE.MONTHLY && (
            <AxisBottom
              top={height - padding.bottom}
              left={0}
              scale={xScale}
              stroke="transparent"
              tickComponent={TickYear}
              hideTicks
              tickFormat={(v: any) => formatYAxis(v)}
            />
          )}

          {series &&
            series.map(({ data }, i) => (
              <DataGroup key={`g-line-path-${i}`}>
                <LinePath<DateValue>
                  key={`line-path-${i}`}
                  className={`data-segment data-segment-${i}`}
                  data={data}
                  data-index={i}
                  // @ts-ignore
                  x={(d) => xScale(getX(d) ?? 0)}
                  y={(d) => yScale(getY(d) ?? 0)}
                  curve={curveMonotoneX}
                  stroke={colors[i]}
                  strokeWidth={3}
                  strokeLinecap="square"
                  onMouseMove={(event) => {
                    event.preventDefault();
                    if (highlightSegmentOnHover) {
                      highlightDataSegment(
                        (event as unknown) as MouseEvent,
                        `data-segment-${i}`
                      );
                    }
                  }}
                  onMouseLeave={(event) => {
                    event.preventDefault();
                    if (highlightSegmentOnHover) {
                      resetDataSegment();
                    }
                  }}
                />
              </DataGroup>
            ))}
          {series &&
            series.map(({ data, label }, i) => (
              <g key={`g-segment-${i}&`}>
                {data.map((dp, j) => (
                  <g key={`g-${i}&${j}`}>
                    <circle
                      className={`data-segment data-segment-${i}`}
                      key={`${i}&${j}`}
                      r={6}
                      // @ts-ignore
                      cx={xScale(getX(dp))}
                      cy={yScale(getY(dp))}
                      stroke="#fff"
                      strokeWidth={1}
                      fill={colors[i]}
                      onMouseLeave={(event) => {
                        if (highlightSegmentOnHover) {
                          resetDataSegment();
                        }
                        tooltipTimeout = window.setTimeout(() => {
                          hideTooltip();
                        }, 300);
                      }}
                      onMouseMove={(event) => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        const eventSvgCoords = localPoint(event);
                        // @ts-ignore
                        const left = xScale(getX(dp));

                        if (highlightSegmentOnHover) {
                          highlightDataSegment(
                            (event as unknown) as MouseEvent,
                            `data-segment-${i}`
                          );
                        }
                        showTooltip({
                          tooltipData: {
                            label,
                            date: dp.date,
                            value: dp.value,
                            dataSeries: data,
                            unit: '%',
                          },
                          tooltipTop: eventSvgCoords?.y,
                          tooltipLeft: left,
                        });
                      }}
                    />
                  </g>
                ))}
              </g>
            ))}
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
            unit="%"
          />
        </TooltipInPortal>
      )}
    </Styled>
  );
};

export default LineChart;
