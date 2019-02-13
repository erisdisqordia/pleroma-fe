import Vue from 'vue'
import map from 'lodash/map'

const defaultEntryPropsGetter = entry => ({ entry })
const defaultKeyGetter = entry => entry.id

const withList = (Component, getEntryProps = defaultEntryPropsGetter, getKey = defaultKeyGetter) => {
  return Vue.component('withList', {
    render (createElement) {
      return (
        <div class="with-list">
          {map(this.entries, (entry, index) => {
            const props = {
              key: getKey(entry, index),
              ...this.$props.entryProps,
              ...getEntryProps(entry, index)
            }
            return <Component {...{ attrs: props }} />
          })}
        </div>
      )
    },
    props: ['entries', 'entryProps']
  })
}

export default withList
