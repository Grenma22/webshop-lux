import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';

export default function AdminOrders() {
  const { fetchApi } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    fetchApi('/orders')
      .then(data => setOrders(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetchApi("/orders/" + id + "/status", { 
        method: 'PUT', 
        body: JSON.stringify({ status: newStatus }) 
      });
      loadOrders();
    } catch (err) {
      alert('Fehler beim Status Update: ' + err.message);
    }
  };

  if (loading) return <div>Lade Bestellungen...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Bestellungen</h1>

      <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 font-semibold text-text-secondary">Bestell-Nr.</th>
                <th className="p-4 font-semibold text-text-secondary">Datum</th>
                <th className="p-4 font-semibold text-text-secondary">Kunde</th>
                <th className="p-4 font-semibold text-text-secondary">Betrag</th>
                <th className="p-4 font-semibold text-text-secondary">Status</th>
                <th className="p-4 font-semibold text-text-secondary">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-text-secondary">Keine Bestellungen vorhanden.</td></tr>
              ) : orders.map(order => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 last:border-0 transition-colors">
                  <td className="p-4 font-medium">#{order.id.toString().padStart(4, '0')}</td>
                  <td className="p-4 text-sm text-text-secondary">{new Date(order.created_at).toLocaleString('de-DE')}</td>
                  <td className="p-4">
                    <p className="text-sm font-medium">{order.shipping_name || 'N/A'}</p>
                    <p className="text-xs text-text-secondary">{order.email}</p>
                  </td>
                  <td className="p-4 font-medium">{order.total_amount.toFixed(2)}€</td>
                  <td className="p-4">
                    <select 
                      value={order.status} 
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={"bg-transparent border rounded p-1 text-sm " + (
                        order.status === 'paid' ? 'border-amber-500 text-amber-500' : 
                        order.status === 'shipped' ? 'border-green-500 text-green-500' : 
                        order.status === 'pending' ? 'border-gray-500 text-gray-500' : 'border-white/20'
                      )}
                    >
                      <option value="pending">Ausstehend</option>
                      <option value="paid">Bezahlt / Bereit</option>
                      <option value="shipped">Versendet</option>
                      <option value="cancelled">Storniert</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <details className="cursor-pointer">
                      <summary className="text-accent-primary text-sm font-medium">Details</summary>
                      <div className="mt-2 p-3 bg-black/50 rounded border border-white/10 text-sm">
                        <p className="mb-2 text-text-secondary">Adresse: {order.shipping_address}, {order.shipping_zip} {order.shipping_city}</p>
                        <ul className="list-disc pl-4">
                          {order.items && order.items.map(item => (
                            <li key={item.id}>{item.quantity}x {item.name} {item.size ? "(Größe: " + item.size + ")" : ''}</li>
                          ))}
                        </ul>
                      </div>
                    </details>
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
