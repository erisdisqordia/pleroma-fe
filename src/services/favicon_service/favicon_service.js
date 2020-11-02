import { find } from 'lodash'

const createFaviconService = () => {
  let favimg, favcanvas, favcontext, favicon
  const faviconWidth = 48
  const faviconHeight = 48
  const badgeRadius = 14

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

  const clearFaviconBadge = () => {
    if (!favimg || !favcontext || !favicon) return

    favcontext.clearRect(0, 0, faviconWidth, faviconHeight)
    favcontext.drawImage(favimg, 0, 0, favimg.width, favimg.height, 0, 0, faviconWidth, faviconHeight)
    favicon.href = favcanvas.toDataURL('image/png')
  }

  const drawFaviconBadge = () => {
    if (!favimg || !favcontext || !favcontext) return

    clearFaviconBadge()

    const style = getComputedStyle(document.body)
    const badgeColor = `${style.getPropertyValue('--badgeNotification') || 'rgb(240, 100, 100)'}`

    favcontext.drawImage(favimg, 0, 0, favimg.width, favimg.height, 0, 0, faviconWidth, faviconHeight)
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
