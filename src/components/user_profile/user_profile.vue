<template>
  <div>
    <div
      v-if="user.id"
      class="user-profile panel panel-default"
    >
      <UserCard
        :user="user"
        :switcher="true"
        :selected="timeline.viewing"
        rounded="top"
      />
      <tab-switcher
        ref="tabSwitcher"
        :render-only-focused="true"
      >
        <Timeline
          :label="$t('user_card.statuses')"
          :disabled="!user.statuses_count"
          :count="user.statuses_count"
          :embedded="true"
          :title="$t('user_profile.timeline_title')"
          :timeline="timeline"
          :timeline-name="'user'"
          :user-id="userId"
        />
        <div
          v-if="followsTabVisible"
          :label="$t('user_card.followees')"
          :disabled="!user.friends_count"
        >
          <FriendList :user-id="userId" />
        </div>
        <div
          v-if="followersTabVisible"
          :label="$t('user_card.followers')"
          :disabled="!user.followers_count"
        >
          <FollowerList
            :user-id="userId"
            :entry-props="{noFollowsYou: isUs}"
          />
        </div>
        <Timeline
          :label="$t('user_card.media')"
          :disabled="!media.visibleStatuses.length"
          :embedded="true"
          :title="$t('user_card.media')"
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
