<template>
  <div class="selectable-list">
    <div class="selectable-list-header">
      <div class="selectable-list-checkbox-wrapper">
        <Checkbox :checked="allSelected" @change="toggleAll" />
      </div>
      <div class="selectable-list-header-actions">
        <slot name="header" :selected="selected" />
      </div>
    </div>
    <List :items="items" :getKey="getKey">
      <template slot="item" slot-scope="p">
        <div class="selectable-list-item-inner" :class="{ 'selectable-list-item-selected-inner': isSelected(p.item) }">
          <div class="selectable-list-checkbox-wrapper">
            <Checkbox :checked="isSelected(p.item)" @change="checked => toggle(checked, p.item)" />
          </div>
          <slot name="item" :item="p.item" />
        </div>
      </template>
      <template slot="empty"><slot name="empty" /></template>
    </List>
  </div>
</template>

<script src="./selectable_list.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.selectable-list {
  &-item-inner {
    display: flex;
    align-items: center;
  }

  &-item-selected-inner {
    background-color: $fallback--lightBg;
    background-color: var(--lightBg, $fallback--lightBg);
  }

  &-header {
    display: flex;
    align-items: center;
    padding: 0.6em 0;
    border-bottom: 2px solid;
    border-bottom-color: $fallback--border;
    border-bottom-color: var(--border, $fallback--border);

    &-actions {
      flex: 1;
    }
  }

  &-checkbox-wrapper {
    padding: 0 10px;
    flex: none;
  }
}
</style>
