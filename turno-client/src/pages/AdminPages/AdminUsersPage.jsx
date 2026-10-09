import { useState, useEffect } from 'react';
import { getUsers, updateUser } from '../../api/users.js';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  function flash(m, isErr = false) {
    if (isErr) { setError(m); setTimeout(() => setError(''), 4000); }
    else { setMsg(m); setTimeout(() => setMsg(''), 4000); }
  }

  function load() {
    setLoading(true);
    getUsers().then((r) => setUsers(r.data.data || [])).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openEdit(u) { setEditId(u._id); setEditForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, role: u.role, isActive: u.isActive }); }

  async function handleSave() {
    try {
      await updateUser(editId, editForm);
      flash('User updated!'); setEditId(null); load();
    } catch { flash('Failed to update user.', true); }
  }

  async function toggleActive(u) {
    try {
      await updateUser(u._id, { isActive: !u.isActive });
      flash(`User ${!u.isActive ? 'activated' : 'deactivated'}!`); load();
    } catch { flash('Failed to update status.', true); }
  }

  const inputCls = 'mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#F4B41A]/40 transition';

  return (
    <div className="min-h-screen bg-[#0A192F]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4B41A]">Admin</p>
          <h1 className="text-3xl font-black text-white">Manage Users</h1>
        </div>

        {msg && <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-emerald-400">{msg}</div>}
        {error && <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-red-400">{error}</div>}

        {/* Edit Modal */}
        {editId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0F2C59] p-6 shadow-2xl">
              <h2 className="text-xl font-black text-white mb-5">Edit User</h2>
              <div className="space-y-3">
                {[['user-firstName', 'firstName', 'First Name'], ['user-lastName', 'lastName', 'Last Name'], ['user-email', 'email', 'Email']].map(([id, n, l]) => (
                  <div key={n}>
                    <label htmlFor={id} className="text-xs font-bold uppercase tracking-widest text-blue-300/80">{l}</label>
                    <input
                      id={id}
                      value={editForm[n] || ''}
                      onChange={(e) => setEditForm((f) => ({ ...f, [n]: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="user-role" className="text-xs font-bold uppercase tracking-widest text-blue-300/80">Role</label>
                  <select
                    id="user-role"
                    value={editForm.role}
                    onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                    className={`${inputCls} cursor-pointer`}>
                    <option value="Customer" className="bg-[#0A192F]">Customer</option>
                    <option value="Admin" className="bg-[#0A192F]">Admin</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    id="user-isActive"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="h-4 w-4 rounded accent-[#F4B41A]"
                  />
                  <span className="text-sm font-bold text-white/70">Active Account</span>
                </label>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={handleSave} className="flex-1 rounded-xl bg-[#F4B41A] py-2.5 text-xs font-black uppercase tracking-[0.2em] text-[#0A192F] hover:bg-[#FFC72C] transition">Save</button>
                <button onClick={() => setEditId(null)} className="flex-1 rounded-xl border border-white/10 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white/60 hover:border-red-500/30 hover:text-red-400 transition">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {loading ? <div className="py-20 text-center font-bold text-white/70 animate-pulse">Loading…</div> : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#112240]">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-[#0F2C59]/60">
                <tr>{['Name', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-blue-300/80">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.length === 0 && (
                  <tr><td colSpan={5} className="py-12 text-center text-blue-300/80">No users found.</td></tr>
                )}
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3 font-bold text-white">{u.firstName} {u.lastName}</td>
                    <td className="px-4 py-3 text-blue-300/80">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase ${u.role === 'Admin' ? 'bg-[#F4B41A]/20 text-[#F4B41A]' : 'bg-blue-500/10 text-blue-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase ${u.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(u)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase text-white/70 hover:bg-[#F4B41A]/10 hover:border-[#F4B41A]/30 hover:text-[#F4B41A] transition">Edit</button>
                        <button onClick={() => toggleActive(u)}
                          className={`rounded-lg border px-3 py-1 text-xs font-bold uppercase transition ${u.isActive ? 'border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
