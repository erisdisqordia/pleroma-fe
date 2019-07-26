<template>
  <div
    class="sticker-picker"
  >
    <div
      class="sticker-picker-panel"
    >
      <tab-switcher
        :render-only-focused="true"
      >
        <div
          v-for="stickerpack in pack"
          :key="stickerpack.path"
          :image-tooltip="stickerpack.meta.title"
          :image="stickerpack.path + stickerpack.meta.tabIcon"
          class="sticker-picker-content"
        >
          <div
            v-for="sticker in stickerpack.meta.stickers"
            :key="sticker"
            class="sticker"
            @click="pick(stickerpack.path + sticker, stickerpack.meta.title)"
          >
            <img
              :src="stickerpack.path + sticker"
            >
          </div>
        </div>
      </tab-switcher>
    </div>
  </div>
</template>

<script src="./sticker_picker.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.sticker-picker {
  .sticker-picker-panel {
    display: inline-block;
    width: 100%;
    .sticker-picker-content {
      max-height: 300px;
      overflow-y: scroll;
      overflow-x: auto;
      .sticker {
        display: inline-block;
        width: 20%;
        height: 20%;
        img {
          width: 100%;
          &:hover {
            filter: drop-shadow(0 0 5px var(--link, $fallback--link));
          }
        }
      }
    }
  }
}

</style>
