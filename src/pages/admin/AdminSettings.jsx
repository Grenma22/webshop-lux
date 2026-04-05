import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Save, Info, Mail, Euro, ShoppingCart, Globe } from 'lucide-react';

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
      setMessage('Einstellungen erfolgreich gespeichert.');
    } catch (err) {
      setMessage('Fehler beim Speichern: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Lade Einstellungen...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-accent">Einstellungen</h1>
        <button 
          form="settings-form"
          disabled={saving}
          className="btn-primary group disabled:opacity-50"
        >
          <Save size={18} className="group-hover:scale-110 transition-transform" />
          {saving ? 'Speichern...' : 'Alle Änderungen speichern'}
        </button>
      </div>

      {message && (
        <div className={"p-4 rounded-lg flex items-center gap-3 border " + (message.includes('Fehler') ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400')}>
          <Info size={18} /> {message}
        </div>
      )}

      <form id="settings-form" onSubmit={handleSubmit} className="space-y-6">
        {/* General Shop Settings */}
        <section className="glass-panel p-8 border border-white/10 rounded-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
            <Globe size={20} className="text-accent-primary" />
            <h2 className="text-xl font-bold font-accent">Allgemein</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                <ShoppingCart size={14} /> Shop Name
              </label>
              <input 
                type="text" 
                name="shop_name" 
                value={settings.shop_name} 
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-accent-primary outline-none transition-colors"
                placeholder="z.B. LUX. Atelier"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                <Mail size={14} /> Kontakt-Email
              </label>
              <input 
                type="email" 
                name="contact_email" 
                value={settings.contact_email} 
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-accent-primary outline-none transition-colors"
                placeholder="hello@example.com"
              />
            </div>
          </div>
        </section>

        {/* Financial Settings */}
        <section className="glass-panel p-8 border border-white/10 rounded-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
            <Euro size={20} className="text-accent-primary" />
            <h2 className="text-xl font-bold font-accent">Finanzen & Versand</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Standard MwSt. (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="vat_rate" 
                  value={settings.vat_rate} 
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 pr-10 text-white focus:border-accent-primary outline-none transition-colors"
                />
                <span className="absolute right-4 top-3.5 text-text-muted text-sm">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Kostenloser Versand ab (€)</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="free_shipping_threshold" 
                  value={settings.free_shipping_threshold} 
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 pr-10 text-white focus:border-accent-primary outline-none transition-colors"
                />
                <span className="absolute right-4 top-3.5 text-text-muted text-sm">€</span>
              </div>
              <p className="text-xs text-text-muted">Lassen Sie dieses Feld leer, wenn kein kostenloser Versand angeboten wird.</p>
            </div>
          </div>
        </section>

        {/* Info Card */}
        <div className="p-6 bg-accent-primary/5 border border-accent-primary/20 rounded-xl flex gap-4 text-sm text-text-secondary">
          <Info className="flex-shrink-0 text-accent-primary" size={24} />
          <div>
            <p className="font-bold text-white mb-1 italic">Tipp</p>
            <p>Diese Einstellungen beeinflussen globale Variablen wie Berechnungen im Checkout und den Text im Header/Footer der Storefront.</p>
          </div>
        </div>
      </form>
    </div>
  );
}
