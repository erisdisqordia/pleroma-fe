<template>
  <basic-user-card :user="user">
    <template slot="secondary-area">
      <button class="btn btn-default" @click="unblockUser" :disabled="progress">
        <template v-if="progress">
          {{ $t('user_card.unblock_progress') }}
        </template>
        <template v-else>
          {{ $t('user_card.unblock') }}
        </template>
      </button>
    </template>
  </basic-user-card>
</template>

<script src="./block_card.js"></script>