<template>
  <Popper
    v-if="enabled && showPopper"
    trigger="click"
    append-to-body
    :options="{
      placement: 'top',
      modifiers: {
        arrow: { enabled: true },
        offset: { offset: '0, 5px' },
      }
    }"
    @hide="showDropDown = false"
  >
    <div class="popper-wrapper">
      <div class="dropdown-menu">
        <button
          v-if="!status.pinned && canPin"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="pinStatus"
        >
          <i class="icon-pin" /><span>{{ $t("status.pin") }}</span>
        </button>
        <button
          v-if="status.pinned && canPin"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="unpinStatus"
        >
          <i class="icon-pin" /><span>{{ $t("status.unpin") }}</span>
        </button>
        <button
          v-if="canDelete"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="deleteStatus"
        >
          <i class="icon-cancel" /><span>{{ $t("status.delete") }}</span>
        </button>
      </div>
    </div>
    <div
      slot="reference"
      class="button-icon"
      @click="toggleMenu"
    >
      <i
        class="icon-ellipsis"
        :class="{'icon-clicked': showDropDown}"
      />
    </div>
  </Popper>
</template>

<script src="./extra_buttons.js" ></script>

<style lang="scss">
@import '../../_variables.scss';
@import '../popper/popper.scss';

.icon-ellipsis {
  cursor: pointer;

  &:hover, &.icon-clicked {
    color: $fallback--text;
    color: var(--text, $fallback--text);
  }
}
</style>
