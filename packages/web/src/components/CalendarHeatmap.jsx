import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Box } from '@mui/material';

export default function CalendarHeatmapChart({ values, onClick }) {
  // values should be array of { date: 'YYYY-MM-DD', count: number }
  const sorted = [...values].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <Box sx={{ width: '100%', overflowX: 'auto', '& .color-empty': { fill: '#e2e8f0' } }}>
      <CalendarHeatmap
        startDate={sorted.length ? new Date(sorted[0].date) : new Date()}
        endDate={sorted.length ? new Date(sorted[sorted.length - 1].date) : new Date()}
        values={sorted}
        classForValue={(val) => {
          if (!val || !val.count) return 'color-empty';
          if (val.count > 5) return 'color-scale-4';
          if (val.count > 3) return 'color-scale-3';
          if (val.count > 1) return 'color-scale-2';
          return 'color-scale-1';
        }}
        onClick={onClick}
      />
    </Box>
  );
}
