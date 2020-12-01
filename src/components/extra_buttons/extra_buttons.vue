<template>
  <Popover
    trigger="click"
    placement="top"
    :offset="{ y: 5 }"
    :bound-to="{ x: 'container' }"
    remove-padding
  >
    <div
      slot="content"
      slot-scope="{close}"
    >
      <div class="dropdown-menu">
        <button
          v-if="canMute && !status.thread_muted"
          class="button-default dropdown-item dropdown-item-icon"
          @click.prevent="muteConversation"
        >
          <FAIcon
            fixed-width
            icon="eye-slash"
          /><span>{{ $t("status.mute_conversation") }}</span>
        </button>
        <button
          v-if="canMute && status.thread_muted"
          class="button-default dropdown-item dropdown-item-icon"
          @click.prevent="unmuteConversation"
        >
          <FAIcon
            fixed-width
            icon="eye-slash"
          /><span>{{ $t("status.unmute_conversation") }}</span>
        </button>
        <button
          v-if="!status.pinned && canPin"
          class="button-default dropdown-item dropdown-item-icon"
          @click.prevent="pinStatus"
          @click="close"
        >
          <FAIcon
            fixed-width
            icon="thumbtack"
          /><span>{{ $t("status.pin") }}</span>
        </button>
        <button
          v-if="status.pinned && canPin"
          class="button-default dropdown-item dropdown-item-icon"
          @click.prevent="unpinStatus"
          @click="close"
        >
          <FAIcon
            fixed-width
            icon="thumbtack"
          /><span>{{ $t("status.unpin") }}</span>
        </button>
        <button
          v-if="!status.bookmarked"
          class="button-default dropdown-item dropdown-item-icon"
          @click.prevent="bookmarkStatus"
          @click="close"
        >
          <FAIcon
            fixed-width
            :icon="['far', 'bookmark']"
          /><span>{{ $t("status.bookmark") }}</span>
        </button>
        <button
          v-if="status.bookmarked"
          class="button-default dropdown-item dropdown-item-icon"
          @click.prevent="unbookmarkStatus"
          @click="close"
        >
          <FAIcon
            fixed-width
            icon="bookmark"
          /><span>{{ $t("status.unbookmark") }}</span>
        </button>
        <button
          v-if="canDelete"
          class="button-default dropdown-item dropdown-item-icon"
          @click.prevent="deleteStatus"
          @click="close"
        >
          <FAIcon
            fixed-width
            icon="times"
          /><span>{{ $t("status.delete") }}</span>
        </button>
        <button
          class="button-default dropdown-item dropdown-item-icon"
          @click.prevent="copyLink"
          @click="close"
        >
          <FAIcon
            fixed-width
            icon="share-alt"
          /><span>{{ $t("status.copy_link") }}</span>
        </button>
      </div>
    </div>
    <span
      slot="trigger"
      class="ExtraButtons"
    >
      <FAIcon
        class="fa-scale-110 fa-old-padding"
        icon="ellipsis-h"
      />
    </span>
  </Popover>
</template>

<script src="./extra_buttons.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.ExtraButtons {
  position: static;
  padding: 10px;
  margin: -10px;

  &:hover .svg-inline--fa {
    color: $fallback--text;
    color: var(--text, $fallback--text);
  }
}
</style>
