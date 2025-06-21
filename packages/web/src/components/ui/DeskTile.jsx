import React from 'react';
import { Box } from '@mui/material';

export default function DeskTile({
  desk,
  scale,
  drag,
  locked,
  bookings,
  onStartDrag,
  getDeskInfo,
  deskColor,
}) {
  const info = getDeskInfo(desk.id);
  const isDragging = drag && drag.id === desk.id;

  return (
    <Box
      onMouseDown={(e) => onStartDrag(desk, e)}
      sx={{
        position: 'absolute',
        left: desk.x * scale,
        top: desk.y * scale,
        width: desk.width * scale,
        height: desk.height * scale,
        bgcolor: deskColor(info.status),
        border: isDragging ? '2px dashed #4f46e5' : '1px solid #cbd5e1',
        fontSize: 12,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1,
        cursor: locked ? 'default' : 'move',
        boxShadow: 1,
        '&:hover': {
          boxShadow: 3,
          borderColor: '#4f46e5',
        },
        userSelect: 'none',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {info.booking ? (
        <Box sx={{ textAlign: 'center' }}>
          <div>{info.booking.name}</div>
          <div style={{ fontSize: 10 }}>{info.booking.team}</div>
        </Box>
      ) : (
        `Desk ${desk.id}`
      )}
    </Box>
  );
}
