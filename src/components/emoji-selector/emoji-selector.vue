<template>
  <div class="emoji-dropdown">
    <span class="emoji-dropdown-toggle" @click="togglePanel">
      <i class="icon-smile"></i>
    </span>
    <div class="emoji-dropdown-menu panel panel-default" v-if="open">
      <div class="panel-heading emoji-tabs">
        <span class="emoji-tabs-item" v-for="(value, key) in emojis" :key="key" :title="value.text">
          <i :class="value.icon"></i>
        </span>
      </div>
      <div class="panel-body emoji-dropdown-menu-content">
        <div class="emoji-search">
          <input type="text" class="form-control" v-model="keyword" />
        </div>
        <div class="emoji-groups">
          <div v-for="(value, key) in emojis" :key="key" class="emoji-group">
            <h6 class="emoji-group-title">{{value.text}}</h6>
            <span
              v-for="emoji in value.emojis"
              :key="key + emoji.shortcode"
              :title="emoji.shortcode"
              class="emoji-item"
              @click="onEmoji(emoji)"
            >
              <span v-if="!emoji.image_url">{{emoji.utf}}</span>
              <img :src="serverUrl + emoji.image_url" v-else>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./emoji-selector.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.emoji {
  &-dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    z-index: 1;

    &-toggle {
      cursor: pointer;
      position: absolute;
      top: -25px;
      right: 2px;

      i {
        font-size: 18px;
      }
    }

    &-menu {
      position: absolute;
      z-index: 1;
      right: 0;
      width: 300px;
      height: 300px;
      display: flex;
      flex-direction: column;
      margin: 0 !important;

      &-content {
        flex: 1 1 1px;
        display: flex;
        flex-direction: column;
      }
    }
  }

  &-tabs {
    &-item {
      padding: 0 5px;

      &:first-child, &.active {
        border-bottom: 4px solid;

        i {
          color: $fallback--lightText;
          color: var(--lightText, $fallback--lightText);
        }
      }
    }
  }

  &-search {
    padding: 5px;
  }

  &-groups {
    flex: 1 1 1px;
    overflow: auto;
  }

  &-group {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;

    &-title {
      font-size: 12px;
      width: 100%;
      margin: 0;
      padding: 5px;
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
    padding: 5px;
    cursor: pointer;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

}
</style>
