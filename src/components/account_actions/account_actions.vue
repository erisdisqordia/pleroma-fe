<template>
  <div class="account-actions">
    <FollowButton :user="user" />
    <v-popover
      trigger="click"
      class="account-tools-popover"
      :container="false"
      placement="bottom-end"
      :offset="5"
      @show="showDropDown = true"
      @hide="showDropDown = false"
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
            <ProgressButton
              v-if="!user.subscribed"
              class="btn btn-default dropdown-item"
              :click="subscribeUser"
              :title="$t('user_card.subscribe')"
            >
              {{ $t('user_card.subscribe') }}
            </ProgressButton>
            <ProgressButton
              v-else
              class="btn btn-default pressed dropdown-item"
              :click="unsubscribeUser"
              :title="$t('user_card.unsubscribe')"
            >
              {{ $t('user_card.unsubscribe') }}
            </ProgressButton>

            <button
              v-if="user.showing_reblogs"
              class="btn btn-default dropdown-item"
              @click="hideRepeats"
            >
              {{ $t('user_card.hide_repeats') }}
            </button>
            <button
              v-if="!user.showing_reblogs"
              class="btn btn-default pressed dropdown-item"
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
            v-if="user.muted"
            class="btn btn-default btn-block pressed dropdown-item"
            @click="unmuteUser"
          >
            {{ $t('user_card.muted') }}
          </button>
          <button
            v-else
            class="btn btn-default btn-block dropdown-item"
            @click="muteUser"
          >
            {{ $t('user_card.mute') }}
          </button>
          <button
            v-if="user.statusnet_blocking"
            class="btn btn-default btn-block pressed dropdown-item"
            @click="unblockUser"
          >
            {{ $t('user_card.blocked') }}
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
      <button class="btn btn-default ellipsis-button">
        <i class="icon-ellipsis" />
      </button>
    </v-popover>
  </div>
</template>

<script src="./account_actions.js"></script>

<style lang="scss">
@import '../../_variables.scss';
@import '../popper/popper.scss';

.account-tools-popover {
  height: 100%;
  .trigger {
    display: flex !important;
    height: 100%;
  }
}
.account-actions {
  display: flex;
  flex: 0 0 0 !important;
  margin: 0 3em 0 0 !important;
}
.account-actions .follow-button {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
.account-actions .ellipsis-button {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
.account-actions .button-icon {
}
</style>
