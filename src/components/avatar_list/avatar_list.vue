<template>
  <ul class="avatars">
      <li class="avatars-item" v-for="avatar in slicedAvatars">
        <UserAvatar :src="avatar.profile_image_url" class="avatar-small" />
      </li>
  </ul>
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

  li.avatars-item {
    margin: 0 0 5px 5px;

    &:first-child {
      padding-left: 10px;
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
