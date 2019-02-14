import Vue from 'vue'
import map from 'lodash/map'

const defaultEntryPropsGetter = entry => ({ entry })
const defaultKeyGetter = entry => entry.id

const withList = ({ getEntryProps = defaultEntryPropsGetter, getKey = defaultKeyGetter }) => (ItemComponent) => (
  Vue.component('withList', {
    render (createElement) {
      return (
        <div class="with-list">
          {map(this.entries, (entry, index) => {
            const props = {
              key: getKey(entry, index),
              props: {
                ...this.$props.entryProps,
                ...getEntryProps(entry, index)
              },
              on: this.$props.entryListeners
            }
            return <ItemComponent {...props} />
          })}
        </div>
      )
    },
    props: ['entries', 'entryProps', 'entryListeners']
  })
)

export default withList
