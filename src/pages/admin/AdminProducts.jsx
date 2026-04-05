import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Link } from 'react-router-dom';
import { 
  Edit, Trash2, Plus, Search, Filter, 
  Package, AlertTriangle, ChevronRight,
  LayoutGrid, List, MoreHorizontal
} from 'lucide-react';

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
    if (window.confirm('Verwerfen dieses Produkts bestätigen?')) {
      try {
        await fetchApi("/products/" + id, { method: 'DELETE' });
        loadProducts();
      } catch (err) {
        alert('Operation fehlgeschlagen: ' + err.message);
      }
    }
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
      <div className="w-10 h-10 border-2 border-t-accent-primary border-white/5 rounded-full animate-spin"></div>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted animate-pulse">Syncing Inventory</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-1000">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-3 mb-6">
             <div className="h-[1px] w-12 bg-accent-primary/50"></div>
             <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-accent-primary">Master Catalog</p>
          </div>
          <h1 className="text-5xl font-bold font-serif tracking-tight">Couture Inventory</h1>
          <p className="text-text-muted mt-4 text-sm max-w-lg font-light">
            Manage your master collection. Add new creations, update pricing, and monitor stock levels across all ateliers.
          </p>
        </div>
        <Link to="/admin/products/new" className="px-8 py-4 bg-accent-gradient text-bg-primary font-bold uppercase tracking-widest text-[10px] rounded-sm hover:opacity-90 transition-all flex items-center gap-3 group shadow-[0_10px_30px_rgba(197,160,89,0.2)]">
          <Plus size={14} className="group-hover:scale-110 transition-transform" />
          Add New Creation
        </Link>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-6 p-1 bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden glass-couture">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search catalog by name, brand or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none rounded-none p-6 pl-14 text-white focus:ring-0 outline-none transition-colors text-[13px] uppercase tracking-wider font-medium placeholder:text-text-muted/50"
          />
        </div>
        <div className="flex items-center gap-2 pr-6 border-l border-white/[0.05]">
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none bg-transparent border-none p-4 pl-10 text-white focus:ring-0 outline-none cursor-pointer text-[10px] uppercase tracking-[0.2em] font-bold"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-bg-secondary">{cat === 'all' ? 'All Collections' : cat}</option>
              ))}
            </select>
          </div>
          <div className="h-4 w-[1px] bg-white/[0.1] mx-2"></div>
          <div className="flex gap-1">
             <button className="p-2.5 text-accent-primary bg-white/[0.05] rounded-md"><LayoutGrid size={16}/></button>
             <button className="p-2.5 text-text-muted hover:text-white rounded-md"><List size={16}/></button>
          </div>
        </div>
      </div>

      {/* Inventory Canvas */}
      <div className="admin-card !p-0">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="pl-10">Creation</th>
                <th>Collection</th>
                <th>Valuation (Buy/Sell)</th>
                <th>Inventory Status</th>
                <th className="pr-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr><td colSpan="5" className="p-20 text-center text-text-muted font-serif text-xl opacity-30">Selection Empty</td></tr>
              ) : filteredProducts.map(product => (
                <tr key={product.id} className="group">
                  <td className="pl-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-20 rounded-sm overflow-hidden border border-white/[0.05] bg-white/[0.02] relative group/img">
                        <img 
                          src={product.image_url.startsWith('http') ? product.image_url : "http://localhost:3001" + product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-125" 
                        />
                        <div className="absolute inset-0 bg-accent-primary/10 opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-serif text-base group-hover:text-accent-primary transition-colors">{product.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold mt-1">{product.brand || 'Atelier Standard'}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="px-3 py-1 bg-white/[0.03] rounded-sm text-[9px] text-text-muted uppercase tracking-[0.2em] font-bold border border-white/[0.05]">
                      {product.category}
                    </span>
                  </td>
                  <td className="text-xs tabular-nums font-medium">
                    <div className="flex flex-col gap-1">
                      <span className="text-red-400/80">Cost: €{product.buy_price.toFixed(2)}</span>
                      <span className="text-emerald-400 font-bold">List: €{product.sell_price.toFixed(2)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest mb-1 pr-10">
                          <span className={product.in_stock < 5 ? 'text-red-400' : 'text-text-muted'}>Reserved</span>
                          <span className="text-white">{product.in_stock} Units</span>
                       </div>
                       <div className="max-w-[120px] h-[3px] bg-white/[0.03] rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${product.in_stock < 5 ? 'bg-red-500/50' : 'bg-accent-primary/40'}`} 
                            style={{ width: `${Math.min(product.in_stock, 10)*10}%` }}
                          ></div>
                       </div>
                    </div>
                  </td>
                  <td className="pr-10 text-right">
                    <div className="flex justify-end gap-3 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                      <Link 
                        to={"/admin/products/" + product.id} 
                        className="p-3 bg-white/[0.03] hover:bg-accent-primary/20 hover:text-accent-primary rounded transition-all border border-white/[0.05] hover:border-accent-primary/30"
                        title="Refine Creation"
                      >
                        <Edit size={14} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className="p-3 bg-red-500/[0.02] hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded transition-all border border-red-500/[0.05] hover:border-red-500/30"
                        title="Discard"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <MoreHorizontal className="group-hover:hidden text-text-muted mx-auto" size={16} />
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
