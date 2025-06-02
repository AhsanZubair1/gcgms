export function getDateRangeConfig(
  range: 'today' | 'week' | 'month' | 'year',
): {
  dateTruncFormat: string;
  interval: string;
  labelFormat: string;
  seriesRange: string;
  periodInterval: string;
  labelType: 'day' | 'week' | 'month' | 'year';
} {
  switch (range) {
    case 'today':
      return {
        dateTruncFormat: 'day',
        interval: '1 day',
        labelFormat: 'DD MMM YYYY', // e.g., "27 May 2025"
        seriesRange: 'day',
        periodInterval: '1 day',
        labelType: 'day',
      };
    case 'week':
      return {
        dateTruncFormat: 'day',
        interval: '1 day',
        labelFormat: 'DD Mon', // e.g., "20 May"
        seriesRange: 'day',
        periodInterval: '7 days',
        labelType: 'day',
      };
    case 'month':
      return {
        dateTruncFormat: 'day',
        interval: '7 days', // 4 weeks in a month
        labelFormat: 'Week W', // e.g., "Week 1"
        seriesRange: 'week',
        periodInterval: '4 weeks',
        labelType: 'week',
      };
    case 'year':
      return {
        dateTruncFormat: 'month',
        interval: '1 month',
        labelFormat: 'Month YYYY', // Changed from 'MM YYYY' to 'Month YYYY'
        seriesRange: 'month',
        periodInterval: '12 months',
        labelType: 'month',
      };
    default:
      throw new Error('Invalid date range');
  }
}
