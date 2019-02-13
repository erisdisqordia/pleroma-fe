import Vue from 'vue'
import filter from 'lodash/filter'
import './with_load_more.scss'

const withLoadMore = (Component, fetchEntries, getEntries) => {
  const originalProps = Component.props || []
  const props = filter(originalProps, v => v !== 'entries')

  return Vue.component('withLoadMore', {
    render (createElement) {
      return (
        <div class="with-load-more">
          <Component entries={this.entries} />
          <div class="with-load-more-footer">
            {this.error && <a onClick={this.fetch} class="alert error">{this.$t('general.generic_error')}</a>}
            {!this.error && this.loading && <i class="icon-spin3 animate-spin"/>}
            {!this.error && !this.loading && !this.bottomedOut && <a onClick={this.fetch}>{this.$t('general.more')}</a>}
          </div>
        </div>
      )
    },
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
        return getEntries(this.$props, this.$store) || []
      }
    },
    created () {
      window.addEventListener('scroll', this.scrollLoad)
      if (this.entries.length === 0) {
        this.fetch()
      }
    },
    destroyed () {
      window.removeEventListener('scroll', this.scrollLoad)
    },
    methods: {
      fetch () {
        if (!this.loading) {
          this.loading = true
          fetchEntries(this.$props, this.$store).then((newEntries) => {
            this.error = false
            this.loading = false
            this.bottomedOut = newEntries.length === 0
          }).catch(() => {
            this.error = true
            this.loading = false
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
          this.fetch()
        }
      }
    }
  })
}

export default withLoadMore
