<template>
  <basic-user-card :user="user">
    <div class="follow-card-content-container">
      <span class="faint" v-if="!noFollowsYou && user.follows_you">
        {{ isMe ? $t('user_card.its_you') : $t('user_card.follows_you') }}
      </span>
      <template v-if="!loggedIn">
        <div class="follow-card-follow-button" v-if="!user.following">
          <RemoteFollow :user="user" />
        </div>
      </template>
      <template v-else>
        <button
          v-if="!user.following"
          class="btn btn-default follow-card-follow-button"
          @click="followUser"
          :disabled="inProgress"
          :title="requestSent ? $t('user_card.follow_again') : ''"
        >
          <template v-if="inProgress">
            {{ $t('user_card.follow_progress') }}
          </template>
          <template v-else-if="requestSent">
            {{ $t('user_card.follow_sent') }}
          </template>
          <template v-else>
            {{ $t('user_card.follow') }}
          </template>
        </button>
        <button v-else class="btn btn-default follow-card-follow-button pressed" @click="unfollowUser" :disabled="inProgress">
          <template v-if="inProgress">
            {{ $t('user_card.follow_progress') }}
          </template>
          <template v-else>
            {{ $t('user_card.follow_unfollow') }}
          </template>
        </button>
      </template>
    </div>
  </basic-user-card>
</template>

<script src="./follow_card.js"></script>

<style lang="scss">
.follow-card {
  &-content-container {
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    line-height: 1.5em;
  }

  &-follow-button {
    margin-top: 0.5em;
    margin-left: auto;
    width: 10em;
  }
}
</style>
