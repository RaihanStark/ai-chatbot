import { tool } from 'ai';
import { z } from 'zod';

export const createChart = tool({
  description: 'Create a data visualization chart directly in the chat (not as a document). Use this for quick data visualizations.',
  parameters: z.object({
    type: z.enum(['line', 'bar', 'pie', 'area', 'radar', 'scatter']).describe('The type of chart to create'),
    title: z.string().describe('The title of the chart'),
    data: z.array(z.record(z.string(), z.any())).describe('The data to visualize. Each object should have consistent keys.'),
    dataKeys: z.array(z.string()).describe('The keys from data objects to plot (e.g., ["value"] for single series, ["revenue", "expenses"] for multi-series)'),
    xAxisKey: z.string().optional().describe('The key to use for x-axis (usually "name" or "label"). Required for bar/line/area charts.'),
    colors: z.array(z.string()).optional().describe('Array of color codes for the chart'),
  }),
  execute: async ({ type, title, data, dataKeys, xAxisKey, colors }) => {
    // Default colors if not provided
    const defaultColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
    
    return {
      type,
      title,
      data,
      dataKeys,
      xAxisKey: xAxisKey || 'name',
      colors: colors || defaultColors,
    };
  },
});