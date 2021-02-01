<template>
  <basic-user-card :user="user">
    <div class="block-card-content-container">
      <button
        v-if="blocked"
        class="btn button-default"
        :disabled="progress"
        @click="unblockUser"
      >
        <template v-if="progress">
          {{ $t('user_card.unblock_progress') }}
        </template>
        <template v-else>
          {{ $t('user_card.unblock') }}
        </template>
      </button>
      <button
        v-else
        class="btn button-default"
        :disabled="progress"
        @click="blockUser"
      >
        <template v-if="progress">
          {{ $t('user_card.block_progress') }}
        </template>
        <template v-else>
          {{ $t('user_card.block') }}
        </template>
      </button>
    </div>
  </basic-user-card>
</template>

<script src="./block_card.js"></script>

<style lang="scss">
.block-card-content-container {
  margin-top: 0.5em;
  text-align: right;
  button {
    width: 10em;
  }
}
</style>
