import React from 'react'
import { motion } from 'framer-motion'
import { Mountain, User, LogOut, Settings, Home } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { AuthModal } from './AuthModal'

interface HeaderProps {
  onAdminToggle?: () => void
  currentPage?: 'home' | 'admin'
}

export const Header: React.FC<HeaderProps> = ({ onAdminToggle, currentPage = 'home' }) => {
  const { user, isAdminUser, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = React.useState(false)

  return (
    <>
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Mountain className="h-8 w-8 text-emerald-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-slate-800">TrekZone</h1>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-3"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <User className="h-4 w-4 text-white" />
                  </motion.div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-slate-700">
                      {user.email}
                    </p>
                    {isAdminUser && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-emerald-600 font-medium"
                      >
                        Admin
                      </motion.p>
                    )}
                  </div>
                </motion.div>
                
                {isAdminUser && (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAdminToggle}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentPage === 'admin'
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
                    }`}
                  >
                    {currentPage === 'admin' ? (
                      <>
                        <Home className="h-4 w-4" />
                        <span className="hidden sm:inline">Home</span>
                      </>
                    ) : (
                      <>
                        <Settings className="h-4 w-4" />
                        <span className="hidden sm:inline">Admin</span>
                      </>
                    )}
                  </motion.button>
                )}
                
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={signOut}
                  className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-md"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
    
    {showAuthModal && (
      <AuthModal onClose={() => setShowAuthModal(false)} />
    )}
    </>
  )
}