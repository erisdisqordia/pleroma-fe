<template>
  <div class="chat-panel" v-if="!this.collapsed">
    <div class="panel panel-default">
      <div class="panel-heading timeline-heading chat-heading" @click.stop.prevent="togglePanel">
        <div class="title">
          {{$t('chat.title')}}
          <i class="icon-cancel" style="float: right;"></i>
        </div>
      </div>
      <div class="chat-window" v-chat-scroll>
        <div class="chat-message" v-for="message in messages" :key="message.id">
          <span class="chat-avatar">
            <img :src="message.author.avatar" />
          </span>
          <div class="chat-content">
            <router-link class="chat-name" :to="{ name: 'user-profile', params: { id: message.author.id } }">
              {{message.author.username}}
            </router-link>
            <br>
            <span class="chat-text">
              {{message.text}}
            </span>
          </div>
        </div>
      </div>
      <div class="chat-input">
        <textarea @keyup.enter="submit(currentMessage)" v-model="currentMessage" class="chat-input-textarea" rows="1"></textarea>
      </div>
    </div>
  </div>
  <div v-else class="chat-panel">
    <div class="panel panel-default">
      <div class="panel-heading stub timeline-heading chat-heading" @click.stop.prevent="togglePanel">
        <div class="title">
          {{$t('chat.title')}}
          <i class="icon-plus-squared" style="float: right;"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./chat_panel.js"></script>

<style lang="scss">
@import '../../_variables.scss';
.chat-heading {
  cursor: pointer;
}

.chat-window {
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
}

.chat-name {
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
</style>
