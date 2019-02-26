<template>
  <basic-user-card :user="user">
    <template slot="primary-area">
      <span class="faint" v-if="!noFollowsYou && user.follows_you">
        {{ isMe ? $t('user_card.its_you') : $t('user_card.follows_you') }}
      </span>
    </template>
    <template slot="secondary-area">
      <button
        v-if="showFollow"
        class="btn btn-default"
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
      <button v-if="following" class="btn btn-default pressed" @click="unfollowUser" :disabled="inProgress">
        <template v-if="inProgress">
          {{ $t('user_card.follow_progress') }}
        </template>
        <template v-else>
          {{ $t('user_card.follow_unfollow') }}
        </template>
      </button>
    </template>
  </basic-user-card>
</template>

<script src="./follow_card.js"></script>
