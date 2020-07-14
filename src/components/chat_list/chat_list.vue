<template>
  <div v-if="isNew">
    <ChatNew @cancel="cancelNewChat" />
  </div>
  <div
    v-else
    class="chat-list panel panel-default"
  >
    <div class="panel-heading">
      <span class="title">
        {{ $t("chats.chats") }}
      </span>
      <button @click="newChat">
        {{ $t("chats.new") }}
      </button>
    </div>
    <div class="panel-body">
      <div
        v-if="sortedChatList.length > 0"
        class="timeline"
      >
        <List :items="sortedChatList">
          <template
            slot="item"
            slot-scope="{item}"
          >
            <ChatListItem
              :key="item.id"
              :compact="false"
              :chat="item"
            />
          </template>
        </List>
      </div>
      <div
        v-else
        class="emtpy-chat-list-alert"
      >
        <span>{{ $t('chats.empty_chat_list_placeholder') }}</span>
      </div>
    </div>
  </div>
</template>

<script src="./chat_list.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.chat-list {
  min-height: 25em;
  margin-bottom: 0;
}

.emtpy-chat-list-alert {
  padding: 3em;
  font-size: 1.2em;
  display: flex;
  justify-content: center;
  color: $fallback--text;
  color: var(--faint, $fallback--text);
}

</style>
