import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  MapPin, 
  ArrowLeft, 
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  Mountain,
  Tag
} from 'lucide-react'
import { MessageCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTreks } from '../hooks/useTreks'
import { TrekForm } from '../components/TrekForm'
import { Trek } from '../types'

interface AdminPageProps {
  onNavigateHome: () => void
  onNavigateToCategories: () => void
  onNavigateToEnquiries: () => void
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateHome, onNavigateToCategories, onNavigateToEnquiries }) => {
  const { user } = useAuth()
  const { treks, addTrek, updateTrek, deleteTrek } = useTreks()
  const [showForm, setShowForm] = useState(false)
  const [editingTrek, setEditingTrek] = useState<Trek | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: Omit<Trek, 'id' | 'created_at' | 'created_by'>, categoryIds?: string[]) => {
    setIsLoading(true)
    try {
      if (editingTrek) {
        console.log('Updating trek:', editingTrek.id, data)
        const result = await updateTrek(editingTrek.id, data, categoryIds)
        if (!result.success) {
          console.error('Update failed:', result.error)
          alert('Failed to update trek: ' + result.error)
          return
        }
      } else {
        console.log('Adding new trek:', data)
        const result = await addTrek({ ...data, created_by: user?.id }, categoryIds)
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

  const totalParticipants = treks.reduce((sum, trek) => sum + trek.current_participants, 0)
  const totalRevenue = treks.reduce((sum, trek) => sum + (trek.price * trek.current_participants), 0)
  const avgPrice = treks.length > 0 ? treks.reduce((sum, trek) => sum + trek.price, 0) / treks.length : 0

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNavigateHome}
                className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-md"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </motion.button>
              
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Mountain className="h-8 w-8 text-emerald-600" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                  <p className="text-sm text-slate-600">Manage your trekking adventures</p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Trek</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-2xl p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>
          
          <div className="relative">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-2"
            >
              Welcome back, {user?.email?.split('@')[0]}!
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-emerald-100 text-lg"
            >
              Manage your trekking adventures and track your business performance
            </motion.p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <MapPin className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-800">{treks.length}</p>
                <p className="text-emerald-600 font-medium">Total Treks</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-800">{totalParticipants}</p>
                <p className="text-blue-600 font-medium">Total Participants</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-800">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-purple-600 font-medium">Total Revenue</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-800">₹{Math.round(avgPrice)}</p>
                <p className="text-orange-600 font-medium">Avg. Price</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateToCategories}
              className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Tag className="h-5 w-5" />
              <span>Manage Categories</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateToEnquiries}
              className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Manage Enquiries</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Treks Table */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
              <Activity className="h-6 w-6 text-emerald-600" />
              <span>Manage Treks</span>
            </h3>
          </div>

          {treks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mb-4"
              >
                <MapPin className="h-16 w-16 text-slate-300 mx-auto" />
              </motion.div>
              <h4 className="text-xl font-semibold text-slate-600 mb-2">No treks yet</h4>
              <p className="text-slate-500 mb-6">Create your first trek to get started!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                Create First Trek
              </motion.button>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Trek</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Dates</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Participants</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {treks.map((trek, index) => (
                    <motion.tr
                      key={trek.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <motion.img 
                            whileHover={{ scale: 1.1 }}
                            src={trek.image_url} 
                            alt={trek.title}
                            className="w-12 h-12 rounded-lg object-cover shadow-md"
                          />
                          <div>
                            <p className="font-semibold text-slate-800">{trek.title}</p>
                            <p className="text-sm text-slate-500">{trek.difficulty}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{trek.location}</td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="text-sm">
                          <p>{new Date(trek.start_date).toLocaleDateString()}</p>
                          <p className="text-slate-400">to {new Date(trek.end_date).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(trek.current_participants / trek.max_participants) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-slate-600 whitespace-nowrap">
                            {trek.current_participants}/{trek.max_participants}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-semibold">
                        ₹{trek.price}
                      </td>
                      <td className="px-6 py-4">
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
          )}
        </motion.div>
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