import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/admin/users').then((res) => {
      setUsers(res.data.users);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/admin/user/${id}`, { role });
      toast.success('Role updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update role');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/user/${id}`);
      toast.success('User deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete user');
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-700">Users ({users.length})</h1>
      <div className="overflow-x-auto rounded-xl2 border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 bg-ink/5 text-left text-xs uppercase tracking-wide text-slate-soft">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-ink/5 last:border-0">
                <td className="flex items-center gap-3 px-4 py-3">
                  <img src={u.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                  {u.name}
                </td>
                <td className="px-4 py-3 text-ink/70">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    disabled={u._id === currentUser._id}
                    className="rounded-lg border border-ink/10 px-2 py-1.5 text-xs disabled:opacity-50"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  {u._id !== currentUser._id && (
                    <button onClick={() => handleDelete(u._id)} className="rounded-lg p-2 text-brand hover:bg-brand/5"><Trash2 className="h-4 w-4" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
