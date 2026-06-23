/**
 * Stable demo image URLs for mock data.
 * Products/covers use Picsum numeric IDs (reliable, no redirects).
 * Avatars use pravatar.cc (portrait placeholders).
 */

const PICSUM_BASE = 'https://picsum.photos/id'

export function demoImage(imageId, width = 800, height = 600) {
  return `${PICSUM_BASE}/${imageId}/${width}/${height}`
}

export function demoAvatar(img = 32, size = 150) {
  return `https://i.pravatar.cc/${size}?img=${img}`
}

export const DEFAULT_AVATAR = demoAvatar(32)
export const DEFAULT_COVER = demoImage(28, 1200, 400)
export const DEFAULT_PRODUCT_IMAGE = demoImage(1, 800, 600)
export const DEMO_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'

/** Short sample clips for story testing (Google CDN, no auth). */
export const demoStoryVideos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
]

/** Vertical story image (9:16-ish). */
export function demoStoryImage(imageId) {
  return demoImage(imageId, 540, 960)
}

export const avatarPool = [
  demoAvatar(1),
  demoAvatar(3),
  demoAvatar(5),
  demoAvatar(8),
  demoAvatar(11),
  demoAvatar(12),
  demoAvatar(15),
  demoAvatar(20),
]

export const coverPool = [
  demoImage(28, 1200, 400),
  demoImage(42, 1200, 400),
  demoImage(60, 1200, 400),
  demoImage(77, 1200, 400),
]

export const productImages = [
  demoImage(1),   // smartphone / tech
  demoImage(10),  // device
  demoImage(20),  // laptop workspace
  demoImage(30),  // accessories
  demoImage(48),  // fashion
  demoImage(60),  // watch / detail
  demoImage(77),  // sneakers / street
  demoImage(96),  // interior / sofa
  demoImage(101), // vehicle / road
  demoImage(119), // camera / photo
  demoImage(160), // gaming / screen
  demoImage(180), // tablet / desk
]
