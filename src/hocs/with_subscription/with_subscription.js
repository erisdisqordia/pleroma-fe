import Vue from 'vue'
import isEmpty from 'lodash/isEmpty'
import { getComponentProps } from '../../services/component_utils/component_utils'
import './with_subscription.scss'

import { FontAwesomeIcon as FAIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faCircleNotch
)

const withSubscription = ({
  fetch, // function to fetch entries and return a promise
  select, // function to select data from store
  childPropName = 'content', // name of the prop to be passed into the wrapped component
  additionalPropNames = [] // additional prop name list of the wrapper component
}) => (WrappedComponent) => {
  const originalProps = Object.keys(getComponentProps(WrappedComponent))
  const props = originalProps.filter(v => v !== childPropName).concat(additionalPropNames)

  return Vue.component('withSubscription', {
    props: [
      ...props,
      'refresh' // boolean saying to force-fetch data whenever created
    ],
    data () {
      return {
        loading: false,
        error: false
      }
    },
    computed: {
      fetchedData () {
        return select(this.$props, this.$store)
      }
    },
    created () {
      if (this.refresh || isEmpty(this.fetchedData)) {
        this.fetchData()
      }
    },
    methods: {
      fetchData () {
        if (!this.loading) {
          this.loading = true
          this.error = false
          fetch(this.$props, this.$store)
            .then(() => {
              this.loading = false
            })
            .catch(() => {
              this.error = true
              this.loading = false
            })
        }
      }
    },
    render (h) {
      if (!this.error && !this.loading) {
        const props = {
          props: {
            ...this.$props,
            [childPropName]: this.fetchedData
          },
          on: this.$listeners,
          scopedSlots: this.$scopedSlots
        }
        const children = Object.entries(this.$slots).map(([key, value]) => h('template', { slot: key }, value))
        return (
          <div class="with-subscription">
            <WrappedComponent {...props}>
              {children}
            </WrappedComponent>
          </div>
        )
      } else {
        return (
          <div class="with-subscription-loading">
            {this.error
              ? <a onClick={this.fetchData} class="alert error">{this.$t('general.generic_error')}</a>
              : <FAIcon spin icon="circle-notch"/>
            }
          </div>
        )
      }
    }
  })
}

export default withSubscription
