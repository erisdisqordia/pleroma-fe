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
      <div class="timeline">
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
    </div>
  </div>
</template>

<script src="./chat_list.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.chat-list {
  min-height: calc(100vh - 67px);
  margin-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

</style>
