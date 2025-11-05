import { useEffect, useState } from 'react';
import { api } from '../utils/api.js';

export default function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [selected, setSelected] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(null);

  const loadStores = async () => {
    const res = await api.get('/owner/my-stores');
    setStores(res.data.stores || []);
  };

  const loadRatings = async (id) => {
    const res = await api.get(`/owner/my-stores/${id}/ratings`);
    setRatings(res.data.ratings || []);
    setAverage(res.data.averageRating || null);
  };

  useEffect(() => { loadStores(); }, []);

  useEffect(() => { if (selected) loadRatings(selected); }, [selected]);

  return (
    <div>
      <h2>Owner Dashboard</h2>
      <div className="grid two">
        <div className="card">
          <h3>My Stores</h3>
          <ul className="list">
            {stores.map(s => (
              <li key={s.id} className="list-item">
                <button className={`ghost ${selected === s.id ? 'active' : ''}`} onClick={() => setSelected(s.id)}>{s.name}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Ratings {selected && `(avg: ${average ? average.toFixed(1) : '—'})`}</h3>
          {selected ? (
            ratings.length === 0 ? <p className="muted">No ratings yet.</p> : (
              <ul className="list">
                {ratings.map(r => (
                  <li key={r.id} className="list-item"><strong>{r.user.name}</strong> — {r.stars}★ {r.comment ? `• ${r.comment}` : ''}</li>
                ))}
              </ul>
            )
          ) : <p className="muted">Select a store to view ratings.</p>}
        </div>
      </div>
    </div>
  );
}
