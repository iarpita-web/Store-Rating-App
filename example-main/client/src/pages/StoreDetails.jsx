import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../utils/api.js';
import { useAuth } from '../state/AuthContext.jsx';

const ratingSchema = z.object({
  stars: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export default function StoreDetails() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ resolver: zodResolver(ratingSchema) });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/stores/${id}`);
      setStore(res.data.store);
      const myRating = res.data.store.ratings.find(r => r.user.id === user.id);
      if (myRating) {
        reset({ stars: myRating.stars, comment: myRating.comment || '' });
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const onSubmit = async (values) => {
    try {
      await api.post('/ratings', { storeId: id, ...values });
      await load();
      alert('Rating saved');
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!store) return <p>Not found</p>;

  const average = store.averageRating ? store.averageRating.toFixed(1) : 'No ratings';

  return (
    <div>
      <h2>{store.name}</h2>
      <p className="muted">Owner: {store.owner?.name}</p>
      <p>{store.description || 'No description'}</p>
      <p><strong>Average:</strong> {average}</p>

      {user.role === 'USER' && (
        <div className="card">
          <h3>Rate this store</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="form inline">
            <label>
              Stars
              <select {...register('stars')}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </label>
            <label style={{ flex: 1 }}>
              Comment
              <input placeholder="Optional" {...register('comment')} />
            </label>
            <button type="submit" disabled={isSubmitting} className="primary">{isSubmitting ? 'Saving...' : 'Save'}</button>
          </form>
        </div>
      )}

      <div>
        <h3>Recent Ratings</h3>
        {store.ratings.length === 0 ? <p className="muted">No ratings yet.</p> : (
          <ul className="list">
            {store.ratings.map(r => (
              <li key={r.id} className="list-item">
                <strong>{r.user.name}</strong> — {r.stars}★ {r.comment ? `• ${r.comment}` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
