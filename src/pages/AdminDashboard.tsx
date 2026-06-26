import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2, Image as ImageIcon, Loader2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Product, ProductOption, parsePrice, formatPrice } from '../data/products';

const CATEGORIES = ['Custom', 'Greeting Card', 'Original Painting'] as const;

// Number-or-empty so the price inputs can be cleared while editing.
type Num = number | '';

interface SizeRow {
  label: string;
  price: Num;
  printPrice: Num;
}

interface OptionRow {
  name: string;
  choices: string; // comma-separated in the form, split on save
}

interface FormState {
  id?: number;
  title: string;
  category: string;
  description: string;
  images: string[];
  details: string[];
  price: Num;        // base price, used when there are no sizes
  printPrice: Num;   // base per-print price (Custom, no sizes)
  sizes: SizeRow[];
  options: OptionRow[];
  active: boolean;
}

// Map any stored category/type onto the current three-option taxonomy.
function resolveCategory(product: Partial<Product>): string {
  const candidates = [product.category, product.type];
  for (const c of candidates) {
    if (c && (CATEGORIES as readonly string[]).includes(c)) return c;
  }
  // Legacy values from before the taxonomy change.
  const legacy: Record<string, string> = {
    Cards: 'Greeting Card',
    'Watercolor Houses': 'Custom',
    Portraits: 'Custom',
    'Original Paintings': 'Original Painting',
  };
  return legacy[product.category ?? ''] ?? 'Custom';
}

function blankForm(): FormState {
  return {
    title: '',
    category: 'Custom',
    description: '',
    images: [],
    details: [],
    price: '',
    printPrice: '',
    sizes: [],
    options: [],
    active: true,
  };
}

// A dollar-prefixed number input. Just type a number; it stores as a number
// and is formatted to $0.00 on save. Defined at module scope so it isn't
// remounted on every render (which would drop focus while typing).
function MoneyInput({
  value,
  onChange,
  placeholder = '0.00',
  required = false,
}: {
  value: Num;
  onChange: (v: Num) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-ink/50 pointer-events-none">$</span>
      <input
        type="number"
        min="0"
        step="0.01"
        required={required}
        placeholder={placeholder}
        value={value === '' ? '' : value}
        onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        className="w-full border-b border-sage/40 py-2 pl-4 bg-transparent focus:outline-none focus:border-olive"
      />
    </div>
  );
}

function formFromProduct(p: Product): FormState {
  const hasSizes = !!p.sizes && p.sizes.length > 0;
  return {
    id: p.id,
    title: p.title ?? '',
    category: resolveCategory(p),
    description: p.description ?? '',
    images: p.images ?? [],
    details: p.details ?? [],
    price: hasSizes ? '' : parsePrice(p.price),
    printPrice: p.printPrice ?? '',
    sizes: (p.sizes ?? []).map(s => ({
      label: s.label,
      price: s.price,
      printPrice: s.printPrice ?? '',
    })),
    options: (p.options ?? []).map(o => ({
      name: o.name,
      choices: o.choices.join(', '),
    })),
    active: p.active ?? true,
  };
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [saving, setSaving] = useState(false);
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
      setProducts(Array.isArray(data) ? data : []);
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

  const isCustom = form?.category === 'Custom';

  // Valid sizes = a label plus a numeric price.
  const validSizes = (form?.sizes ?? []).filter(s => s.label.trim() && s.price !== '');
  const hasSizes = validSizes.length > 0;

  const updateForm = (patch: Partial<FormState>) =>
    setForm(prev => (prev ? { ...prev, ...patch } : prev));

  const updateSize = (index: number, patch: Partial<SizeRow>) =>
    setForm(prev =>
      prev
        ? { ...prev, sizes: prev.sizes.map((s, i) => (i === index ? { ...s, ...patch } : s)) }
        : prev
    );

  const addSizeRow = () =>
    setForm(prev =>
      prev ? { ...prev, sizes: [...prev.sizes, { label: '', price: '', printPrice: '' }] } : prev
    );

  const removeSizeRow = (index: number) =>
    setForm(prev => (prev ? { ...prev, sizes: prev.sizes.filter((_, i) => i !== index) } : prev));

  const updateOption = (index: number, patch: Partial<OptionRow>) =>
    setForm(prev =>
      prev
        ? { ...prev, options: prev.options.map((o, i) => (i === index ? { ...o, ...patch } : o)) }
        : prev
    );

  const addOptionRow = () =>
    setForm(prev =>
      prev ? { ...prev, options: [...prev.options, { name: '', choices: '' }] } : prev
    );

  const removeOptionRow = (index: number) =>
    setForm(prev => (prev ? { ...prev, options: prev.options.filter((_, i) => i !== index) } : prev));

  const moveImageUp = (index: number) => {
    if (index <= 0) return;
    setForm(prev => {
      if (!prev) return prev;
      const newImages = [...prev.images];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      return { ...prev, images: newImages };
    });
  };

  const moveImageDown = (index: number) => {
    if (!form || index >= form.images.length - 1) return;
    setForm(prev => {
      if (!prev) return prev;
      const newImages = [...prev.images];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      return { ...prev, images: newImages };
    });
  };

  const buildProduct = (f: FormState): Product => {
    const cleanSizes = f.sizes
      .filter(s => s.label.trim() && s.price !== '')
      .map(s => ({
        label: s.label.trim(),
        price: Number(s.price),
        ...(f.category === 'Custom' && s.printPrice !== ''
          ? { printPrice: Number(s.printPrice) }
          : {}),
      }))
      // Cheapest first so the shop card "from" price matches the product page's
      // default selected size.
      .sort((a, b) => a.price - b.price);

    const sized = cleanSizes.length > 0;
    const basePrice = sized
      ? Math.min(...cleanSizes.map(s => s.price))
      : Number(f.price || 0);

    // Parse options: split comma-separated choices and filter empty rows
    const cleanOptions = f.options
      .filter(o => o.name.trim() && o.choices.trim())
      .map(o => ({
        name: o.name.trim(),
        choices: o.choices
          .split(',')
          .map(c => c.trim())
          .filter(Boolean),
      }));

    return {
      id: f.id as number, // ignored by the API on create
      title: f.title.trim(),
      category: f.category,
      type: f.category, // mirror for backward-compatible storefront reads
      description: f.description.trim(),
      images: f.images,
      details: f.details.map(s => s.trim()).filter(Boolean),
      price: formatPrice(basePrice),
      active: f.active,
      ...(cleanOptions.length > 0 ? { options: cleanOptions } : {}),
      ...(f.category === 'Custom' && !sized && f.printPrice !== ''
        ? { printPrice: Number(f.printPrice) }
        : {}),
      ...(sized ? { sizes: cleanSizes } : {}),
    };
  };

  const validate = (f: FormState): string | null => {
    if (!f.title.trim()) return 'Please enter a title.';
    if (!f.description.trim()) return 'Please enter a description.';
    if (f.images.length === 0) return 'Please upload at least one image.';
    if (!hasSizes) {
      if (f.price === '' || Number(f.price) <= 0) return 'Please enter a price.';
      if (f.category === 'Custom' && (f.printPrice === '' || Number(f.printPrice) < 0))
        return 'Please enter a price per print (or add sizes with print prices).';
    }
    return null;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const problem = validate(form);
    if (problem) {
      alert(problem);
      return;
    }

    const method = form.id ? 'PUT' : 'POST';
    setSaving(true);
    try {
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(buildProduct(form)),
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setForm(null);
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
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    const snapshot = products;
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
        body: file,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        updateForm({ images: [...(form?.images ?? []), data.url] });
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <Loader2 className="w-8 h-8 animate-spin text-olive" />
      </div>
    );
  }

  const labelClass = 'block text-sm uppercase tracking-widest text-ink/80 mb-2';
  const inputClass =
    'w-full border-b border-sage/40 py-2 bg-transparent focus:outline-none focus:border-olive';

  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl text-ink uppercase tracking-widest">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-sm text-ink/70 hover:text-ink transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>

        {form ? (
          <div className="bg-white p-6 md:p-8 border border-sage/20 shadow-sm mb-8">
            <h2 className="font-serif text-xl mb-6">{form.id ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Title */}
              <div>
                <label className={labelClass}>Title</label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={e => updateForm({ title: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Category */}
              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={form.category}
                  onChange={e => updateForm({ category: e.target.value })}
                  className={`${inputClass} appearance-none`}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sizes */}
              <div>
                <label className={labelClass}>Sizes (optional)</label>
                <p className="text-xs text-ink/50 -mt-1 mb-3">
                  Add multiple sizes, each with its own price.
                  {isCustom && ' For Custom pieces, set a price per print for each size too.'}
                </p>

                {form.sizes.length > 0 && (
                  <div className="space-y-3 mb-3">
                    {form.sizes.map((s, i) => (
                      <div key={i} className="flex flex-wrap items-end gap-3">
                        <div className="flex-1 min-w-[120px]">
                          <span className="block text-[11px] uppercase tracking-widest text-ink/50 mb-1">
                            Size
                          </span>
                          <input
                            type="text"
                            placeholder='e.g. 8x10"'
                            value={s.label}
                            onChange={e => updateSize(i, { label: e.target.value })}
                            className={inputClass}
                          />
                        </div>
                        <div className="w-28">
                          <span className="block text-[11px] uppercase tracking-widest text-ink/50 mb-1">
                            {isCustom ? 'Original' : 'Price'}
                          </span>
                          <MoneyInput value={s.price} onChange={v => updateSize(i, { price: v })} />
                        </div>
                        {isCustom && (
                          <div className="w-28">
                            <span className="block text-[11px] uppercase tracking-widest text-ink/50 mb-1">
                              Per print
                            </span>
                            <MoneyInput
                              value={s.printPrice}
                              onChange={v => updateSize(i, { printPrice: v })}
                            />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeSizeRow(i)}
                          aria-label="Remove size"
                          className="text-red-400 hover:text-red-600 transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={addSizeRow}
                  className="inline-flex items-center text-sm text-olive hover:text-ink transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add size
                </button>
              </div>

              {/* Price (used when there are no sizes) */}
              {hasSizes ? (
                <div className="text-sm text-ink/60 bg-cream/60 border border-sage/20 p-3">
                  Pricing is set per size above. Shop cards will show a “from {formatPrice(
                    Math.min(...validSizes.map(s => Number(s.price)))
                  )}” starting price.
                </div>
              ) : isCustom ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Original Piece Price</label>
                    <MoneyInput value={form.price} onChange={v => updateForm({ price: v })} required />
                  </div>
                  <div>
                    <label className={labelClass}>Price Per Print</label>
                    <MoneyInput
                      value={form.printPrice}
                      onChange={v => updateForm({ printPrice: v })}
                    />
                    <p className="text-xs text-ink/50 mt-1">One original; customers may add prints.</p>
                  </div>
                </div>
              ) : (
                <div className="md:w-1/2">
                  <label className={labelClass}>Price</label>
                  <MoneyInput value={form.price} onChange={v => updateForm({ price: v })} required />
                </div>
              )}

              {/* Description */}
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={e => updateForm({ description: e.target.value })}
                  className="w-full border border-sage/40 p-3 bg-transparent focus:outline-none focus:border-olive resize-y"
                />
              </div>

              {/* Details */}
              <div>
                <label className={labelClass}>Details (optional)</label>
                <p className="text-xs text-ink/50 -mt-1 mb-2">
                  One per line — shown as a checklist on the product page.
                </p>
                <textarea
                  rows={4}
                  value={form.details.join('\n')}
                  onChange={e => updateForm({ details: e.target.value.split('\n') })}
                  className="w-full border border-sage/40 p-3 bg-transparent focus:outline-none focus:border-olive resize-y"
                />
              </div>

              {/* Options (e.g., Background type, Size variant) */}
              <div>
                <label className={labelClass}>Product Options (optional)</label>
                <p className="text-xs text-ink/50 -mt-1 mb-3">
                  Add custom selectable options (e.g., Background type). Customers will choose from these on the product page.
                </p>

                {form.options.length > 0 && (
                  <div className="space-y-3 mb-3">
                    {form.options.map((o, i) => (
                      <div key={i} className="flex flex-wrap items-end gap-3">
                        <div className="flex-1 min-w-[180px]">
                          <span className="block text-[11px] uppercase tracking-widest text-ink/50 mb-1">
                            Option Name
                          </span>
                          <input
                            type="text"
                            placeholder='e.g. Background'
                            value={o.name}
                            onChange={e => updateOption(i, { name: e.target.value })}
                            className={inputClass}
                          />
                        </div>
                        <div className="flex-1 min-w-[180px]">
                          <span className="block text-[11px] uppercase tracking-widest text-ink/50 mb-1">
                            Choices (comma-separated)
                          </span>
                          <input
                            type="text"
                            placeholder='e.g. White, Cream, Sage Green'
                            value={o.choices}
                            onChange={e => updateOption(i, { choices: e.target.value })}
                            className={inputClass}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeOptionRow(i)}
                          aria-label="Remove option"
                          className="text-red-400 hover:text-red-600 transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={addOptionRow}
                  className="inline-flex items-center text-sm text-olive hover:text-ink transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add option
                </button>
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center gap-3 p-4 bg-cream border border-sage/20">
                <input
                  type="checkbox"
                  id="active"
                  checked={form.active}
                  onChange={e => updateForm({ active: e.target.checked })}
                  className="w-5 h-5 cursor-pointer"
                />
                <label htmlFor="active" className="flex-1 cursor-pointer font-sans text-sm text-ink/80">
                  {form.active ? '✓ Product is active' : '✗ Product is hidden'} — Show this product in the shop
                </label>
              </div>

              {/* Images */}
              <div>
                <label className={labelClass}>Images</label>
                <p className="text-xs text-ink/50 -mt-1 mb-3">
                  The first image is shown as the product thumbnail in the shop. Use arrow buttons to reorder.
                </p>
                <div className="flex flex-wrap gap-4 mb-4">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <div className="w-24 h-24 border border-sage/20 bg-cream">
                        <img src={img} alt="Product" className="w-full h-full object-contain" />
                      </div>
                      {/* Reorder and delete buttons */}
                      <div className="absolute top-0 right-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => moveImageUp(i)}
                          disabled={i === 0}
                          aria-label="Move image up"
                          className="bg-white rounded-full p-1 shadow-sm hover:bg-olive disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronUp className="w-3.5 h-3.5 text-ink" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImageDown(i)}
                          disabled={i === form.images.length - 1}
                          aria-label="Move image down"
                          className="bg-white rounded-full p-1 shadow-sm hover:bg-olive disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronDown className="w-3.5 h-3.5 text-ink" />
                        </button>
                      </div>
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() =>
                          updateForm({ images: form.images.filter((_, index) => index !== i) })
                        }
                        className="absolute bottom-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-sage/40 hover:border-olive flex flex-col items-center justify-center cursor-pointer text-ink/50 hover:text-ink transition-colors bg-cream">
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ImageIcon className="w-6 h-6" />
                    )}
                    <span className="text-[10px] mt-1 uppercase">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-sage/20">
                <button
                  type="button"
                  onClick={() => setForm(null)}
                  className="px-6 py-2 border border-sage text-sm uppercase tracking-widest hover:bg-sage/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-ink text-cream text-sm uppercase tracking-widest hover:bg-olive transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Product
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white border border-sage/20 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-sage/20 flex justify-between items-center bg-cream/50">
              <h2 className="font-serif text-lg text-ink">All Products</h2>
              <button
                onClick={() => setForm(blankForm())}
                className="flex items-center text-sm uppercase tracking-widest bg-olive text-white px-4 py-2 hover:bg-ink transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </button>
            </div>
            {/* Desktop / tablet: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-ink/80">
                <thead className="bg-cream border-b border-sage/20 font-serif uppercase tracking-widest text-xs">
                  <tr>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr
                      key={product.id}
                      className={`border-b border-sage/10 transition-colors ${
                        product.active === false ? 'bg-ivory/30 opacity-60' : 'hover:bg-ivory/50'
                      }`}
                    >
                      <td className="px-6 py-3">
                        <div className={`w-12 h-12 bg-cream border border-sage/20 ${product.active === false ? 'opacity-50' : ''}`}>
                          {product.images && product.images.length > 0 && (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 font-medium text-ink">
                        {product.title}
                        {product.active === false && (
                          <span className="ml-2 inline-block px-2 py-0.5 bg-olive/20 text-olive text-[10px] font-sans uppercase tracking-wider rounded">
                            Hidden
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3">{product.category}</td>
                      <td className="px-6 py-3">
                        {product.sizes && product.sizes.length > 0
                          ? `from ${product.price}`
                          : product.price}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => {
                            const updated = { ...product, active: !product.active };
                            fetch('/api/admin/products', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                              body: JSON.stringify(updated),
                            }).then(res => {
                              if (res.ok) fetchProducts();
                            });
                          }}
                          aria-label={product.active === false ? 'Show product' : 'Hide product'}
                          className="text-olive hover:text-ink transition-colors"
                        >
                          {product.active === false ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => setForm(formFromProduct(product))}
                          aria-label="Edit product"
                          className="text-olive hover:text-ink mr-4 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          aria-label="Delete product"
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: stacked cards — no horizontal scroll */}
            <div className="md:hidden divide-y divide-sage/10">
              {products.map(product => (
                <div key={product.id} className={`flex items-center gap-3 p-4 transition-colors ${product.active === false ? 'bg-ivory/30 opacity-60' : ''}`}>
                  <div className={`w-16 h-16 flex-shrink-0 bg-cream border border-sage/20 ${product.active === false ? 'opacity-50' : ''}`}>
                    {product.images && product.images.length > 0 && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink truncate">
                      {product.title}
                      {product.active === false && (
                        <span className="ml-2 inline-block px-1.5 py-0.5 bg-olive/20 text-olive text-[9px] font-sans uppercase tracking-wider rounded">
                          Hidden
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-ink/60">{product.category}</p>
                    <p className="text-sm text-ink/80">
                      {product.sizes && product.sizes.length > 0
                        ? `from ${product.price}`
                        : product.price}
                    </p>
                  </div>
                  <div className="flex items-center flex-shrink-0 gap-1">
                    <button
                      onClick={() => {
                        const updated = { ...product, active: !product.active };
                        fetch('/api/admin/products', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify(updated),
                        }).then(res => {
                          if (res.ok) fetchProducts();
                        });
                      }}
                      aria-label={product.active === false ? 'Show product' : 'Hide product'}
                      className="text-olive hover:text-ink p-2.5 transition-colors"
                    >
                      {product.active === false ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => setForm(formFromProduct(product))}
                      aria-label="Edit product"
                      className="text-olive hover:text-ink p-2.5 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      aria-label="Delete product"
                      className="text-red-400 hover:text-red-600 p-2.5 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="p-8 text-center text-ink/50">No products found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
