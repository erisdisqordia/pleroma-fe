<template>
  <label class="checkbox">
    <input type="checkbox" :checked="value" @change="$emit('input', $event.target.checked)">
    <i class="checkbox-indicator" />
    <span><slot></slot></span>
  </label>
</template>

<script>
export default {
  props: ['value']
}
</script>

<style lang="scss">
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

    &:disabled + .checkbox-indicator::before {
      opacity: .5;
    }
  }

  & > span {
    margin-left: .5em;
  }
}
</style>
