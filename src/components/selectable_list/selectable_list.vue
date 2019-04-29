<template>
  <div class="selectable-list">
    <div class="selectable-list-header" v-if="items.length > 0">
      <div class="selectable-list-checkbox-wrapper">
        <Checkbox :checked="allSelected" @change="toggleAll" :indeterminate="someSelected">{{ $t('selectable_list.select_all') }}</Checkbox>
      </div>
      <div class="selectable-list-header-actions">
        <slot name="header" :selected="filteredSelected" />
      </div>
    </div>
    <List :items="items" :getKey="getKey">
      <template slot="item" slot-scope="{item}">
        <div class="selectable-list-item-inner" :class="{ 'selectable-list-item-selected-inner': isSelected(item) }">
          <div class="selectable-list-checkbox-wrapper">
            <Checkbox :checked="isSelected(item)" @change="checked => toggle(checked, item)" />
          </div>
          <slot name="item" :item="item" />
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

    > * {
      min-width: 0;
    }
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
