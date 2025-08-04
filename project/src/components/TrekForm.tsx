import React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { X, Plus, Trash2, Clock } from 'lucide-react'
import { Trek, ItineraryDay, ItineraryActivity } from '../types'
import { useCategories } from '../hooks/useCategories'
import { useState } from 'react'

interface TrekFormProps {
  trek?: Trek
  onSubmit: (data: Omit<Trek, 'id' | 'created_at' | 'created_by'>, categoryIds?: string[]) => Promise<void>
  onClose: () => void
  isLoading: boolean
}

type FormData = Omit<Trek, 'id' | 'created_at' | 'created_by'>

export const TrekForm: React.FC<TrekFormProps> = ({ trek, onSubmit, onClose, isLoading }) => {
  const [inclusions, setInclusions] = useState<string[]>(trek?.inclusions || [''])
  const [exclusions, setExclusions] = useState<string[]>(trek?.exclusions || [''])
  const [thingsToCarry, setThingsToCarry] = useState<string[]>(trek?.things_to_carry || [''])
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(trek?.itinerary || [])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  
  const { categories } = useCategories()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: trek ? {
      title: trek.title,
      description: trek.description,
      location: trek.location,
      duration: trek.duration,
      difficulty: trek.difficulty,
      price: trek.price,
      image_url: trek.image_url,
      start_date: trek.start_date,
      end_date: trek.end_date,
      max_participants: trek.max_participants,
      current_participants: trek.current_participants,
      inclusions: trek.inclusions || [],
      exclusions: trek.exclusions || [],
      things_to_carry: trek.things_to_carry || [],
      itinerary: trek.itinerary || []
    } : {
      title: '',
      description: '',
      location: '',
      duration: '',
      difficulty: 'Easy' as const,
      price: 0,
      image_url: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
      start_date: '',
      end_date: '',
      max_participants: 20,
      current_participants: 0,
      inclusions: [],
      exclusions: [],
      things_to_carry: [],
      itinerary: []
    }
  })

  const addInclusion = () => {
    setInclusions([...inclusions, ''])
  }

  const removeInclusion = (index: number) => {
    setInclusions(inclusions.filter((_, i) => i !== index))
  }

  const updateInclusion = (index: number, value: string) => {
    const updated = [...inclusions]
    updated[index] = value
    setInclusions(updated)
  }

  const addExclusion = () => {
    setExclusions([...exclusions, ''])
  }

  const removeExclusion = (index: number) => {
    setExclusions(exclusions.filter((_, i) => i !== index))
  }

  const updateExclusion = (index: number, value: string) => {
    const updated = [...exclusions]
    updated[index] = value
    setExclusions(updated)
  }

  const addThingToCarry = () => {
    setThingsToCarry([...thingsToCarry, ''])
  }

  const removeThingToCarry = (index: number) => {
    setThingsToCarry(thingsToCarry.filter((_, i) => i !== index))
  }

  const updateThingToCarry = (index: number, value: string) => {
    const updated = [...thingsToCarry]
    updated[index] = value
    setThingsToCarry(updated)
  }

  const addItineraryDay = () => {
    const newDay: ItineraryDay = {
      day: itinerary.length + 1,
      title: '',
      activities: [{ id: Date.now().toString(), time: '', description: '' }]
    }
    setItinerary([...itinerary, newDay])
  }

  const removeItineraryDay = (dayIndex: number) => {
    setItinerary(itinerary.filter((_, i) => i !== dayIndex))
  }

  const updateItineraryDay = (dayIndex: number, field: keyof ItineraryDay, value: any) => {
    const updated = [...itinerary]
    updated[dayIndex] = { ...updated[dayIndex], [field]: value }
    setItinerary(updated)
  }

  const addActivity = (dayIndex: number) => {
    const updated = [...itinerary]
    const newActivity: ItineraryActivity = {
      id: Date.now().toString(),
      time: '',
      description: ''
    }
    updated[dayIndex].activities.push(newActivity)
    setItinerary(updated)
  }

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updated = [...itinerary]
    updated[dayIndex].activities = updated[dayIndex].activities.filter((_, i) => i !== activityIndex)
    setItinerary(updated)
  }

  const updateActivity = (dayIndex: number, activityIndex: number, field: keyof ItineraryActivity, value: string) => {
    const updated = [...itinerary]
    updated[dayIndex].activities[activityIndex] = {
      ...updated[dayIndex].activities[activityIndex],
      [field]: value
    }
    setItinerary(updated)
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId])
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId))
    }
  }

  const handleFormSubmit = (data: FormData) => {
    const filteredInclusions = inclusions.filter(item => item && item.trim() !== '')
    const filteredExclusions = exclusions.filter(item => item && item.trim() !== '')
    const filteredThingsToCarry = thingsToCarry.filter(item => item && item.trim() !== '')
    const filteredItinerary = itinerary.map(day => ({
      ...day,
      activities: day.activities.filter(activity => activity.description.trim() !== '')
    })).filter(day => day.title.trim() !== '' || day.activities.length > 0)

    const formattedData = {
      ...data,
      inclusions: filteredInclusions,
      exclusions: filteredExclusions,
      things_to_carry: filteredThingsToCarry,
      itinerary: filteredItinerary
    }
    
    console.log('Submitting trek data:', formattedData)
    console.log('Selected categories:', selectedCategories)
    onSubmit(formattedData, selectedCategories)
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
        className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {trek ? 'Edit Trek' : 'Add New Trek'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter trek title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Location *
              </label>
              <input
                {...register('location', { required: 'Location is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter location"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Describe the trek experience"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Duration *
              </label>
              <input
                {...register('duration', { required: 'Duration is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., 7 days"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Difficulty *
              </label>
              <select
                {...register('difficulty', { required: 'Difficulty is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Price (Rs) *
              </label>
              <input
                type="number"
                {...register('price', { required: 'Price is required', min: 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                {...register('start_date', { required: 'Start date is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                {...register('end_date', { required: 'End date is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Max Participants
              </label>
              <input
                type="number"
                {...register('max_participants', { min: 1 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Current Participants
              </label>
              <input
                type="number"
                {...register('current_participants', { min: 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Image URL
            </label>
            <input
              {...register('image_url')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Categories
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                  <label 
                    htmlFor={`category-${category.id}`}
                    className="text-sm text-slate-700 cursor-pointer"
                  >
                    {category.title}
                  </label>
                </div>
              ))}
            </div>
            {categories.length === 0 && (
              <p className="text-sm text-slate-500 italic">
                No categories available. Create categories first in the admin panel.
              </p>
            )}
          </div>

          {/* Inclusions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-700">
                Inclusions
              </label>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addInclusion}
                className="flex items-center space-x-1 px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-sm transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </motion.button>
            </div>
            <div className="space-y-2">
              {inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inclusion}
                    onChange={(e) => updateInclusion(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., Professional guide"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeInclusion(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-700">
                Exclusions
              </label>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addExclusion}
                className="flex items-center space-x-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </motion.button>
            </div>
            <div className="space-y-2">
              {exclusions.map((exclusion, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={exclusion}
                    onChange={(e) => updateExclusion(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., Personal expenses"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeExclusion(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              ))}
            </div>
          </div>

          {/* Things to Carry */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-700">
                Things to Carry
              </label>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addThingToCarry}
                className="flex items-center space-x-1 px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </motion.button>
            </div>
            <div className="space-y-2">
              {thingsToCarry.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateThingToCarry(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., Waterproof hiking boots"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeThingToCarry(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-700">
                Detailed Itinerary
              </label>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addItineraryDay}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Add Day</span>
              </motion.button>
            </div>
            
            <div className="space-y-4">
              {itinerary.map((day, dayIndex) => (
                <div key={dayIndex} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {day.day}
                      </div>
                      <input
                        value={day.title}
                        onChange={(e) => updateItineraryDay(dayIndex, 'title', e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Day title (e.g., Base Camp to Summit)"
                      />
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItineraryDay(dayIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                  
                  <div className="space-y-2">
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activity.id} className="flex items-start space-x-2 bg-slate-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 min-w-0">
                          <Clock className="h-4 w-4 text-slate-500 flex-shrink-0" />
                          <input
                            value={activity.time}
                            onChange={(e) => updateActivity(dayIndex, activityIndex, 'time', e.target.value)}
                            className="w-20 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="09:00"
                          />
                        </div>
                        <input
                          value={activity.description}
                          onChange={(e) => updateActivity(dayIndex, activityIndex, 'description', e.target.value)}
                          className="flex-1 px-3 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Activity description"
                        />
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeActivity(dayIndex, activityIndex)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </motion.button>
                      </div>
                    ))}
                    
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addActivity(dayIndex)}
                      className="w-full py-2 border-2 border-dashed border-slate-300 hover:border-blue-400 text-slate-500 hover:text-blue-600 rounded-lg transition-colors text-sm"
                    >
                      + Add Activity
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
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
              {isLoading ? 'Saving...' : trek ? 'Update Trek' : 'Create Trek'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}