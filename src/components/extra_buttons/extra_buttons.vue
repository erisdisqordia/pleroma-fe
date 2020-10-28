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
          <FAIcon
            size="md"
            fixed-width
            icon="eye-slash"
          /><span>{{ $t("status.mute_conversation") }}</span>
        </button>
        <button
          v-if="canMute && status.thread_muted"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="unmuteConversation"
        >
          <FAIcon
            size="md"
            fixed-width
            icon="eye-slash"
          /><span>{{ $t("status.unmute_conversation") }}</span>
        </button>
        <button
          v-if="!status.pinned && canPin"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="pinStatus"
          @click="close"
        >
          <FAIcon
            size="md"
            fixed-width
            icon="thumbtack"
          /><span>{{ $t("status.pin") }}</span>
        </button>
        <button
          v-if="status.pinned && canPin"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="unpinStatus"
          @click="close"
        >
          <FAIcon
            size="md"
            fixed-width
            icon="thumbtack"
          /><span>{{ $t("status.unpin") }}</span>
        </button>
        <button
          v-if="!status.bookmarked"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="bookmarkStatus"
          @click="close"
        >
          <FAIcon
            size="md"
            fixed-width
            :icon="['far', 'bookmark']"
          /><span>{{ $t("status.bookmark") }}</span>
        </button>
        <button
          v-if="status.bookmarked"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="unbookmarkStatus"
          @click="close"
        >
          <FAIcon
            size="md"
            fixed-width
            icon="bookmark"
          /><span>{{ $t("status.unbookmark") }}</span>
        </button>
        <button
          v-if="canDelete"
          class="dropdown-item dropdown-item-icon"
          @click.prevent="deleteStatus"
          @click="close"
        >
          <FAIcon
            size="md"
            fixed-width
            icon="times"
          /><span>{{ $t("status.delete") }}</span>
        </button>
        <button
          class="dropdown-item dropdown-item-icon"
          @click.prevent="copyLink"
          @click="close"
        >
          <FAIcon
            size="md"
            fixed-width
            icon="share-alt"
          /><span>{{ $t("status.copy_link") }}</span>
        </button>
      </div>
    </div>
    <span slot="trigger">
      <FAIcon
        class="ExtraButtons fa-scale-110 fa-old-padding"
        icon="ellipsis-h"
        size="md"
      />
    </span>
  </Popover>
</template>

<script src="./extra_buttons.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.ExtraButtons {
  cursor: pointer;
  position: static;

  &:hover,
  .extra-button-popover.open & {
    color: $fallback--text;
    color: var(--text, $fallback--text);
  }
}
</style>
