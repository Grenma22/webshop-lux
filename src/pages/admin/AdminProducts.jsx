import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Search, Filter, Package, AlertTriangle } from 'lucide-react';

export default function AdminProducts() {
  const { fetchApi } = useApi();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const loadProducts = () => {
    setLoading(true);
    fetchApi('/products')
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== 'all') {
      result = result.filter(p => p.category === categoryFilter);
    }
    setFilteredProducts(result);
  }, [searchTerm, categoryFilter, products]);

  const handleDelete = async (id) => {
    if (window.confirm('Produkt wirklich löschen?')) {
      try {
        await fetchApi("/products/" + id, { method: 'DELETE' });
        loadProducts();
      } catch (err) {
        alert('Löschen fehlgeschlagen: ' + err.message);
      }
    }
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-t-accent-primary border-white/10 animate-spin"></div>
      <p className="text-text-secondary animate-pulse uppercase tracking-widest text-xs font-bold">Produkte werden geladen...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-accent">Inventar</h1>
          <p className="text-sm text-text-secondary">Verwalte deine Produktkollektion</p>
        </div>
        <Link to="/admin/products/new" className="px-5 py-2.5 bg-accent-primary text-black font-bold rounded-lg hover:bg-accent-secondary transition-all flex items-center gap-2 shadow-lg shadow-accent-primary/10">
          <Plus size={18} /> Neues Produkt hinzufügen
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-black/40 p-4 rounded-xl border border-white/10 glass-morphism">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Suchen nach Name, Marke oder Kategorie..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/20 border border-white/5 rounded-lg p-2.5 pl-10 text-white focus:border-accent-primary outline-none transition-colors text-sm"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-2.5 text-text-muted" size={18} />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full appearance-none bg-black/20 border border-white/5 rounded-lg p-2.5 pl-10 pr-10 text-white focus:border-accent-primary outline-none transition-colors text-sm capitalize"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'Alle Kategorien' : cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden glass-morphism">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Produkt</th>
                <th className="p-5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Kategorie</th>
                <th className="p-5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Preise (EK/VK)</th>
                <th className="p-5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Bestand</th>
                <th className="p-5 font-semibold text-text-secondary text-xs uppercase tracking-wider text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr><td colSpan="5" className="p-12 text-center text-text-secondary italic">Keine Produkte in dieser Ansicht.</td></tr>
              ) : filteredProducts.map(product => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                        <img 
                          src={product.image_url.startsWith('http') ? product.image_url : "http://localhost:3001" + product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                      <div>
                        <p className="font-bold text-sm group-hover:text-accent-primary transition-colors">{product.name}</p>
                        <p className="text-xs text-text-muted">{product.brand || 'Keine Marke'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-text-secondary uppercase tracking-widest border border-white/10">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-5 text-sm tabular-nums">
                    <div className="flex flex-col">
                      <span className="text-red-400 font-medium">EK: {product.buy_price.toFixed(2)}€</span>
                      <span className="text-emerald-400 font-bold">VK: {product.sell_price.toFixed(2)}€</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                       {product.in_stock > 10 ? (
                         <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                           <CheckCircle size={14} /> {product.in_stock} Lagernd
                         </span>
                       ) : product.in_stock > 0 ? (
                         <span className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                           <AlertTriangle size={14} /> {product.in_stock} Kritisch
                         </span>
                       ) : (
                         <span className="flex items-center gap-1.5 text-xs text-red-400 font-bold">
                           <XCircle size={14} /> Ausverkauft
                         </span>
                       )}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        to={"/admin/products/" + product.id} 
                        className="p-2.5 bg-white/5 hover:bg-accent-primary/20 hover:text-accent-primary rounded-lg transition-all border border-white/10"
                        title="Bearbeiten"
                      >
                        <Edit size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all border border-red-500/20"
                        title="Löschen"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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

function CheckCircle({ size }) {
  return <Package size={size} />;
}

function XCircle({ size }) {
  return <AlertTriangle size={size} />;
}
