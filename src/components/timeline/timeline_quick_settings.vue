<template>
  <Popover
    trigger="click"
    class="TimelineQuickSettings"
    :bound-to="{ x: 'container' }"
  >
    <div
      slot="content"
      class="timeline-settings-menu dropdown-menu"
    >
      <button
        class="button-default dropdown-item"
        @click="replyVisibilityAll = true"
      >
        <span
          class="menu-checkbox"
          :class="{ 'menu-checkbox-radio': replyVisibilityAll }"
        />{{ $t('settings.reply_visibility_all') }}
      </button>
      <button
        class="button-default dropdown-item"
        @click="replyVisibilityFollowing = true"
      >
        <span
          class="menu-checkbox"
          :class="{ 'menu-checkbox-radio': replyVisibilityFollowing }"
        />{{ $t('settings.reply_visibility_following_short') }}
      </button>
      <button
        class="button-default dropdown-item"
        @click="replyVisibilitySelf = true"
      >
        <span
          class="menu-checkbox"
          :class="{ 'menu-checkbox-radio': replyVisibilitySelf }"
        />{{ $t('settings.reply_visibility_self_short') }}
      </button>
      <div
        role="separator"
        class="dropdown-divider"
      />
      <button
        class="button-default dropdown-item"
        @click="hideMedia = !hideMedia"
      >
        <span
          class="menu-checkbox"
          :class="{ 'menu-checkbox-checked': hideMedia }"
        />{{ $t('settings.hide_media_previews') }}
      </button>
      <button
        class="button-default dropdown-item"
        @click="hideMutedPosts = !hideMutedPosts"
      >
        <span
          class="menu-checkbox"
          :class="{ 'menu-checkbox-checked': hideMutedPosts }"
        />{{ $t('settings.hide_all_muted_posts') }}
      </button>
      <button
        class="button-default dropdown-item dropdown-item-icon"
        @click="openTab('filtering')"
      >
        <FAIcon icon="filter" />{{ $t('settings.word_filter') }}
      </button>
      <button
        class="button-default dropdown-item dropdown-item-icon"
        @click="openTab('general')"
      >
        <FAIcon icon="wrench" />{{ $t('settings.more_settings') }}
      </button>
    </div>
    <div slot="trigger">
      <FAIcon icon="cog" />
    </div>
  </Popover>
</template>

<script src="./timeline_quick_settings.js"></script>

<style lang="scss">

.TimelineQuickSettings {
  align-self: stretch;

  > button {
    font-size: 1.2em;
    padding-left: 0.7em;
    padding-right: 0.2em;
    line-height: 100%;
    height: 100%;
  }

  .dropdown-item {
    margin: 0;
  }

  .timeline-settings-menu {
    display: flex;
    min-width: 12em;
    flex-direction: column;
  }
}

</style>
