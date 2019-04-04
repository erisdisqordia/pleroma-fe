<template>
  <div class="list">
    <slot name="item" v-for="item in items" :item="item" />
    <div class="list-empty-content faint" v-if="items.length === 0">
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
    }
  }
}
</script>

<style lang="scss">
.list {
  &-empty-content {
    text-align: center;
    padding: 10px;
  }
}
</style>
