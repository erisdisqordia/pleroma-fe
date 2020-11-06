<template>
  <div
    class="font-control style-control"
    :class="{ custom: isCustom }"
  >
    <label
      :for="preset === 'custom' ? name : name + '-font-switcher'"
      class="label"
    >
      {{ label }}
    </label>
    <input
      v-if="typeof fallback !== 'undefined'"
      :id="name + '-o'"
      class="opt exlcude-disabled"
      type="checkbox"
      :checked="present"
      @input="$emit('input', typeof value === 'undefined' ? fallback : undefined)"
    >
    <label
      v-if="typeof fallback !== 'undefined'"
      class="opt-l"
      :for="name + '-o'"
    />
    <label
      :for="name + '-font-switcher'"
      class="select"
      :disabled="!present"
    >
      <select
        :id="name + '-font-switcher'"
        v-model="preset"
        :disabled="!present"
        class="font-switcher"
      >
        <option
          v-for="option in availableOptions"
          :key="option"
          :value="option"
        >
          {{ option === 'custom' ? $t('settings.style.fonts.custom') : option }}
        </option>
      </select>
      <FAIcon
        class="select-down-icon"
        icon="chevron-down"
      />
    </label>
    <input
      v-if="isCustom"
      :id="name"
      v-model="family"
      class="custom-font"
      type="text"
    >
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
