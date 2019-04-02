<template>
  <ul class="avatars" :class="{ 'transparent-avatar': slicedAvatars.length == 10 }">
      <li class="avatars__item" v-for="avatar in slicedAvatars" :key="avatar.id">
        <UserAvatar :src="avatar.avatar_static" class="avatars__img" />
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
  padding: 0px 20px 0px 0px;
  flex-direction: row;
  flex-wrap: wrap;

  &__item {
    height: 40px;
    margin: 0;
    padding: 0;
    width: 20px;

    &:nth-child( 1 ) { z-index: 10 ; }
    &:nth-child( 2 ) { z-index: 9 ; }
    &:nth-child( 3 ) { z-index: 8 ; }
    &:nth-child( 4 ) { z-index: 7 ; }
    &:nth-child( 5 ) { z-index: 6 ; }
    &:nth-child( 6 ) { z-index: 5 ; }
    &:nth-child( 7 ) { z-index: 4 ; }
    &:nth-child( 8 ) { z-index: 3 ; }
    &:nth-child( 9 ) { z-index: 2 ; }
    &:nth-child( 10 ) { z-index: 1 ; }

    .avatars__img {
      border-radius: 50%;
      height: 40px;
      width: 40px;
      line-height: 40px;
      background-color: $main-background;
    }
  }
}

.transparent-avatar {
  .avatars__item {
    &:last-child {
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
