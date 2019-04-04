<template>
  <div class="selectable-list">
    <div v-for="item in items" :key="getKey(item)" class="selectable-list-item" :class="{ 'selectable-list-item-selected': isSelected(item) }">
      <div class="selectable-list-checkbox-wrapper">
        <Checkbox :checked="isSelected(item)" @change="checked => toggle(checked, item)" />
      </div>
      <slot name="item" :item="item" />
    </div>
    <div class="selectable-list-empty-content faint" v-if="items.length === 0">
      <slot name="empty" />
    </div>
  </div>
</template>

<script src="./selectable_list.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.selectable-list {
  &-item {
    display: flex;

    &-selected {
      background-color: $fallback--lightBg;
      background-color: var(--lightBg, $fallback--lightBg);
    }
  }

  &-checkbox-wrapper {
    padding: 10px;
    flex: none;
  }

  &-empty-content {
    text-align: center;
    padding: 10px;
  }
}
</style>
