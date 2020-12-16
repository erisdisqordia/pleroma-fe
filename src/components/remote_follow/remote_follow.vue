<template>
  <div class="remote-follow">
    <form
      method="POST"
      :action="subscribeUrl"
    >
      <input
        type="hidden"
        name="nickname"
        :value="user.screen_name"
      >
      <input
        type="hidden"
        name="profile"
        value=""
      >
      <button
        click="submit"
        class="button-default remote-button"
      >
        {{ $t('user_card.remote_follow') }}
      </button>
    </form>
  </div>
</template>

<script src="./remote_follow.js"></script>

<style lang="scss">
.remote-follow {
  max-width: 220px;

  .remote-button {
    width: 100%;
    min-height: 28px;
  }
}
</style>
