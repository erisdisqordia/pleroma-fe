<template>
  <Popover
    v-if="canDelete || canMute || canPin"
    trigger="click"
    placement="top"
    class="extra-button-popover"
  >
    <div slot="content">
      <div class="dropdown-menu">
        <button
          v-if="canMute && !status.thread_muted"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="muteConversation"
        >
          <i class="icon-eye-off" /><span>{{ $t("status.mute_conversation") }}</span>
        </button>
        <button
          v-if="canMute && status.thread_muted"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="unmuteConversation"
        >
          <i class="icon-eye-off" /><span>{{ $t("status.unmute_conversation") }}</span>
        </button>
        <button
          v-if="!status.pinned && canPin"
          v-close-popover
          class="dropdown-item dropdown-item-icon"
          @click.prevent="pinStatus"
        >
          <i class="icon-pin" /><span>{{ $t("status.pin") }}</span>
        </button>
        <button
          v-if="status.pinned && canPin"
          v-close-popover
          class="dropdown-item dropdown-item-icon"
          @click.prevent="unpinStatus"
        >
          <i class="icon-pin" /><span>{{ $t("status.unpin") }}</span>
        </button>
        <button
          v-if="canDelete"
          v-close-popover
          class="dropdown-item dropdown-item-icon"
          @click.prevent="deleteStatus"
        >
          <i class="icon-cancel" /><span>{{ $t("status.delete") }}</span>
        </button>
      </div>
    </div>
    <i
      slot="trigger"
      class="icon-ellipsis button-icon"
    />
  </Popover>
</template>

<script src="./extra_buttons.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.icon-ellipsis {
  cursor: pointer;

  &:hover,
  .extra-button-popover.open & {
    color: $fallback--text;
    color: var(--text, $fallback--text);
  }
}
</style>
