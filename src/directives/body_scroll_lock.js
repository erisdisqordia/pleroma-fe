import * as bodyScrollLock from 'body-scroll-lock'

let previousNavPaddingRight
let previousAppBgWrapperRight
const lockerEls = new Set([])

const disableBodyScroll = (el) => {
  const scrollBarGap = window.innerWidth - document.documentElement.clientWidth
  bodyScrollLock.disableBodyScroll(el, {
    reserveScrollBarGap: true
  })
  lockerEls.add(el)
  setTimeout(() => {
    if (lockerEls.size <= 1) {
      // If previousNavPaddingRight is already set, don't set it again.
      if (previousNavPaddingRight === undefined) {
        const navEl = document.getElementById('nav')
        previousNavPaddingRight = window.getComputedStyle(navEl).getPropertyValue('padding-right')
        navEl.style.paddingRight = previousNavPaddingRight ? `calc(${previousNavPaddingRight} + ${scrollBarGap}px)` : `${scrollBarGap}px`
      }
      // If previousAppBgWrapeprRight is already set, don't set it again.
      if (previousAppBgWrapperRight === undefined) {
        const appBgWrapperEl = document.getElementById('app_bg_wrapper')
        previousAppBgWrapperRight = window.getComputedStyle(appBgWrapperEl).getPropertyValue('right')
        appBgWrapperEl.style.right = previousAppBgWrapperRight ? `calc(${previousAppBgWrapperRight} + ${scrollBarGap}px)` : `${scrollBarGap}px`
      }
      document.body.classList.add('scroll-locked')
    }
  })
}

const enableBodyScroll = (el) => {
  lockerEls.delete(el)
  setTimeout(() => {
    if (lockerEls.size === 0) {
      if (previousNavPaddingRight !== undefined) {
        document.getElementById('nav').style.paddingRight = previousNavPaddingRight
        // Restore previousNavPaddingRight to undefined so disableBodyScroll knows it can be set again.
        previousNavPaddingRight = undefined
      }
      if (previousAppBgWrapperRight !== undefined) {
        document.getElementById('app_bg_wrapper').style.right = previousAppBgWrapperRight
        // Restore previousAppBgWrapperRight to undefined so disableBodyScroll knows it can be set again.
        previousAppBgWrapperRight = undefined
      }
      document.body.classList.remove('scroll-locked')
    }
  })
  bodyScrollLock.enableBodyScroll(el)
}

const directive = {
  inserted: (el, binding) => {
    if (binding.value) {
      disableBodyScroll(el)
    }
  },
  componentUpdated: (el, binding) => {
    if (binding.oldValue === binding.value) {
      return
    }

    if (binding.value) {
      disableBodyScroll(el)
    } else {
      enableBodyScroll(el)
    }
  },
  unbind: (el) => {
    enableBodyScroll(el)
  }
}

export default (Vue) => {
  Vue.directive('body-scroll-lock', directive)
}
