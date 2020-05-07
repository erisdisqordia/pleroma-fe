const ChatLayout = {
  methods: {
    setChatLayout () {
      if (this.mobileLayout) {
        this.setMobileChatLayout()
      }
    },
    unsetChatLayout () {
      this.unsetMobileChatLayout()
    },
    setMobileChatLayout () {
      // This is a hacky way to adjust the global layout to the mobile chat (without modifying the rest of the app).
      // This layout prevents empty spaces from being visible at the bottom
      // of the chat on iOS Safari (`safe-area-inset`) when
      // - the on-screen keyboard appears and the user starts typing
      // - the user selects the text inside the input area
      // - the user selects and deletes the text that is multiple lines long
      // TODO: unify the chat layout with the global layout.

      let html = document.querySelector('html')
      if (html) {
        html.style.overflow = 'hidden'
        html.style.height = '100%'
      }

      let body = document.querySelector('body')
      if (body) {
        body.style.height = '100%'
      }

      let app = document.getElementById('app')
      if (app) {
        app.style.height = '100%'
        app.style.overflow = 'hidden'
        app.style.minHeight = 'auto'
      }

      let appBgWrapper = window.document.getElementById('app_bg_wrapper')
      if (appBgWrapper) {
        appBgWrapper.style.overflow = 'hidden'
      }

      let main = document.getElementsByClassName('main')[0]
      if (main) {
        main.style.overflow = 'hidden'
        main.style.height = '100%'
      }

      let content = document.getElementById('content')
      if (content) {
        content.style.paddingTop = '0'
        content.style.height = '100%'
        content.style.overflow = 'visible'
      }

      this.$nextTick(() => {
        this.updateScrollableContainerHeight()
      })
    },
    unsetMobileChatLayout () {
      let html = document.querySelector('html')
      if (html) {
        html.style.overflow = 'visible'
        html.style.height = 'unset'
      }

      let body = document.querySelector('body')
      if (body) {
        body.style.height = 'unset'
      }

      let app = document.getElementById('app')
      if (app) {
        app.style.height = '100%'
        app.style.overflow = 'visible'
        app.style.minHeight = '100vh'
      }

      let appBgWrapper = document.getElementById('app_bg_wrapper')
      if (appBgWrapper) {
        appBgWrapper.style.overflow = 'visible'
      }

      let main = document.getElementsByClassName('main')[0]
      if (main) {
        main.style.overflow = 'visible'
        main.style.height = 'unset'
      }

      let content = document.getElementById('content')
      if (content) {
        content.style.paddingTop = '60px'
        content.style.height = 'unset'
        content.style.overflow = 'unset'
      }
    }
  }
}

export default ChatLayout
