<template>
  <basic-user-card :user="user">
    <div class="mute-card-content-container">
      <button
        v-if="muted"
        class="btn button-default"
        :disabled="progress"
        @click="unmuteUser"
      >
        <template v-if="progress">
          {{ $t('user_card.unmute_progress') }}
        </template>
        <template v-else>
          {{ $t('user_card.unmute') }}
        </template>
      </button>
      <button
        v-else
        class="btn button-default"
        :disabled="progress"
        @click="muteUser"
      >
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
