import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Tag, MapPin, Calendar, Clock, Users } from 'lucide-react'
import { useTreks } from '../hooks/useTreks'
import { useCategories } from '../hooks/useCategories'
import { TrekCard } from '../components/TrekCard'
import { Category, Trek } from '../types'

interface CategoryPageProps {
  categoryId: string
  onNavigateBack: () => void
  onViewTrekDetails: (trek: Trek) => void
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ 
  categoryId, 
  onNavigateBack, 
  onViewTrekDetails 
}) => {
  const { loading: treksLoading, fetchTreksByCategory, getTreksForCategory } = useTreks()
  const { categories } = useCategories()
  const [category, setCategory] = useState<Category | null>(null)
  const [categoryTreks, setCategoryTreks] = useState<Trek[]>([])

  useEffect(() => {
    const foundCategory = categories.find(cat => cat.id === categoryId)
    setCategory(foundCategory || null)
    
    if (categoryId && fetchTreksByCategory) {
      fetchTreksByCategory(categoryId).then(treks => {
        setCategoryTreks(treks)
      })
    }
  }, [categoryId, categories])

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Tag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-600 mb-2">Category not found</h2>
          <button
            onClick={onNavigateBack}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
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
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateBack}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </motion.button>
            
            <div className="flex items-center space-x-2">
              <Tag className="h-6 w-6 text-emerald-600" />
              <span className="text-lg font-bold text-slate-800">TrekZone</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white py-20"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Tag className="h-12 w-12 text-emerald-300" />
                <h1 className="text-5xl md:text-6xl font-bold">{category.title}</h1>
              </div>
              <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed">
                {category.description}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Treks Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.section
          variants={itemVariants}
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
              All {category.title} Treks
            </motion.h2>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl text-slate-600 max-w-2xl mx-auto"
            >
              Explore all available treks in the {category.title.toLowerCase()} category
            </motion.p>
            
            {/* Trek count indicator */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-4"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">
                  {treksLoading ? 'Loading...' : `${categoryTreks.length} trek${categoryTreks.length !== 1 ? 's' : ''} available`}
                </span>
              </div>
            </motion.div>
          </div>
          
          {treksLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading treks...</p>
            </motion.div>
          ) : categoryTreks.length === 0 ? (
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
                <Tag className="h-16 w-16 text-slate-300 mx-auto" />
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-slate-500"
              >
                No treks available in this category yet.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, staggerChildren: 0.1 }}
            >
              {categoryTreks.map((trek, index) => (
                <TrekCard 
                  key={trek.id} 
                  trek={trek} 
                  index={index} 
                  onViewDetails={() => onViewTrekDetails(trek)}
                />
              ))}
            </motion.div>
          )}
        </motion.section>
      </div>
    </motion.div>
  )
}