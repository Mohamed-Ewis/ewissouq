// Brand & app constants
export const APP_NAME = 'EwiSSouq'

export const PRODUCT_CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
  { value: 'refurbished', label: 'Refurbished' },
]

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'likes', label: 'Most Liked' },
]

export const COUNTRIES = [
  { value: 'ae', label: 'United Arab Emirates' },
  { value: 'sa', label: 'Saudi Arabia' },
  { value: 'eg', label: 'Egypt' },
  { value: 'jo', label: 'Jordan' },
]

export const CITIES = {
  ae: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'],
  sa: ['Riyadh', 'Jeddah', 'Dammam', 'Mecca'],
  eg: ['Cairo', 'Alexandria', 'Giza', 'Luxor'],
  jo: ['Amman', 'Zarqa', 'Irbid', 'Aqaba'],
}

export const AREAS = {
  Dubai: ['Downtown', 'Marina', 'JBR', 'Business Bay', 'Deira'],
  'Abu Dhabi': ['Corniche', 'Yas Island', 'Al Reem', 'Khalifa City'],
  Riyadh: ['Olaya', 'Malaz', 'Al Nakheel', 'King Fahd'],
  Cairo: ['Zamalek', 'Maadi', 'Heliopolis', 'Nasr City'],
  Amman: ['Abdoun', 'Sweifieh', 'Jabal Amman', 'Shmeisani'],
}

export const TOKEN_KEY = 'ewissouq_access_token'
export const REFRESH_TOKEN_KEY = 'ewissouq_refresh_token'
export const USER_KEY = 'ewissouq_user'

export const PAGE_SIZE = 12
