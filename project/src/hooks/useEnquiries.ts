import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Enquiry } from '../types'

export const useEnquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEnquiries = async () => {
    try {
      if (!supabase) {
        setError('Supabase client is not initialized. Cannot fetch enquiries.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('enquiries')
        .select(`
          *,
          trek:treks(
            id,
            title,
            location,
            image_url
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }
      setEnquiries(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching enquiries:', err)
    } finally {
      setLoading(false)
    }
  }

  const addEnquiry = async (enquiry: Omit<Enquiry, 'id' | 'created_at' | 'status'>) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase client not configured. Cannot add enquiry.' }
      }

      const { data, error } = await supabase
        .from('enquiries')
        .insert([enquiry])
        .select()
        .single()

      if (error) throw error
      
      // Add to local state
      setEnquiries((prev: Enquiry[]) => [data, ...prev])
      
      return { success: true, data }
    } catch (err) {
      console.error('Error adding enquiry:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add enquiry' }
    }
  }

  const updateEnquiryStatus = async (id: string, status: Enquiry['status']) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase client not configured. Cannot update enquiry.' }
      }

      const { data, error } = await supabase
        .from('enquiries')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        throw error
      }
      
      setEnquiries((prev: Enquiry[]) => prev.map((enquiry: Enquiry) => enquiry.id === id ? { ...enquiry, status } : enquiry))
      return { success: true, data }
    } catch (err) {
      console.error('Error updating enquiry status:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update enquiry status' }
    }
  }

  const deleteEnquiry = async (id: string) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase client not configured. Cannot delete enquiry.' }
      }

      const { error } = await supabase
        .from('enquiries')
        .delete()
        .eq('id', id)

      if (error) throw error
      setEnquiries((prev: Enquiry[]) => prev.filter((enquiry: Enquiry) => enquiry.id !== id))
      
      return { success: true }
    } catch (err) {
      console.error('Error deleting enquiry:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete enquiry' }
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  return {
    enquiries,
    loading,
    error,
    addEnquiry,
    updateEnquiryStatus,
    deleteEnquiry,
    refetch: fetchEnquiries,
  }
}