<template>
<div>
  <div v-if="user" class="user-profile panel panel-default">
    <UserCard :user="user" :switcher="true" :selected="timeline.viewing" rounded="top"/>
    <tab-switcher :renderOnlyFocused="true" ref="tabSwitcher">
      <div :label="$t('user_card.statuses')" :disabled="!user.statuses_count">
        <div class="timeline">
          <template v-for="statusId in user.pinnedStatuseIds">
            <Conversation
              v-if="timeline.statusesObject[statusId]"
              class="status-fadein"
              :key="statusId"
              :statusoid="timeline.statusesObject[statusId]"
              :collapsable="true"
              :showPinned="true"
            />
          </template>
        </div>
        <Timeline
          :count="user.statuses_count"
          :embedded="true"
          :title="$t('user_profile.timeline_title')"
          :timeline="timeline"
          :timeline-name="'user'"
          :user-id="userId"
        />
      </div>
      <div :label="$t('user_card.followees')" v-if="followsTabVisible" :disabled="!user.friends_count">
        <FriendList :userId="userId">
          <template slot="item" slot-scope="{item}">
            <FollowCard :user="item" />
          </template>
        </FriendList>
      </div>
      <div :label="$t('user_card.followers')" v-if="followersTabVisible" :disabled="!user.followers_count">
        <FollowerList :userId="userId">
          <template slot="item" slot-scope="{item}">
            <FollowCard :user="item" :noFollowsYou="isUs" />
          </template>
        </FollowerList>
      </div>
      <Timeline
        :label="$t('user_card.media')"
        :disabled="!media.visibleStatuses.length"
        :embedded="true" :title="$t('user_card.media')"
        timeline-name="media"
        :timeline="media"
        :user-id="userId"
      />
      <Timeline
        v-if="isUs"
        :label="$t('user_card.favorites')"
        :disabled="!favorites.visibleStatuses.length"
        :embedded="true"
        :title="$t('user_card.favorites')"
        timeline-name="favorites"
        :timeline="favorites"
      />
    </tab-switcher>
  </div>
  <div v-else class="panel user-profile-placeholder">
    <div class="panel-heading">
      <div class="title">
        {{ $t('settings.profile_tab') }}
      </div>
    </div>
    <div class="panel-body">
      <span v-if="error">{{ error }}</span>
      <i class="icon-spin3 animate-spin" v-else></i>
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
