<template>
  <div class="account-actions">
    <v-popover
      trigger="click"
      class="account-tools-popover"
      :container="false"
      placement="bottom-end"
      :offset="5"
    >
      <div slot="popover">
        <div class="dropdown-menu">
          <button
            class="btn btn-default btn-block dropdown-item"
            @click="mentionUser"
          >
            {{ $t('user_card.mention') }}
          </button>
          <template v-if="user.following">
            <div
              role="separator"
              class="dropdown-divider"
            />
            <button
              v-if="user.showing_reblogs"
              class="btn btn-default dropdown-item"
              @click="hideRepeats"
            >
              {{ $t('user_card.hide_repeats') }}
            </button>
            <button
              v-if="!user.showing_reblogs"
              class="btn btn-default dropdown-item"
              @click="showRepeats"
            >
              {{ $t('user_card.show_repeats') }}
            </button>
          </template>
          <div
            role="separator"
            class="dropdown-divider"
          />
          <button
            v-if="user.statusnet_blocking"
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
        </div>
      </div>
      <div class="btn btn-default ellipsis-button">
        <i class="icon-ellipsis trigger-button" />
      </div>
    </v-popover>
  </div>
</template>

<script src="./account_actions.js"></script>

<style lang="scss">
@import '../../_variables.scss';
@import '../popper/popper.scss';
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

.account-actions .open {
  min-width: 130px;
}
</style>
