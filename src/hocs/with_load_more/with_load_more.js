import Vue from 'vue'
import isEmpty from 'lodash/isEmpty'
import { getComponentProps } from '../../services/component_utils/component_utils'
import './with_load_more.scss'

import { FontAwesomeIcon as FAIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faCircleNotch
)

const withLoadMore = ({
  fetch, // function to fetch entries and return a promise
  select, // function to select data from store
  destroy, // function called at "destroyed" lifecycle
  childPropName = 'entries', // name of the prop to be passed into the wrapped component
  additionalPropNames = [] // additional prop name list of the wrapper component
}) => (WrappedComponent) => {
  const originalProps = Object.keys(getComponentProps(WrappedComponent))
  const props = originalProps.filter(v => v !== childPropName).concat(additionalPropNames)

  return Vue.component('withLoadMore', {
    props,
    data () {
      return {
        loading: false,
        bottomedOut: false,
        error: false
      }
    },
    computed: {
      entries () {
        return select(this.$props, this.$store) || []
      }
    },
    created () {
      window.addEventListener('scroll', this.scrollLoad)
      if (this.entries.length === 0) {
        this.fetchEntries()
      }
    },
    destroyed () {
      window.removeEventListener('scroll', this.scrollLoad)
      destroy && destroy(this.$props, this.$store)
    },
    methods: {
      fetchEntries () {
        if (!this.loading) {
          this.loading = true
          this.error = false
          fetch(this.$props, this.$store)
            .then((newEntries) => {
              this.loading = false
              this.bottomedOut = isEmpty(newEntries)
            })
            .catch(() => {
              this.loading = false
              this.error = true
            })
        }
      },
      scrollLoad (e) {
        const bodyBRect = document.body.getBoundingClientRect()
        const height = Math.max(bodyBRect.height, -(bodyBRect.y))
        if (this.loading === false &&
          this.bottomedOut === false &&
          this.$el.offsetHeight > 0 &&
          (window.innerHeight + window.pageYOffset) >= (height - 750)
        ) {
          this.fetchEntries()
        }
      }
    },
    render (h) {
      const props = {
        props: {
          ...this.$props,
          [childPropName]: this.entries
        },
        on: this.$listeners,
        scopedSlots: this.$scopedSlots
      }
      const children = Object.entries(this.$slots).map(([key, value]) => h('template', { slot: key }, value))
      return (
        <div class="with-load-more">
          <WrappedComponent {...props}>
            {children}
          </WrappedComponent>
          <div class="with-load-more-footer">
            {this.error && <a onClick={this.fetchEntries} class="alert error">{this.$t('general.generic_error')}</a>}
            {!this.error && this.loading && <FAIcon spin icon="circle-notch"/>}
            {!this.error && !this.loading && !this.bottomedOut && <a onClick={this.fetchEntries}>{this.$t('general.more')}</a>}
          </div>
        </div>
      )
    }
  })
}

export default withLoadMore
