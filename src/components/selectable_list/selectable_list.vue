<template>
  <List class="selectable-list" :items="items" :getKey="getKey">
    <template slot="item" scope="p">
      <div class="selectable-list-item-inner" :class="{ 'selectable-list-item-selected-inner': isSelected(p.keyVal) }">
        <div class="selectable-list-checkbox-wrapper">
          <Checkbox :checked="isSelected(p.keyVal)" @change="checked => toggle(checked, p.keyVal)" />
        </div>
        <slot name="item" :item="p.item" />
      </div>
    </template>
  </List>
</template>

<script src="./selectable_list.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.selectable-list {
  &-item-inner {
    display: flex;
  }

  &-item-selected-inner {
    background-color: $fallback--lightBg;
    background-color: var(--lightBg, $fallback--lightBg);
  }

  &-checkbox-wrapper {
    padding: 10px;
    flex: none;
  }
}
</style>
