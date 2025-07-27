import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ArrowLeft, 
  Tag,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  MapPin,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCategories } from '../hooks/useCategories'
import { useTreks } from '../hooks/useTreks'
import { CategoryForm } from '../components/CategoryForm'
import { Category, Trek } from '../types'
import { supabase } from '../lib/supabase'

interface ManageCategoriesPageProps {
  onNavigateBack: () => void
}

export const ManageCategoriesPage: React.FC<ManageCategoriesPageProps> = ({ onNavigateBack }) => {
  const { user } = useAuth()
  const { categories, addCategory, updateCategory, deleteCategory, toggleCategoryStatus } = useCategories()
  const { treks, treksByCategory } = useTreks()
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [categoryTreks, setCategoryTreks] = useState<Record<string, Trek[]>>({})

  // Get trek count for a category from treksByCategory
  const getCategoryTrekCount = (categoryId: string) => {
    return treksByCategory[categoryId]?.length || 0
  }
  // Fetch treks for a specific category
  const fetchCategoryTreks = async (categoryId: string) => {
    if (!supabase) return
    
    try {
      const { data, error } = await supabase
        .from('treks')
        .select(`
          *,
          trek_categories!inner(category_id)
        `)
        .eq('trek_categories.category_id', categoryId)
        .order('start_date', { ascending: true })

      if (error) throw error
      setCategoryTreks(prev => ({ ...prev, [categoryId]: data || [] }))
    } catch (error) {
      console.error('Error fetching category treks:', error)
      setCategoryTreks(prev => ({ ...prev, [categoryId]: [] }))
    }
  }

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
      // Fetch treks when expanding for the first time
      if (!categoryTreks[categoryId]) {
        fetchCategoryTreks(categoryId)
      }
    }
    setExpandedCategories(newExpanded)
  }

  const handleSubmit = async (data: Omit<Category, 'id' | 'created_at' | 'created_by'>) => {
    setIsLoading(true)
    try {
      if (editingCategory) {
        const result = await updateCategory(editingCategory.id, data)
        if (!result.success) {
          alert('Failed to update category: ' + result.error)
          return
        }
      } else {
        const result = await addCategory({ ...data, created_by: user?.id })
        if (!result.success) {
          alert('Failed to add category: ' + result.error)
          return
        }
      }
      setShowForm(false)
      setEditingCategory(null)
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Error saving category: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will also remove it from all associated treks.')) {
      await deleteCategory(id)
      // Remove from expanded categories and category treks
      const newExpanded = new Set(expandedCategories)
      newExpanded.delete(id)
      setExpandedCategories(newExpanded)
      setCategoryTreks(prev => {
        const updated = { ...prev }
        delete updated[id]
        return updated
      })
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await toggleCategoryStatus(id, !currentStatus)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingCategory(null)
  }

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
                onClick={onNavigateBack}
                className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-md"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Admin</span>
              </motion.button>
              
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Tag className="h-8 w-8 text-emerald-600" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Manage Categories</h1>
                  <p className="text-sm text-slate-600">Organize your treks by categories</p>
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
              <span>Add Category</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Tag className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-800">{categories.length}</p>
                <p className="text-emerald-600 font-medium">Total Categories</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-800">
                  {categories.filter(cat => cat.is_active).length}
                </p>
                <p className="text-green-600 font-medium">Active Categories</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <MapPin className="h-8 w-8 text-slate-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800">
                  {treks.length}
                </p>
                <p className="text-slate-600 font-medium">Total Treks</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Categories List */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
              <Tag className="h-6 w-6 text-emerald-600" />
              <span>Categories</span>
            </h3>
          </div>

          {categories.length === 0 ? (
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
                <Tag className="h-16 w-16 text-slate-300 mx-auto" />
              </motion.div>
              <h4 className="text-xl font-semibold text-slate-600 mb-2">No categories yet</h4>
              <p className="text-slate-500 mb-6">Create your first category to organize your treks!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                Create First Category
              </motion.button>
            </motion.div>
          ) : (
            <div className="divide-y divide-slate-100">
              {categories.map((category, index) => (
                <div key={category.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleCategoryExpansion(category.id)}
                            className="p-1 hover:bg-slate-200 rounded transition-colors"
                          >
                            {expandedCategories.has(category.id) ? (
                              <ChevronDown className="h-4 w-4 text-slate-600" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-600" />
                            )}
                          </motion.button>
                          <h4 className="text-lg font-semibold text-slate-800">{category.title}</h4>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            category.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {category.is_active ? 'Active' : 'Inactive'}
                          </div>
                          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {getCategoryTrekCount(category.id)}
                          </div>
                        </div>
                        <p className="text-slate-600 mb-2 ml-8">{category.description}</p>
                        <p className="text-xs text-slate-400 ml-8">
                          Created {new Date(category.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggleStatus(category.id, category.is_active)}
                          className={`p-2 rounded-lg transition-colors ${
                            category.is_active 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-slate-400 hover:bg-slate-100'
                          }`}
                          title={category.is_active ? 'Deactivate category' : 'Activate category'}
                        >
                          {category.is_active ? (
                            <ToggleRight className="h-5 w-5" />
                          ) : (
                            <ToggleLeft className="h-5 w-5" />
                          )}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(category)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Expanded Trek List */}
                  <AnimatePresence>
                    {expandedCategories.has(category.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-slate-50 border-t border-slate-200"
                      >
                        <div className="p-6">
                          <h5 className="text-sm font-semibold text-slate-700 mb-4 flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
                            Treks in this category
                          </h5>
                          
                          {categoryTreks[category.id] ? (
                            categoryTreks[category.id].length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categoryTreks[category.id].map((trek) => (
                                  <motion.div
                                    key={trek.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <img 
                                        src={trek.image_url} 
                                        alt={trek.title}
                                        className="w-12 h-12 rounded-lg object-cover"
                                      />
                                      <div className="flex-1">
                                        <h6 className="font-semibold text-slate-800 text-sm">{trek.title}</h6>
                                        <p className="text-xs text-slate-500">{trek.location}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            trek.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                            trek.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                            trek.difficulty === 'Hard' ? 'bg-orange-100 text-orange-800' :
                                            'bg-red-100 text-red-800'
                                          }`}>
                                            {trek.difficulty}
                                          </span>
                                          <span className="text-xs font-semibold text-emerald-600">
                                            ₹{trek.price}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-500 text-sm">No treks in this category yet</p>
                              </div>
                            )
                          ) : (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                              <p className="text-slate-500 text-sm">Loading treks...</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && (
          <CategoryForm
            category={editingCategory || undefined}
            onSubmit={handleSubmit}
            onClose={closeForm}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}