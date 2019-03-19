// TODO: Template-based functional component is supported in vue-loader 13.3.0+.
// Also, somehow, props are not provided through 'context' even though they are defined.
// Need to upgrade vue-loader

import './checkbox.scss'

export default {
  functional: true,
  name: 'Checkbox',
  model: {
    prop: 'checked',
    event: 'change'
  },
  render (createElement, { data, children }) {
    const { props = {}, attrs = {}, on = {}, ...rest } = data
    const { name, checked, disabled, readonly, ...restAttrs } = attrs
    const { change, ...restListeners } = on
    const wrapperProps = {
      attrs: restAttrs,
      on: restListeners,
      ...rest
    }
    const inputProps = {
      attrs: {
        name,
        checked,
        disabled,
        readonly,
        ...props
      },
      on: {}
    }
    if (change) {
      inputProps.on.change = e => change(e.target.checked)
    }
    return (
      <label class="checkbox" {...wrapperProps}>
        <input type="checkbox" {...inputProps} />
        <i />
        {children && <span>{children}</span>}
      </label>
    )
  }
}
