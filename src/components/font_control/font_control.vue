<template>
<div class="font-control style-control" :class="{ custom: isCustom }">
  <label :for="preset === 'custom' ? name : name + '-font-switcher'" class="label">
    {{label}}
  </label>
  <input
    v-if="typeof fallback !== 'undefined'"
    class="opt exlcude-disabled"
    type="checkbox"
    :id="name + '-o'"
    :checked="present"
    @input="$emit('input', typeof value === 'undefined' ? fallback : undefined)">
  <label v-if="typeof fallback !== 'undefined'" class="opt-l" :for="name + '-o'"></label>
  <label :for="name + '-font-switcher'" class="select" :disabled="!present">
    <select
      :disabled="!present"
      v-model="preset"
      class="font-switcher"
      :id="name + '-font-switcher'">
      <option v-for="option in availableOptions" :value="option">
        {{ option === 'custom' ? $t('settings.style.fonts.custom') : option }}
      </option>
    </select>
    <i class="icon-down-open"/>
  </label>
  <input
    v-if="isCustom"
    class="custom-font"
    type="text"
    :id="name"
    v-model="family">
</div>
</template>

<script src="./font_control.js" ></script>

<style lang="scss">
@import '../../_variables.scss';
.font-control {
  input.custom-font {
    min-width: 10em;
  }
  &.custom {
    .select {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .custom-font {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
