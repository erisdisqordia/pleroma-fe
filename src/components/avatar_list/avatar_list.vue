<template>
  <div class="avatars">
    <router-link
      :to="userProfileLink(user)"
      class="avatars-item"
      v-for="user in slicedUsers"
      :key="user.id"
    >
      <UserAvatar :user="user" class="avatar-small" />
    </router-link>
  </div>
</template>

<script src="./avatar_list.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.avatars {
  display: flex;
  margin: 0;
  padding: 0;

  // For hiding overflowing elements
  flex-wrap: wrap;
  height: 24px;

  .avatars-item {
    margin: 0 0 5px 5px;

    &:first-child {
      padding-left: 5px;
    }

    .avatar-small {
      border-radius: $fallback--avatarAltRadius;
      border-radius: var(--avatarAltRadius, $fallback--avatarAltRadius);
      height: 24px;
      width: 24px;
    }
  }
}
</style>
