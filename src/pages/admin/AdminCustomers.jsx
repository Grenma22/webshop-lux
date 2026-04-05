import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Mail, ShoppingBag, TrendingUp } from 'lucide-react';

export default function AdminCustomers() {
  const { fetchApi } = useApi();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/orders')
      .then(orders => {
        // Derive unique customers from orders
        const customerMap = orders.reduce((acc, order) => {
          if (!acc[order.email]) {
            acc[order.email] = {
              email: order.email,
              name: order.shipping_name || 'Unbekannt',
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

  if (loading) return <div>Lade Kunden...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="text-sm text-text-secondary bg-white/5 px-4 py-2 rounded-full border border-white/10">
          Gesamt: {customers.length} aktive Kunden
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border-l-4 border-l-accent-primary">
          <p className="text-sm text-text-secondary mb-1">Top Kunde Revenue</p>
          <p className="text-2xl font-bold text-accent-primary">
            {customers[0]?.totalSpent.toFixed(2) || '0.00'} €
          </p>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-indigo-500">
          <p className="text-sm text-text-secondary mb-1">Ø Bestellwert</p>
          <p className="text-2xl font-bold text-indigo-400">
            {(customers.reduce((acc, c) => acc + c.totalSpent, 0) / (customers.length || 1)).toFixed(2)} €
          </p>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-emerald-500">
          <p className="text-sm text-text-secondary mb-1">Repeat-Customer Rate</p>
          <p className="text-2xl font-bold text-emerald-400">
            {((customers.filter(c => c.orderCount > 1).length / (customers.length || 1)) * 100).toFixed(1)} %
          </p>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden glass-morphism">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider">Kunde</th>
                <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider">Bestellungen</th>
                <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider">Umsatz gesamt</th>
                <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider">Letzte Bestellung</th>
                <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider text-right">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan="5" className="p-12 text-center text-text-secondary">Noch keine Kundendaten verfügbar.</td></tr>
              ) : customers.map((customer, idx) => (
                <tr key={customer.email} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary/20 to-purple-500/20 flex items-center justify-center border border-white/10 text-accent-primary font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-accent-primary transition-colors">{customer.name}</p>
                        <p className="text-xs text-text-secondary flex items-center gap-1"><Mail size={12} /> {customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-2 text-sm">
                      <ShoppingBag size={14} className="text-text-muted" />
                      {customer.orderCount} x
                    </span>
                  </td>
                  <td className="p-4 font-mono text-sm font-semibold text-accent-primary">
                    {customer.totalSpent.toFixed(2)} €
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    {new Date(customer.lastOrder).toLocaleDateString('de-DE')}
                  </td>
                  <td className="p-4 text-right">
                    <a href={"mailto:" + customer.email} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-accent-primary/20 hover:text-accent-primary rounded-md text-xs transition-all border border-white/10">
                      Kontaktieren
                    </a>
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
