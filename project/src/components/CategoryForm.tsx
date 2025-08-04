import React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { X, Tag } from 'lucide-react'
import { Category } from '../types'

interface CategoryFormProps {
  category?: Category
  onSubmit: (data: Omit<Category, 'id' | 'created_at' | 'created_by'>) => Promise<void>
  onClose: () => void
  isLoading: boolean
}

type FormData = Omit<Category, 'id' | 'created_at' | 'created_by'>

export const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onClose, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: category ? {
      title: category.title,
      description: category.description,
      is_active: category.is_active
    } : {
      title: '',
      description: '',
      is_active: true
    }
  })

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Tag className="h-6 w-6 mr-3 text-emerald-600" />
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title *
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter category title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Describe this category"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('is_active')}
              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
            />
            <label className="text-sm font-medium text-slate-700">
              Active (visible on home page)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}