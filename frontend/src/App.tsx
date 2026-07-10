import { useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Favorites } from './pages/Favorites';

export function App() {
  const { token } = useAuth();
  // Ruteo mínimo por estado de sesión (sin router para mantenerlo simple).
  return token ? <Favorites /> : <Login />;
}
