import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import ChairIcon from '@mui/icons-material/Chair';

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
  const isBooked = info.status === 'booked';
  const isMine = info.status === 'mine';

  return (
    <Tooltip
      title={
        info.booking
          ? `${info.booking.name} (${info.booking.team})`
          : `Desk ${desk.id} — Available`
      }
      arrow
    >
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          cursor: locked ? 'default' : 'move',
          boxShadow: isDragging ? 4 : 1,
          userSelect: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 4,
            borderColor: '#4f46e5',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <ChairIcon
            sx={{
              color: isBooked ? '#d32f2f' : isMine ? '#388e3c' : '#333',
              fontSize: 28,
              mb: 0.5,
            }}
          />
          <Typography
            variant="caption"
            sx={{ fontWeight: 500, fontSize: 11, color: '#333' }}
          >
            Desk {desk.id}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
}
