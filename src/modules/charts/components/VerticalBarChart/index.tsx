import React, { FC } from 'react';
import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { GridRows } from '@visx/grid';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { Label, TickPlain, TickYear } from '../Axis';
import colors from '../../constants/colors';
import Tooltip, { ITooltipContent } from '../TooltipContent';
import { TIMELINE } from '../../../../constants';

export const background = '#612efb';

let tooltipTimeout: number;

const Stack: ({
  containerTop,
  containerLeft,
  containerHeight,
  containerWidth,
  dataKey,
  date,
  value,
  series,
  keys,
}: {
  containerTop: any;
  containerLeft: any;
  containerHeight: any;
  containerWidth: any;
  dataKey: any;
  date: any;
  value: any;
  keys: string[];
  [x: string]: any;
  series;
}) => null | JSX.Element = (props) => {
  const {
    containerTop,
    containerLeft,
    containerHeight,
    containerWidth,
    dataKey,
    date,
    value,
    series,
    keys,
    ...otherProps
  } = props;
  let top = containerTop;

  const stackData = series
    .find((d) => d.key === dataKey)
    ?.data?.find((d) => +d.date === +date);

  if (!stackData) return null;

  return (
    <>
      {Object.keys(stackData)
        .filter((d) => d !== 'date')
        .map((k, i) => {
          const h = (stackData[k] * containerHeight) / value;
          top += h;
  
          console.log(123, stackData);
          
          return (
            <g key={`g-${i}-${dataKey}-fk`}>
              {Object.keys(stackData).length > 2 && (
                <rect
                  key={`stack-${i}-${dataKey}-fk`}
                  x={containerLeft}
                  y={
                    Object.keys(stackData).length - 2 === i
                      ? top - h
                      : top - h + 11
                  }
                  height={h - 8}
                  width={containerWidth}
                  rx={0}
                  ry={0}
                  fill={colors[i]}
                />
              )}
              <rect
                key={`stack-${i}-${dataKey}`}
                x={containerLeft}
                y={top - h}
                height={h}
                width={containerWidth}
                rx={5}
                ry={5}
                fill={colors[i]}
                {...otherProps}
              />
              {Object.keys(stackData).length - 2 === i && (
                <rect
                  y={top - h - 2}
                  x={containerLeft}
                  height={2}
                  width={containerWidth}
                  fill="#fff"
                  style={{ pointerEvents: 'none' }}
                />
              )}
            </g>
          );
        })}
    </>
  );
};

const VerticalBarChart: FC<{
  series: any[];
  seriesTotal: any[];
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
  seriesTotal = [],
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
  const filteredSeries = series.filter(d => d.data.length > 0);
  const keyAbbr = filteredSeries.reduce(
    (result, d) => ({
      ...result,
      [d.key]: d.abbr,
    }),
    {}
  );
  const keys = filteredSeries.map((d) => d.key);
  // accessors
  const getDate = (d) => d.date;

  // scales
  const dateScale = scaleBand<string>({
    domain: seriesTotal.map(getDate),
    padding: 0.1,
  });

  const cityScale = scaleBand<string>({
    domain: keys,
    padding: 0.1,
  });
  const tempScale = scaleLinear<number>({
    domain: [
      0,
      Math.max(...seriesTotal.map((d) => Math.max(d?.export, d?.import))),
    ],
    range: [50, height - 50],
  });
  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: colors,
  });

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
  dateScale.rangeRound([padding.left, width]);
  tempScale.range([height - 100, 0]);
  cityScale.rangeRound([0, dateScale.bandwidth()]);

  return (
    <div>
      <svg
        ref={containerRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ fontSize: width > 600 ? '1em' : '0.75em' }}
      >
        <rect x={0} y={0} width={width} height={height} fill="#fff" rx={14} />
        <Label x={5} y={25}>
          {title}
        </Label>
        <AxisLeft
          top={50}
          left={padding.left - 18}
          scale={tempScale}
          numTicks={5}
          strokeWidth={0}
          hideTicks
          tickFormat={(v) => `${v}`}
          tickComponent={TickPlain}
        />

        <GridRows
          scale={tempScale}
          width={width - padding.left - padding.right}
          height={10}
          strokeDasharray="2,2"
          top={50}
          left={padding.left}
          stroke="#d3d3d3"
        />
        <Group top={padding.top}>
          <BarGroup
            data={seriesTotal}
            keys={keys}
            height={height - 100}
            x0={getDate}
            x0Scale={dateScale}
            x1Scale={cityScale}
            yScale={tempScale}
            color={colorScale}
          >
            {(barGroups) =>
              barGroups.map((barGroup) => (
                <Group
                  key={`bar-group-${barGroup.index}-${barGroup.x0}`}
                  left={barGroup.x0}
                >
                  {barGroup.bars.map((bar) => (
                    <g
                      x={bar.x}
                      y={bar.y}
                      height={bar.height}
                      width={bar.width}
                      key={`group-${barGroup.index}-${bar.index}`}
                    >
                      <Stack
                        keys={keys}
                        key={`stack-${barGroup.index}-${bar.index}`}
                        containerTop={bar.y}
                        containerLeft={bar.x}
                        containerHeight={bar.height}
                        containerWidth={bar.width}
                        date={seriesTotal[barGroup.index]?.date}
                        dataKey={bar.key}
                        value={bar.value}
                        onMouseLeave={() => {
                          tooltipTimeout = window.setTimeout(() => {
                            hideTooltip();
                          }, 300);
                        }}
                        onMouseMove={(event) => {
                          if (barGroup !== undefined) {
                            if (tooltipTimeout) clearTimeout(tooltipTimeout);
                            const eventSvgCoords = localPoint(event);
                            const left = eventSvgCoords
                              ? eventSvgCoords?.x - bar.width / 2
                              : bar.x;

                            showTooltip({
                              tooltipData: {
                                label: bar.key,
                                date: seriesTotal[barGroup.index]?.date,
                                value: bar.value,
                                dataSeries: seriesTotal.map((d: any) => ({
                                  date: d?.date,
                                  value: parseFloat(d[bar.key]).toFixed(4),
                                })),
                                unit: '%',
                              },
                              tooltipTop: eventSvgCoords?.y,
                              tooltipLeft: left,
                            });
                          }
                        }}
                        series={filteredSeries}
                      />
                      {barGroup.index === 0 && (
                        <text
                          x={bar.width * bar.index + bar.width / 2 + bar.width/14}
                          y={bar.y + bar.height + 15}
                        >
                          {keyAbbr[bar.key]}
                        </text>
                      )}
                    </g>
                  ))}
                </Group>
              ))}
          </BarGroup>
        </Group>
        <AxisBottom
          top={height - padding.bottom + 10}
          left={0}
          tickComponent={TickYear}
          scale={dateScale}
          stroke="transparent"
          tickStroke="transparent"
          hideAxisLine
          tickLabelProps={() => ({
            fill: '#000',
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />
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
            unit="mn $"
            valueFormat={tickFormat.value}
          />
        </TooltipInPortal>
      )}
    </div>
  );
};

export default VerticalBarChart;
