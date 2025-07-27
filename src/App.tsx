import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, MapPin, Calendar, Clock, Users, ArrowRight } from 'lucide-react'
import { useAuth } from './hooks/useAuth'
import { useTreks } from './hooks/useTreks'
import { useCategories } from './hooks/useCategories'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { TrekCard } from './components/TrekCard'
import { LoadingSpinner } from './components/LoadingSpinner'
import { AdminPage } from './pages/AdminPage'
import { ManageCategoriesPage } from './pages/ManageCategoriesPage'
import { CategoryPage } from './pages/CategoryPage'
import { TrekDetailsPage } from './pages/TrekDetailsPage'
import { Trek, Category } from './types'

type Page = 'home' | 'admin' | 'categories' | 'category' | 'trek-details'

function App() {
  const { user, loading: authLoading, isAdminUser } = useAuth()
  const { treks, loading: treksLoading } = useTreks()
  const { categories, loading: categoriesLoading, fetchActiveCategories, fetchAllCategories } = useCategories()
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  // Load appropriate categories based on user role
  React.useEffect(() => {
    if (isAdminUser) {
      fetchAllCategories()
    } else {
      fetchActiveCategories()
    }
  }, [isAdminUser, fetchActiveCategories, fetchAllCategories])

  const handleAdminToggle = () => {
    setCurrentPage(currentPage === 'admin' ? 'home' : 'admin')
  }

  const handleNavigateToCategories = () => {
    setCurrentPage('categories')
  }

  const handleNavigateHome = () => {
    setCurrentPage('home')
  }

  const handleNavigateToCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setCurrentPage('category')
  }

  const handleViewTrekDetails = (trek: Trek) => {
    setSelectedTrek(trek)
    setCurrentPage('trek-details')
  }

  const handleBackFromTrekDetails = () => {
    setSelectedTrek(null)
    if (selectedCategoryId) {
      setCurrentPage('category')
    } else {
      setCurrentPage('home')
    }
  }

  const handleBackFromCategory = () => {
    setSelectedCategoryId(null)
    setCurrentPage('home')
  }

  const handleBackFromCategories = () => {
    setCurrentPage('admin')
  }

  // Get treks for a specific category (limited to 3 for home page)
  const getTreksForCategory = (categoryId: string, limit?: number) => {
    const categoryTreks = treks.filter(trek => {
      // For now, we'll show all treks since we don't have category relationships loaded
      // In a real implementation, you'd filter by trek-category relationships
      return true
    })
    return limit ? categoryTreks.slice(0, limit) : categoryTreks
  }

  if (authLoading) {
    return <LoadingSpinner />
  }

  // Render different pages based on current page
  if (currentPage === 'admin' && isAdminUser) {
    return (
      <AdminPage 
        onNavigateHome={handleNavigateHome}
        onNavigateToCategories={handleNavigateToCategories}
      />
    )
  }

  if (currentPage === 'categories' && isAdminUser) {
    return (
      <ManageCategoriesPage 
        onNavigateBack={handleBackFromCategories}
      />
    )
  }

  if (currentPage === 'category' && selectedCategoryId) {
    return (
      <CategoryPage 
        categoryId={selectedCategoryId}
        onNavigateBack={handleBackFromCategory}
        onViewTrekDetails={handleViewTrekDetails}
      />
    )
  }

  if (currentPage === 'trek-details' && selectedTrek) {
    return (
      <TrekDetailsPage 
        trek={selectedTrek}
        onNavigateBack={handleBackFromTrekDetails}
      />
    )
  }

  // Home page
  const activeCategories = categories.filter(cat => cat.is_active)
  const inactiveCategories = categories.filter(cat => !cat.is_active)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Header 
        onAdminToggle={handleAdminToggle}
        currentPage={currentPage}
      />
      <Hero />
      
      <div className="container mx-auto px-4 py-16">
        {/* Active Categories Section */}
        {activeCategories.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
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
                Explore by Category
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

            <div className="space-y-16">
              {activeCategories.map((category, categoryIndex) => {
                const categoryTreks = getTreksForCategory(category.id, 3)
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1, duration: 0.8 }}
                    className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                          <Tag className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-800">{category.title}</h3>
                          <p className="text-slate-600">{category.description}</p>
                        </div>
                      </div>
                      
                      {categoryTreks.length >= 3 && (
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleNavigateToCategory(category.id)}
                          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <span>View All Treks in {category.title}</span>
                          <ArrowRight className="h-4 w-4" />
                        </motion.button>
                      )}
                    </div>

                    {treksLoading || categoriesLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                        <p className="text-slate-600">Loading treks...</p>
                      </div>
                    ) : categoryTreks.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No treks available in this category yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryTreks.map((trek, index) => (
                          <TrekCard 
                            key={trek.id} 
                            trek={trek} 
                            index={index} 
                            onViewDetails={() => handleViewTrekDetails(trek)}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.section>
        )}

        {/* Inactive Categories Section (Admin Only) */}
        {isAdminUser && inactiveCategories.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
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
                className="text-3xl font-bold text-amber-800 mb-4"
              >
                Inactive Categories (Admin Preview)
              </motion.h2>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-lg text-amber-600 max-w-2xl mx-auto"
              >
                These categories are not visible to regular users
              </motion.p>
            </div>

            <div className="space-y-12">
              {inactiveCategories.map((category, categoryIndex) => {
                const categoryTreks = getTreksForCategory(category.id, 3)
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1, duration: 0.8 }}
                    className="bg-amber-50 rounded-2xl shadow-lg p-8 border border-amber-200 opacity-75"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-amber-100 rounded-xl">
                          <Tag className="h-8 w-8 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-amber-800">{category.title}</h3>
                          <p className="text-amber-600">{category.description}</p>
                          <span className="inline-block mt-2 px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-sm font-medium">
                            Inactive
                          </span>
                        </div>
                      </div>
                      
                      {categoryTreks.length >= 3 && (
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleNavigateToCategory(category.id)}
                          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <span>Preview All Treks</span>
                          <ArrowRight className="h-4 w-4" />
                        </motion.button>
                      )}
                    </div>

                    {categoryTreks.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-amber-300 mx-auto mb-3" />
                        <p className="text-amber-500">No treks available in this category yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryTreks.map((trek, index) => (
                          <TrekCard 
                            key={trek.id} 
                            trek={trek} 
                            index={index} 
                            onViewDetails={() => handleViewTrekDetails(trek)}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.section>
        )}

        {/* All Treks Section (fallback when no categories) */}
        {categories.length === 0 && (
          <motion.section
            id="treks"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
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
                Featured Treks
              </motion.h2>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xl text-slate-600 max-w-2xl mx-auto"
              >
                Discover breathtaking adventures curated by our expert guides
              </motion.p>
            </div>
            
            {treksLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading amazing treks...</p>
              </motion.div>
            ) : treks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
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
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-slate-500"
                >
                  No treks available yet. Check back soon for amazing adventures!
                </motion.p>
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, staggerChildren: 0.1 }}
              >
                {treks.slice(0, 6).map((trek, index) => (
                  <TrekCard 
                    key={trek.id} 
                    trek={trek} 
                    index={index} 
                    onViewDetails={() => handleViewTrekDetails(trek)}
                  />
                ))}
              </motion.div>
            )}
          </motion.section>
        )}
      </div>
    </div>
  )
}

export default App