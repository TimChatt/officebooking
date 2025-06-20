import React, { useEffect, useState } from 'react';
import Button from '../components/ui/Button.jsx';

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
    <div>
      <h2 className="text-lg font-semibold mb-2">Users</h2>
      <table className="table-auto w-full text-left">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <Button onClick={() => toggleRole(u)}>Toggle Role</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
