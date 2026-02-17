'use client';

import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Package, AlertTriangle, 
  CheckCircle2, XCircle, Loader2, X, Trash2, 
  AlertCircle, Edit3, Save, ChevronDown, Upload, ImageIcon
} from 'lucide-react';
import axios from 'axios';
import { supabase } from '@/app/lib/supabase'; 

const InventoryRow = ({ product, onEdit, onDelete }: { 
  product: any, 
  onEdit: (p: any) => void, 
  onDelete: (key: string) => void 
}) => {
  const totalStock = product.variants?.reduce((acc: number, curr: any) => acc + (Number(curr.stock) || 0), 0) || 0;
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
          <button onClick={() => onEdit(product)} className="p-2.5 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all active:scale-90">
            <Edit3 size={18} />
          </button>
          <button onClick={() => onDelete(product.key)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const categories = ['Disposable', 'Re-fill', 'E-Liquid', 'Accessories', 'T-shirts'];
  
  // --- UPDATED BUCKET NAME ---
  const BUCKET_NAME = 'Laki'; 

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
  const api = process.env.NEXT_PUBLIC_API;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${api}/api/products/get`);
      const data = Array.isArray(res.data) ? res.data : res.data.products || [];
      setProducts(data);
    } catch (err) {
      setErrorMsg("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isVariant: boolean = false, index: number = 0) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubmitting(true);
    setErrorMsg(null);
    
    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `inventory/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      if (isVariant) {
        const updatedVariants = [...formData.variants];
        updatedVariants[index].variantImage = [data.publicUrl];
        setFormData({ ...formData, variants: updatedVariants });
      } else {
        setFormData({ ...formData, productImage: [data.publicUrl] });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Upload failed. Check if bucket 'Laki' exists and is Public.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingKey(product.key);
    setFormData({
      key: product.key,
      name: product.name,
      tagline: product.tagline,
      basePrice: product.basePrice.toString(),
      deliveryFee: product.deliveryFee.toString(),
      category: product.category || 'Disposable',
      description: product.description,
      productImage: product.productImage,
      variants: product.variants
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (key: string) => {
    if (!key || key === "N/A" || !window.confirm(`Delete product "${key}"?`)) return;
    try {
      await axios.delete(`${api}/api/products/delete/${key}`);
      fetchData();
    } catch (err: any) {
      setErrorMsg("Failed to delete product.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        deliveryFee: Number(formData.deliveryFee),
        variants: formData.variants.map(v => ({
          ...v,
          vKey: `${formData.key}-${v.flavor.toLowerCase().replace(/\s+/g, '-')}`,
          stock: Number(v.stock),
          availability: Number(v.stock) > 0,
          variantImage: Array.isArray(v.variantImage) ? v.variantImage : [v.variantImage]
        }))
      };

      if (editingKey) {
        await axios.put(`${api}/api/products/update/${editingKey}`, payload);
      } else {
        await axios.post(`${api}/api/products/add`, payload);
      }

      setIsModalOpen(false);
      setEditingKey(null);
      setFormData(initialFormState);
      fetchData();
    } catch (err: any) {
      setErrorMsg("Error submitting product.");
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
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 shadow-sm">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{errorMsg}</p>
            <button onClick={() => setErrorMsg(null)} className="ml-auto p-1 hover:bg-rose-100 rounded-lg transition-colors"><X size={16}/></button>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Catalog Master</h1>
            <p className="text-slate-500 font-medium">Managing inventory in bucket: <b>{BUCKET_NAME}</b></p>
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
            <button onClick={() => { setEditingKey(null); setFormData(initialFormState); setIsModalOpen(true); }} 
              className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-600 transition-all active:scale-95 shadow-xl">
              <Plus size={16} strokeWidth={3} /> Add Product
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                <Loader2 size={40} className="animate-spin text-indigo-500 mb-4" />
                <p className="text-[10px] font-black tracking-widest uppercase">Syncing Database...</p>
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
                <tbody>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">{editingKey ? 'Edit Product' : 'New Entry'}</h2>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm focus:bg-white transition-all" placeholder="Product Name" />
                <input required value={formData.key} onChange={e => setFormData({...formData, key: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm focus:bg-white transition-all" placeholder="Unique Key" />
              </div>

              <div className="relative">
                <select 
                  required 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white text-sm appearance-none cursor-pointer pr-10"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>

              {/* IMAGE UPLOAD SECTION (MAIN) */}
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="flex items-center gap-3 w-full p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all">
                    <Upload size={18} className="text-slate-400" />
                    <span className="text-sm text-slate-500 font-medium">
                        {submitting ? "Uploading..." : formData.productImage[0] ? "Replace Main Image" : "Upload Main Image"}
                    </span>
                    <input type="file" accept="image/*" className="hidden" disabled={submitting} onChange={(e) => handleFileUpload(e)} />
                  </label>
                </div>
                {formData.productImage[0] && (
                  <div className="w-14 h-14 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 shadow-sm animate-in zoom-in-50">
                    <img src={formData.productImage[0]} className="w-full h-full object-cover" alt="preview" />
                  </div>
                )}
              </div>

              <input required value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm focus:bg-white transition-all" placeholder="Marketing Tagline" />

              <div className="grid grid-cols-2 gap-4">
                <input required type="number" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm focus:bg-white" placeholder="Base Price" />
                <input required type="number" value={formData.deliveryFee} onChange={e => setFormData({...formData, deliveryFee: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm focus:bg-white" placeholder="Delivery Fee" />
              </div>

              <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm resize-none focus:bg-white transition-all" placeholder="Long Description" />

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Variants</h3>
                  <button type="button" onClick={() => setFormData({...formData, variants: [...formData.variants, { flavor: '', emoji: '', stock: '', variantImage: [''] }]})} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">+ Add Variant</button>
                </div>
                {formData.variants.map((v, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative group">
                    <button type="button" onClick={() => setFormData({...formData, variants: formData.variants.filter((_, i) => i !== idx)})} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button>
                    <div className="grid grid-cols-12 gap-3 mb-4">
                      <input required className="col-span-6 p-3 rounded-xl border border-slate-200 text-xs focus:bg-white" placeholder="Flavor" value={v.flavor} onChange={e => { const n = [...formData.variants]; n[idx].flavor = e.target.value; setFormData({...formData, variants: n}); }} />
                      <input className="col-span-2 p-3 rounded-xl border border-slate-200 text-xs text-center focus:bg-white" placeholder="🍏" value={v.emoji} onChange={e => { const n = [...formData.variants]; n[idx].emoji = e.target.value; setFormData({...formData, variants: n}); }} />
                      <input required type="number" className="col-span-4 p-3 rounded-xl border border-slate-200 text-xs focus:bg-white" placeholder="Stock" value={v.stock} onChange={e => { const n = [...formData.variants]; n[idx].stock = e.target.value; setFormData({...formData, variants: n}); }} />
                    </div>
                    
                    {/* VARIANT IMAGE UPLOAD */}
                    <div className="flex gap-3 items-center">
                      <label className="flex-1 flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all">
                        <ImageIcon size={14} className="text-slate-400" />
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Upload Flavor Image</span>
                        <input type="file" accept="image/*" className="hidden" disabled={submitting} onChange={(e) => handleFileUpload(e, true, idx)} />
                      </label>
                      {v.variantImage?.[0] && (
                        <div className="w-10 h-10 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0 bg-white shadow-sm animate-in zoom-in-50">
                          <img src={v.variantImage[0]} className="w-full h-full object-cover" alt="variant preview" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button disabled={submitting} type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[12px] shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50">
                {submitting ? <Loader2 className="animate-spin" size={20}/> : editingKey ? "Update Catalog" : "Publish Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}