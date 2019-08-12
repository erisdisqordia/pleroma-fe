<template>
  <div class="emoji-dropdown-menu panel panel-default">
    <div class="panel-heading emoji-tabs">
      <span
        v-for="(value, key) in emojis"
        :key="key"
        class="emoji-tabs-item"
        :class="{'active': activeGroup === key}"
        :title="value.text"
        @click.prevent="highlight(key)"
      >
        <i :class="value.icon" />
      </span>
    </div>
    <div class="panel-body emoji-dropdown-menu-content">
      <div class="emoji-search">
        <input
          v-model="keyword"
          type="text"
          class="form-control"
        >
      </div>
      <div
        ref="emoji-groups"
        class="emoji-groups"
        @scroll="scrolledGroup"
      >
        <div
          v-for="(value, key) in emojis"
          :key="key"
          class="emoji-group"
        >
          <h6
            :ref="'group-' + key"
            class="emoji-group-title"
          >
            {{ value.text }}
          </h6>
          <span
            v-for="emoji in value.emojis"
            :key="key + emoji.displayText"
            :title="emoji.displayText"
            class="emoji-item"
            @click="onEmoji(emoji)"
          >
            <span v-if="!emoji.imageUrl">{{ emoji.replacement }}</span>
            <img
              v-else
              :src="emoji.imageUrl"
            >
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./emoji_picker.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.emoji {
  &-dropdown {
    position: absolute;
    right: 0;
    top: 28px;
    z-index: 1;

    &-toggle {
      cursor: pointer;
      position: absolute;
      top: -23px;
      right: 2px;
      line-height: 1;

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

      &.active {
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

    input {
      width: 100%;
    }
  }

  &-groups {
    flex: 1 1 1px;
    overflow: auto;
    position: relative;
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
    width: 32px;
    height: 32px;
    box-sizing: border-box;
    display: flex;
    font-size: 32px;
    align-items: center;
    justify-content: center;
    margin: 2px;
    cursor: pointer;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

}
</style>
