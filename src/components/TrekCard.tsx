import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Clock, Users, DollarSign, X, Star, Shield, Camera, Mountain } from 'lucide-react'
import { Trek } from '../types'

interface TrekCardProps {
  trek: Trek
  index: number
  onViewDetails: () => void
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800',
  Moderate: 'bg-yellow-100 text-yellow-800',
  Hard: 'bg-orange-100 text-orange-800',
  Expert: 'bg-red-100 text-red-800'
}

const difficultyIcons = {
  Easy: '🌱',
  Moderate: '⚡',
  Hard: '🔥',
  Expert: '💀'
}

export const TrekCard: React.FC<TrekCardProps> = ({ trek, index, onViewDetails }) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  }

  const hoverVariants = {
    hover: { 
      y: -4, 
      transition: { duration: 0.2, ease: "easeOut" }
    }
  }

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        whileHover="hover"
        variants={hoverVariants}
        className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer relative"
        style={{ willChange: 'transform' }}
      >
        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.3), rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.3))',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Content wrapper */}
        <div className="relative bg-white rounded-xl m-0.5">
        <div className="relative overflow-hidden">
          <motion.img 
            src={trek.image_url} 
            alt={trek.title}
            className="w-full h-48 object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{
              background: [
                "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.1), transparent)",
                "linear-gradient(to top, rgba(16,185,129,0.2), rgba(0,0,0,0.1), transparent)",
                "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.1), transparent)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <motion.div 
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${difficultyColors[trek.difficulty]}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05, type: "spring", stiffness: 200 }}
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.5 }
            }}
          >
            <span className="mr-1">{difficultyIcons[trek.difficulty]}</span>
            {trek.difficulty}
          </motion.div>
          
          <motion.div
            className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)"
            }}
          >
            <div className="flex items-center space-x-1">
              <span className="text-xs font-bold text-emerald-600">₹</span>
              <span className="text-sm font-bold text-slate-800">{trek.price}</span>
            </div>
          </motion.div>
        </div>
        
        <div className="p-6">
          <motion.h3 
            className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors duration-200"
            whileHover={{
              scale: 1.02,
              textShadow: "0 0 8px rgba(16, 185, 129, 0.3)"
            }}
          >
            {trek.title}
          </motion.h3>
          
          <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed">
            {trek.description}
          </p>
          
          <div className="space-y-2 mb-4">
            <motion.div 
              className="flex items-center text-slate-500 text-sm"
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
            >
              <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
              <span>{trek.location}</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center text-slate-500 text-sm"
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
            >
              <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
              <span>{formatDate(trek.start_date)} - {formatDate(trek.end_date)}</span>
            </motion.div>
            
            <div className="flex items-center justify-between text-sm">
              <motion.div 
                className="flex items-center text-slate-500"
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
              >
                <Clock className="h-4 w-4 mr-2 text-emerald-600" />
                <span>{trek.duration}</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center text-slate-500"
                whileHover={{ x: -5, transition: { duration: 0.2 } }}
              >
                <Users className="h-4 w-4 mr-2 text-emerald-600" />
                <span>{trek.current_participants}/{trek.max_participants}</span>
              </motion.div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-2 flex-1 mr-4">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(trek.current_participants / trek.max_participants) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.05 }}
                  whileHover={{
                    boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)",
                    transition: { duration: 0.3 }
                  }}
                />
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap">
                {Math.round((trek.current_participants / trek.max_participants) * 100)}%
              </span>
            </div>
            
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
              onClick={onViewDetails}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative">
              View Details
              </span>
            </motion.button>
          </div>
        </div>
        </div>
      </motion.div>
    </>
  )
}