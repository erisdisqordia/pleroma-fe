import Vue from 'vue'

// FIXME: This doesn't like v-if directly inside the tab's contents, breaks vue really bad

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
    const contents = (
      <div>
        {this.$slots.default.filter(slot => slot.data)[this.active]}
      </div>
    );
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
