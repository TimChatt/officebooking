import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
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
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold mb-6">User Management</h1>

        <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Role</th>
                <th className="px-4 py-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 border-b last:border-none">
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2">
                    <Button onClick={() => toggleRole(u)} size="sm">
                      Toggle Role
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
