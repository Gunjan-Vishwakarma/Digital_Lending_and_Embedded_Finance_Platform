import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '../../utils/helpers';

interface ScheduleItem {
  month: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

interface RepaymentChartProps {
  data: ScheduleItem[];
}

const RepaymentChart: React.FC<RepaymentChartProps> = ({ data }) => {
  return (
    <div className="chart-container">
      <h3>Loan Amortization Breakdown</h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
        Principal vs. interest components over time
      </p>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="month"
              stroke="var(--color-text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Month', position: 'insideBottom', offset: -5, fill: 'var(--color-text-muted)' }}
            />
            <YAxis
              stroke="var(--color-text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-bg-elevated)',
                border: 'var(--border-default)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--text-sm)',
              }}
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name,
              ]}
            />
            <Legend
              wrapperStyle={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}
            />
            <Area
              type="monotone"
              dataKey="principalPaid"
              stackId="1"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#colorPrincipal)"
              name="Principal Paid"
            />
            <Area
              type="monotone"
              dataKey="interestPaid"
              stackId="1"
              stroke="#a855f7"
              strokeWidth={2}
              fill="url(#colorInterest)"
              name="Interest Paid"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RepaymentChart;
