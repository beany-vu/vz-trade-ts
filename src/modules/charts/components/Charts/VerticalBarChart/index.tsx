import React, { FC } from 'react';
import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { GridRows } from '@visx/grid';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { Label, TickPlain, TickYear } from '../../Axes';
import colorsDefault from '../../../constants/colors';
import Tooltip, { ITooltipTrendProps } from '../../Tooltips/TooltipTrend';
import Stack from './Stack';
import { defaultConfig } from '../../../helpers';

let tooltipTimeout: number;

const VerticalBarChart: FC<{
  series: any[];
  seriesTotal: any[];
  tickFormat: { value: string; date: string };
  title: string | React.ReactNode;
  width: number;
  height: number;
  colors: any | null;
  padding: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  } | null;
  domainAxisX: number[] | null;
  domainAxisY: number[] | null;
  showAxisX: boolean;
  showAxisY: boolean;
}> = ({
  series = [],
  seriesTotal = [],
  tickFormat = defaultConfig.tickFormat,
  title = '',
  height = defaultConfig.height,
  width = defaultConfig.width,
  colors = null,
  padding = null,
  domainAxisX = null,
  domainAxisY = null,
  showAxisX = true,
  showAxisY = true,
}) => {
  const refinedPadding = padding
    ? {
        ...defaultConfig.padding,
        ...padding,
      }
    : {
        ...defaultConfig.padding,
      };

  const filteredSeries = series.filter((d) => d.data.length > 0);

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
    domain: domainAxisX || seriesTotal.map(getDate),
    padding: 0.1,
  });

  const directionScale = scaleBand<string>({
    domain: keys,
    padding: 0.1,
  });
  const objectScale = scaleLinear<number>({
    domain: domainAxisY || [
      0,
      Math.max(...seriesTotal.map((d) => Math.max(d?.export, d?.import))),
    ],
    range: [50, height - 50],
  });
  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: colorsDefault,
  });

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
  });
  dateScale.rangeRound([refinedPadding.left, width - refinedPadding.right]);
  objectScale.range([height - 100, 0]);
  directionScale.rangeRound([0, dateScale.bandwidth()]);

  return (
    <div>
      <svg
        ref={containerRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          fontSize: width > 600 ? '1em' : '0.75em',
          overflow: 'visible',
        }}
      >
        <rect x={0} y={0} width={width} height={height} fill="#fff" />
        <Label x={5} y={25}>
          {title}
        </Label>
        {showAxisY && (
          <AxisLeft
            top={50}
            left={refinedPadding.left - 18}
            scale={objectScale}
            numTicks={5}
            strokeWidth={0}
            hideTicks
            tickFormat={(v) => `${v}`}
            tickComponent={TickPlain}
          />
        )}

        <GridRows
          scale={objectScale}
          width={width - refinedPadding.left - refinedPadding.right}
          height={10}
          numTicks={5}
          strokeDasharray="2,2"
          top={50}
          left={refinedPadding.left}
          stroke="#d3d3d3"
        />
        <Group top={refinedPadding.top}>
          <BarGroup
            data={seriesTotal}
            keys={keys}
            height={height - 100}
            x0={getDate}
            x0Scale={dateScale}
            x1Scale={directionScale}
            yScale={objectScale}
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
                        colors={colors}
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
                                tickFormat,
                              },
                              tooltipTop: eventSvgCoords?.y,
                              tooltipLeft: left,
                            });
                          }
                        }}
                        series={filteredSeries}
                      />
                      {barGroup.index === 0 && (
                        <foreignObject
                          x={bar.x}
                          y={bar.y + bar.height + 5}
                          width={bar.width}
                          height={20}
                        >
                          <div style={{ textAlign: 'center' }}>
                            {keyAbbr[bar.key]}
                          </div>
                        </foreignObject>
                      )}
                    </g>
                  ))}
                </Group>
              ))
            }
          </BarGroup>
        </Group>
        {showAxisX && (
          <AxisBottom
            top={height - refinedPadding.bottom + 15}
            left={0}
            tickComponent={TickYear}
            scale={dateScale}
            stroke="transparent"
            tickStroke="transparent"
            numTicks={20}
            hideAxisLine
            tickLabelProps={() => ({
              fill: '#000',
              fontSize: 11,
              textAnchor: 'middle',
              width,
            })}
          />
        )}
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
    </div>
  );
};

export default VerticalBarChart;
