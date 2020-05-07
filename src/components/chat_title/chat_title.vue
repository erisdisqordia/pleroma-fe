<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    class="chat-title"
    :title="title"
  >
    <ChatAvatar
      v-if="withAvatar"
      :user="user"
      width="23px"
      height="23px"
    />
    <span
      v-if="withAvatar"
      style="margin-right: 0.5em"
    />
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

  a {
    display: flex;
    align-items: center;
  }

  .username {
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline;
    word-wrap: break-word;

    .emoji {
      width: 14px;
      height: 14px;
      vertical-align: middle;
      object-fit: contain
    }
  }
}
</style>
