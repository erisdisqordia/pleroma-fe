import { find } from 'lodash'

const createFaviconService = () => {
  let favimg, favcanvas, favcontext, favicon
  const faviconWidth = 48
  const faviconHeight = 48
  const strokeColor = 'rgb(200, 0, 0)'
  const fillColor = 'rgb(255, 90, 90)'
  const badgeRadius = 12

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

    favcontext.drawImage(favimg, 0, 0, favimg.width, favimg.height, 0, 0, faviconWidth, faviconHeight)
    favcontext.fillStyle = fillColor
    favcontext.strokeStyle = strokeColor
    favcontext.beginPath()
    favcontext.arc(faviconWidth - badgeRadius, faviconHeight - badgeRadius, badgeRadius, 0, 2 * Math.PI, false)
    favcontext.fill()
    favcontext.stroke()
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
