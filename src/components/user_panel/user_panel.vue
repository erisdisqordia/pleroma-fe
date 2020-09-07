<template>
  <div class="user-panel">
    <div
      v-if="signedIn"
      key="user-panel"
      class="panel panel-default signed-in"
    >
      <UserCard
        :user-id="user.id"
        :hide-bio="true"
        rounded="top"
      />
      <PostStatusForm />
    </div>
    <auth-form
      v-else
      key="user-panel"
    />
  </div>
</template>

<script src="./user_panel.js"></script>

<style lang="scss">
.user-panel .signed-in {
  overflow: visible;
}
</style>
