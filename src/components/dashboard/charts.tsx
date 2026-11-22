"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface WeeklyMinutesPoint {
  date: string;
  label: string;
  minutes: number;
  wpm: number;
  sessions: number;
}

export interface MonthlyWpmPoint {
  date: string;
  label: string;
  minutes: number;
  wpm: number;
}

const tooltipContentStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  boxShadow: "var(--shadow)",
  color: "var(--foreground)",
  fontSize: 12,
  fontWeight: 600,
};

const tooltipLabelStyle: React.CSSProperties = {
  color: "var(--foreground)",
  fontSize: 12,
  fontWeight: 800,
  marginBottom: 2,
};

const tooltipItemStyle: React.CSSProperties = {
  color: "var(--muted)",
  fontSize: 12,
};

const axisTick = { fill: "var(--muted)", fontSize: 11 };

function EmptyChart({ height, message }: { height: number; message: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl border border-dashed border-border px-4 text-center text-sm text-muted"
      style={{ height }}
    >
      {message}
    </div>
  );
}

export function WeeklyMinutesChart({
  data,
  height = 220,
}: {
  data: WeeklyMinutesPoint[];
  height?: number;
}) {
  if (!data.some((point) => point.minutes > 0 || point.sessions > 0 || point.wpm > 0)) {
    return <EmptyChart height={height} message="No practice minutes recorded in the last 7 days yet." />;
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 6, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={axisTick} dy={6} />
          <YAxis allowDecimals={false} width={44} tickLine={false} axisLine={false} tick={axisTick} />
          <Tooltip
            contentStyle={tooltipContentStyle}
            labelStyle={tooltipLabelStyle}
            itemStyle={tooltipItemStyle}
            cursor={{ fill: "var(--primary-soft)", opacity: 0.5 }}
          />
          <Bar
            dataKey="minutes"
            name="Practice minutes"
            unit=" min"
            fill="var(--primary)"
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyWpmChart({
  data,
  height = 220,
}: {
  data: MonthlyWpmPoint[];
  height?: number;
}) {
  if (!data.some((point) => point.wpm > 0 || point.minutes > 0)) {
    return <EmptyChart height={height} message="No typing activity recorded in the last 30 days yet." />;
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 6, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="speakmate-monthly-wpm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={axisTick}
            interval="preserveStartEnd"
            minTickGap={26}
            dy={6}
          />
          <YAxis allowDecimals={false} width={44} tickLine={false} axisLine={false} tick={axisTick} />
          <Tooltip
            contentStyle={tooltipContentStyle}
            labelStyle={tooltipLabelStyle}
            itemStyle={tooltipItemStyle}
            cursor={{ stroke: "var(--border-strong)", strokeDasharray: "3 3" }}
          />
          <Area
            type="monotone"
            dataKey="wpm"
            name="Average WPM"
            unit=" WPM"
            stroke="var(--secondary)"
            strokeWidth={2.5}
            fill="url(#speakmate-monthly-wpm)"
            connectNulls
            dot={false}
            activeDot={{ r: 4, fill: "var(--primary)", stroke: "var(--surface)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface ChartTableColumn {
  key: string;
  label: string;
}

/** Visually hidden, screen-reader-friendly figures for each chart. */
export function ChartDataTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: ChartTableColumn[];
  rows: Array<Record<string, string | number>>;
}) {
  return (
    <div className="sr-only">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
