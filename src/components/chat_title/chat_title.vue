<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    class="chat-title"
    :title="title"
  >
    <router-link
      v-if="withAvatar && user"
      :to="getUserProfileLink(user)"
    >
      <UserAvatar
        :user="user"
        width="23px"
        height="23px"
      />
    </router-link>
    <span
      class="username"
      v-html="htmlTitle"
    />
  </div>
  <!-- eslint-enable vue/no-v-html -->
</template>

<script src="./chat_title.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.chat-title {
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  align-items: center;

  .username {
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;

    .emoji {
      width: 14px;
      height: 14px;
      vertical-align: middle;
      object-fit: contain
    }
  }

  .still-image.avatar {
    width: 23px;
    height: 23px;
    margin-right: 0.5em;

    border-radius: $fallback--avatarAltRadius;
    border-radius: var(--avatarAltRadius, $fallback--avatarAltRadius);

    &.animated::before {
      display: none;
    }
  }
}
</style>
