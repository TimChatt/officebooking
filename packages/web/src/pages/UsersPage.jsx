import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/ui/Button.jsx';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  async function load() {
    const res = await fetch('/users', {
      headers: { 'x-user-role': 'admin' }
    });
    if (res.ok) setUsers(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function toggleRole(user) {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const res = await fetch(`/users/${user.id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'admin'
      },
      body: JSON.stringify({ role: newRole })
    });
    if (res.ok) load();
  }

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>
          Users
        </Typography>

        <Paper sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <Button onClick={() => toggleRole(u)} size="small">
                      Toggle Role
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Layout>
  );
}
