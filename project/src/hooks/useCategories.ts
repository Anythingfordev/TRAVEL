import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Category } from '../types'

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      if (!supabase) {
        setError('Database connection not configured. Please set up Supabase credentials.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('title', { ascending: true })

      if (error) {
        throw error
      }
      setCategories(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(`Failed to load categories: ${errorMessage}`)
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchActiveCategories = async () => {
    try {
      if (!supabase) {
        setError('Database connection not configured. Please set up Supabase credentials.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('title', { ascending: true })

      if (error) {
        throw error
      }
      setCategories(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(`Failed to load categories: ${errorMessage}`)
      console.error('Error fetching active categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllCategories = async () => {
    try {
      if (!supabase) {
        setError('Database connection not configured. Please set up Supabase credentials.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('is_active', { ascending: false })
        .order('title', { ascending: true })

      if (error) {
        throw error
      }
      setCategories(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(`Failed to load categories: ${errorMessage}`)
      console.error('Error fetching all categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async (category: Omit<Category, 'id' | 'created_at'>) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase client not configured. Cannot add category.' }
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single()

      if (error) throw error
      setCategories((prev: Category[]) => [...prev, data])
      return { success: true, data }
    } catch (err) {
      console.error('Error adding category:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add category' }
    }
  }

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase client not configured. Cannot update category.' }
      }

      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        throw error
      }
      
      setCategories((prev: Category[]) => prev.map((category: Category) => category.id === id ? data : category))
      return { success: true, data }
    } catch (err) {
      console.error('Error updating category:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update category' }
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase client not configured. Cannot delete category.' }
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      setCategories((prev: Category[]) => prev.filter((category: Category) => category.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting category:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete category' }
    }
  }

  const toggleCategoryStatus = async (id: string, isActive: boolean) => {
    return updateCategory(id, { is_active: isActive })
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    refetch: fetchCategories,
    fetchActiveCategories,
    fetchAllCategories
  }
}