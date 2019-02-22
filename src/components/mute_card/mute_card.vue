<template>
  <basic-user-card :user="user">
    <template slot="secondary-area">
      <button class="btn btn-default" @click="unmuteUser" :disabled="progress" v-if="muted">
        <template v-if="progress">
          {{ $t('user_card.unmute_progress') }}
        </template>
        <template v-else>
          {{ $t('user_card.unmute') }}
        </template>
      </button>
      <button class="btn btn-default" @click="muteUser" :disabled="progress" v-else>
        <template v-if="progress">
          {{ $t('user_card.mute_progress') }}
        </template>
        <template v-else>
          {{ $t('user_card.mute') }}
        </template>
      </button>
    </template>
  </basic-user-card>
</template>

<script src="./mute_card.js"></script>