import Vue from 'vue'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import './with_list.scss'

const defaultEntryPropsGetter = entry => ({ entry })
const defaultKeyGetter = entry => entry.id

const withList = ({
  getEntryProps = defaultEntryPropsGetter,  // function to accept entry and index values and return props to be passed into the item component
  getKey = defaultKeyGetter                 // funciton to accept entry and index values and return key prop value
}) => (ItemComponent) => (
  Vue.component('withList', {
    props: [
      'entries',                            // array of entry
      'entryProps',                         // additional props to be passed into each entry
      'entryListeners'                      // additional event listeners to be passed into each entry
    ],
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
          {isEmpty(this.entries) && this.$slots.empty && <div class="with-list-empty-content faint">{this.$slots.empty}</div>}
        </div>
      )
    }
  })
)

export default withList
