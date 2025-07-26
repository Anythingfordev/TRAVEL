import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mountain, Route, Tag, ArrowLeft } from 'lucide-react'
import { supabase } from './lib/supabase'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { TrekCard } from './components/TrekCard'
import { AdminPage } from './pages/AdminPage'
import { ManageCategoriesPage } from './pages/ManageCategoriesPage'
import { CategoryPage } from './pages/CategoryPage'
import { TrekDetailsPage } from './pages/TrekDetailsPage'
import { LoadingSpinner } from './components/LoadingSpinner'
import { useAuth } from './hooks/useAuth'
import { useTreks } from './hooks/useTreks'
import { useCategories } from './hooks/useCategories'
import { Trek } from './types'

// Floating particles animation component
const FloatingParticles: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-emerald-400/20 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeInOut"
          }}
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
        />
      ))}
    </div>
  )
}

function App() {
  const { loading: authLoading, user, isAdminUser } = useAuth()
  const { treks, loading: treksLoading } = useTreks()
  const { categories, loading: categoriesLoading, error: categoriesError, fetchActiveCategories } = useCategories()
  const [currentPage, setCurrentPage] = useState<'home' | 'admin' | 'manage-categories' | 'category' | 'trek-details'>('home')
  const [previousPage, setPreviousPage] = useState<'home' | 'admin' | 'manage-categories' | 'category' | 'trek-details'>('home')
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  // Track page changes
  useEffect(() => {
    setPreviousPage(currentPage)
  }, [currentPage])

  // Fetch active categories on mount
  useEffect(() => {
    fetchActiveCategories()
  }, [fetchActiveCategories])

  if (authLoading || treksLoading) {
    return <LoadingSpinner />
  }

  if (currentPage === 'category' && selectedCategoryId) {
    return (
      <>
        <FloatingParticles />
        <CategoryPage 
          categoryId={selectedCategoryId}
          onNavigateBack={() => {
            setCurrentPage('home')
            setSelectedCategoryId(null)
          }}
          onViewTrekDetails={(trek) => {
            setSelectedTrek(trek)
            setPreviousPage('category')
            setCurrentPage('trek-details')
          }}
        />
      </>
    )
  }

  if (currentPage === 'trek-details' && selectedTrek) {
    return (
      <>
        <FloatingParticles />
        <TrekDetailsPage 
          trek={selectedTrek} 
          onNavigateBack={() => {
            setCurrentPage(previousPage === 'category' ? 'category' : 'home')
            setSelectedTrek(null)
          }}
        />
      </>
    )
  }

  if (currentPage === 'manage-categories' && user && isAdminUser) {
    return (
      <>
        <FloatingParticles />
        <ManageCategoriesPage onNavigateBack={() => setCurrentPage('admin')} />
      </>
    )
  }

  if (currentPage === 'admin' && user && isAdminUser) {
    return (
      <>
        <FloatingParticles />
        <AdminPage 
          onNavigateHome={() => setCurrentPage('home')}
          onNavigateToCategories={() => setCurrentPage('manage-categories')}
        />
      </>
    )
  }

  const handleViewTrekDetails = (trek: Trek) => {
    setSelectedTrek(trek)
    setPreviousPage(currentPage)
    setCurrentPage('trek-details')
  }

  const handleViewCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setPreviousPage(currentPage)
    setCurrentPage('category')
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <FloatingParticles />
      
      {/* Animated background gradient */}
      <motion.div
        className="fixed inset-0 opacity-30 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <Header 
        onAdminToggle={() => setCurrentPage('admin')}
        currentPage={currentPage}
      />
      
      <Hero />
      
      <main className="container mx-auto px-4 py-16 relative z-10">
        {/* Weekend Trips Section */}
        {categories.filter(cat => cat.is_active).length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold text-slate-800 mb-4"
              >
                Explore by Categories
              </motion.h2>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xl text-slate-600 max-w-2xl mx-auto"
              >
                Discover amazing adventures organized by your interests
              </motion.p>
            </div>
            
            {categoriesLoading ? (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            ) : categoriesError ? (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Categories</h3>
                  <p className="text-red-600 text-sm">{categoriesError}</p>
                </div>
              </div>
            ) : categories.filter(cat => cat.is_active).length === 0 ? (
              <div className="text-center py-12">
                <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Categories Available</h3>
                <p className="text-gray-500">Categories will appear here once they are created and activated.</p>
              </div>
            ) : (
              <div className="space-y-16">
                {categories.filter(cat => cat.is_active).map((category) => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    onViewCategory={handleViewCategory}
                    onViewTrekDetails={handleViewTrekDetails}
                  />
                ))}
              </div>
            )}
          </motion.section>
        )}

        {!user && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center py-16 bg-white rounded-xl shadow-lg"
          >
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-slate-800 mb-4"
            >
              Ready to Start Your Adventure?
            </motion.h3>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto"
            >
              Sign in to book your trek and join our community of adventurers.
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl transition-colors"
            >
              Sign In to Book
            </motion.button>
          </motion.section>
        )}
      </main>
      
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-slate-800 text-white py-12"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center items-center space-x-2 mb-4"
          >
            <Mountain className="h-8 w-8 text-emerald-400" />
            <h3 className="text-2xl font-bold">TrekZone</h3>
          </motion.div>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-slate-400"
          >
            © 2025 TrekZone. Discover the world, one step at a time.
          </motion.p>
        </div>
      </motion.footer>
    </div>
  )
}

// Category Section Component
const CategorySection: React.FC<{
  category: any
  onViewCategory: (categoryId: string) => void
  onViewTrekDetails: (trek: Trek) => void
}> = ({ category, onViewCategory, onViewTrekDetails }) => {
  const [categoryTreks, setCategoryTreks] = useState<Trek[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategoryTreks = async () => {
      if (!category.id) {
        setLoading(false)
        return
      }

      if (!supabase) {
        setError('Database connection not available. Please check your configuration.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('treks')
          .select(`
            *,
            trek_categories!inner(category_id)
          `)
          .eq('trek_categories.category_id', category.id)
          .order('start_date', { ascending: true })
          .limit(3)

        if (error) {
          console.error('Error fetching category treks:', error)
          setError(error.message)
          setCategoryTreks([])
        } else {
          setCategoryTreks(data || [])
        }
      } catch (err) {
        console.error('Error fetching category treks:', err)
        setError(err instanceof Error ? err.message : 'Failed to load treks')
        setCategoryTreks([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryTreks()
  }, [category.id])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100"
      >
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Tag className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-800">{category.title}</h3>
            <p className="text-slate-600 mt-1">{category.description}</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading treks...</p>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100"
      >
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Tag className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-800">{category.title}</h3>
            <p className="text-slate-600 mt-1">{category.description}</p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading treks: {error}</p>
        </div>
      </motion.div>
    )
  }

  if (categoryTreks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100"
      >
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Tag className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-800">{category.title}</h3>
            <p className="text-slate-600 mt-1">{category.description}</p>
          </div>
        </div>
        <div className="text-center py-8">
          <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-slate-500">No treks available in this category yet.</p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewCategory(category.id)}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            View Category
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Tag className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-800">{category.title}</h3>
            <p className="text-slate-600 mt-1">{category.description}</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewCategory(category.id)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <span>View All</span>
          <ArrowLeft className="h-4 w-4 rotate-180" />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryTreks.map((trek, index) => (
          <TrekCard
            key={trek.id}
            trek={trek}
            index={index}
            onViewDetails={() => onViewTrekDetails(trek)}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default App