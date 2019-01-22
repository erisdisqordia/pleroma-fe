import Vue from 'vue'

import './tab_switcher.scss'

export default Vue.component('tab-switcher', {
  name: 'TabSwitcher',
  data () {
    return {
      active: this.$slots.default.findIndex(_ => _.tag)
    }
  },
  methods: {
    activateTab (index) {
      return () => {
        this.active = index
      }
    }
  },
  beforeUpdate () {
    const currentSlot = this.$slots.default[this.active]
    if (!currentSlot.tag) {
      this.active = this.$slots.default.findIndex(_ => _.tag)
    }
  },
  render (h) {
    const tabs = this.$slots.default
          .map((slot, index) => {
            if (!slot.tag) return
            const classesTab = ['tab']
            const classesWrapper = ['tab-wrapper']

            if (index === this.active) {
              classesTab.push('active')
              classesWrapper.push('active')
            }

            return (
              <div class={ classesWrapper.join(' ')}>
                <button onClick={this.activateTab(index)} class={ classesTab.join(' ') }>{slot.data.attrs.label}</button>
              </div>
            )
          })

    const contents = this.$slots.default.map((slot, index) => {
      if (!slot.tag) return
      const active = index === this.active
      return (
        <div class={active ? 'active' : 'hidden'}>
          {slot}
        </div>
      )
    })

    return (
      <div class="tab-switcher">
        <div class="tabs">
          {tabs}
        </div>
        <div class="contents">
          {contents}
        </div>
      </div>
    )
  }
})
