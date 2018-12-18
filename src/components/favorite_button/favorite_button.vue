<template>
  <div v-if="loggedIn">
    <i :class='classes' class='button-icon favorite-button fav-active' @click.prevent='favorite()' :title="$t('tool_tip.favorite')"/>
    <span v-if='!hidePostStatsLocal && status.fave_num > 0'>{{status.fave_num}}</span>
  </div>
  <div v-else>
    <i :class='classes' class='button-icon favorite-button' :title="$t('tool_tip.favorite')"/>
    <span v-if='!hidePostStatsLocal && status.fave_num > 0'>{{status.fave_num}}</span>
  </div>
</template>

<script src="./favorite_button.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.fav-active {
  cursor: pointer;
  animation-duration: 0.6s;

  &:hover {
    color: $fallback--cOrange;
    color: var(--cOrange, $fallback--cOrange);
  }
}

.favorite-button.icon-star {
  color: $fallback--cOrange;
  color: var(--cOrange, $fallback--cOrange);
}
</style>
