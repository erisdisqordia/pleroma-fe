<template>
  <div class="list">
    <div v-for="item in items" class="list-item" :key="getKey(item)">
      <slot name="item" :item="item" />
    </div>
    <div class="list-empty-content faint" v-if="items.length === 0 && !!$slots.empty">
      <slot name="empty" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    getKey: {
      type: Function,
      default: item => item.id
    }
  }
}
</script>

<style lang="scss">
@import '../../_variables.scss';

.list {
  &-item:not(:last-child) {
    border-bottom: 1px solid;
    border-bottom-color: $fallback--border;
    border-bottom-color: var(--border, $fallback--border);
  }

  &-empty-content {
    text-align: center;
    padding: 10px;
  }
}
</style>
