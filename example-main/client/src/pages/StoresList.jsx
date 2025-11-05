import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api.js';

export default function StoresList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async (q = '') => {
    setLoading(true);
    try {
      const res = await api.get('/stores', { params: q ? { search: q } : {} });
      setStores(res.data.stores || []);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSearch = (e) => {
    e.preventDefault();
    load(search.trim());
  };

  return (
    <div>
      <h2>Stores</h2>
      <form onSubmit={onSearch} className="search-row">
        <input placeholder="Search stores..." value={search} onChange={e => setSearch(e.target.value)} />
        <button className="ghost" type="submit">Search</button>
      </form>
      {loading ? <p>Loading...</p> : (
        <div className="grid">
          {stores.map(s => (
            <div className="card" key={s.id}>
              <h3>{s.name}</h3>
              <p className="muted">Owner: {s.owner?.name || '—'}</p>
              <p>{s.description || 'No description'}</p>
              <p><strong>Average:</strong> {s.averageRating ? s.averageRating.toFixed(1) : 'No ratings'}</p>
              <Link to={`/stores/${s.id}`} className="primary">View</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
