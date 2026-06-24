import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Product } from '../data/products';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchProducts();
  }, [token, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const method = editingProduct.id ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/admin/products', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingProduct)
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setEditingProduct(null);
      } else {
        const text = await res.text().catch(() => '');
        let msg = `HTTP ${res.status}`;
        try {
          const data = JSON.parse(text);
          msg = data.error || data.message || JSON.stringify(data);
        } catch {
          msg = text.slice(0, 200) || msg;
        }
        alert('Failed to save product: ' + msg);
      }
    } catch (error: any) {
      console.error(error);
      alert('Error saving product: ' + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    const snapshot = products;
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      } else {
        setProducts(snapshot);
        alert('Failed to delete product');
      }
    } catch (error) {
      setProducts(snapshot);
      console.error(error);
      alert('Error deleting product');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    try {
      const res = await fetch(`/api/admin/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: file,
      });
      
      const data = await res.json();
      if (res.ok && data.url) {
        setEditingProduct(prev => ({
          ...prev,
          images: [...(prev?.images || []), data.url]
        }));
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error(error);
      alert('Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-ivory"><Loader2 className="w-8 h-8 animate-spin text-olive" /></div>;
  }

  return (
    <div className="min-h-screen bg-ivory py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl text-ink uppercase tracking-widest">Admin Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center text-sm text-ink/70 hover:text-ink transition-colors">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>

        {editingProduct ? (
          <div className="bg-white p-6 md:p-8 border border-sage/20 shadow-sm mb-8">
            <h2 className="font-serif text-xl mb-6">{editingProduct.id ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm uppercase tracking-widest text-ink/80 mb-2">Title</label>
                  <input required type="text" value={editingProduct.title || ''} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} className="w-full border-b border-sage/40 py-2 bg-transparent focus:outline-none focus:border-olive" />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-widest text-ink/80 mb-2">Price (e.g. $8.00)</label>
                  <input required type="text" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full border-b border-sage/40 py-2 bg-transparent focus:outline-none focus:border-olive" />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-widest text-ink/80 mb-2">Category</label>
                  <input required type="text" value={editingProduct.category || ''} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full border-b border-sage/40 py-2 bg-transparent focus:outline-none focus:border-olive" />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-widest text-ink/80 mb-2">Type</label>
                  <input required type="text" value={editingProduct.type || ''} onChange={e => setEditingProduct({...editingProduct, type: e.target.value})} className="w-full border-b border-sage/40 py-2 bg-transparent focus:outline-none focus:border-olive" />
                </div>
              </div>

              <div>
                <label className="block text-sm uppercase tracking-widest text-ink/80 mb-2">Description</label>
                <textarea required rows={3} value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full border border-sage/40 p-3 bg-transparent focus:outline-none focus:border-olive resize-y" />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-widest text-ink/80 mb-2">Images</label>
                <div className="flex flex-wrap gap-4 mb-4">
                  {(editingProduct.images || []).map((img, i) => (
                    <div key={i} className="relative w-24 h-24 border border-sage/20 bg-cream group">
                      <img src={img} alt="Product" className="w-full h-full object-contain" />
                      <button type="button" onClick={() => setEditingProduct({...editingProduct, images: editingProduct.images?.filter((_, index) => index !== i)})} className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-sage/40 hover:border-olive flex flex-col items-center justify-center cursor-pointer text-ink/50 hover:text-ink transition-colors bg-cream">
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
                    <span className="text-[10px] mt-1 uppercase">Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-sage/20">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-2 border border-sage text-sm uppercase tracking-widest hover:bg-sage/10 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-ink text-cream text-sm uppercase tracking-widest hover:bg-olive transition-colors">Save Product</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white border border-sage/20 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-sage/20 flex justify-between items-center bg-cream/50">
              <h2 className="font-serif text-lg text-ink">All Products</h2>
              <button onClick={() => setEditingProduct({ images: [], details: [] })} className="flex items-center text-sm uppercase tracking-widest bg-olive text-white px-4 py-2 hover:bg-ink transition-colors">
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-ink/80">
                <thead className="bg-cream border-b border-sage/20 font-serif uppercase tracking-widest text-xs">
                  <tr>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-sage/10 hover:bg-ivory/50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="w-12 h-12 bg-cream border border-sage/20">
                          {product.images && product.images.length > 0 && (
                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-contain" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 font-medium text-ink">{product.title}</td>
                      <td className="px-6 py-3">{product.category}</td>
                      <td className="px-6 py-3">{product.price}</td>
                      <td className="px-6 py-3 text-right">
                        <button onClick={() => setEditingProduct(product)} className="text-olive hover:text-ink mr-4 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="p-8 text-center text-ink/50">No products found.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
