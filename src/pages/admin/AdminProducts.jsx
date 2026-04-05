import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function AdminProducts() {
  const { fetchApi } = useApi();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    setLoading(true);
    fetchApi('/products')
      .then(data => setProducts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

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

  if (loading) return <div>Lade Produkte...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Produkte</h1>
        <Link to="/admin/products/new" className="btn-primary">
          <Plus size={18} /> Neues Produkt
        </Link>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 font-semibold text-text-secondary">Bild</th>
                <th className="p-4 font-semibold text-text-secondary">Name</th>
                <th className="p-4 font-semibold text-text-secondary">Kategorie</th>
                <th className="p-4 font-semibold text-text-secondary">EK / VK</th>
                <th className="p-4 font-semibold text-text-secondary">Bestand</th>
                <th className="p-4 font-semibold text-text-secondary text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-text-secondary">Keine Produkte vorhanden.</td></tr>
              ) : products.map(product => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 last:border-0 transition-colors">
                  <td className="p-4">
                    <img src={product.image_url.startsWith('http') ? product.image_url : "http://localhost:3001" + product.image_url} alt={product.name} className="w-12 h-12 rounded object-cover" />
                  </td>
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-sm text-text-secondary">{product.category}</td>
                  <td className="p-4 text-sm">
                    <span className="text-red-400">{product.buy_price.toFixed(2)}€</span> / <span className="text-green-400">{product.sell_price.toFixed(2)}€</span>
                  </td>
                  <td className="p-4">
                    {product.in_stock ? <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Auf Lager</span> : <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Ausverkauft</span>}
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <Link to={"/admin/products/" + product.id} className="p-2 bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white rounded transition-colors"><Edit size={16} /></Link>
                    <button onClick={() => handleDelete(product.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded transition-colors"><Trash2 size={16} /></button>
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
