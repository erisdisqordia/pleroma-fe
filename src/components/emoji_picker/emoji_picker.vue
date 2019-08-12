<template>
  <div class="emoji-picker panel panel-default">
    <div class="panel-heading">
      <span class="emoji-tabs">
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
      </span>
      <span class="additional-tabs">
        <slot name="tabs" />
      </span>
    </div>
    <div class="panel-body emoji-dropdown-menu-content">
      <div
        v-if="!showingAdditional"
        class="emoji-content"
      >
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
      <div v-if="showingAdditional" class="additional-tabs-content">
        <slot name="tab-content" />
      </div>
    </div>
</div>
</template>

<script src="./emoji_picker.js"></script>
<style lang="scss" src="./emoji_picker.scss"></style>
