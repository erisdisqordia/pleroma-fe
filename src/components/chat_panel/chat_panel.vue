<template>
  <chat-list
    v-if="!collapsed || !floating"
    class="chat-panel"
  />
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
          <FAIcon
            class="icon"
            icon="cat"
          />
          {{ $t('chats.chats') }}
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
  bottom: 0px;
  z-index: 1000;
  max-width: 25em;
  overflow-y: hidden;

  .panel-body, .member-list {
    overflow-y: auto;
  }
  .panel-body {
    height: 400px;
  }
}

.floating-chat.left {
  left: 0px;
}

.floating-chat:not(.left) {
  right: 0px;
}

.chat-panel {
  .chat-heading {
    cursor: pointer;

    .icon {
      color: $fallback--text;
      color: var(--text, $fallback--text);
    }
  }

  .chat-list.floating-chat {
    overflow-y: hidden;
    max-height: 400px;

    .panel.body {
      overflow-y: auto;
    }

    .panel-heading {
      height: 30px;
      box-shadow: none;
      background: none;

      .title {
        display: none;
      }

      .input-wrap {
        position: absolute;
        width: 85%;
        right: 0px;
      }

      .input-search {
        padding-top: 5px;
      }

    }

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
