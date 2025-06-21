import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const HOURS = Array.from({ length: 10 }, (_, i) => 8 + i); // 8am-17pm
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function PeakTimesHeatmap() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/analytics/peaks').then(r => r.json()).then(setData);
  }, []);

  function count(dow, hour) {
    const f = data.find(row => Number(row.dow) === dow && Number(row.hour) === hour);
    return f ? Number(f.bookings) : 0;
  }

  function color(val) {
    if (val > 20) return '#dc2626';
    if (val > 10) return '#eab308';
    if (val > 0) return '#86efac';
    return '#e2e8f0';
  }

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: `80px repeat(${HOURS.length}, 1fr)` }}>
        <Box></Box>
        {HOURS.map(h => (
          <Box key={h} sx={{ textAlign: 'center', fontSize: 12 }}>{h}:00</Box>
        ))}
        {DAYS.map((d, i) => (
          <React.Fragment key={d}>
            <Box sx={{ fontSize: 12 }}>{d}</Box>
            {HOURS.map(h => {
              const val = count(i, h);
              return (
                <Box key={h}
                  sx={{ height: 20, bgcolor: color(val), textAlign:'center', fontSize:10 }}
                >{val || ''}</Box>
              );
            })}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
