<template>
  <label class="checkbox">
    <input type="checkbox" :checked="checked" @change="$emit('change', $event.target.checked)" :indeterminate.prop="indeterminate">
    <i class="checkbox-indicator" />
    <span v-if="!!$slots.default"><slot></slot></span>
  </label>
</template>

<script>
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: ['checked', 'indeterminate']
}
</script>

<style lang="scss">
@import '../../_variables.scss';

.checkbox {
  position: relative;
  display: inline-block;
  padding-left: 1.2em;
  min-height: 1.2em;

  &-indicator::before {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    content: '✔';
    transition: color 200ms;
    width: 1.1em;
    height: 1.1em;
    border-radius: $fallback--checkboxRadius;
    border-radius: var(--checkboxRadius, $fallback--checkboxRadius);
    box-shadow: 0px 0px 2px black inset;
    box-shadow: var(--inputShadow);
    background-color: $fallback--fg;
    background-color: var(--input, $fallback--fg);
    vertical-align: top;
    text-align: center;
    line-height: 1.1em;
    font-size: 1.1em;
    color: transparent;
    overflow: hidden;
    box-sizing: border-box;
  }

  input[type=checkbox] {
    display: none;

    &:checked + .checkbox-indicator::before {
      color: $fallback--text;
      color: var(--text, $fallback--text);
    }

    &:indeterminate + .checkbox-indicator::before {
      content: '–';
      color: $fallback--text;
      color: var(--text, $fallback--text);
    }

    &:disabled + .checkbox-indicator::before {
      opacity: .5;
    }
  }

  & > span {
    margin-left: .5em;
  }
}
</style>
