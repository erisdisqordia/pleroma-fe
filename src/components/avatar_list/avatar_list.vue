<template>
  <ul class="avatars" :class="{ 'transparent-avatar': slicedAvatars.length == 15 }">
      <li class="avatars-item" v-for="avatar in slicedAvatars" :key="avatar.id">
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
    height: 30px;
    margin: 0;
    padding: 0;
    width: 15px;

    .avatars-img {
      border-radius: 50%;
      height: 30px;
      width: 30px;
      line-height: 30px;
      background-color: $main-background;
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
          background-color: rgba(255, 255, 255, 0.7);
          left: 0;
          top: 0;
        }
      }
    }
  }
}
</style>
