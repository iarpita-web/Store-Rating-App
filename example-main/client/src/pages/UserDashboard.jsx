import { useEffect, useState } from 'react';
import { api } from '../utils/api.js';

export default function UserDashboard() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/stores');
        setStores(res.data.stores || []);
      } catch (e) { alert(e.message); }
    })();
  }, []);

  return (
    <div>
      <h2>My Dashboard</h2>
      <p className="muted">Browse stores and submit or update your ratings.</p>
      <div className="grid">
        {stores.map(s => (
          <div className="card" key={s.id}>
            <h3>{s.name}</h3>
            <p>{s.description || 'No description'}</p>
            <p><strong>Average:</strong> {s.averageRating ? s.averageRating.toFixed(1) : 'No ratings'}</p>
            <a className="primary" href={`/stores/${s.id}`}>Rate</a>
          </div>
        ))}
      </div>
    </div>
  );
}
