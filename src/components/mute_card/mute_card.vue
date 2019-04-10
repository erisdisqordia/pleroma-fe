<template>
  <basic-user-card :user="user">
    <div class="mute-card-content-container">
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
    </div>
  </basic-user-card>
</template>

<script src="./mute_card.js"></script>

<style lang="scss">
.mute-card-content-container {
  margin-top: 0.5em;
  text-align: right;
  button {
    width: 10em;
  }
}
</style>
