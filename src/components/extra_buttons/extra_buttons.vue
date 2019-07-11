<template>
  <v-popover
    v-if="enabled"
    trigger="click"
    class="extra-button-popover"
    :container="false"
  >
    <div class="popper-wrapper" slot="popover">
      <div class="dropdown-menu">
        <button
          v-if="!status.pinned && canPin"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="pinStatus"
          v-close-popover
        >
          <i class="icon-pin" /><span>{{ $t("status.pin") }}</span>
        </button>
        <button
          v-if="status.pinned && canPin"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="unpinStatus"
          v-close-popover
        >
          <i class="icon-pin" /><span>{{ $t("status.unpin") }}</span>
        </button>
        <button
          v-if="canDelete"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="deleteStatus"
          v-close-popover
        >
          <i class="icon-cancel" /><span>{{ $t("status.delete") }}</span>
        </button>
      </div>
    </div>
    <div class="button-icon">
      <i class="icon-ellipsis" />
    </div>
  </v-popover>
</template>

<script src="./extra_buttons.js" ></script>

<style lang="scss">
@import '../../_variables.scss';
@import '../popper/popper.scss';

.icon-ellipsis {
  cursor: pointer;

  &:hover,
  .extra-button-popover.open & {
    color: $fallback--text;
    color: var(--text, $fallback--text);
  }
}
</style>
