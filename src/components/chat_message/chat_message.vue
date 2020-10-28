<template>
  <div
    v-if="isMessage"
    class="chat-message-wrapper"
    :class="{ 'hovered-message-chain': hoveredMessageChain }"
    @mouseover="onHover(true)"
    @mouseleave="onHover(false)"
  >
    <div
      class="chat-message"
      :class="[{ 'outgoing': isCurrentUser, 'incoming': !isCurrentUser }]"
    >
      <div
        v-if="!isCurrentUser"
        class="avatar-wrapper"
      >
        <router-link
          v-if="chatViewItem.isHead"
          :to="userProfileLink"
        >
          <UserAvatar
            :compact="true"
            :better-shadow="betterShadow"
            :user="author"
          />
        </router-link>
      </div>
      <div class="chat-message-inner">
        <div
          class="status-body"
          :style="{ 'min-width': message.attachment ? '80%' : '' }"
        >
          <div
            class="media status"
            :class="{ 'without-attachment': !hasAttachment }"
            style="position: relative"
            @mouseenter="hovered = true"
            @mouseleave="hovered = false"
          >
            <div
              class="chat-message-menu"
              :class="{ 'visible': hovered || menuOpened }"
            >
              <Popover
                trigger="click"
                placement="top"
                :bound-to-selector="isCurrentUser ? '' : '.scrollable-message-list'"
                :bound-to="{ x: 'container' }"
                :margin="popoverMarginStyle"
                @show="menuOpened = true"
                @close="menuOpened = false"
              >
                <div slot="content">
                  <div class="dropdown-menu">
                    <button
                      class="dropdown-item dropdown-item-icon"
                      @click="deleteMessage"
                    >
                      <FAIcon icon="times" /> {{ $t("chats.delete") }}
                    </button>
                  </div>
                </div>
                <button
                  slot="trigger"
                  class="menu-icon"
                  :title="$t('chats.more')"
                >
                  <FAIcon icon="ellipsis-h" />
                </button>
              </Popover>
            </div>
            <StatusContent
              :status="messageForStatusContent"
              :full-content="true"
            >
              <span
                slot="footer"
                class="created-at"
              >
                {{ createdAt }}
              </span>
            </StatusContent>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-else
    class="chat-message-date-separator"
  >
    <ChatMessageDate :date="chatViewItem.date" />
  </div>
</template>

<script src="./chat_message.js" ></script>
<style lang="scss">
@import './chat_message.scss';

</style>
