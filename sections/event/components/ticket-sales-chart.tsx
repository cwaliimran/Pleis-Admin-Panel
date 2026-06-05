'use client';

import { useTheme } from 'next-themes';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const formatChartDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

interface TicketSalesChartProps {
  ticketPerformance?: Array<{ date: string; value: number }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  const { theme } = useTheme ? useTheme() : { theme: 'light' };
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: theme === 'dark' ? '#1f1f1f' : '#fff',
          color: theme === 'dark' ? '#f1f1f1' : '#222',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          padding: '10px 16px',
          minWidth: 150,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4, opacity: 0.6 }}>{label}</div>
        <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 15 }}>{payload[0]?.value} Tickets Sold</div>
      </div>
    );
  }
  return null;
};

const TicketSalesChart = ({ ticketPerformance }: TicketSalesChartProps) => {
  const data = (ticketPerformance ?? []).map((p) => ({ day: formatChartDate(p.date), value: p.value }));
  const interval = data.length <= 10 ? 0 : Math.floor(data.length / 6);

  if (data.length === 0) {
    return (
      <div className="flex h-75 w-full items-center justify-center px-2 pb-4">
        <p className="text-muted-foreground text-sm">No sales data available</p>
      </div>
    );
  }

  return (
    <div className="h-75 w-full px-2 pb-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 48, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="ticketSalesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.4} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} style={{ fontSize: '11px' }} interval={interval} padding={{ left: 10, right: 10 }} />
          <YAxis axisLine={false} tickLine={false} style={{ fontSize: '11px' }} allowDecimals={false} domain={[0, 'auto']} />
          <Tooltip cursor={{ stroke: '#2563EB', strokeWidth: 1, strokeDasharray: '4 4' }} content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#2563EB"
            strokeWidth={2}
            fill="url(#ticketSalesGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#2563EB', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TicketSalesChart;
