<template>
  <div class="card">
    <a href="#">
      <StillImage @click.prevent="toggleUserExpanded" class="avatar" :src="user.profile_image_url"/>
    </a>
    <div class="usercard" v-if="userExpanded">
      <user-card-content :user="user" :switcher="false"></user-card-content>
    </div>
    <div class="name-and-screen-name" v-else>
      <div :title="user.name" v-if="user.name_html" class="user-name">
        <span v-html="user.name_html"></span>
        <span class="follows-you" v-if="!userExpanded && showFollows && user.follows_you">
          {{ currentUser.id == user.id ? $t('user_card.its_you') : $t('user_card.follows_you') }}
        </span>
      </div>
      <div :title="user.name" v-else class="user-name">
        {{ user.name }}
        <span class="follows-you" v-if="!userExpanded && showFollows && user.follows_you">
          {{ currentUser.id == user.id ? $t('user_card.its_you') : $t('user_card.follows_you') }}
        </span>
      </div>

      <router-link class='user-screen-name' :to="userProfileLink(user)">
        @{{user.screen_name}}
      </router-link>
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
    img {
      object-fit: contain;
      height: 16px;
      width: 16px;
      vertical-align: middle;
    }
  }
}

.follows-you {
  margin-left: 2em;
  float: right;
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
    margin-top: 0.2em;
    width:32px;
    height: 32px;
    border-radius: $fallback--avatarAltRadius;
    border-radius: var(--avatarAltRadius, $fallback--avatarAltRadius);
  }
}

.usercard {
  width: fill-available;
  margin: 0.2em 0 0.7em 0;
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
