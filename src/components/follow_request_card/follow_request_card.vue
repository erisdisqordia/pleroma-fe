<template>
  <basic-user-card :user="user">
    <template slot="third-area">
      <div class="follow-request-card-action-buttons-container">
        <button class="btn btn-default" @click="approveUser">{{ $t('user_card.approve') }}</button>
        <button class="btn btn-default" @click="denyUser">{{ $t('user_card.deny') }}</button>
      </div>
    </template>
  </basic-user-card>
</template>

<script src="./follow_request_card.js"></script>

<style lang="scss">
.follow-request-card-action-buttons-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  button {
    margin-top: 0.5em;
    margin-right: 0.5em;
    flex: 1 1;
    max-width: 12em;
    min-width: 8em;
  }
}
</style>
