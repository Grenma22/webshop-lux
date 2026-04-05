import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Search, Filter, ExternalLink, Clock, CheckCircle, Send, XCircle } from 'lucide-react';
import OrderDetailDrawer from '../../components/OrderDetailDrawer';

export default function AdminOrders() {
  const { fetchApi } = useApi();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadOrders = () => {
    setLoading(true);
    fetchApi('/orders')
      .then(data => {
        setOrders(data);
        setFilteredOrders(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    let result = orders;
    if (searchTerm) {
      result = result.filter(o => 
        o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.shipping_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toString().includes(searchTerm)
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(o => o.status === filterStatus);
    }
    setFilteredOrders(result);
  }, [searchTerm, filterStatus, orders]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetchApi("/orders/" + id + "/status", { 
        method: 'PUT', 
        body: JSON.stringify({ status: newStatus }) 
      });
      loadOrders();
      // Update selected order in drawer if open
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert('Fehler beim Status Update: ' + err.message);
    }
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-t-accent-primary border-white/10 animate-spin"></div>
      <p className="text-text-secondary animate-pulse uppercase tracking-widest text-xs">Bestellungen laden...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-3xl font-bold font-accent">Bestellungen</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl justify-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Suchen nach Kunde oder ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 pl-10 text-white focus:border-accent-primary outline-none transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 text-text-muted" size={18} />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-black/40 border border-white/10 rounded-lg p-2.5 pl-10 pr-10 text-white focus:border-accent-primary outline-none transition-colors"
            >
              <option value="all">Alle Status</option>
              <option value="pending">Ausstehend</option>
              <option value="paid">Bezahlt</option>
              <option value="shipped">Versendet</option>
              <option value="cancelled">Storniert</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden glass-morphism">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Bestell-Nr.</th>
                <th className="p-5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Datum</th>
                <th className="p-5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Kunde</th>
                <th className="p-5 font-semibold text-text-secondary text-xs uppercase tracking-wider text-right">Betrag</th>
                <th className="p-5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Status</th>
                <th className="p-5 font-semibold text-text-secondary text-xs uppercase tracking-wider text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan="6" className="p-12 text-center text-text-secondary italic">Keine Bestellungen gefunden.</td></tr>
              ) : filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-5 font-mono text-sm tracking-tighter">#{order.id.toString().padStart(4, '0')}</td>
                  <td className="p-5">
                    <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString('de-DE')}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{new Date(order.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="p-5">
                    <p className="text-sm font-bold group-hover:text-accent-primary transition-colors">{order.shipping_name || 'N/A'}</p>
                    <p className="text-xs text-text-secondary">{order.email}</p>
                  </td>
                  <td className="p-5 text-right font-bold text-accent-primary">
                    {order.total_amount.toFixed(2)} €
                  </td>
                  <td className="p-5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => openDetails(order)}
                      className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-text-secondary hover:text-white transition-all flex items-center gap-2 text-xs ml-auto border border-white/10"
                    >
                      <ExternalLink size={14} /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetailDrawer 
        order={selectedOrder} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    shipped: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]',
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
    <span className={"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight border " + (styles[status] || styles.pending)}>
      {icons[status]} {labels[status] || status}
    </span>
  );
}
