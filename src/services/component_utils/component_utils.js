import isFunction from 'lodash/isFunction'

const getComponentOptions = (Component) => (isFunction(Component)) ? Component.options : Component

const getComponentProps = (Component) => getComponentOptions(Component).props

export {
  getComponentOptions,
  getComponentProps
}
