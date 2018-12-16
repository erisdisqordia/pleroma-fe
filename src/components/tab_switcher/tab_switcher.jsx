import Vue from 'vue'

import './tab_switcher.scss'

export default Vue.component('tab-switcher', {
  name: 'TabSwitcher',
  data () {
    return {
      active: 0
    }
  },
  methods: {
    activateTab(index) {
      return () => this.active = index;
    }
  },
  render(h) {
    const tabs = this.$slots.default
          .filter(slot => slot.data)
          .map((slot, index) => {
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
          });
    const contents = this.$slots.default.filter(_=>_.data).map(( slot, index ) => {
      const active = index === this.active
      return (
        <div class={active ? 'active' : 'hidden'}>
          {slot}
        </div>
      )
    });
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
