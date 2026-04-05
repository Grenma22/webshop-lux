import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { 
  Package, Send, DollarSign, TrendingUp, 
  ArrowUpRight, Users, ShoppingBag, AlertCircle,
  Clock, CheckCircle, XCircle, ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area
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
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-6">
        <div className="w-10 h-10 border-2 border-t-accent-primary border-white/5 rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted animate-pulse">Analyzing Portfolio</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="p-20 text-center glass-couture brass-border inline-block">
      <AlertCircle className="mx-auto text-red-500 mb-4" size={32} />
      <p className="font-serif text-xl">Connection Interrupt</p>
      <p className="text-text-muted text-sm mt-2">Could not synchronize with atelier database.</p>
    </div>
  );

  const { summary, salesByDay, recentOrders, lowStock } = data;

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-2 duration-1000">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-6">
             <div className="h-[1px] w-12 bg-accent-primary/50"></div>
             <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-accent-primary">Executive Summary</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-serif tracking-tight lg:leading-[1.1]">Atelier Command Center</h1>
          <p className="text-text-muted mt-6 text-sm max-w-xl font-light leading-relaxed">
            Real-time management of your fashion portfolio. Monitor sales trends, control inventory, and oversee client relationships with precision.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
           <Link to="/admin/products/new" className="px-8 py-4 bg-accent-gradient text-bg-primary font-bold uppercase tracking-widest text-[10px] rounded-sm hover:opacity-90 transition-all flex items-center gap-3 group shadow-[0_10px_30px_rgba(197,160,89,0.2)]">
             <Package size={14} className="group-hover:scale-110 transition-transform" />
             Create Master Collection
           </Link>
           <p className="text-[9px] text-text-muted font-bold uppercase tracking-[0.2em]">Updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </header>
      
      {/* Global Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <CoutureKPI 
          title="Consolidated Revenue" 
          value={summary.revenue.toFixed(2) + " €"} 
          icon={<DollarSign size={20} />} 
          trend="+12.5%"
          color="accent"
        />
        <CoutureKPI 
          title="Total Fulfillment" 
          value={summary.orders} 
          icon={<ShoppingBag size={20} />} 
          trend="+8%"
        />
        <CoutureKPI 
          title="Catalog Selection" 
          value={summary.products} 
          icon={<LayoutGrid size={20} />} 
          color="muted"
        />
        <CoutureKPI 
          title="Pending Shipment" 
          value={summary.pending} 
          icon={<Send size={20} />} 
          alert={summary.pending > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Market Analytics */}
        <div className="lg:col-span-8 admin-card !p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-2xl font-serif mb-1">Market Performance</h2>
              <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Last 7 Calendar Days</p>
            </div>
            <div className="flex gap-4">
               <div className="bg-bg-primary/50 border border-white/5 rounded-full px-4 py-1.5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Revenue Peak</p>
               </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesByDay}>
                <defs>
                  <linearGradient id="brassFade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  dy={15}
                  tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                  style={{ fontWeight: 700, letterSpacing: '0.1em' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                  style={{ fontWeight: 700 }}
                  tickFormatter={(val) => `${val}€`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#141417', 
                    border: '1px solid rgba(197, 160, 89, 0.2)', 
                    borderRadius: '4px',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    letterSpacing: '0.05em'
                  }}
                  itemStyle={{ color: '#C5A059' }}
                  cursor={{ stroke: 'rgba(197, 160, 89, 0.3)', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#C5A059" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#brassFade)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Guard */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="admin-card !p-8 bg-gradient-to-br from-bg-secondary to-bg-primary">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-amber-500/10 rounded-sm text-amber-500">
                      <AlertCircle size={18} />
                   </div>
                   <h2 className="text-xl font-serif">Critical Alerts</h2>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{lowStock.length} Items</span>
              </div>
              
              <div className="space-y-4">
                {lowStock.length === 0 ? (
                  <div className="py-12 flex flex-col items-center gap-3 border border-dashed border-white/5 rounded-lg opacity-50">
                    <CheckCircle className="text-emerald-500" size={24} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Inventory Secure</p>
                  </div>
                ) : lowStock.map(p => (
                  <Link key={p.id} to={`/admin/products/${p.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.03] transition-all group">
                    <div className="w-12 h-12 rounded-sm overflow-hidden border border-white/[0.05] flex-shrink-0">
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-tight truncate group-hover:text-accent-primary transition-colors">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-[2px] bg-white/[0.03] overflow-hidden rounded-full">
                           <div className="h-full bg-red-500/50" style={{ width: `${(p.in_stock/10)*100}%` }}></div>
                        </div>
                        <span className="text-[9px] font-bold text-red-400 uppercase">{p.in_stock} Left</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-text-muted group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
           </div>

           <div className="admin-card !p-8 bg-bg-secondary flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted">Direct Access</h3>
              <div className="grid grid-cols-2 gap-3">
                 <QuickLink to="/admin/products" label="Stock" />
                 <QuickLink to="/admin/orders" label="Sales" />
                 <QuickLink to="/admin/customers" label="CRM" />
                 <QuickLink to="/admin/settings" label="Config" />
              </div>
           </div>
        </div>
      </div>

      {/* Narrative Event Log */}
      <div className="admin-card !p-0 overflow-hidden">
        <div className="p-10 border-b border-white/[0.03] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-serif mb-1">Recent Master Transactions</h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Live Fulfillment Stream</p>
          </div>
          <Link to="/admin/orders" className="text-[10px] font-bold uppercase tracking-widest text-accent-primary flex items-center gap-2 group">
            Archives <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="pl-10">Consignee</th>
                <th>Status</th>
                <th>Units</th>
                <th>Valuation</th>
                <th className="pr-10 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="group cursor-pointer">
                  <td className="pl-10">
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-[10px] font-bold">
                         {order.shipping_name?.charAt(0) || order.email.charAt(0)}
                       </div>
                       <div>
                         <p className="font-bold tracking-tight text-xs uppercase">{order.shipping_name || order.email}</p>
                         <p className="text-[9px] text-text-muted mt-0.5">{order.email.toLowerCase()}</p>
                       </div>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="text-xs font-medium">{order.item_count} Items</td>
                  <td className="font-bold text-accent-primary text-xs tabular-nums">{order.total_amount.toFixed(2)} €</td>
                  <td className="pr-10 text-right text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                    <span className="block opacity-40 mt-0.5">{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
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

function CoutureKPI({ title, value, icon, trend, color, alert }) {
  const isAccent = color === 'accent';
  return (
    <div className={`admin-card group ${alert ? 'border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-sm transition-all duration-500 group-hover:scale-110 ${isAccent ? 'bg-accent-primary text-bg-primary shadow-[0_5px_15px_rgba(197,160,89,0.3)]' : 'bg-white/[0.03] text-text-muted border border-white/5'}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-400/5 px-2 py-1 rounded-sm">
            <TrendingUp size={10} /> {trend}
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-2">{title}</p>
      <p className={`text-3xl font-serif tracking-tight ${isAccent ? 'text-accent-primary' : ''}`}>{value}</p>
      {alert && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>}
      <div className="absolute -right-2 -bottom-2 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000 transform rotate-45 scale-150">
        {icon}
      </div>
    </div>
  );
}

function QuickLink({ to, label }) {
  return (
    <Link to={to} className="p-3 bg-bg-primary border border-white/[0.03] hover:border-accent-primary/30 rounded text-[10px] font-bold uppercase tracking-widest text-center transition-all hover:text-accent-primary">
      {label}
    </Link>
  );
}

function StatusBadge({ status }) {
  const styles = {
    paid: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/[0.02]',
    shipped: 'border-accent-primary/20 text-accent-brass bg-accent-primary/[0.02]',
    pending: 'border-amber-500/20 text-amber-500 bg-amber-500/[0.02]',
    cancelled: 'border-red-500/20 text-red-500 bg-red-500/[0.02]'
  };
  
  const labels = {
    paid: 'Finalized',
    shipped: 'In Transit',
    pending: 'Queued',
    cancelled: 'Voided'
  };

  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-[0.2em] border shadow-sm ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  );
}

function LayoutGrid() {
  return <LayoutGrid size={18} />;
}
