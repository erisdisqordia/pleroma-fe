<template>
  <div class="AccountActions">
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
        <FAIcon
          class="icon"
          icon="ellipsis-v"
        />
      </div>
    </Popover>
  </div>
</template>

<script src="./account_actions.js"></script>

<style lang="scss">
@import '../../_variables.scss';
.AccountActions {
  button.dropdown-item {
    margin-left: 0;
  }

  .ellipsis-button {
    cursor: pointer;
    width: 2.5em;
    margin: -0.5em 0;
    padding: 0.5em 0;
    text-align: center;

    &:not(:hover) .icon {
      color: $fallback--lightText;
      color: var(--lightText, $fallback--lightText);
    }
  }
}
</style>
