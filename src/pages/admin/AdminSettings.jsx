import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { 
  Save, Info, Mail, Euro, 
  ShoppingCart, Globe, Command, 
  Settings as SettingsIcon, ShieldIcon,
  HardDriveIcon, CloudIcon
} from 'lucide-react';

export default function AdminSettings() {
  const { fetchApi } = useApi();
  const [settings, setSettings] = useState({
    shop_name: '',
    vat_rate: '',
    free_shipping_threshold: '',
    contact_email: '',
    primary_currency: 'EUR'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchApi('/settings')
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [fetchApi]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await fetchApi('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      setMessage('Configuration synchronized successfully.');
    } catch (err) {
      setMessage('Sync Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
      <div className="w-10 h-10 border-2 border-t-accent-primary border-white/5 rounded-full animate-spin"></div>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted animate-pulse">Accessing Core Config</p>
    </div>
  );

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-2 duration-1000 pb-20">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-6">
             <div className="h-[1px] w-12 bg-accent-primary/50"></div>
             <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-accent-primary">System Core</p>
          </div>
          <h1 className="text-5xl font-bold font-serif tracking-tight lg:leading-[1.1]">Atelier Infrastructure</h1>
          <p className="text-text-muted mt-6 text-sm max-w-xl font-light leading-relaxed">
            Manage the technical foundation of your storefront. Control global variables, financial rates, and operational metadata with couture precision.
          </p>
        </div>
        <button 
          form="settings-form"
          disabled={saving}
          className="px-8 py-4 bg-accent-gradient text-bg-primary font-bold uppercase tracking-widest text-[10px] rounded-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-3 group shadow-[0_10px_30px_rgba(197,160,89,0.2)]"
        >
          <Save size={14} className="group-hover:scale-110 transition-transform" />
          {saving ? 'Syncing...' : 'Sync Configuration'}
        </button>
      </header>

      {message && (
        <div className={`p-8 glass-couture border flex flex-col gap-2 animate-in slide-in-from-top-4 duration-500 rounded-sm ${message.includes('Error') ? 'border-red-500/20 bg-red-500/[0.02] text-red-100' : 'border-emerald-500/20 bg-emerald-500/[0.02] text-emerald-100'}`}>
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-sm ${message.includes('Error') ? 'bg-red-500 text-white' : 'bg-emerald-500 text-bg-primary'}`}>
                <Info size={14} />
             </div>
             <p className="text-[11px] font-bold uppercase tracking-widest leading-none mt-1">{message.includes('Error') ? 'Alert' : 'System Sync'}</p>
          </div>
          <p className="text-sm font-light mt-2 ml-10 opacity-70 italic">{message}</p>
        </div>
      )}

      <form id="settings-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 flex flex-col gap-10">
          {/* General Branding */}
          <section className="admin-card !p-10 space-y-10 bg-gradient-to-br from-bg-secondary to-bg-primary">
            <div className="flex items-center gap-4 pb-6 border-b border-white/[0.03]">
              <div className="p-3 bg-accent-primary/10 rounded-sm text-accent-primary">
                <Globe size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-serif">Storefront Identity</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted mt-1">Global Branding Meta</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <CoutureInput 
                label="Atelier Designation" 
                name="shop_name"
                icon={<Command size={14} />}
                value={settings.shop_name} 
                onChange={handleChange}
                placeholder="e.g. ATELIER COUTURE"
              />
              <CoutureInput 
                label="Primary Liaison Email" 
                name="contact_email"
                type="email"
                icon={<Mail size={14} />}
                value={settings.contact_email} 
                onChange={handleChange}
                placeholder="couture@atelier.com"
              />
            </div>
          </section>

          {/* Financials */}
          <section className="admin-card !p-10 space-y-10 bg-bg-secondary">
            <div className="flex items-center gap-4 pb-6 border-b border-white/[0.03]">
              <div className="p-3 bg-accent-primary/10 rounded-sm text-accent-primary">
                <Euro size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-serif">Fiscal Controls</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted mt-1">VAT & Liquidity thresholds</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <CoutureInput 
                label="Standard Fiscal Rate (%)" 
                name="vat_rate"
                type="number"
                value={settings.vat_rate} 
                onChange={handleChange}
                suffix="%"
              />
              <CoutureInput 
                label="Complimentary Logistics Threshold (€)" 
                name="free_shipping_threshold"
                type="number"
                value={settings.free_shipping_threshold} 
                onChange={handleChange}
                suffix="€"
                help="Optional: Free shipping above this valuation."
              />
            </div>
          </section>
        </div>

        {/* Sidebar Info/Status */}
        <div className="lg:col-span-4 space-y-8">
           <div className="admin-card !p-8 bg-black">
              <div className="flex flex-col gap-6">
                 <div className="flex items-center gap-4 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                    <CloudIcon size={16} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Operational Status</p>
                 </div>
                 <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Cloud DB Sync</p>
                       <span className="text-[10px] font-bold text-emerald-400">ACTIVE</span>
                    </div>
                    <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500/30 w-full"></div>
                    </div>
                 </div>
                 <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Atelier Cache</p>
                       <span className="text-[10px] font-bold text-accent-primary">OPTIMIZED</span>
                    </div>
                    <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden">
                       <div className="h-full bg-accent-primary/30 w-[85%]"></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-8 glass-couture brass-border border-accent-primary/10 rounded-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-primary flex items-center gap-2 mb-6">
                <ShieldIcon size={12} /> Data Intelligence
              </h3>
              <p className="text-sm font-light text-text-muted leading-relaxed">
                Global definitions ensure every transaction, calculation, and client interface maintains the highest standard of atelier integrity.
              </p>
           </div>

           <div className="admin-card !p-8 opacity-50 flex items-center gap-4">
              <HardDriveIcon className="text-text-muted" size={24} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Version</p>
                <p className="text-xs font-bold uppercase tracking-widest font-mono">LUX-CORE-2.4.0</p>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}

function CoutureInput({ label, name, value, onChange, placeholder, type = 'text', icon, suffix, help }) {
  return (
    <div className="flex flex-col gap-3 group/input">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted transition-colors group-focus-within/input:text-accent-primary">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 text-text-muted group-focus-within/input:text-white transition-all pl-2">
            {icon}
          </div>
        )}
        <input 
          type={type} 
          name={name} 
          value={value} 
          onChange={onChange}
          className={`
            w-full bg-transparent border-b border-white/5 rounded-none p-4 
            ${icon ? 'pl-8' : 'pl-0'} 
            ${suffix ? 'pr-10' : 'pr-0'}
            text-white text-sm font-medium focus:border-accent-primary 
            focus:ring-0 outline-none transition-all placeholder:text-text-muted/30
          `}
          placeholder={placeholder}
        />
        {suffix && (
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm select-none pr-2 group-focus-within/input:text-accent-primary transition-all">
            {suffix}
          </span>
        )}
      </div>
      {help && <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-1 italic">{help}</p>}
    </div>
  );
}
