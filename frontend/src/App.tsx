import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Favorites } from './pages/Favorites';
import { Teams } from './pages/Teams';

type PageType = 'favorites' | 'teams';

export function App() {
  const { token, logout } = useAuth();
  const [page, setPage] = useState<PageType>('favorites');

  if (!token) return <Login />;

  return (
    <div>
      <nav style={{ maxWidth: 640, margin: '16px auto 0', fontFamily: 'system-ui', display: 'flex', gap: 8 }}>
        <button onClick={() => setPage('favorites')} disabled={page === 'favorites'}>
          Favoritos
        </button>
        <button onClick={() => setPage('teams')} disabled={page === 'teams'}>
          Equipos
        </button>
        <button onClick={logout}>Salir</button>
      </nav>
      {page === 'favorites' ? <Favorites /> : <Teams />}
    </div>
  );
}
