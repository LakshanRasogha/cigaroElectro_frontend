'use client';

import React, { useEffect, useState } from 'react';
import { 
  Plus, Filter, Download, Search, Package, AlertTriangle, 
  CheckCircle2, XCircle, LayoutGrid, Loader2, X, Trash2, 
  AlertCircle, Edit3, Save, Tag
} from 'lucide-react';
import axios from 'axios';

/**
 * --- SUB-COMPONENT: InventoryRow ---
 */
const InventoryRow = ({ product, onEdit, onDelete }: { product: any, onEdit: (p: any) => void, onDelete: (id: string) => void }) => {
  // Calculate total stock from variants
  const totalStock = product.variants?.reduce((acc: number, curr: any) => acc + (Number(curr.stock) || 0), 0) || 0;
  
  // Determine status
  const status = totalStock <= 0 ? 'Out of Stock' : totalStock < 10 ? 'Low Stock' : 'In Stock';

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Low Stock': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Out of Stock': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <tr className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
      <td className="py-5 px-8">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
            {product.productImage?.[0] ? (
              <img 
                src={product.productImage[0]} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as any).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=random` }}
              />
            ) : (
              <Package size={20} className="text-slate-400" />
            )}
          </div>
          <div className="max-w-[200px]">
            <p className="text-sm font-bold text-slate-900 mb-0.5 truncate">{product.name}</p>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">key: {product.key || 'N/A'}</p>
          </div>
        </div>
      </td>
      <td className="py-5 px-4 text-xs font-bold text-slate-500 uppercase">{product.category}</td>
      <td className="py-5 px-4 font-mono text-sm font-bold text-slate-700">Rs. {product.basePrice?.toLocaleString()}</td>
      <td className="py-5 px-4 text-sm font-bold text-slate-900">{totalStock.toLocaleString()} Units</td>
      <td className="py-5 px-4">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${getStatusStyles(status)}`}>
          {status === 'In Stock' ? <CheckCircle2 size={12} /> : status === 'Low Stock' ? <AlertTriangle size={12} /> : <XCircle size={12} />}
          {status}
        </div>
      </td>
      <td className="py-5 px-8">
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => onEdit(product)}
            className="p-2.5 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
            title="Edit Product"
          >
            <Edit3 size={18} />
          </button>
          <button 
            onClick={() => onDelete(product._id)}
            className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
            title="Delete Product"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

/**
 * --- MAIN PAGE: InventoryPage ---
 */
export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialFormState = {
    key: '',
    name: '',
    tagline: '',
    basePrice: '',
    deliveryFee: '',
    category: 'Disposable',
    description: '',
    productImage: [''],
    variants: [{ flavor: '', emoji: '', stock: '', variantImage: [''] }]
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await axios.get("http://localhost:3001/api/products/get");
      const data = Array.isArray(res.data) ? res.data : res.data.products || [];
      setProducts(data);
    } catch (err) {
      setErrorMsg("Failed to connect to server. Ensure backend is running on port 3001.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Open modal for editing
  const handleEdit = (product: any) => {
    setEditingId(product._id);
    setFormData({
      key: product.key,
      name: product.name,
      tagline: product.tagline,
      basePrice: product.basePrice.toString(),
      deliveryFee: product.deliveryFee.toString(),
      category: product.category,
      description: product.description,
      productImage: product.productImage,
      variants: product.variants
    });
    setIsModalOpen(true);
  };

  // Delete product
  const handleDelete = async (key: string) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:3001/api/products/${key}`);
      fetchData();
    } catch (err) {
      setErrorMsg("Failed to delete product. Please try again.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const payload = {
        key: formData.key,
        name: formData.name,
        tagline: formData.tagline,
        basePrice: Number(formData.basePrice),
        deliveryFee: Number(formData.deliveryFee),
        category: formData.category,
        description: formData.description,
        productImage: formData.productImage,
        variants: formData.variants.map(v => ({
          vKey: `${formData.key}-${v.flavor.toLowerCase().replace(/\s+/g, '-')}`,
          flavor: v.flavor,
          emoji: v.emoji,
          stock: Number(v.stock),
          availability: Number(v.stock) > 0,
          variantImage: Array.isArray(v.variantImage) ? v.variantImage : [v.variantImage]
        }))
      };

      if (editingId) {
        await axios.put(`http://localhost:3001/api/products/update/${editingId}`, payload);
      } else {
        await axios.post("http://localhost:3001/api/products/add", payload);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData(initialFormState);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Error submitting product. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        
        {errorMsg && !isModalOpen && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{errorMsg}</p>
            <button onClick={() => setErrorMsg(null)} className="ml-auto p-1 hover:bg-rose-100 rounded-lg"><X size={16}/></button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Catalog Master</h1>
            <p className="text-slate-500 font-medium">Manage hardware and flavor variants.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" placeholder="Search catalog..."
                className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 w-full md:w-80 shadow-sm"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => { setEditingId(null); setFormData(initialFormState); setIsModalOpen(true); }} 
              className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-600 transition-all active:scale-95 shadow-xl"
            >
              <Plus size={16} strokeWidth={3} /> Add Product
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                <Loader2 size={40} className="animate-spin text-indigo-500 mb-4" />
                <p className="text-[10px] font-black tracking-widest uppercase">Updating Database...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/40">
                    <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Product Info</th>
                    <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                    <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Base Price</th>
                    <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Stock Units</th>
                    <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="py-5 px-8 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="animate-in fade-in duration-500">
                  {filteredProducts.map((prod) => (
                    <InventoryRow key={prod._id} product={prod} onEdit={handleEdit} onDelete={handleDelete} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative animate-in zoom-in-95">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
            
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{editingId ? 'Edit Product' : 'New Entry'}</h2>
              {errorMsg && <p className="text-rose-500 text-xs font-bold bg-rose-50 p-3 rounded-xl mb-4">{errorMsg}</p>}
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white text-sm" placeholder="Product Name" />
                <input required value={formData.key} onChange={e => setFormData({...formData, key: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white text-sm" placeholder="key (e.g. gk-pulse-2)" />
              </div>

              <input required value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm" placeholder="Tagline" />

              <div className="grid grid-cols-2 gap-4">
                <input required type="number" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm" placeholder="Base Price" />
                <input required type="number" value={formData.deliveryFee} onChange={e => setFormData({...formData, deliveryFee: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm" placeholder="Delivery Fee" />
              </div>

              <input required value={formData.productImage[0]} onChange={e => setFormData({...formData, productImage: [e.target.value]})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-xs font-mono" placeholder="Main Image URL" />

              <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white text-sm resize-none" placeholder="Description" />

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center"><h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Variants</h3><button type="button" onClick={() => setFormData({...formData, variants: [...formData.variants, { flavor: '', emoji: '', stock: '', variantImage: [''] }]})} className="text-xs font-bold text-indigo-600">+ Add Variant</button></div>
                {formData.variants.map((v, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative group">
                    <button type="button" onClick={() => setFormData({...formData, variants: formData.variants.filter((_, i) => i !== idx)})} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                    <div className="grid grid-cols-12 gap-3 mb-4">
                      <input required className="col-span-6 p-3 rounded-xl border-none text-xs" placeholder="Flavor" value={v.flavor} onChange={e => { const n = [...formData.variants]; n[idx].flavor = e.target.value; setFormData({...formData, variants: n}); }} />
                      <input className="col-span-2 p-3 rounded-xl border-none text-xs text-center" placeholder="🍏" value={v.emoji} onChange={e => { const n = [...formData.variants]; n[idx].emoji = e.target.value; setFormData({...formData, variants: n}); }} />
                      <input required type="number" className="col-span-4 p-3 rounded-xl border-none text-xs" placeholder="Stock" value={v.stock} onChange={e => { const n = [...formData.variants]; n[idx].stock = e.target.value; setFormData({...formData, variants: n}); }} />
                    </div>
                    <input className="w-full p-3 rounded-xl border-none text-[10px] font-mono" placeholder="Variant Image URL" value={v.variantImage?.[0]} onChange={e => { const n = [...formData.variants]; n[idx].variantImage = [e.target.value]; setFormData({...formData, variants: n}); }} />
                  </div>
                ))}
              </div>

              <button disabled={submitting} type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[12px] flex justify-center items-center gap-4 active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100">
                {submitting ? <Loader2 className="animate-spin" size={20}/> : editingId ? <><Save size={20}/> Save Changes</> : <><CheckCircle2 size={20}/> Publish Product</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}