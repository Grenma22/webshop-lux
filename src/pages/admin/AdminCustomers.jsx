import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Mail, ShoppingBag, TrendingUp, User, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminCustomers() {
  const { fetchApi } = useApi();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/orders')
      .then(orders => {
        const customerMap = orders.reduce((acc, order) => {
          if (!acc[order.email]) {
            acc[order.email] = {
              email: order.email,
              name: order.shipping_name || 'Anonymous Client',
              orderCount: 0,
              totalSpent: 0,
              lastOrder: order.created_at
            };
          }
          acc[order.email].orderCount += 1;
          acc[order.email].totalSpent += order.total_amount;
          if (new Date(order.created_at) > new Date(acc[order.email].lastOrder)) {
            acc[order.email].lastOrder = order.created_at;
          }
          return acc;
        }, {});

        setCustomers(Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [fetchApi]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
      <div className="w-10 h-10 border-2 border-t-accent-primary border-white/5 rounded-full animate-spin"></div>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted animate-pulse">Synchronizing Global Clientele</p>
    </div>
  );

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-2 duration-1000">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-3 mb-6">
             <div className="h-[1px] w-12 bg-accent-primary/50"></div>
             <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-accent-primary">Exclusive CRM</p>
          </div>
          <h1 className="text-5xl font-bold font-serif tracking-tight">Client Portfolio</h1>
          <p className="text-text-muted mt-4 text-sm max-w-lg font-light">
            Manage your global clientele. Monitor lifetime value, engagement levels, and acquisition metrics for every fashion connoisseur in your network.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.05] p-6 rounded-lg glass-couture">
          <div className="flex flex-col text-right">
             <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted mb-1">Global Base</p>
             <p className="text-2xl font-serif text-white">{customers.length}</p>
          </div>
          <div className="h-10 w-[1px] bg-white/[0.1]"></div>
          <User className="text-accent-primary" size={24} />
        </div>
      </header>

      {/* CRM Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="admin-card relative overflow-hidden group">
          <div className="p-2 bg-accent-primary text-bg-primary absolute top-0 left-0 text-[8px] font-bold uppercase tracking-widest px-3">Valued Asset</div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mt-4 mb-2">Portfolio Peak Revenue</p>
          <p className="text-3xl font-serif text-accent-primary">
            {customers[0]?.totalSpent.toFixed(2) || '0.00'} €
          </p>
          <TrendingUp className="absolute bottom-6 right-8 text-white/[0.03] group-hover:text-white/[0.08] transition-colors" size={48} />
        </div>
        <div className="admin-card">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Consolidated Avg spend</p>
          <p className="text-3xl font-serif text-white">
            {(customers.reduce((acc, c) => acc + c.totalSpent, 0) / (customers.length || 1)).toFixed(2)} €
          </p>
        </div>
        <div className="admin-card border-emerald-500/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Loyalty Conversion</p>
          <p className="text-3xl font-serif text-emerald-400">
            {((customers.filter(c => c.orderCount > 1).length / (customers.length || 1)) * 100).toFixed(1)} %
          </p>
          <div className="absolute top-4 right-6 text-[8px] font-bold text-emerald-400 bg-emerald-400/5 px-2 py-1 rounded uppercase tracking-[0.2em] border border-emerald-500/20">Retention High</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="admin-card !p-0 shadow-2xl">
        <div className="p-8 border-b border-white/[0.03] flex items-center justify-between">
            <h2 className="text-xl font-serif">Client Directory</h2>
            <div className="flex gap-2">
               <button className="p-2 hover:bg-white/[0.05] rounded text-text-muted transition-all"><MoreHorizontal size={16} /></button>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="pl-10">Client Profile</th>
                <th>Purchasing Power</th>
                <th>Cumulative Value</th>
                <th>Last Engagement</th>
                <th className="pr-10 text-right">Verification</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan="5" className="p-20 text-center text-text-muted font-serif text-lg opacity-30 italic">No Registered Clients</td></tr>
              ) : customers.map((customer) => (
                <tr key={customer.email} className="group">
                  <td className="pl-10">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-primary/20 via-bg-tertiary to-purple-500/10 flex items-center justify-center border border-white/[0.05] group-hover:border-accent-primary/30 transition-all font-serif text-lg">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-bold tracking-tight uppercase group-hover:text-accent-primary transition-colors">{customer.name}</p>
                        <p className="text-[10px] text-text-muted font-medium mt-0.5 tracking-wide">{customer.email.toLowerCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                       <ShoppingBag size={12} className="text-text-muted" />
                       <span className="text-xs font-bold">{customer.orderCount} <span className="text-[10px] font-medium text-text-muted uppercase tracking-widest ml-1">Orders</span></span>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm font-bold tabular-nums text-accent-primary">€ {customer.totalSpent.toFixed(2)}</span>
                  </td>
                  <td className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    {new Date(customer.lastOrder).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
                  </td>
                  <td className="pr-10 text-right">
                    <div className="flex justify-end gap-3 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    <a href={"mailto:" + customer.email} className="p-3 bg-white/[0.03] hover:bg-white/[0.08] text-accent-primary rounded border border-white/[0.05] transition-all">
                       <Mail size={14} />
                    </a>
                    <button className="p-3 bg-white/[0.03] hover:bg-accent-primary/20 text-white rounded border border-white/[0.05] transition-all">
                       <ShieldCheck size={14} />
                    </button>
                    </div>
                    <ArrowRight className="group-hover:hidden text-text-muted mx-auto opacity-30" size={14} />
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

function MoreHorizontal({ size }) {
  return <TrendingUp size={size} />;
}
