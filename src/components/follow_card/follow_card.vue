<template>
  <basic-user-card :user="user">
    <template slot="secondary-area">
      <div class="follow-box">
        <button
          v-if="showFollow"
          class="btn btn-default"
          @click="followUser"
          :disabled="progress"
          :title="requestSent ? $t('user_card.follow_again') : ''"
        >
          <template v-if="progress">
            {{ $t('user_card.follow_progress') }}
          </template>
          <template v-else-if="requestSent">
            {{ $t('user_card.follow_sent') }}
          </template>
          <template v-else>
            {{ $t('user_card.follow') }}
          </template>
        </button>
        <button v-if="following" class="btn btn-default pressed" @click="unfollowUser" :disabled="progress">
          <template v-if="progress">
            {{ $t('user_card.follow_progress') }}
          </template>
          <template v-else>
            {{ $t('user_card.follow_unfollow') }}
          </template>
        </button>
      </div>
    </template>
    <template slot="third-area">
      <span class="faint" v-if="!noFollowsYou && user.follows_you">
        {{ isMe ? $t('user_card.its_you') : $t('user_card.follows_you') }}
      </span>
    </template>
  </basic-user-card>
</template>

<script src="./follow_card.js"></script>
