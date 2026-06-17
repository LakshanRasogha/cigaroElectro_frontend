"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Folder,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  Trash2,
  AlertCircle,
  Edit3,
} from "lucide-react";
import { apiUrl, getAuthHeaders, apiFetch } from "@/app/lib/api";
import { getErrorMessage } from "@/app/lib/errors";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const CategoryRow = ({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: (c: Category) => void;
  onDelete: (id: string, name: string) => void;
}) => {
  const isDefaultCategory = ["disposable", "re-fill", "e-liquid", "accessories"].includes(
    category.slug.toLowerCase()
  );

  return (
    <tr className='group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0'>
      <td className='py-5 px-8'>
        <div className='flex items-center gap-4'>
          <div className='relative w-12 h-12 rounded-2xl bg-indigo-50 overflow-hidden flex items-center justify-center border border-indigo-100/50'>
            <Folder size={20} className='text-indigo-500' />
          </div>
          <div>
            <p className='text-sm font-bold text-slate-900 mb-0.5'>
              {category.name}
            </p>
            <p className='text-[10px] font-medium text-slate-400 uppercase tracking-tight'>
              slug: {category.slug}
            </p>
          </div>
        </div>
      </td>
      <td className='py-5 px-4 text-xs font-medium text-slate-500 max-w-xs truncate'>
        {category.description || <span className='text-slate-300 italic'>No description</span>}
      </td>
      <td className='py-5 px-4 text-xs font-semibold text-slate-500'>
        {new Date(category.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>
      <td className='py-5 px-8'>
        <div className='flex items-center justify-end gap-2'>
          <button
            onClick={() => onEdit(category)}
            className='p-2.5 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all active:scale-90'
            title="Edit Category"
          >
            <Edit3 size={18} />
          </button>
          {!isDefaultCategory && (
            <button
              onClick={() => onDelete(category.id, category.name)}
              className='p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90'
              title="Delete Category"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const initialFormState = {
    name: "",
    slug: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiFetch<Category[]>(apiUrl("/categories/get"));
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error: unknown) {
      setErrorMsg(getErrorMessage(error, "Failed to load categories."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!id || !window.confirm(`Are you sure you want to delete the category "${name}"? Existing products in this category might be affected.`)) {
      return;
    }

    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      await apiFetch(apiUrl(`/categories/delete/${encodeURIComponent(id)}`), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      setSuccessMsg(`Category "${name}" deleted successfully.`);
      fetchCategories();
    } catch (error: unknown) {
      setErrorMsg(getErrorMessage(error, "Failed to delete category."));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        description: formData.description.trim() || undefined,
      };

      if (editingId) {
        await apiFetch(apiUrl(`/categories/update/${encodeURIComponent(editingId)}`), {
          method: "PUT",
          body: payload,
          headers: getAuthHeaders(),
        });
        setSuccessMsg(`Category "${payload.name}" updated successfully.`);
      } else {
        await apiFetch(apiUrl("/categories/add"), {
          method: "POST",
          body: payload,
          headers: getAuthHeaders(),
        });
        setSuccessMsg(`Category "${payload.name}" added successfully.`);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData(initialFormState);
      fetchCategories();
    } catch (error: unknown) {
      setErrorMsg(getErrorMessage(error, "Error submitting category form."));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12'>
      <div className='max-w-7xl mx-auto'>
        {errorMsg && (
          <div className='mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 shadow-sm'>
            <AlertCircle size={20} />
            <p className='text-sm font-bold'>{errorMsg}</p>
            <button
              onClick={() => setErrorMsg(null)}
              className='ml-auto p-1 hover:bg-rose-100 rounded-lg transition-colors'
            >
              <X size={16} />
            </button>
          </div>
        )}

        {successMsg && (
          <div className='mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 shadow-sm'>
            <CheckCircle2 size={20} className="text-emerald-500" />
            <p className='text-sm font-bold'>{successMsg}</p>
            <button
              onClick={() => setSuccessMsg(null)}
              className='ml-auto p-1 hover:bg-emerald-100 rounded-lg transition-colors'
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6'>
          <div className='space-y-1'>
            <h1 className='text-4xl md:text-5xl font-bold text-slate-900 tracking-tight'>
              Categories Management
            </h1>
          </div>

          <div className='flex items-center gap-3'>
            <div className='relative'>
              <Search
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                size={16}
              />
              <input
                type='text'
                placeholder='Search categories...'
                className='pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 w-full md:w-80 shadow-sm'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setEditingId(null);
                setFormData(initialFormState);
                setIsModalOpen(true);
              }}
              className='bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-600 transition-all active:scale-95 shadow-xl'
            >
              <Plus size={16} strokeWidth={3} /> Add Category
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            {loading ? (
              <div className='py-24 flex flex-col items-center justify-center text-slate-400'>
                <Loader2
                  size={40}
                  className='animate-spin text-indigo-500 mb-4'
                />
                <p className='text-[10px] font-black tracking-widest uppercase'>
                  Syncing Categories...
                </p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className='py-24 flex flex-col items-center justify-center text-center text-slate-400'>
                <Folder size={40} className='mb-4 text-slate-300' />
                <p className='text-sm font-black uppercase tracking-widest text-slate-500'>
                  No Categories Found
                </p>
                <p className='mt-2 text-sm text-slate-400'>
                  {searchQuery ? "No categories matched your search." : "Add a category to get started."}
                </p>
              </div>
            ) : (
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='bg-slate-50/40'>
                    <th className='py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400'>
                      Category Info
                    </th>
                    <th className='py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400'>
                      Description
                    </th>
                    <th className='py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400'>
                      Created Date
                    </th>
                    <th className='py-5 px-8 text-right text-[10px] font-black uppercase tracking-widest text-slate-400'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((cat) => (
                    <CategoryRow
                      key={cat.id}
                      category={cat}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'>
          <div className='bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative animate-in zoom-in-95 duration-200'>
            <button
              onClick={() => setIsModalOpen(false)}
              className='absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full text-slate-400'
            >
              <X size={20} />
            </button>

            <h2 className='text-3xl font-bold text-slate-900 mb-8 tracking-tight'>
              {editingId ? "Edit Category" : "New Category"}
            </h2>

            <form onSubmit={handleFormSubmit} className='space-y-6'>
              <div>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm focus:bg-white transition-all font-semibold'
                  placeholder='Category Name'
                />
              </div>

              <div>
                <div className='flex items-center border border-slate-100 bg-slate-50 rounded-2xl overflow-hidden focus-within:bg-white transition-all'>
                  <input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-")
                          .replace(/--+/g, "-"),
                      })
                    }
                    className='flex-1 p-4 bg-transparent outline-none text-sm font-mono'
                    placeholder='custom-slug (optional)'
                  />
                </div>
                <p className='text-[10px] text-slate-400 mt-1.5 px-1'>
                  Optional. Leave blank to auto-generate slug from name.
                </p>
              </div>

              <div>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm resize-none focus:bg-white transition-all'
                  placeholder='Category Description'
                />
              </div>

              <button
                disabled={submitting}
                type='submit'
                className='w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[12px] shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50'
              >
                {submitting ? (
                  <Loader2 className='animate-spin' size={20} />
                ) : editingId ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
