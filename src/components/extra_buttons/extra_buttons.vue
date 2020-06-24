<template>
  <Popover
    trigger="click"
    placement="top"
    class="extra-button-popover"
    :bound-to="{ x: 'container' }"
  >
    <div
      slot="content"
      slot-scope="{close}"
    >
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
          class="dropdown-item dropdown-item-icon"
          @click.prevent="pinStatus"
          @click="close"
        >
          <i class="icon-pin" /><span>{{ $t("status.pin") }}</span>
        </button>
        <button
          v-if="status.pinned && canPin"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="unpinStatus"
          @click="close"
        >
          <i class="icon-pin" /><span>{{ $t("status.unpin") }}</span>
        </button>
        <button
          v-if="canDelete"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="deleteStatus"
          @click="close"
        >
          <i class="icon-cancel" /><span>{{ $t("status.delete") }}</span>
        </button>
        <button
          class="dropdown-item dropdown-item-icon"
          @click.prevent="copyLink"
          @click="close"
        >
          <i class="icon-share" /><span>{{ $t("status.copy_link") }}</span>
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
