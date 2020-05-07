<template>
  <div
    v-if="!collapsed || !floating"
    class="chat-panel"
  >
    <div class="panel panel-default">
      <div
        class="panel-heading timeline-heading"
        :class="{ 'chat-heading': floating }"
        @click.stop.prevent="togglePanel"
      >
        <div class="title">
          <span>{{ $t('chat.title') }}</span>
          <i
            v-if="floating"
            class="icon-cancel"
          />
        </div>
      </div>
      <div
        v-chat-scroll
        class="chat-window"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          class="chat-message"
        >
          <span class="chat-avatar">
            <img :src="message.author.avatar">
          </span>
          <div class="chat-content">
            <router-link
              class="chat-name"
              :to="userProfileLink(message.author)"
            >
              {{ message.author.username }}
            </router-link>
            <br>
            <span class="chat-text">
              {{ message.text }}
            </span>
          </div>
        </div>
      </div>
      <div class="chat-input">
        <textarea
          v-model="currentMessage"
          class="chat-input-textarea"
          rows="1"
          @keyup.enter="submit(currentMessage)"
        />
      </div>
    </div>
  </div>
  <div
    v-else
    class="chat-panel"
  >
    <div class="panel panel-default">
      <div
        class="panel-heading stub timeline-heading chat-heading"
        @click.stop.prevent="togglePanel"
      >
        <div class="title">
          <i class="icon-comment-empty" />
          {{ $t('chat.title') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./chat_panel.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.floating-chat {
  position: fixed;
  right: 0px;
  bottom: 0px;
  z-index: 1000;
  max-width: 25em;
}

.chat-panel {
  .chat-heading {
    cursor: pointer;
    .icon-comment-empty {
      color: $fallback--text;
      color: var(--text, $fallback--text);
    }
  }

  .chat-window {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 20em;
  }

  .chat-window-container {
    height: 100%;
  }

  .chat-message {
    display: flex;
    padding: 0.2em 0.5em
  }

  .chat-avatar {
    img {
      height: 24px;
      width: 24px;
      border-radius: $fallback--avatarRadius;
      border-radius: var(--avatarRadius, $fallback--avatarRadius);
      margin-right: 0.5em;
      margin-top: 0.25em;
    }
  }

  .chat-input {
    display: flex;
    textarea {
      flex: 1;
      margin: 0.6em;
      min-height: 3.5em;
      resize: none;
    }
  }

  .chat-panel {
    .title {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
