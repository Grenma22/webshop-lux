import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { 
  Search, Filter, ExternalLink, Clock, 
  CheckCircle, Send, XCircle, MoreHorizontal,
  ChevronRight, Calendar, User
} from 'lucide-react';
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
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert('Security Breach: ' + err.message);
    }
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
      <div className="w-10 h-10 border-2 border-t-accent-primary border-white/5 rounded-full animate-spin"></div>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted animate-pulse">Syncing Transactions</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-1000">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-3 mb-6">
             <div className="h-[1px] w-12 bg-accent-primary/50"></div>
             <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-accent-primary">Transaction Ledger</p>
          </div>
          <h1 className="text-5xl font-bold font-serif tracking-tight">Couture Sales Fulfillment</h1>
          <p className="text-text-muted mt-4 text-sm max-w-lg font-light">
            Oversee and finalize client orders. Monitor the fulfillment timeline from initial payment to professional shipment for every atelier creation.
          </p>
        </div>
        <div className="flex bg-white/[0.03] border border-white/[0.05] rounded-lg p-1 glass-couture">
           <button className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-accent-primary bg-white/[0.05] rounded-md transition-all">Live Fulfillment</button>
           <button className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-white transition-all">Export Report</button>
        </div>
      </header>

      {/* Modern Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6 p-1 bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden glass-couture shadow-lux">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search transactions by reference, client or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none rounded-none p-6 pl-14 text-white focus:ring-0 outline-none transition-colors text-[13px] uppercase tracking-wider font-medium placeholder:text-text-muted/50"
          />
        </div>
        <div className="flex items-center gap-6 pr-6 border-l border-white/[0.05]">
          <div className="flex items-center gap-3 ml-6">
            <Filter size={14} className="text-text-muted" />
             <div className="flex gap-1.5 p-1 bg-black/40 rounded-lg">
                {['all', 'pending', 'paid', 'shipped'].map(status => (
                  <button 
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-accent-gradient text-bg-primary shadow-sm' : 'text-text-muted hover:text-white'}`}
                  >
                    {status === 'all' ? 'Entire Inventory' : status}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Transaction Canvas */}
      <div className="admin-card !p-0 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="pl-10">Consignment ID</th>
                <th>Client Details</th>
                <th>Valuation</th>
                <th>Fulfillment Status</th>
                <th className="pr-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan="5" className="p-20 text-center text-text-muted font-serif text-xl opacity-30 italic">No Active Transactions</td></tr>
              ) : filteredOrders.map(order => (
                <tr key={order.id} className="group hover:bg-white/[0.01]">
                  <td className="pl-10">
                    <div className="flex flex-col">
                      <span className="font-mono text-sm tracking-tight text-white group-hover:text-accent-primary transition-colors">#{order.id.toString().padStart(6, '0')}</span>
                      <div className="flex items-center gap-2 mt-1 text-[9px] font-bold text-text-muted uppercase">
                         <Calendar size={10} /> {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-[11px] font-bold text-text-muted group-hover:border-accent-primary/20 transition-all">
                        {order.shipping_name?.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                         <p className="text-xs font-bold uppercase tracking-wide group-hover:text-white transition-colors">{order.shipping_name || 'Anonymous Client'}</p>
                         <p className="text-[9px] text-text-muted mt-0.5">{order.email.toLowerCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-bold text-sm tracking-tight tabular-nums">
                    €{order.total_amount.toFixed(2)}
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="pr-10 text-right">
                    <div className="flex justify-end items-center gap-4">
                       <button 
                         onClick={() => openDetails(order)}
                         className="px-6 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] text-[10px] font-bold uppercase tracking-widest border border-white/[0.05] rounded-sm transition-all group/btn"
                       >
                         Manage Allocation <ChevronRight size={12} className="inline ml-1 group-hover/btn:translate-x-1 transition-transform" />
                       </button>
                       <MoreHorizontal size={14} className="text-text-muted opacity-50" />
                    </div>
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

  const icons = {
    paid: <CheckCircle size={10} />,
    shipped: <Send size={10} />,
    pending: <Clock size={10} />,
    cancelled: <XCircle size={10} />
  };

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-[0.2em] border shadow-sm ${styles[status] || styles.pending}`}>
      {icons[status] || <Clock size={10} />}
      {labels[status] || status}
    </span>
  );
}
