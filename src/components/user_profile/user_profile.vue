<template>
  <div>
    <div
      v-if="user"
      class="user-profile panel panel-default"
    >
      <UserCard
        :user-id="userId"
        :switcher="true"
        :selected="timeline.viewing"
        :allow-zooming-avatar="true"
        rounded="top"
      />
      <tab-switcher
        :active-tab="tab"
        :render-only-focused="true"
        :on-switch="onTabSwitch"
      >
        <Timeline
          key="statuses"
          :label="$t('user_card.statuses')"
          :count="user.statuses_count"
          :embedded="true"
          :title="$t('user_profile.timeline_title')"
          :timeline="timeline"
          timeline-name="user"
          :user-id="userId"
          :pinned-status-ids="user.pinnedStatusIds"
          :in-profile="true"
        />
        <div
          v-if="followsTabVisible"
          key="followees"
          :label="$t('user_card.followees')"
          :disabled="!user.friends_count"
        >
          <FriendList :user-id="userId">
            <template
              slot="item"
              slot-scope="{item}"
            >
              <FollowCard :user="item" />
            </template>
          </FriendList>
        </div>
        <div
          v-if="followersTabVisible"
          key="followers"
          :label="$t('user_card.followers')"
          :disabled="!user.followers_count"
        >
          <FollowerList :user-id="userId">
            <template
              slot="item"
              slot-scope="{item}"
            >
              <FollowCard
                :user="item"
                :no-follows-you="isUs"
              />
            </template>
          </FollowerList>
        </div>
        <Timeline
          key="media"
          :label="$t('user_card.media')"
          :disabled="!media.visibleStatuses.length"
          :embedded="true"
          :title="$t('user_card.media')"
          timeline-name="media"
          :timeline="media"
          :user-id="userId"
          :in-profile="true"
        />
        <Timeline
          v-if="isUs"
          key="favorites"
          :label="$t('user_card.favorites')"
          :disabled="!favorites.visibleStatuses.length"
          :embedded="true"
          :title="$t('user_card.favorites')"
          timeline-name="favorites"
          :timeline="favorites"
          :in-profile="true"
        />
      </tab-switcher>
    </div>
    <div
      v-else
      class="panel user-profile-placeholder"
    >
      <div class="panel-heading">
        <div class="title">
          {{ $t('settings.profile_tab') }}
        </div>
      </div>
      <div class="panel-body">
        <span v-if="error">{{ error }}</span>
        <i
          v-else
          class="icon-spin3 animate-spin"
        />
      </div>
    </div>
  </div>
</template>

<script src="./user_profile.js"></script>

<style lang="scss">

.user-profile {
  flex: 2;
  flex-basis: 500px;

  .userlist-placeholder {
    display: flex;
    justify-content: center;
    align-items: middle;
    padding: 2em;
  }

  .timeline-heading {
    display: flex;
    justify-content: center;

    .loadmore-button, .alert {
      flex: 1;
    }

    .loadmore-button {
      height: 28px;
      margin: 10px .6em;
    }

    .title, .loadmore-text {
      display: none
    }
  }
}
.user-profile-placeholder {
  .panel-body {
    display: flex;
    justify-content: center;
    align-items: middle;
    padding: 7em;
  }
}
</style>
