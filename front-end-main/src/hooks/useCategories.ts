// src/hooks/useCategories.ts
'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types';
import { categoriesApi } from '@/lib/api';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]); // ✅ Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await categoriesApi.getAll();

        // ✅ Safe data handling
        const safeData = Array.isArray(data) ? data : [];
        setCategories(safeData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat mengambil kategori'
        );
        setCategories([]); // ✅ Set to empty array on error
        console.error('Error in fetchCategories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryById = (id: number) => {
    return categories.find((category) => category.id === id);
  };

  const getCategoryName = (id: number) => {
    const category = getCategoryById(id);
    return category ? category.name : 'Kategori Tidak Diketahui';
  };

  return {
    categories,
    loading,
    error,
    getCategoryById,
    getCategoryName,
  };
}
