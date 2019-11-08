import Vue from 'vue'

import './tab_switcher.scss'

export default Vue.component('tab-switcher', {
  name: 'TabSwitcher',
  props: {
    renderOnlyFocused: {
      required: false,
      type: Boolean,
      default: false
    },
    onSwitch: {
      required: false,
      type: Function,
      default: undefined
    },
    activeTab: {
      required: false,
      type: String,
      default: undefined
    },
    scrollableTabs: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: this.$slots.default.findIndex(_ => _.tag)
    }
  },
  computed: {
    activeIndex () {
      // In case of controlled component
      if (this.activeTab) {
        return this.$slots.default.findIndex(slot => this.activeTab === slot.key)
      } else {
        return this.active
      }
    }
  },
  beforeUpdate () {
    const currentSlot = this.$slots.default[this.active]
    if (!currentSlot.tag) {
      this.active = this.$slots.default.findIndex(_ => _.tag)
    }
  },
  methods: {
    activateTab (index) {
      return (e) => {
        e.preventDefault()
        if (typeof this.onSwitch === 'function') {
          this.onSwitch.call(null, this.$slots.default[index].key)
        }
        this.active = index
      }
    }
  },
  render (h) {
    const tabs = this.$slots.default
      .map((slot, index) => {
        if (!slot.tag) return
        const classesTab = ['tab']
        const classesWrapper = ['tab-wrapper']

        if (this.activeIndex === index) {
          classesTab.push('active')
          classesWrapper.push('active')
        }
        if (slot.data.attrs.image) {
          return (
            <div class={classesWrapper.join(' ')}>
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
          <div class={classesWrapper.join(' ')}>
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
      const active = this.activeIndex === index
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
        <div class={'contents' + (this.scrollableTabs ? ' scrollable-tabs' : '')}>
          {contents}
        </div>
      </div>
    )
  }
})
