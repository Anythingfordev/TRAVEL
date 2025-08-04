import React from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  DollarSign, 
  Mountain, 
  Calendar,
  Shield,
  X,
  CheckCircle,
  XCircle,
  Route,
  Sunrise,
  Camera,
  Heart
} from 'lucide-react'
import { Trek } from '../types'
import { EnquiryForm } from '../components/EnquiryForm'

interface TrekDetailsPageProps {
  trek: Trek
  onNavigateBack: () => void
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800 border-green-200',
  Moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Hard: 'bg-orange-100 text-orange-800 border-orange-200',
  Expert: 'bg-red-100 text-red-800 border-red-200'
}

const difficultyIcons = {
  Easy: '🌱',
  Moderate: '⚡',
  Hard: '🔥',
  Expert: '💀'
}

export const TrekDetailsPage: React.FC<TrekDetailsPageProps> = ({ trek, onNavigateBack }) => {
  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
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
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateBack}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Treks</span>
            </motion.button>
            
            <div className="flex items-center space-x-2">
              <Mountain className="h-6 w-6 text-emerald-600" />
              <span className="text-lg font-bold text-slate-800">TrekZone</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="relative h-96 md:h-[500px] overflow-hidden"
      >
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={trek.image_url} 
          alt={trek.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${difficultyColors[trek.difficulty]} bg-white/90`}>
                <span className="mr-2">{difficultyIcons[trek.difficulty]}</span>
                {trek.difficulty}
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <DollarSign className="h-5 w-5" />
                <span className="font-bold text-lg">${trek.price}</span>
                <span className="text-sm opacity-80">/person</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {trek.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-emerald-300" />
                <span>{trek.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-300" />
                <span>{trek.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-300" />
                <span>{trek.current_participants}/{trek.max_participants} participants</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center border border-slate-100"
          >
            <MapPin className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
            <p className="text-sm text-slate-600 mb-1">Location</p>
            <p className="font-bold text-slate-800">{trek.location}</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center border border-slate-100"
          >
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <p className="text-sm text-slate-600 mb-1">Duration</p>
            <p className="font-bold text-slate-800">{trek.duration}</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center border border-slate-100"
          >
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <p className="text-sm text-slate-600 mb-1">Participants</p>
            <p className="font-bold text-slate-800">{trek.current_participants}/{trek.max_participants}</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center border border-slate-100"
          >
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
            <p className="text-sm text-slate-600 mb-1">Rating</p>
            <p className="font-bold text-slate-800">4.8/5</p>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg p-8 border border-slate-100"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <Mountain className="h-6 w-6 mr-3 text-emerald-600" />
                About This Trek
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {trek.description}
              </p>
            </motion.div>

            {/* Itinerary */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg p-8 border border-slate-100"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <Route className="h-6 w-6 mr-3 text-emerald-600" />
                Detailed Itinerary
              </h2>
              
              {trek.itinerary && trek.itinerary.length > 0 ? (
                <div className="space-y-6">
                  {trek.itinerary.map((day, dayIndex) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: dayIndex * 0.1 }}
                      className="border-l-4 border-emerald-500 pl-6 pb-6"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {day.day}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">{day.title}</h3>
                      </div>
                      
                      <div className="space-y-3">
                        {day.activities.map((activity, actIndex) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (dayIndex * 0.1) + (actIndex * 0.05) }}
                            className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-2 min-w-0">
                              <Sunrise className="h-4 w-4 text-orange-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                                {activity.time}
                              </span>
                            </div>
                            <p className="text-slate-600 flex-1">{activity.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Route className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Detailed itinerary will be provided soon.</p>
                </div>
              )}
            </motion.div>

            {/* Inclusions & Exclusions */}
            <motion.div
              variants={itemVariants}
              className="grid md:grid-cols-2 gap-6 mb-8"
            >
              {/* Inclusions */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                  <CheckCircle className="h-6 w-6 mr-3 text-emerald-600" />
                  Inclusions
                </h3>
                
                {trek.inclusions && trek.inclusions.length > 0 ? (
                  <div className="space-y-3">
                    {trek.inclusions.map((inclusion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                        <p className="text-slate-600 leading-relaxed">{inclusion.trim()}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Inclusions will be updated soon.</p>
                )}
              </div>

              {/* Exclusions */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                  <XCircle className="h-6 w-6 mr-3 text-red-600" />
                  Exclusions
                </h3>
                
                {trek.exclusions && trek.exclusions.length > 0 ? (
                  <div className="space-y-3">
                    {trek.exclusions.map((exclusion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                        <p className="text-slate-600 leading-relaxed">{exclusion.trim()}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Exclusions will be updated soon.</p>
                )}
              </div>
            </motion.div>

            {/* Things to Carry */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg p-8 border border-slate-100 mb-8"
            >
              <div className="max-w-4xl mx-auto">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-purple-600" />
                  Things to Carry
                </h3>
                
                {trek.things_to_carry && trek.things_to_carry.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {trek.things_to_carry.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-100"
                      >
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                        <p className="text-slate-600 leading-relaxed">{item.trim()}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 italic">Things to carry will be updated soon.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg p-6 border border-slate-100"
            >
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-slate-800 mb-2">
                  ₹{trek.price}
                  <span className="text-lg text-slate-500 font-normal"> /person</span>
                </div>
                <p className="text-slate-600">
                  {trek.max_participants - trek.current_participants} spots remaining
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Booking Progress</span>
                  <span className="text-sm font-medium text-slate-800">
                    {Math.round((trek.current_participants / trek.max_participants) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <motion.div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(trek.current_participants / trek.max_participants) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-4 mb-6">
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <p className="text-emerald-600 font-medium mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Start Date
                  </p>
                  <p className="text-slate-800 font-semibold">{formatFullDate(trek.start_date)}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-600 font-medium mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    End Date
                  </p>
                  <p className="text-slate-800 font-semibold">{formatFullDate(trek.end_date)}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={trek.current_participants >= trek.max_participants}
              >
                {trek.current_participants >= trek.max_participants ? (
                  <>
                    <X className="h-5 w-5 inline mr-2" />
                    Fully Booked
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5 inline mr-2" />
                    Book This Trek
                  </>
                )}
              </motion.button>

              <p className="text-xs text-slate-500 text-center mt-4">
                Free cancellation up to 48 hours before departure
              </p>
            </motion.div>

            {/* Enquiry Form */}
            <motion.div variants={itemVariants}>
              <EnquiryForm trek={trek} />
            </motion.div>

            {/* Quick Info */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200"
            >
              <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-emerald-600" />
                Trek Highlights
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Camera className="h-4 w-4 text-blue-600" />
                  <span className="text-slate-600">Professional photography included</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-slate-600">Certified safety equipment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-slate-600">Expert local guides</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span className="text-slate-600">4.8/5 average rating</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}