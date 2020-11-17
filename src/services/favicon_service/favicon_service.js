import { find } from 'lodash'

const createFaviconService = () => {
  let favimg, favcanvas, favcontext, favicon
  const faviconWidth = 128
  const faviconHeight = 128
  const badgeRadius = 32

  const initFaviconService = () => {
    const nodes = document.getElementsByTagName('link')
    favicon = find(nodes, node => node.rel === 'icon')
    if (favicon) {
      favcanvas = document.createElement('canvas')
      favcanvas.width = faviconWidth
      favcanvas.height = faviconHeight
      favimg = new Image()
      favimg.src = favicon.href
      favcontext = favcanvas.getContext('2d')
    }
  }

  const isImageLoaded = (img) => img.complete && img.naturalHeight !== 0

  const clearFaviconBadge = () => {
    if (!favimg || !favcontext || !favicon) return

    favcontext.clearRect(0, 0, faviconWidth, faviconHeight)
    if (isImageLoaded(favimg)) {
      favcontext.drawImage(favimg, 0, 0, favimg.width, favimg.height, 0, 0, faviconWidth, faviconHeight)
    }
    favicon.href = favcanvas.toDataURL('image/png')
  }

  const drawFaviconBadge = () => {
    if (!favimg || !favcontext || !favcontext) return

    clearFaviconBadge()

    const style = getComputedStyle(document.body)
    const badgeColor = `${style.getPropertyValue('--badgeNotification') || 'rgb(240, 100, 100)'}`

    if (isImageLoaded(favimg)) {
      favcontext.drawImage(favimg, 0, 0, favimg.width, favimg.height, 0, 0, faviconWidth, faviconHeight)
    }
    favcontext.fillStyle = badgeColor
    favcontext.beginPath()
    favcontext.arc(faviconWidth - badgeRadius, badgeRadius, badgeRadius, 0, 2 * Math.PI, false)
    favcontext.fill()
    favicon.href = favcanvas.toDataURL('image/png')
  }

  return {
    initFaviconService,
    clearFaviconBadge,
    drawFaviconBadge
  }
}

const FaviconService = createFaviconService()

export default FaviconService
