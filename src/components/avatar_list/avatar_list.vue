<template>
  <ul class="avatars" :class="{ 'transparent-avatar': slicedAvatars.length == 15 }">
      <li class="avatars-item" v-for="(avatar, index) in slicedAvatars" :key="`avatar-${index}`">
        <UserAvatar :src="avatar.profile_image_url" class="avatars-img" />
      </li>
  </ul>
</template>

<script src="./avatar_list.js" ></script>

<style lang="scss">
@import '../../_variables.scss';
.avatars {
  display: inline-flex; /* Causes LI items to display in row. */
  list-style-type: none;
  margin: 0;

  &-item {
    height: 25px;
    width: 25px;
    margin: 0;
    padding: 0;

    .avatars-img {
      border-radius: $fallback--avatarAltRadius;
      border-radius: var(--avatarAltRadius, $fallback--avatarAltRadius);
      height: 25px !important;
      width: 25px !important;
      background-color: $fallback--lightText;
      background-color: var(--lightText, $fallback--lightText);
    }
  }
}

.transparent-avatar {
  .avatars-item {
    &:first-child {
      position: relative;

      .avatars-img {
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: $fallback--faint;
          background-color: var(--faint, $fallback--faint);
          left: 0;
          top: 0;
        }
      }
    }
  }
}
</style>
