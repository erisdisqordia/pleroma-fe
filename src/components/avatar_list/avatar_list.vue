<template>
  <ul class="avatars" :class="{ 'transparent-avatar': slicedAvatars.length == 10 }">
      <li class="avatars__item" v-for="(avatar, index) in slicedAvatars" :key="index">
        <UserAvatar :src="avatar.src" class="avatars__img" />
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
  padding: 0px 16px 0px 0px;
  flex-direction: row-reverse;

  &__item {
    height: 40px;
    margin: 0;
    padding: 0;
    width: 25px;

    .avatars__img {
      border-radius: 50%;
      height: 40px;
      width: 40px;
      line-height: 40px;
    }
  }
}

.transparent-avatar {
  .avatars__item {
    &:first-child {
      position: relative;

      .avatars__img {
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
