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
            const classes = ['tab']

            if (index === this.active) {
              classes.push('active')
            }
            return (<button onClick={this.activateTab(index)} class={ classes.join(' ') }>{slot.data.attrs.label}</button>)
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
