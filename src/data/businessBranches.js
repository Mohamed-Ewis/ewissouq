/** Generate realistic branch networks for large retailers */

const CAIRO_AREAS = [
  'Nasr City', 'Maadi', 'Heliopolis', 'Zamalek', 'Mohandessin', '6th October',
  'New Cairo', 'Shorouk', 'Rehab', 'Obour', 'Downtown', 'Garden City',
  'Mokattam', 'Tagamoa', 'Sheraton', 'Abbassia', 'Faisal', 'Haram',
]

const ALEX_AREAS = ['Smouha', 'Stanley', 'Sidi Gaber', 'Miami', 'Agami', 'Roushdy']
const GIZA_AREAS = ['6th October', 'Sheikh Zayed', 'Dokki', 'Mohandessin', 'Haram']
const DUBAI_AREAS = ['Deira', 'Al Barsha', 'JBR', 'Marina', 'Jebel Ali', 'Mirdif', 'Silicon Oasis', 'Downtown', 'Al Quoz', 'Bur Dubai']
const SHARJAH_AREAS = ['Al Nahda', 'Muwaileh', 'Rolla']

function branch(id, name, city, area, phone, open, close) {
  return {
    id,
    name,
    city,
    area,
    address: `${area}, ${city}`,
    phone: phone || '+20 100 000 0000',
    hours: { open: open || '10:00', close: close || '22:00' },
    isFlagship: false,
  }
}

function generateCityBranches(startId, prefix, city, areas, count, phonePrefix) {
  const list = []
  for (let i = 0; i < count; i++) {
    const area = areas[i % areas.length]
    list.push(branch(
      startId + i,
      `${prefix} ${area}`,
      city,
      area,
      `${phonePrefix}${String(i + 1).padStart(3, '0')}`,
    ))
  }
  return list
}

export const businessBranches = {
  1: [ // B.Tech — 28 branches
    { ...branch(101, 'B.Tech Nasr City HQ', 'Cairo', 'Nasr City', '+20 19999', '10:00', '23:00'), isFlagship: true },
    ...generateCityBranches(102, 'B.Tech', 'Cairo', CAIRO_AREAS, 18, '+20 199'),
    ...generateCityBranches(120, 'B.Tech', 'Alexandria', ALEX_AREAS, 6, '+20 198'),
    ...generateCityBranches(126, 'B.Tech', 'Giza', GIZA_AREAS, 4, '+20 197'),
  ],
  2: [ // Carrefour — 22 branches
    { ...branch(201, 'Carrefour City Stars', 'Cairo', 'Nasr City', '+20 16001', '08:00', '00:00'), isFlagship: true },
    branch(202, 'Carrefour Mall of Egypt', 'Giza', '6th October', '+20 16002', '08:00', '00:00'),
    ...generateCityBranches(203, 'Carrefour', 'Cairo', CAIRO_AREAS, 12, '+20 160'),
    ...generateCityBranches(215, 'Carrefour', 'Alexandria', ALEX_AREAS, 4, '+20 161'),
    ...generateCityBranches(219, 'Carrefour', 'Giza', GIZA_AREAS, 4, '+20 162'),
  ],
  3: [
    branch(301, 'IKEA Cairo Festival City', 'Cairo', 'New Cairo', '+20 19900', '10:00', '22:00'),
  ],
  4: [ // Virgin — 10 UAE
    branch(401, 'Virgin Mall of Emirates', 'Dubai', 'Al Barsha', '+971 4 000 0001'),
    ...generateCityBranches(402, 'Virgin', 'Dubai', DUBAI_AREAS, 8, '+971 4 000 '),
    branch(410, 'Virgin Sahara Centre', 'Sharjah', 'Al Nahda', '+971 6 000 0001'),
  ],
  5: [
    branch(501, 'Mobile Shop Maadi', 'Cairo', 'Maadi', '+20 100 000 0001', '11:00', '21:00'),
  ],
  6: [
    branch(601, 'El Araby Tanta HQ', 'Tanta', 'Industrial', '+20 16222'),
    branch(602, 'El Araby Cairo Showroom', 'Cairo', 'Nasr City', '+20 16223'),
    branch(603, 'El Araby Alexandria', 'Alexandria', 'Smouha', '+20 16224'),
  ],
  7: [
    branch(701, 'Home Centre Ibn Battuta', 'Dubai', 'Jebel Ali', '+971 4 111 0001'),
    branch(702, 'Home Centre Mall of Emirates', 'Dubai', 'Al Barsha', '+971 4 111 0002'),
    branch(703, 'Home Centre Mirdif', 'Dubai', 'Mirdif', '+971 4 111 0003'),
  ],
  8: [ // Sharaf DG — 14 UAE
    branch(801, 'Sharaf DG Times Square', 'Dubai', 'Deira', '+971 600 502030'),
    ...generateCityBranches(802, 'Sharaf DG', 'Dubai', DUBAI_AREAS, 10, '+971 600 502'),
    ...generateCityBranches(812, 'Sharaf DG', 'Sharjah', SHARJAH_AREAS, 3, '+971 600 503'),
  ],
}

export function getBranchesForBusiness(businessId) {
  return businessBranches[businessId] || []
}

export function groupBranchesByCity(branches) {
  const map = {}
  for (const b of branches) {
    if (!map[b.city]) map[b.city] = []
    map[b.city].push(b)
  }
  return Object.entries(map)
    .map(([city, items]) => ({ city, branches: items, count: items.length }))
    .sort((a, b) => b.count - a.count)
}

export function getBranchCities(branches) {
  const cities = [...new Set(branches.map((b) => b.city))]
  return cities.sort()
}
