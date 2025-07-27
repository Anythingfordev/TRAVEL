import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Trek } from '../types'

export const useTreks = () => {
  const [treks, setTreks] = useState<Trek[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTreks = async () => {
    try {
      if (!supabase) {
        setError('Supabase client is not initialized. Cannot fetch treks.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('treks')
        .select('*')
        .order('start_date', { ascending: true })

      if (error) {
        throw error
      }
      setTreks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching treks:', err)
    } finally {
      setLoading(false)
    }
  }

  const addTrek = async (trek: Omit<Trek, 'id' | 'created_at'>, categoryIds?: string[]) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase client not configured. Cannot add trek.' }
      }

      // Ensure correct types for array and JSON fields
      const payload = {
        ...trek,
        inclusions: trek.inclusions ?? [],
        exclusions: trek.exclusions ?? [],
        things_to_carry: trek.things_to_carry ?? [],
        itinerary: trek.itinerary ?? [],
      }

      const { data, error } = await supabase
        .from('treks')
        .insert([payload])
        .select()
        .single()

      if (error) throw error
      
      // Add trek to categories if provided
      if (categoryIds && categoryIds.length > 0) {
        const categoryInserts = categoryIds.map(categoryId => ({
          trek_id: data.id,
          category_id: categoryId
        }))
        
        const { error: categoryError } = await supabase
          .from('trek_categories')
          .insert(categoryInserts)
        
        if (categoryError) {
          console.error('Error adding trek to categories:', categoryError)
        }
      }
      
      setTreks((prev: Trek[]) => [...prev, data])
      return { success: true, data }
    } catch (err) {
      console.error('Error adding trek:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add trek' }
    }
  }

  const updateTrek = async (id: string, updates: Partial<Trek>, categoryIds?: string[]) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase client not configured. Cannot update trek.' }
      }

      // Ensure correct types for array and JSON fields
      const payload = {
        ...updates,
        inclusions: updates.inclusions ?? [],
        exclusions: updates.exclusions ?? [],
        things_to_carry: updates.things_to_carry ?? [],
        itinerary: updates.itinerary ?? [],
      }

      console.log('Updating trek with ID:', id)
      console.log('Update data:', payload)

      const { data, error } = await supabase
        .from('treks')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        throw error
      }
      
      // Update trek categories if provided
      if (categoryIds !== undefined) {
        // First, remove existing categories
        await supabase
          .from('trek_categories')
          .delete()
          .eq('trek_id', id)
        
        // Then add new categories
        if (categoryIds.length > 0) {
          const categoryInserts = categoryIds.map(categoryId => ({
            trek_id: id,
            category_id: categoryId
          }))
          
          const { error: categoryError } = await supabase
            .from('trek_categories')
            .insert(categoryInserts)
          
          if (categoryError) {
            console.error('Error updating trek categories:', categoryError)
          }
        }
      }
      
      console.log('Update successful:', data)
      setTreks((prev: Trek[]) => prev.map((trek: Trek) => trek.id === id ? data : trek))
      return { success: true, data }
    } catch (err) {
      console.error('Error updating trek:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update trek' }
    }
  }

  const deleteTrek = async (id: string) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase client not configured. Cannot delete trek.' }
      }

      const { error } = await supabase
        .from('treks')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTreks((prev: Trek[]) => prev.filter((trek: Trek) => trek.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting trek:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete trek' }
    }
  }

  const fetchTreksByCategory = async (categoryId: string) => {
    try {
      if (!supabase) {
        setError('Supabase client is not initialized. Cannot fetch treks.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('treks')
        .select(`
          *,
          trek_categories!inner(category_id)
        `)
        .eq('trek_categories.category_id', categoryId)
        .order('start_date', { ascending: true })

      if (error) {
        throw error
      }
      setTreks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching treks by category:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTreks()
  }, [])

  return {
    treks,
    loading,
    error,
    addTrek,
    updateTrek,
    deleteTrek,
    refetch: fetchTreks,
    fetchTreksByCategory
  }
}