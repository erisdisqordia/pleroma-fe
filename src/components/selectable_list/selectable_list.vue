<template>
  <div class="selectable-list">
    <div v-for="item in items">
      <Checkbox :checked="isChecked(item)" @change="checked => toggle(checked, item)" />
      <slot name="item" :item="item" />
    </div>
    <div class="selectable-list-empty-content faint" v-if="items.length === 0">
      <slot name="empty" />
    </div>
  </div>
</template>

<script src="./selectable_list.js"></script>

<style lang="scss">
.selectable-list {
  &-empty-content {
    text-align: center;
    padding: 10px;
  }
}
</style>
