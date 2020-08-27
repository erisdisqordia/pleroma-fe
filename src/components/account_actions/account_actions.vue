<template>
  <div class="account-actions">
    <Popover
      trigger="click"
      placement="bottom"
      :bound-to="{ x: 'container' }"
    >
      <div
        slot="content"
        class="account-tools-popover"
      >
        <div class="dropdown-menu">
          <template v-if="relationship.following">
            <button
              v-if="relationship.showing_reblogs"
              class="btn btn-default dropdown-item"
              @click="hideRepeats"
            >
              {{ $t('user_card.hide_repeats') }}
            </button>
            <button
              v-if="!relationship.showing_reblogs"
              class="btn btn-default dropdown-item"
              @click="showRepeats"
            >
              {{ $t('user_card.show_repeats') }}
            </button>
            <div
              role="separator"
              class="dropdown-divider"
            />
          </template>
          <button
            v-if="relationship.blocking"
            class="btn btn-default btn-block dropdown-item"
            @click="unblockUser"
          >
            {{ $t('user_card.unblock') }}
          </button>
          <button
            v-else
            class="btn btn-default btn-block dropdown-item"
            @click="blockUser"
          >
            {{ $t('user_card.block') }}
          </button>
          <button
            class="btn btn-default btn-block dropdown-item"
            @click="reportUser"
          >
            {{ $t('user_card.report') }}
          </button>
          <button
            v-if="pleromaChatMessagesAvailable"
            class="btn btn-default btn-block dropdown-item"
            @click="openChat"
          >
            {{ $t('user_card.message') }}
          </button>
        </div>
      </div>
      <div
        slot="trigger"
        class="btn btn-default ellipsis-button"
      >
        <i class="icon-ellipsis trigger-button" />
      </div>
    </Popover>
  </div>
</template>

<script src="./account_actions.js"></script>

<style lang="scss">
@import '../../_variables.scss';
.account-actions {
  margin: 0 .8em;
}

.account-actions button.dropdown-item {
  margin-left: 0;
}

.account-actions .trigger-button {
  color: $fallback--lightText;
  color: var(--lightText, $fallback--lightText);
  opacity: .8;
  cursor: pointer;
  &:hover {
    color: $fallback--text;
    color: var(--text, $fallback--text);
  }
}
</style>
