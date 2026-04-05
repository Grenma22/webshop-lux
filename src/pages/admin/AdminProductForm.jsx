import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = id && id !== 'new';
  const { fetchApi } = useApi();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    buy_price: '',
    sell_price: '',
    category: 'Streetwear',
    brand: '',
    sizes: '',
    condition: 'Neu',
    image_url: '',
    in_stock: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchApi("/products/" + id)
        .then(data => {
          setFormData({
            ...data,
            in_stock: Boolean(data.in_stock)
          });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          navigate('/admin/products');
        });
    }
  }, [id, fetchApi, isEdit, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = formData.image_url;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        
        // Custom fetch for multipart/form-data
        const uploadRes = await fetch('http://localhost:3001/api/upload', {
          method: 'POST',
          headers: { 'Authorization': "Bearer " + token },
          body: uploadData
        });
        const uploadJson = await uploadRes.json();
        if (uploadRes.ok) {
          finalImageUrl = uploadJson.url;
        } else {
          throw new Error(uploadJson.error || 'Upload failed');
        }
      }

      const payload = { ...formData, image_url: finalImageUrl };

      if (isEdit) {
        await fetchApi("/products/" + id, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await fetchApi('/products', { method: 'POST', body: JSON.stringify(payload) });
      }
      navigate('/admin/products');
    } catch (err) {
      alert('Fehler beim Speichern: ' + err.message);
    }
  };

  if (loading) return <div>Lade Produktdaten...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/products" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><ArrowLeft size={20} /></Link>
        <h1 className="text-3xl font-bold">{isEdit ? 'Produkt bearbeiten' : 'Neues Produkt'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-black/40 border border-white/10 p-8 rounded-xl flex flex-col gap-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Marke</label>
            <input type="text" name="brand" className="form-input" value={formData.brand} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Beschreibung</label>
          <textarea name="description" className="form-input min-h-[100px]" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label>Einkaufspreis (€)</label>
            <input type="number" step="0.01" name="buy_price" className="form-input" value={formData.buy_price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Verkaufspreis (€)</label>
            <input type="number" step="0.01" name="sell_price" className="form-input" value={formData.sell_price} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-group">
            <label>Kategorie</label>
            <select name="category" className="form-input" value={formData.category} onChange={handleChange}>
              <option>Streetwear</option>
              <option>Designer</option>
              <option>Vintage</option>
              <option>Sportswear</option>
              <option>Schuhe</option>
              <option>Accessoires</option>
            </select>
          </div>
          <div className="form-group">
            <label>Größen (kommagetrennt)</label>
            <input type="text" name="sizes" className="form-input" value={formData.sizes} onChange={handleChange} placeholder="z.B. S,M,L oder 42,43" />
          </div>
          <div className="form-group">
            <label>Zustand</label>
            <select name="condition" className="form-input" value={formData.condition} onChange={handleChange}>
              <option>Neu</option>
              <option>Wie Neu</option>
              <option>Gut</option>
              <option>Akzeptabel</option>
            </select>
          </div>
        </div>

        <div className="form-group border-t border-white/10 pt-6">
          <label>Produktbild</label>
          <div className="flex gap-4 items-center">
            {formData.image_url && !imageFile && (
              <img src={formData.image_url.startsWith('http') ? formData.image_url : "http://localhost:3001" + formData.image_url} alt="Vorschau" className="w-20 h-20 rounded object-cover" />
            )}
            <div className="flex-1">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-md cursor-pointer hover:bg-white/10 transition-colors w-max">
                <Upload size={18} /> {imageFile ? imageFile.name : 'Bild auswählen (max. 5MB)'}
              </label>
            </div>
          </div>
        </div>

        <div className="form-group border-t border-white/10 pt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="in_stock" checked={formData.in_stock} onChange={handleChange} className="w-5 h-5 accent-accent-primary" />
            <span className="font-medium">Produkt ist auf Lager / Sichtbar</span>
          </label>
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">Abbrechen</button>
          <button type="submit" className="btn-primary">Speichern</button>
        </div>
      </form>
    </div>
  );
}
