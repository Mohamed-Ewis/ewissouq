/**
 * Stable Unsplash CDN URLs for mock/demo content (no redirects, no broken seeds).
 */
export function demoImage(photoId, width = 800, height = 600) {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`
}

export const DEFAULT_AVATAR = demoImage('1472099645785-5658abf4ff4e', 150, 150)
export const DEFAULT_COVER = demoImage('1441986300917-64674bd600d8', 1200, 400)
export const DEFAULT_PRODUCT_IMAGE = demoImage('1511707171634-5f897ff02aa9', 800, 600)
export const DEMO_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'

export const avatarPool = [
  demoImage('1507003211169-0a1dd7228f2d', 150, 150),
  demoImage('1494790108377-be9c29b29330', 150, 150),
  demoImage('1500648767791-00dcc994a43e', 150, 150),
  demoImage('1438761681033-6461ffad8d80', 150, 150),
  demoImage('1472099645785-5658abf4ff4e', 150, 150),
  demoImage('1517841905240-472988babdf9', 150, 150),
  demoImage('1534528741775-53994a69daeb', 150, 150),
  demoImage('1527982315083-2e54d983ddad', 150, 150),
]

export const coverPool = [
  demoImage('1441986300917-64674bd600d8', 1200, 400),
  demoImage('1557804506-669a67965ba0', 1200, 400),
  demoImage('1469474968028-56623f02e42e', 1200, 400),
  demoImage('1504384308090-c894fdcc538d', 1200, 400),
]

export const productImages = [
  demoImage('1511707171634-5f897ff02aa9'), // smartphone
  demoImage('1610945265464-25f22d24ec31'), // mobile tech
  demoImage('1517336714731-489689fd1ca8'), // laptop
  demoImage('1505740420928-5e560c06d30e'), // headphones
  demoImage('1584917865442-89aaaaf32d53'), // handbag
  demoImage('1523275335684-37898b6baf30'), // watch
  demoImage('1542291026-7eec264c27ff'), // sneakers
  demoImage('1555041469-a586c61ea9bc'), // sofa
  demoImage('1494976388531-d1058494cdd8'), // car
  demoImage('1526170375885-4d8ecf77b99f'), // camera
  demoImage('1486401897074-25bcd3253973'), // gaming console
  demoImage('1544244015-0df4b3ffc6b0'), // tablet
]
