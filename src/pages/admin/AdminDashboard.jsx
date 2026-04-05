import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Package, Send, DollarSign, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { fetchApi } = useApi();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi('/products'),
      fetchApi('/orders')
    ]).then(([productsData, ordersData]) => {
      const revenue = ordersData
        .filter(o => o.status !== 'cancelled' && o.status !== 'pending') // assuming paid/shipped etc
        .reduce((sum, order) => sum + order.total_amount, 0);
      
      const pendingOrders = ordersData.filter(o => o.status === 'paid').length; // ready to ship

      setStats({
        products: productsData.length,
        orders: ordersData.length,
        revenue,
        pending: pendingOrders
      });
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [fetchApi]);

  if (loading) return <div>Lade Dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-black/40 border border-white/10 rounded-xl p-6 flex items-center gap-4">
          <div className="p-4 bg-indigo-500/20 text-indigo-400 rounded-lg"><Package size={24} /></div>
          <div>
            <p className="text-text-secondary text-sm">Produkte gesamt</p>
            <p className="text-2xl font-bold">{stats.products}</p>
          </div>
        </div>
        
        <div className="bg-black/40 border border-white/10 rounded-xl p-6 flex items-center gap-4">
          <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-lg"><Send size={24} /></div>
          <div>
            <p className="text-text-secondary text-sm">Bestellungen</p>
            <p className="text-2xl font-bold">{stats.orders}</p>
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-6 flex items-center gap-4">
          <div className="p-4 bg-amber-500/20 text-amber-400 rounded-lg"><TrendingUp size={24} /></div>
          <div>
            <p className="text-text-secondary text-sm">Zu Versenden</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-6 flex items-center gap-4">
          <div className="p-4 bg-purple-500/20 text-purple-400 rounded-lg"><DollarSign size={24} /></div>
          <div>
            <p className="text-text-secondary text-sm">Umsatz</p>
            <p className="text-2xl font-bold">{stats.revenue.toFixed(2)} €</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Quick Actions</h2>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/admin/products/new" className="btn-primary justify-center">Neues Produkt anlegen</Link>
            <Link to="/admin/orders" className="btn-secondary justify-center">Bestellungen prüfen</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
