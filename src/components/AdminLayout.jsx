import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, ShoppingBag, Send, Users, 
  Settings, LogOut, ArrowLeft, Command,
  LayoutGrid, UserCircle
} from 'lucide-react';

export default function AdminLayout() {
  const { admin, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-bg-primary">
      <div className="w-16 h-16 border-2 border-t-accent-primary border-white/5 rounded-full animate-spin"></div>
    </div>
  );
  
  if (!admin) return <Navigate to="/admin/login" />;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: <ShoppingBag size={18} />, label: 'Inventory' },
    { to: '/admin/orders', icon: <Send size={18} />, label: 'Orders' },
    { to: '/admin/customers', icon: <Users size={18} />, label: 'Clients' },
  ];

  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary selection:bg-accent-primary selection:text-bg-primary">
      {/* Precision Sidebar */}
      <aside className="w-72 border-r border-white-[0.03] bg-bg-secondary flex flex-col sticky top-0 h-screen z-50">
        <div className="p-10 border-b border-white/[0.03] flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold font-serif tracking-tight flex items-center gap-2">
              <div className="w-6 h-6 bg-accent-primary rounded-sm flex items-center justify-center text-bg-primary">
                <Command size={14} strokeWidth={3} />
              </div>
              ATELIER
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted mt-2 ml-8">Management</p>
          </div>
        </div>

        <nav className="flex-1 px-6 py-10 flex flex-col gap-1.5">
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              end={item.end}
              className={({isActive}) => `
                flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-500
                group relative overflow-hidden
                ${isActive ? 'bg-white/[0.03] text-accent-primary' : 'text-text-secondary hover:text-white hover:bg-white/[0.02]'}
              `}
            >
              {({isActive}) => (
                <>
                  <span className={`transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-accent-primary' : 'text-text-muted group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  <span className="text-[13px] font-medium tracking-wide uppercase">{item.label}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent-primary rounded-r-full shadow-[0_0_12px_var(--accent-primary)] animate-in fade-in duration-700"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}

          <div className="mt-auto pt-10 border-t border-white/[0.03] flex flex-col gap-2">
            <NavLink 
              to="/admin/settings" 
              className={({isActive}) => `
                flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all 
                ${isActive ? 'bg-white/[0.03] text-accent-primary' : 'text-text-secondary hover:text-white hover:bg-white/[0.02]'}
              `}
            >
              <Settings size={18} className="text-text-muted" />
              <span className="text-[13px] font-medium tracking-wide uppercase">Settings</span>
            </NavLink>
          </div>
        </nav>

        {/* Account Footer */}
        <div className="p-8 border-t border-white/[0.03] bg-bg-primary/20">
          <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
             <div className="w-10 h-10 rounded-full bg-accent-gradient flex items-center justify-center text-bg-primary font-bold overflow-hidden border border-white/10">
               <UserCircle className="opacity-80" />
             </div>
             <div className="flex flex-col">
               <p className="text-xs font-bold uppercase tracking-wider">{admin.username}</p>
               <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest">Administrator</p>
               </div>
             </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/')} 
              className="flex-1 flex items-center justify-center gap-2 p-3 text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-lg transition-all"
            >
              <ArrowLeft size={12} /> Store
            </button>
            <button 
              onClick={handleLogout} 
              className="p-3 text-red-400/80 hover:text-red-400 bg-red-500/[0.02] hover:bg-red-500/10 border border-red-500/[0.05] rounded-lg transition-all"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Canvas Viewport */}
      <main className="flex-1 overflow-y-auto bg-[#08080A]">
        <div className="p-12 lg:p-16 max-w-full overflow-hidden">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
