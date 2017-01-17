const setStyle = (href) => {
  /***
      What's going on here?
      I want to make it easy for admins to style this application. To have
      a good set of default themes, I chose the system from base16
      (https://chriskempson.github.io/base16/) to style all elements. They
      all have the base00..0F classes. So the only thing an admin needs to
      do to style Pleroma is to change these colors in that one css file.
      Some default things (body text color, link color) need to be set dy-
      namically, so this is done here by waiting for the stylesheet to be
      loaded and then creating an element with the respective classes.

      It is a bit weird, but should make life for admins somewhat easier.
  ***/
  const head = document.head
  const body = document.body
  body.style.display = 'none'
  const cssEl = document.createElement('link')
  cssEl.setAttribute('rel', 'stylesheet')
  cssEl.setAttribute('href', href)
  head.appendChild(cssEl)

  const setDynamic = () => {
    const baseEl = document.createElement('div')
    baseEl.setAttribute('class', 'base05')
    const base05Color = window.getComputedStyle(baseEl).getPropertyValue('color')
    baseEl.setAttribute('class', 'base08')
    const base08Color = window.getComputedStyle(baseEl).getPropertyValue('color')
    const styleEl = document.createElement('style')
    head.appendChild(styleEl)
    const styleSheet = styleEl.sheet

    styleSheet.insertRule(`a { color: ${base08Color}`, 'index-max')
    styleSheet.insertRule(`body { color: ${base05Color}`, 'index-max')
    styleSheet.insertRule(`.base05-border { color: ${base05Color}`, 'index-max')
    body.style.display = 'initial'
  }
  cssEl.addEventListener('load', setDynamic)
}

const StyleSetter = {
  setStyle
}

export default StyleSetter
