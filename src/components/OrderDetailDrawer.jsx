import { X, Mail, MapPin, Package, CheckCircle, Send, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderDetailDrawer({ order, isOpen, onClose, onStatusChange }) {
  if (!order) return null;

  const steps = [
    { id: 'pending', label: 'Eingegangen', icon: <Clock size={16} /> },
    { id: 'paid', label: 'Bezahlt', icon: <CheckCircle size={16} /> },
    { id: 'shipped', label: 'Versendet', icon: <Send size={16} /> }
  ];

  const currentStepIdx = steps.findIndex(s => s.id === order.status);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-bg-secondary border-l border-white/10 z-[101] shadow-2xl overflow-y-auto"
          >
            <div className="p-8 space-y-8 pb-24">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-bold font-accent">Bestellung #{order.id.toString().padStart(4, '0')}</h2>
                  <p className="text-sm text-text-secondary">{new Date(order.created_at).toLocaleString('de-DE')}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Status Stepper */}
              <div className="grid grid-cols-3 gap-2 pb-6 border-b border-white/5">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  
                  return (
                    <button 
                      key={step.id}
                      onClick={() => onStatusChange(order.id, step.id)}
                      className={"flex flex-col items-center gap-2 p-3 rounded-xl border transition-all " + (
                        isCurrent ? 'bg-accent-primary/10 border-accent-primary text-accent-primary ring-1 ring-accent-primary/50' : 
                        isCompleted ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 opacity-60' : 
                        'bg-white/5 border-white/5 text-text-muted hover:bg-white/10'
                      )}
                    >
                      {step.icon}
                      <span className="text-[10px] font-bold uppercase tracking-wider">{step.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Customer Info */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase text-text-muted flex items-center gap-2">
                  <User size={14} /> Kunde
                </h3>
                <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
                  <p className="font-bold text-lg">{order.shipping_name || 'Gast'}</p>
                  <p className="text-sm text-text-secondary flex items-center gap-2">
                    <Mail size={14} /> {order.email}
                  </p>
                  <div className="pt-2 flex gap-3 text-sm">
                    <MapPin size={18} className="text-text-muted flex-shrink-0 mt-1" />
                    <div>
                      <p>{order.shipping_address}</p>
                      <p>{order.shipping_zip} {order.shipping_city}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Items */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase text-text-muted flex items-center gap-2">
                  <Package size={14} /> Positionen
                </h3>
                <div className="space-y-3">
                  {order.items && order.items.map(item => (
                    <div key={item.id} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5 group">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-text-secondary">Größe: {item.size || 'N/A'}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs font-bold">{item.quantity}x</p>
                          <p className="text-sm font-bold text-accent-primary">{(item.sell_price * item.quantity).toFixed(2)}€</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Summary */}
              <section className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Gesamtsumme</span>
                  <span className="text-accent-primary">{order.total_amount.toFixed(2)}€</span>
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors">
                    Rechnung PDF
                  </button>
                  <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors text-red-400">
                    Stornieren
                  </button>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
