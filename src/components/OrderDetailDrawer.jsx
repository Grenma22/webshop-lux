import { X, Package, Truck, CheckCircle, Clock, Trash2, ExternalLink, User, LucideLayoutList } from 'lucide-react';

export default function OrderDetailDrawer({ order, isOpen, onClose, onStatusChange }) {
  if (!order) return null;

  return (
    <div className={`fixed inset-0 z-[100] transition-opacity duration-1000 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* Absolute Glass Overlay */}
      <div 
        className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm cursor-crosshair" 
        onClick={onClose}
      />
      
      {/* Precision Detail Panel */}
      <div className={`absolute top-0 right-0 h-full w-full max-w-2xl bg-bg-secondary border-l border-white/[0.05] shadow-lux transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-bg-secondary via-bg-primary to-bg-secondary">
          
          {/* Unboxing Header */}
          <div className="p-10 border-b border-white/[0.03] flex items-center justify-between bg-bg-secondary">
            <div>
               <div className="flex items-center gap-3 mb-2">
                 <div className="h-[1px] w-8 bg-accent-primary/40"></div>
                 <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-accent-primary">Consignment Details</p>
               </div>
               <h2 className="text-3xl font-serif text-white">#{order.id.toString().padStart(6, '0')}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-4 hover:bg-white/[0.05] rounded-full transition-all group border border-white/[0.05]"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">
            
            {/* Status Timeline Couture */}
            <section className="admin-card !p-8 bg-black/40">
               <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/[0.03]">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted">Fulfillment Lifecycle</h3>
                  <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest">{order.status}</span>
               </div>
               <div className="flex justify-between relative mt-4">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/[0.05] -translate-y-1/2"></div>
                  <TimelineStep icon={<Clock size={16}/>} label="Queued" active={order.status === 'pending' || order.status === 'paid' || order.status === 'shipped'} completed={order.status !== 'pending'} />
                  <TimelineStep icon={<CheckCircle size={16}/>} label="Payment" active={order.status === 'paid' || order.status === 'shipped'} completed={order.status === 'shipped'} />
                  <TimelineStep icon={<Truck size={16}/>} label="Transit" active={order.status === 'shipped'} completed={false} />
                  <TimelineStep icon={<Package size={16}/>} label="Finalized" active={false} completed={false} />
               </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Consignee Profile */}
               <div className="admin-card !p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <User size={16} className="text-accent-primary" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Client Profile</h3>
                  </div>
                  <div className="space-y-4">
                     <div className="p-4 bg-white/[0.03] border border-white/[0.05] rounded-sm">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Shipping Designation</p>
                        <p className="text-sm font-serif text-white">{order.shipping_name || 'Atelier Standard'}</p>
                     </div>
                     <div className="p-4 bg-white/[0.03] border border-white/[0.05] rounded-sm">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Direct Liaison</p>
                        <p className="text-sm font-medium italic opacity-80">{order.email}</p>
                     </div>
                  </div>
               </div>

               {/* Logistics Destination */}
               <div className="admin-card !p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Truck size={16} className="text-accent-primary" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Logistics Hub</h3>
                  </div>
                  <div className="space-y-2 text-sm font-light text-text-secondary leading-relaxed italic">
                    <p>{order.shipping_address}</p>
                    <p>{order.shipping_postcode} {order.shipping_city}</p>
                    <p className="uppercase tracking-[0.2em] font-bold text-[10px] mt-4 not-italic opacity-50">Global Distribution</p>
                  </div>
               </div>
            </div>

            {/* Allocated Creations */}
            <section className="space-y-6">
               <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-3">
                     <LucideLayoutList size={16} className="text-accent-primary" />
                     <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Allocated Selection</h3>
                  </div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Master Units: {order.items?.length || 0}</span>
               </div>
               <div className="grid grid-cols-1 gap-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 p-4 glass-couture border border-white/[0.03] hover:border-accent-primary/20 transition-all group">
                       <div className="w-16 h-20 rounded-sm overflow-hidden border border-white/[0.05] flex-shrink-0 group-hover:scale-110 transition-transform">
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1">
                          <p className="text-[11px] font-bold uppercase tracking-tight group-hover:text-accent-primary transition-colors">{item.name}</p>
                          <p className="text-[10px] text-text-muted mt-1 uppercase font-medium">{item.quantity} x Master Unit</p>
                       </div>
                       <div className="text-xs font-bold tracking-tight tabular-nums opacity-60">
                          €{item.price.toFixed(2)}
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            {/* Valuation Aggregate */}
            <section className="p-10 border-t border-white/[0.03] bg-bg-primary/20 space-y-4">
               <div className="flex justify-between items-center text-text-muted">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Atelier Subtotal</span>
                  <span className="text-xs font-medium">€{order.total_amount.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center text-text-muted">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Logistics Allocation</span>
                  <span className="text-xs font-bold text-accent-primary uppercase tracking-widest">Complimentary</span>
               </div>
               <div className="h-[1px] w-full bg-white/[0.03] my-4"></div>
               <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold tracking-[0.3em] text-white">Consolidated Valuation</span>
                  <span className="text-3xl font-serif text-accent-primary leading-none">€{order.total_amount.toFixed(2)}</span>
               </div>
            </section>

          </div>

          {/* Action Hub */}
          <div className="p-10 border-t border-white/[0.05] bg-bg-secondary flex gap-4">
            <div className="flex-1 flex gap-2 p-1 bg-white/[0.02] border border-white/[0.05] rounded-lg">
               <ActionButton 
                 icon={<CheckCircle size={14}/>} 
                 label="Finalize" 
                 active={order.status === 'paid'} 
                 onClick={() => onStatusChange(order.id, 'paid')}
               />
               <ActionButton 
                 icon={<Send size={14}/>} 
                 label="Dispatch" 
                 active={order.status === 'shipped'} 
                 onClick={() => onStatusChange(order.id, 'shipped')}
               />
               <div className="w-[1px] h-full bg-white/[0.05] mx-2"></div>
               <ActionButton 
                 icon={<XCircle size={14}/>} 
                 label="Void" 
                 active={order.status === 'cancelled'} 
                 onClick={() => onStatusChange(order.id, 'cancelled')}
                 danger
               />
            </div>
            <button className="p-4 bg-white/[0.03] hover:bg-white/[0.08] transition-all rounded-lg border border-white/[0.05] hover:border-accent-primary/20">
               <ExternalLink size={18} className="text-text-muted" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function TimelineStep({ icon, label, active, completed }) {
  return (
    <div className="flex flex-col items-center gap-3 relative z-10">
       <div className={`
         w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-1000
         ${completed ? 'bg-accent-primary border-accent-primary text-bg-primary shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 
           active ? 'bg-white/[0.03] border-accent-primary text-accent-primary shadow-[0_0_15px_rgba(197,160,89,0.2)] scale-110' : 
           'bg-bg-secondary border-white/[0.05] text-text-muted'}
       `}>
          {icon}
       </div>
       <span className={`text-[8px] uppercase font-bold tracking-widest ${active ? 'text-white' : 'text-text-muted'}`}>{label}</span>
    </div>
  );
}

function ActionButton({ icon, label, active, onClick, danger }) {
  return (
    <button 
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all
        ${active ? (danger ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-accent-primary text-bg-primary shadow-sm') : 
         'text-text-muted hover:text-white hover:bg-white/[0.03]'}
      `}
    >
      {icon} {label}
    </button>
  );
}
