import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Users, MapPin } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTreks } from '../hooks/useTreks'
import { TrekForm } from './TrekForm'
import { Trek } from '../types'

export const AdminPanel: React.FC = () => {
  const { user } = useAuth()
  const { treks, addTrek, updateTrek, deleteTrek } = useTreks()
  const [showForm, setShowForm] = useState(false)
  const [editingTrek, setEditingTrek] = useState<Trek | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: Omit<Trek, 'id' | 'created_at' | 'created_by'>) => {
    setIsLoading(true)
    try {
      if (editingTrek) {
        console.log('Updating trek:', editingTrek.id, data)
        const result = await updateTrek(editingTrek.id, data)
        if (!result.success) {
          console.error('Update failed:', result.error)
          alert('Failed to update trek: ' + result.error)
          return
        }
      } else {
        console.log('Adding new trek:', data)
        const result = await addTrek({ ...data, created_by: user?.id })
        if (!result.success) {
          console.error('Add failed:', result.error)
          alert('Failed to add trek: ' + result.error)
          return
        }
      }
      setShowForm(false)
      setEditingTrek(null)
    } catch (error) {
      console.error('Error saving trek:', error)
      alert('Error saving trek: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (trek: Trek) => {
    setEditingTrek(trek)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this trek?')) {
      await deleteTrek(id)
    }
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingTrek(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Admin Dashboard</h2>
          <p className="text-slate-600">
            Logged in as: <span className="font-medium text-emerald-600">{user?.email}</span>
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Trek</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-emerald-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <MapPin className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-emerald-800">{treks.length}</p>
              <p className="text-emerald-600 text-sm">Total Treks</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-800">
                {treks.reduce((sum, trek) => sum + trek.current_participants, 0)}
              </p>
              <p className="text-blue-600 text-sm">Total Participants</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">$</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-800">
                ${treks.reduce((sum, trek) => sum + (trek.price * trek.current_participants), 0).toLocaleString()}
              </p>
              <p className="text-purple-600 text-sm">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="pb-3 text-slate-600 font-medium">Trek</th>
              <th className="pb-3 text-slate-600 font-medium">Location</th>
              <th className="pb-3 text-slate-600 font-medium">Dates</th>
              <th className="pb-3 text-slate-600 font-medium">Participants</th>
              <th className="pb-3 text-slate-600 font-medium">Price</th>
              <th className="pb-3 text-slate-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {treks.map((trek) => (
              <motion.tr
                key={trek.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={trek.image_url} 
                      alt={trek.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-slate-800">{trek.title}</p>
                      <p className="text-sm text-slate-500">{trek.difficulty}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-slate-600">{trek.location}</td>
                <td className="py-4 text-slate-600">
                  <div className="text-sm">
                    <p>{new Date(trek.start_date).toLocaleDateString()}</p>
                    <p>to {new Date(trek.end_date).toLocaleDateString()}</p>
                  </div>
                </td>
                <td className="py-4 text-slate-600">
                  {trek.current_participants}/{trek.max_participants}
                </td>
                <td className="py-4 text-slate-600 font-medium">
                  ${trek.price}
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(trek)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(trek.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showForm && (
          <TrekForm
            trek={editingTrek || undefined}
            onSubmit={handleSubmit}
            onClose={closeForm}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}