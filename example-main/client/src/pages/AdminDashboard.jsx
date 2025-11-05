import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../utils/api.js';

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'USER', 'OWNER']).default('USER'),
});

const storeSchema = z.object({
  name: z.string().min(2),
  description: z.string().max(1000).optional(),
  ownerId: z.string().uuid(),
});

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const owners = useMemo(() => users.filter(u => u.role === 'OWNER'), [users]);

  const userForm = useForm({ resolver: zodResolver(userSchema), defaultValues: { role: 'USER' } });
  const storeForm = useForm({ resolver: zodResolver(storeSchema) });

  const load = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, storesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/stores'),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setStores(storesRes.data.stores);
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onCreateUser = async (v) => {
    try {
      await api.post('/admin/users', v);
      userForm.reset({ role: 'USER' });
      await load();
      alert('User created');
    } catch (e) { alert(e.message); }
  };

  const onCreateStore = async (v) => {
    try {
      await api.post('/admin/stores', v);
      storeForm.reset();
      await load();
      alert('Store created');
    } catch (e) { alert(e.message); }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {loading && <p>Loading...</p>}

      {stats && (
        <div className="stats-row">
          <div className="stat">Users<br/><strong>{stats.users}</strong></div>
          <div className="stat">Stores<br/><strong>{stats.stores}</strong></div>
          <div className="stat">Ratings<br/><strong>{stats.ratings}</strong></div>
        </div>
      )}

      <div className="grid two">
        <div className="card">
          <h3>Create User</h3>
          <form className="form" onSubmit={userForm.handleSubmit(onCreateUser)}>
            <label>Name<input {...userForm.register('name')} /></label>
            <label>Email<input type="email" {...userForm.register('email')} /></label>
            <label>Password<input type="password" {...userForm.register('password')} /></label>
            <label>Role<select {...userForm.register('role')}>
              <option value="USER">USER</option>
              <option value="OWNER">OWNER</option>
              <option value="ADMIN">ADMIN</option>
            </select></label>
            <button className="primary" disabled={userForm.formState.isSubmitting} type="submit">Create</button>
          </form>
        </div>

        <div className="card">
          <h3>Create Store</h3>
          <form className="form" onSubmit={storeForm.handleSubmit(onCreateStore)}>
            <label>Name<input {...storeForm.register('name')} /></label>
            <label>Description<input {...storeForm.register('description')} /></label>
            <label>Owner<select {...storeForm.register('ownerId')}>
              <option value="">Select owner</option>
              {owners.map(o => <option key={o.id} value={o.id}>{o.name} ({o.email})</option>)}
            </select></label>
            <button className="primary" disabled={storeForm.formState.isSubmitting} type="submit">Create</button>
          </form>
        </div>
      </div>

      <div className="grid two">
        <div className="card">
          <h3>Users</h3>
          <ul className="list">
            {users.map(u => (
              <li key={u.id} className="list-item"><strong>{u.name}</strong> — {u.email} • {u.role}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Stores</h3>
          <ul className="list">
            {stores.map(s => (
              <li key={s.id} className="list-item"><strong>{s.name}</strong> — owner {s.owner?.name || '—'} • avg {s.averageRating ? s.averageRating.toFixed(1) : '—'}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
