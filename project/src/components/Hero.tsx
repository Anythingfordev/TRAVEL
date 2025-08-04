import React from 'react'
import { motion } from 'framer-motion'
import { Mountain, Compass, Globe } from 'lucide-react'

export const Hero: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white py-20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              animate={{
                textShadow: [
                  "0 0 20px rgba(16, 185, 129, 0.3)",
                  "0 0 30px rgba(16, 185, 129, 0.5)",
                  "0 0 20px rgba(16, 185, 129, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Discover Your Next
              <motion.span 
                className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Adventure
              </motion.span>
            </motion.h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-8 leading-relaxed">
              Join expert-guided treks across the world's most breathtaking landscapes. 
              From mountain peaks to hidden valleys, your journey begins here.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              <Mountain className="h-8 w-8 text-yellow-300" />
              <span className="text-lg font-medium">Expert Guides</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              <Compass className="h-8 w-8 text-yellow-300" />
              <span className="text-lg font-medium">Curated Routes</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              <Globe className="h-8 w-8 text-yellow-300" />
              <span className="text-lg font-medium">Global Destinations</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              whileHover={{ 
                scale: 1.08, 
                y: -5,
                boxShadow: "0 20px 40px rgba(255, 255, 255, 0.3)",
                textShadow: "0 0 20px rgba(16, 185, 129, 0.8)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-emerald-700 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              onClick={() => {
                document.getElementById('treks')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8 }}
              />
              <span className="relative">
              Explore Treks
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 hidden lg:block"
      >
        <Mountain className="h-16 w-16 text-white/20" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-20 right-10 hidden lg:block"
      >
        <Compass className="h-12 w-12 text-white/20" />
      </motion.div>
    </motion.section>
  )
}