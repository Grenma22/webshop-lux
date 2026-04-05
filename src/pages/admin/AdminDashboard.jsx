import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { 
  Package, Send, DollarSign, TrendingUp, 
  ArrowUpRight, Users, ShoppingBag, AlertCircle,
  Clock, CheckCircle, XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';

export default function AdminDashboard() {
  const { fetchApi } = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/stats/dashboard')
      .then(stats => {
        setData(stats);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [fetchApi]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-accent-primary animate-pulse flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-t-accent-primary border-white/10 animate-spin"></div>
        <p className="text-sm font-medium">Analyse läuft...</p>
      </div>
    </div>
  );

  if (!data) return <div className="text-red-400">Fehler beim Laden der Dashboard-Daten.</div>;

  const { summary, salesByDay, recentOrders, lowStock } = data;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold font-accent mb-2">Portfolio Overview</h1>
          <p className="text-text-secondary">Willkommen zurück. Hier ist der aktuelle Status Ihres Ateliers.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products/new" className="px-5 py-2.5 bg-accent-primary text-black font-bold rounded-lg hover:bg-accent-secondary transition-all flex items-center gap-2 shadow-lg shadow-accent-primary/20">
            <Package size={18} /> Neues Produkt
          </Link>
        </div>
      </header>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Gesamtumsatz" 
          value={summary.revenue.toFixed(2) + " €"} 
          icon={<DollarSign size={20} />} 
          color="purple"
          trend="+12.5%"
        />
        <StatCard 
          title="Bestellungen" 
          value={summary.orders} 
          icon={<Send size={20} />} 
          color="emerald"
          trend="+5.2%"
        />
        <StatCard 
          title="Produkte" 
          value={summary.products} 
          icon={<Package size={20} />} 
          color="indigo"
        />
        <StatCard 
          title="Zu Versenden" 
          value={summary.pending} 
          icon={<TrendingUp size={20} />} 
          color="amber"
          alert={summary.pending > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-white/10 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-accent">Umsatzverlauf (7 Tage)</h2>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                <div className="w-2 h-2 rounded-full bg-accent-primary"></div> Revenue
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesByDay}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={12} 
                  tickFormatter={(str) => new Date(str).toLocaleDateString('de-DE', { weekday: 'short' })}
                />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121215', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#D4AF37' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-amber-500" size={20} />
            <h2 className="text-xl font-bold font-accent">Bestandswarnung</h2>
          </div>
          <div className="flex flex-col gap-4">
            {lowStock.length === 0 ? (
              <div className="py-10 text-center text-text-muted italic flex flex-col items-center gap-2">
                <CheckCircle className="text-emerald-500/50" />
                Alles auf Lager
              </div>
            ) : lowStock.map(p => (
              <div key={p.id} className="flex items-center gap-4 group">
                <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded object-cover border border-white/10" />
                <div className="flex-1">
                  <p className="text-sm font-medium group-hover:text-accent-primary transition-colors line-clamp-1">{p.name}</p>
                  <p className="text-xs text-text-secondary">{p.in_stock} Stück übrig</p>
                </div>
                <Link to={"/admin/products/" + p.id} className="p-2 bg-white/5 rounded text-xs hover:bg-white/10">Edit</Link>
              </div>
            ))}
          </div>
          <Link to="/admin/products" className="mt-auto text-center text-sm text-text-secondary hover:text-white transition-colors py-2 border-t border-white/5">Alle Produkte ansehen</Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold font-accent">Letzte Aktivitäten</h2>
          <Link to="/admin/orders" className="text-sm text-accent-primary hover:underline">Alle Bestellungen</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-text-secondary text-xs uppercase tracking-wider font-semibold">
                <th className="px-8 py-4">Kunde</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Items</th>
                <th className="px-8 py-4">Betrag</th>
                <th className="px-8 py-4 text-right">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-4">
                    <p className="text-sm font-medium">{order.shipping_name || order.email}</p>
                    <p className="text-xs text-text-secondary">{order.email}</p>
                  </td>
                  <td className="px-8 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-8 py-4 text-sm">{order.item_count} Positionen</td>
                  <td className="px-8 py-4 font-bold text-accent-primary">{order.total_amount.toFixed(2)} €</td>
                  <td className="px-8 py-4 text-right text-xs text-text-secondary flex flex-col">
                    <span>{new Date(order.created_at).toLocaleDateString('de-DE')}</span>
                    <span className="opacity-50 flex items-center justify-end gap-1"><Clock size={10} /> {new Date(order.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend, alert }) {
  const colors = {
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  };

  return (
    <div className={"glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-4 relative overflow-hidden " + (alert ? 'ring-1 ring-amber-500/50 ring-inset' : '')}>
      <div className="flex justify-between items-start">
        <div className={"p-3 rounded-xl border " + (colors[color] || colors.indigo)}>
          {icon}
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded-full">
            <ArrowUpRight size={14} /> {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-text-secondary mb-1">{title}</p>
        <p className="text-3xl font-bold font-accent">{value}</p>
      </div>
      {alert && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    shipped: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cancelled: 'bg-red-500/10 text-red-500 border-red-500/20'
  };
  
  const labels = {
    paid: 'Bezahlt',
    shipped: 'Versendet',
    pending: 'Ausstehend',
    cancelled: 'Storniert'
  };

  const icons = {
    paid: <CheckCircle size={14} />,
    shipped: <Send size={14} />,
    pending: <Clock size={14} />,
    cancelled: <XCircle size={14} />
  };

  return (
    <span className={"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border " + (styles[status] || styles.pending)}>
      {icons[status]} {labels[status] || status}
    </span>
  );
}
