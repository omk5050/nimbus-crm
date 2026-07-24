import { useState } from 'react';
import { motion } from 'motion/react';
import type { RevenuePoint } from '@/types/dashboard.types';
import { formatCompactCurrency, formatCurrency } from '@/utils/format';

interface RevenueAreaChartProps {
  data: RevenuePoint[];
}

const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 220;
const PADDING_X = 8;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 28;

/**
 * Renders a gradient-filled revenue trend line as raw SVG, scaled entirely in
 * percentages so it stays responsive without a resize observer. The final
 * point renders as a dashed projection when `isProjected` is set (the
 * current, still-in-progress month).
 */
export function RevenueAreaChart({ data }: RevenueAreaChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const values = data.map((point) => point.revenue);
  const max = Math.max(...values);
  const min = Math.min(0, ...values);
  const chartWidth = VIEW_WIDTH - PADDING_X * 2;
  const chartHeight = VIEW_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const points = data.map((point, index) => {
    const x = PADDING_X + (index / (data.length - 1)) * chartWidth;
    const ratio = max === min ? 0 : (point.revenue - min) / (max - min);
    const y = PADDING_TOP + (1 - ratio) * chartHeight;
    return { x, y, point };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const baselineY = PADDING_TOP + chartHeight;
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${baselineY} L ${points[0].x.toFixed(1)} ${baselineY} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="relative h-full w-full">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="h-full w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Revenue trend over the last 7 months"
      >
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 0.28 }} />
            <stop offset="100%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        {gridLines.map((ratio) => (
          <line
            key={ratio}
            x1={PADDING_X}
            x2={VIEW_WIDTH - PADDING_X}
            y1={PADDING_TOP + ratio * chartHeight}
            y2={PADDING_TOP + ratio * chartHeight}
            style={{ stroke: 'var(--color-border)' }}
            strokeWidth={1}
          />
        ))}

        <motion.path
          d={areaPath}
          fill="url(#revenueFill)"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          style={{ stroke: 'var(--color-primary)' }}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        />

        {points.map(({ x, y, point }, index) => (
          <g key={point.month}>
            {point.isProjected && (
              <circle
                cx={x}
                cy={y}
                r={4}
                style={{ fill: 'var(--color-background)', stroke: 'var(--color-primary)' }}
                strokeWidth={2}
                strokeDasharray="2 2"
              />
            )}
            <motion.circle
              cx={x}
              cy={y}
              r={hovered === index ? 5 : 3.5}
              style={{ fill: 'var(--color-primary)', transformOrigin: `${x}px ${y}px` }}
              className="transition-all"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.25, delay: 0.7 + index * 0.05 }}
            />
            {/* Generous invisible hit target so the tooltip is easy to trigger */}
            <circle
              cx={x}
              cy={y}
              r={16}
              fill="transparent"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered((current) => (current === index ? null : current))}
            />
            <text
              x={x}
              y={VIEW_HEIGHT - 8}
              textAnchor="middle"
              className="text-[10px]"
              style={{ fill: 'var(--color-muted-foreground)' }}
            >
              {point.month}
            </text>
          </g>
        ))}
      </svg>

      {hovered !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md"
          style={{
            left: `${(points[hovered].x / VIEW_WIDTH) * 100}%`,
            top: `${(points[hovered].y / VIEW_HEIGHT) * 100 - 4}%`,
          }}
        >
          <div className="font-semibold text-popover-foreground">
            {formatCurrency(data[hovered].revenue)}
          </div>
          <div className="text-muted-foreground">
            {data[hovered].month}
            {data[hovered].isProjected ? ' (in progress)' : ''}
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute left-1 top-2 text-[10px] text-muted-foreground">
        {formatCompactCurrency(max)}
      </div>
    </div>
  );
}
