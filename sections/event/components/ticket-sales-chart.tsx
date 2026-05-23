'use client';

import { useTheme } from 'next-themes';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Daily data for ~30 days — every 5th label shown via interval prop
const DUMMY_DATA = [
  { day: 'May 1', value: 8 },
  { day: 'May 2', value: 14 },
  { day: 'May 3', value: 11 },
  { day: 'May 4', value: 20 },
  { day: 'May 5', value: 17 },
  { day: 'May 6', value: 25 },
  { day: 'May 7', value: 22 },
  { day: 'May 8', value: 30 },
  { day: 'May 9', value: 28 },
  { day: 'May 10', value: 35 },
  { day: 'May 11', value: 40 },
  { day: 'May 12', value: 38 },
  { day: 'May 13', value: 45 },
  { day: 'May 14', value: 42 },
  { day: 'May 15', value: 55 },
  { day: 'May 16', value: 50 },
  { day: 'May 17', value: 48 },
  { day: 'May 18', value: 60 },
  { day: 'May 19', value: 58 },
  { day: 'May 20', value: 65 },
  { day: 'May 21', value: 70 },
  { day: 'May 22', value: 68 },
  { day: 'May 23', value: 75 },
  { day: 'May 24', value: 72 },
  { day: 'May 25', value: 80 },
  { day: 'May 26', value: 77 },
  { day: 'May 27', value: 85 },
  { day: 'May 28', value: 82 },
  { day: 'May 29', value: 90 },
  { day: 'May 30', value: 88 },
];

interface TicketSalesChartProps {
  chartData?: Array<{ day: string; value: number }>;
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

const TicketSalesChart = ({ chartData }: TicketSalesChartProps) => {
  const data = chartData && chartData.length > 0 ? chartData : DUMMY_DATA;

  return (
    <div className="h-[300px] w-full px-2 pb-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="ticketSalesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.4} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} style={{ fontSize: '11px' }} interval={4} />
          <YAxis axisLine={false} tickLine={false} style={{ fontSize: '11px' }} />
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
