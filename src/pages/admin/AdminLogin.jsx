import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const { success, error: authError } = await login(username, password);
    if (success) {
      navigate('/admin');
    } else {
      setError(authError || 'Login fehlgeschlagen');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="w-full max-w-md p-8 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md">
        <div className="flex justify-center mb-6 text-accent-primary">
          <Lock size={48} />
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">Admin Login</h1>
        {error && <div className="p-3 mb-6 bg-red-500/20 border border-red-500 text-red-100 rounded-md text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label>Benutzername</label>
            <input 
              type="text" 
              className="form-input" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Passwort</label>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-primary mt-4 w-full justify-center">Login</button>
        </form>
      </div>
    </div>
  );
}
