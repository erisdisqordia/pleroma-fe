<template>
  <ul class="avatars">
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
  padding: 0px 15px 0px 0px;
  flex-direction: row-reverse;

  &-item {
    height: 25px;
    margin: 0;
    padding: 0;
    width: 15px;

    .avatars-img {
      border-radius: $fallback--avatarAltRadius;
      border-radius: var(--avatarAltRadius, $fallback--avatarAltRadius);
      height: 25px !important;
      width: 25px !important;
    }
  }
}
</style>
