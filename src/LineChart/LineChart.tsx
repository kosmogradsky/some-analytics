import * as React from 'react';
import { scaleLinear, scaleTime, extent, max, timeMonth, ScaleLinear, ScaleTime } from 'd3';
import { addMonths } from 'date-fns';

export interface ViewsEachMonthEntry {
  month: Date,
  views: number
}

const padding = 15;

interface PlaneProps {
  entries: ViewsEachMonthEntry[],
  width: number,
  height: number,
  scaleViews: ScaleLinear<number, number>,
  scaleMonth: ScaleTime<number, number>,
  viewsTickRange: number[],
  monthTickRange: Date[]
}

const Plane: React.FunctionComponent<PlaneProps> = ({
  entries,
  width,
  height,
  scaleMonth,
  scaleViews,
  viewsTickRange,
  monthTickRange
}) => {
  return (
    <svg
      width={width}
      height={height}
      style={{
        display: 'inline-block',
        verticalAlign: 'top'
      }}
    >
      {viewsTickRange.map(tickViews => {
        const tickY = scaleViews(tickViews);

        return (
          <line
            y1={tickY}
            y2={tickY}
            x1={padding}
            x2={width - padding}
            stroke='violet'
            opacity='.5'
          />
        )
      })}
      {monthTickRange.map(tickMonth => {
        const tickX = scaleMonth(tickMonth);

        return (
          <line
            y1={height - padding}
            y2={padding}
            x1={tickX}
            x2={tickX}
            stroke='violet'
            opacity='.5'
          />
        )
      })}
      {entries.map((entry, index) => (
        <circle
          key={index}
          cx={scaleMonth(entry.month)}
          cy={scaleViews(entry.views)}
          r='2.5'
          strokeWidth='1.25'
          fill='orange'
        />
      ))}
    </svg>
  )
}

interface VerticalLabelsProps {
  scaleViews: ScaleLinear<number, number>,
  viewsTickRange: number[]
}

const VerticalLabels: React.FunctionComponent<VerticalLabelsProps> = ({
  scaleViews,
  viewsTickRange
}) => {
  return (
    <div style={{
      display: 'inline-block',
      verticalAlign: 'top'
    }}>
      {viewsTickRange.map((tickViews, index) => {
        const tickY = scaleViews(tickViews);

        return (
          <div style={{
            position: index === viewsTickRange.length - 1 ? 'static' : 'absolute',
            transform: `translateY(calc(${tickY}px - 50%))`
          }}>{tickViews}</div>
        )
      })}
    </div>
  ) 
}

interface LineChartProps {
  entries: ViewsEachMonthEntry[],
  width: number,
  height: number
}

export const LineChart: React.FunctionComponent<LineChartProps> = ({ entries, width, height }) => {
  const scaleViews = scaleLinear()
    .range([height - padding, padding])
    .domain([0, max(entries, entry => entry.views) as number]);

  const viewsTickRange = scaleViews.ticks(5)

  const monthExtent = extent(entries, entry => entry.month) as [Date, Date];
  const monthTickRange = timeMonth.range(monthExtent[0], addMonths(monthExtent[1], 1))

  const scaleMonth = scaleTime()
    .range([padding, width - padding])
    .domain(monthExtent);

  return (
    <div>
      <VerticalLabels
        scaleViews={scaleViews}
        viewsTickRange={viewsTickRange}
      />
      <Plane
        entries={entries}
        width={width}
        height={height}
        scaleViews={scaleViews}
        scaleMonth={scaleMonth}
        viewsTickRange={viewsTickRange}
        monthTickRange={monthTickRange}
      />
      <div>HorizontalLabels</div>
    </div>
  )
} 