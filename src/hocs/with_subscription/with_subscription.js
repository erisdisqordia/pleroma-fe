import Vue from 'vue'
import reject from 'lodash/reject'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'
import './with_subscription.scss'

const withSubscription = ({
  fetch,                      // function to fetch entries and return a promise
  select,                     // function to select data from store
  childPropName = 'content'   // name of the prop to be passed into the wrapped component
}) => (WrappedComponent) => {
  const originalProps = WrappedComponent.props || []
  const props = reject(originalProps, v => v === 'content')

  return Vue.component('withSubscription', {
    props: [
      ...props,
      'refresh'               // boolean saying to force-fetch data whenever created
    ],
    render (createElement) {
      if (!this.error && !this.loading) {
        const props = {
          props: {
            ...omit(this.$props, 'refresh'),
            [childPropName]: this.fetchedData
          },
          on: this.$listeners,
          scopedSlots: this.$scopedSlots
        }
        const children = Object.entries(this.$slots).map(([key, value]) => createElement('template', { slot: key }, value))
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
              : <i class="icon-spin3 animate-spin"/>
            }
          </div>
        )
      }
    },
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
    }
  })
}

export default withSubscription
