<template>
  <div class="card">
    <router-link :to="userProfileLink(user)">
      <UserAvatar class="avatar" @click.prevent.native="toggleUserExpanded" :src="user.profile_image_url"/>
    </router-link>
    <div class="user-card-main-content">
      <div class="usercard" v-if="userExpanded">
        <user-card-content :user="user" :switcher="false"></user-card-content>
      </div>
      <div class="name-and-screen-name" v-if="!userExpanded">
        <div :title="user.name" class="user-name">
          <span v-if="user.name_html" v-html="user.name_html"></span>
          <span v-else>{{ user.name }}</span>
        </div>
        <div class="user-link-action">
          <router-link class='user-screen-name' :to="userProfileLink(user)">
            @{{user.screen_name}}
          </router-link>
        </div>
      </div>
      <div class="follow-box" v-if="!userExpanded">
        <span class="faint" v-if="!noFollowsYou && user.follows_you">
          {{ currentUser.id == user.id ? $t('user_card.its_you') : $t('user_card.follows_you') }}
        </span>
        <button
          v-if="showFollow"
          class="btn btn-default"
          @click="followUser"
          :disabled="followRequestInProgress"
          :title="followRequestSent ? $t('user_card.follow_again') : ''"
        >
          <template v-if="followRequestInProgress">
            {{ $t('user_card.follow_progress') }}
          </template>
          <template v-else-if="followRequestSent">
            {{ $t('user_card.follow_sent') }}
          </template>
          <template v-else>
            {{ $t('user_card.follow') }}
          </template>
        </button>
        <button v-if="following" class="btn btn-default pressed" @click="unfollowUser" :disabled="followRequestInProgress">
          <template v-if="followRequestInProgress">
            {{ $t('user_card.follow_progress') }}
          </template>
          <template v-else>
            {{ $t('user_card.follow_unfollow') }}
          </template>
        </button>
      </div>
      <div class="approval" v-if="showApproval">
        <button class="btn btn-default" @click="approveUser">{{ $t('user_card.approve') }}</button>
        <button class="btn btn-default" @click="denyUser">{{ $t('user_card.deny') }}</button>
      </div>
    </div>
  </div>
</template>

<script src="./user_card.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.user-card-main-content {
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  margin-left: 0.7em;
  min-width: 0;
}

.name-and-screen-name {
  text-align: left;
  width: 100%;

  .user-name {
    img {
      object-fit: contain;
      height: 16px;
      width: 16px;
      vertical-align: middle;
    }
  }

  .user-link-action {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
}


.card {
  display: flex;
  flex: 1 0;
  padding-top: 0.6em;
  padding-right: 1em;
  padding-bottom: 0.6em;
  padding-left: 1em;
  border-bottom: 1px solid;
  margin: 0;
  border-bottom-color: $fallback--border;
  border-bottom-color: var(--border, $fallback--border);

  .avatar {
    padding: 0;
  }

  .follow-box {
    text-align: center;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    line-height: 1.5em;

    .btn {
      margin-top: 0.5em;
      margin-left: auto;
      width: 10em;
    }
  }
}

.usercard {
  width: fill-available;
  border-radius: $fallback--panelRadius;
  border-radius: var(--panelRadius, $fallback--panelRadius);
  border-style: solid;
  border-color: $fallback--border;
  border-color: var(--border, $fallback--border);
  border-width: 1px;
  overflow: hidden;

  .panel-heading {
    background: transparent;
    flex-direction: column;
    align-items: stretch;
  }

  p {
    margin-bottom: 0;
  }
}

.approval {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  button {
    margin-top: 0.5em;
    margin-right: 0.5em;
    flex: 1 1;
    max-width: 12em;
    min-width: 8em;
  }
}
</style>
