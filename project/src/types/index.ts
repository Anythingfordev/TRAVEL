export interface Trek {
  id: string
  title: string
  description: string
  location: string
  duration: string
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Expert'
  price: number
  image_url: string
  start_date: string
  end_date: string
  max_participants: number
  current_participants: number
  inclusions: string[]
  exclusions: string[]
  things_to_carry: string[]
  itinerary: ItineraryDay[]
  created_at: string
  created_by: string
}

export interface ItineraryDay {
  day: number
  title: string
  activities: ItineraryActivity[]
}

export interface ItineraryActivity {
  id: string
  time: string
  description: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
}

export interface Category {
  id: string
  title: string
  description: string
  is_active: boolean
  created_at: string
  created_by: string
}

export interface TrekCategory {
  id: string
  trek_id: string
  category_id: string
  created_at: string
}

export interface Enquiry {
  id: string
  trek_id: string
  name: string
  email: string
  phone: string
  message: string
  status: 'pending' | 'responded' | 'closed'
  created_at: string
  trek?: Trek
}