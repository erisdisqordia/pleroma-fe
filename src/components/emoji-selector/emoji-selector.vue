<template>
  <div class="emoji-dropdown">
    <span class="emoji-dropdown-toggle" @click="togglePanel">Emoji</span>
    <div class="emoji-dropdown-menu" v-if="open">
      <span v-for="emoji in standardEmoji" :key="'standard' + emoji.shortcode" :title="emoji.shortcode" class="emoji-item">
        <span v-if="!emoji.image_url">{{emoji.utf}}</span>
        <img :src="emoji.utf" v-else>
      </span>
      <span v-for="emoji in customEmoji" :key="'custom' + emoji.shortcode" :title="emoji.shortcode" class="emoji-item">
        <span v-if="!emoji.image_url">{{emoji.utf}}</span>
        <img :src="'https://bikeshed.party' + emoji.image_url" v-else>
      </span>
    </div>
  </div>
</template>

<script src="./emoji-selector.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.emoji {
  &-dropdown {
    position: relative;

    &-toggle {
      cursor: pointer;
    }

    &-menu {
      position: absolute;
      z-index: 1;
      right: 0;
      width: 300px;
      height: 300px;
      background: white;
      border: 1px solid $fallback--faint;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      overflow: auto;
      margin-bottom: 5px;

      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }

  &-item {
    width: 34px;
    height: 34px;
    box-sizing: border-box;
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: center;
    color: black;
    padding: 5px;
    cursor: pointer;
  }

}
</style>
