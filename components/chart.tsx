'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
} from 'recharts';

interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'area' | 'radar' | 'scatter';
  title: string;
  data: any[];
  dataKeys: string[];
  xAxisKey: string;
  colors: string[];
}

export function Chart({ chartData }: { chartData?: ChartData }) {
  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/50">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    );
  }

  const { type, title, data, dataKeys, xAxisKey, colors } = chartData;

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/50">
        <p className="text-muted-foreground">No data to display</p>
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        );

      case 'pie': {
        const pieDataKey = dataKeys[0] || 'value';
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => entry[xAxisKey]}
              outerRadius={80}
              fill="#8884d8"
              dataKey={pieDataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${entry[xAxisKey]}-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      }

      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        );

      case 'radar':
        return (
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey={xAxisKey} />
            <PolarRadiusAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, index) => (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.6}
              />
            ))}
          </RadarChart>
        );

      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid />
            <XAxis dataKey={xAxisKey} />
            <YAxis dataKey={dataKeys[0]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name={title} data={data} fill={colors[0]} />
          </ScatterChart>
        );

      default:
        return <p>Unsupported chart type</p>;
    }
  };

  return (
    <div className="w-full border rounded-lg p-4 bg-background">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}