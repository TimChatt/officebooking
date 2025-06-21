import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

const SCALE = 40;

export default function FloorplanAnalytics() {
  const [desks, setDesks] = useState([]);
  const [usage, setUsage] = useState([]);

  useEffect(() => {
    fetch('/api/desks').then(r => r.json()).then(setDesks);
    fetch('/api/analytics/floorplan').then(r => r.json()).then(setUsage);
  }, []);

  function deskColor(id) {
    const u = usage.find(u => u.desk_id === id);
    if (!u) return '#bbf7d0';
    if (u.bookings > 20) return '#dc2626';
    if (u.bookings > 10) return '#eab308';
    return '#a7f3d0';
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 300, border: '1px solid #ddd', borderRadius: 1 }}>
      {desks.map(d => (
        <Box key={d.id}
          sx={{
            position: 'absolute',
            left: d.x * SCALE,
            top: d.y * SCALE,
            width: d.width * SCALE,
            height: d.height * SCALE,
            bgcolor: deskColor(d.id),
            border: '1px solid #cbd5e1',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
          }}
        >
          {d.id}
        </Box>
      ))}
    </Box>
  );
}
