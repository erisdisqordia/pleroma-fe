import Vue from 'vue'

import './tab_switcher.scss'

export default Vue.component('tab-switcher', {
  name: 'TabSwitcher',
  props: ['renderOnlyFocused', 'onSwitch', 'customActive'],
  data () {
    return {
      active: this.$slots.default.findIndex(_ => _.tag)
    }
  },
  beforeUpdate () {
    const currentSlot = this.$slots.default[this.active]
    if (!currentSlot.tag) {
      this.active = this.$slots.default.findIndex(_ => _.tag)
    }
  },
  methods: {
    activateTab (index, dataset) {
      return () => {
        if (typeof this.onSwitch === 'function') {
          this.onSwitch.call(null, index, this.$slots.default[index].elm.dataset)
        }
        this.active = index
      }
    },
    isActiveTab (index) {
      const customActiveIndex = this.$slots.default.findIndex(slot => {
        const dataFilter = slot.data && slot.data.attrs && slot.data.attrs['data-filter']
        return this.customActive && this.customActive === dataFilter
      })

      return customActiveIndex > -1 ? customActiveIndex === index : index === this.active
    }
  },
  render (h) {
    const tabs = this.$slots.default
      .map((slot, index) => {
        if (!slot.tag) return
        const classesTab = ['tab']
        const classesWrapper = ['tab-wrapper']

        if (this.isActiveTab(index)) {
          classesTab.push('active')
          classesWrapper.push('active')
        }
        if (slot.data.attrs.image) {
          return (
            <div class={ classesWrapper.join(' ')}>
              <button
                disabled={slot.data.attrs.disabled}
                onClick={this.activateTab(index)}
                class={classesTab.join(' ')}>
                <img src={slot.data.attrs.image} title={slot.data.attrs['image-tooltip']}/>
                {slot.data.attrs.label ? '' : slot.data.attrs.label}
              </button>
            </div>
          )
        }
        return (
          <div class={ classesWrapper.join(' ')}>
            <button
              disabled={slot.data.attrs.disabled}
              onClick={this.activateTab(index)}
              class={classesTab.join(' ')}>
              {slot.data.attrs.label}</button>
          </div>
        )
      })

    const contents = this.$slots.default.map((slot, index) => {
      if (!slot.tag) return
      const active = index === this.active
      if (this.renderOnlyFocused) {
        return active
          ? <div class="active">{slot}</div>
          : <div class="hidden"></div>
      }
      return <div class={active ? 'active' : 'hidden' }>{slot}</div>
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
