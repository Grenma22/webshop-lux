import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingBag, Send, LogOut, ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
  const { admin, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Lade...</div>;
  if (!admin) return <Navigate to="/admin/login" />;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-primary">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-black/40 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold font-accent text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">LUX. Admin</h2>
          <p className="text-xs text-text-secondary mt-1">Eingeloggt als {admin.username}</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <NavLink to="/admin" end className={({isActive}) => "flex items-center gap-3 p-3 rounded-md transition-colors " + (isActive ? 'bg-accent-primary/20 text-accent-primary' : 'hover:bg-white/5 text-text-secondary w-full')}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({isActive}) => "flex items-center gap-3 p-3 rounded-md transition-colors " + (isActive ? 'bg-accent-primary/20 text-accent-primary' : 'hover:bg-white/5 text-text-secondary w-full')}>
            <ShoppingBag size={18} /> Produkte
          </NavLink>
          <NavLink to="/admin/orders" className={({isActive}) => "flex items-center gap-3 p-3 rounded-md transition-colors " + (isActive ? 'bg-accent-primary/20 text-accent-primary' : 'hover:bg-white/5 text-text-secondary w-full')}>
            <Send size={18} /> Bestellungen
          </NavLink>
        </nav>
        <div className="p-4 border-t border-white/10 flex flex-col gap-2">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 p-3 text-sm text-text-secondary hover:text-white transition-colors w-full text-left rounded-md hover:bg-white/5">
            <ArrowLeft size={16} /> Zum Shop
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-sm text-red-400 hover:text-red-300 transition-colors w-full text-left rounded-md hover:bg-red-500/10">
            <LogOut size={16} /> Abmelden
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
