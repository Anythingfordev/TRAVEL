import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  MessageCircle, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Eye,
  CheckCircle,
  Clock,
  X,
  Filter,
  Search,
  Trash2
} from 'lucide-react'
import { useEnquiries } from '../hooks/useEnquiries'
import { Enquiry } from '../types'

interface ManageEnquiriesPageProps {
  onNavigateBack: () => void
}

export const ManageEnquiriesPage: React.FC<ManageEnquiriesPageProps> = ({ onNavigateBack }) => {
  const { enquiries, loading, updateEnquiryStatus, deleteEnquiry } = useEnquiries()
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'responded' | 'closed'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter
    const matchesSearch = searchTerm === '' || 
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.trek?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const handleStatusUpdate = async (id: string, status: Enquiry['status']) => {
    await updateEnquiryStatus(id, status)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      await deleteEnquiry(id)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'responded':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'closed':
        return 'bg-slate-100 text-slate-600 border-slate-200'
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'responded':
        return <CheckCircle className="h-4 w-4" />
      case 'closed':
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
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
                  <MessageCircle className="h-8 w-8 text-emerald-600" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Manage Enquiries</h1>
                  <p className="text-sm text-slate-600">View and respond to customer enquiries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-800">{enquiries.length}</p>
                <p className="text-blue-600 font-medium">Total Enquiries</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-yellow-800">
                  {enquiries.filter(e => e.status === 'pending').length}
                </p>
                <p className="text-yellow-600 font-medium">Pending</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-800">
                  {enquiries.filter(e => e.status === 'responded').length}
                </p>
                <p className="text-green-600 font-medium">Responded</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <X className="h-8 w-8 text-slate-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800">
                  {enquiries.filter(e => e.status === 'closed').length}
                </p>
                <p className="text-slate-600 font-medium">Closed</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6 border border-slate-100 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or trek..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Enquiries List */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
              <MessageCircle className="h-6 w-6 text-emerald-600" />
              <span>Enquiries ({filteredEnquiries.length})</span>
            </h3>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading enquiries...</p>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="p-12 text-center">
              <MessageCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-slate-600 mb-2">No enquiries found</h4>
              <p className="text-slate-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Enquiries will appear here when customers send them.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredEnquiries.map((enquiry, index) => (
                <motion.div
                  key={enquiry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-slate-500" />
                          <span className="font-semibold text-slate-800">{enquiry.name}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(enquiry.status)} flex items-center space-x-1`}>
                          {getStatusIcon(enquiry.status)}
                          <span className="capitalize">{enquiry.status}</span>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Mail className="h-4 w-4" />
                            <span>{enquiry.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Phone className="h-4 w-4" />
                            <span>{enquiry.phone}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {enquiry.trek && (
                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                              <MapPin className="h-4 w-4" />
                              <span>{enquiry.trek.title}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(enquiry.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {enquiry.message}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      
                      {enquiry.status === 'pending' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleStatusUpdate(enquiry.id, 'responded')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark as Responded"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(enquiry.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2 mt-4">
                    {enquiry.status !== 'responded' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusUpdate(enquiry.id, 'responded')}
                        className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        Mark Responded
                      </motion.button>
                    )}
                    
                    {enquiry.status !== 'closed' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusUpdate(enquiry.id, 'closed')}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        Close
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Enquiry Detail Modal */}
      <AnimatePresence>
        {selectedEnquiry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEnquiry(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Enquiry Details</h2>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700">{selectedEnquiry.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700">{selectedEnquiry.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700">{selectedEnquiry.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3">Enquiry Details</h3>
                    <div className="space-y-2">
                      {selectedEnquiry.trek && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-700">{selectedEnquiry.trek.title}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700">
                          {new Date(selectedEnquiry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedEnquiry.status)} flex items-center space-x-1`}>
                          {getStatusIcon(selectedEnquiry.status)}
                          <span className="capitalize">{selectedEnquiry.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Message</h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedEnquiry.message}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 pt-4 border-t border-slate-200">
                  {selectedEnquiry.status !== 'responded' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleStatusUpdate(selectedEnquiry.id, 'responded')
                        setSelectedEnquiry(null)
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Mark as Responded
                    </motion.button>
                  )}
                  
                  {selectedEnquiry.status !== 'closed' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleStatusUpdate(selectedEnquiry.id, 'closed')
                        setSelectedEnquiry(null)
                      }}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Close Enquiry
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}