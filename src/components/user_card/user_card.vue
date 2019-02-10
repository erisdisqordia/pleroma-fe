<template>
  <div class="card">
    <router-link :to="userProfileLink(user)">
      <UserAvatar class="avatar" :compact="true" @click.prevent.native="toggleUserExpanded" :src="user.profile_image_url"/>
    </router-link>
    <div class="usercard" v-if="userExpanded">
      <user-card-content :user="user" :switcher="false"></user-card-content>
    </div>
    <div class="name-and-screen-name" v-else>
      <div :title="user.name" class="user-name">
        <span v-if="user.name_html" v-html="user.name_html"></span>
        <span v-else>{{ user.name }}</span>
        <span class="follows-you" v-if="!userExpanded && showFollows && user.follows_you">
          {{ currentUser.id == user.id ? $t('user_card.its_you') : $t('user_card.follows_you') }}
        </span>
      </div>
      <div class="user-link-action">
        <router-link class='user-screen-name' :to="userProfileLink(user)">
          @{{user.screen_name}}
        </router-link>
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
        <button v-if="showActions && showFollows && following" class="btn btn-default" @click="unfollowUser" :disabled="followRequestInProgress">
          <template v-if="followRequestInProgress">
            {{ $t('user_card.follow_progress') }}
          </template>
          <template v-else>
            {{ $t('user_card.follow_unfollow') }}
          </template>
        </button>
      </div>
    </div>
    <div class="approval" v-if="showApproval">
      <button class="btn btn-default" @click="approveUser">{{ $t('user_card.approve') }}</button>
      <button class="btn btn-default" @click="denyUser">{{ $t('user_card.deny') }}</button>
    </div>
  </div>
</template>

<script src="./user_card.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.name-and-screen-name {
  margin-left: 0.7em;
  margin-top:0.0em;
  text-align: left;
  width: 100%;
  .user-name {
    display: flex;
    justify-content: space-between;

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

    button {
      margin-top: 3px;
    }
  }
}

.follows-you {
  margin-left: 2em;
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
}

.usercard {
  width: fill-available;
  margin: 0.2em 0 0 0.7em;
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
  button {
    width: 100%;
    margin-bottom: 0.5em;
  }
}
</style>
