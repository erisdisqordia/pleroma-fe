<template>
  <div
    class="sticker-picker"
  >
    <tab-switcher
      class="tab-switcher"
      :render-only-focused="true"
      scrollable-tabs
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
          @click.stop.prevent="pick(stickerpack.path + sticker, stickerpack.meta.title)"
        >
          <img
            :src="stickerpack.path + sticker"
          >
        </div>
      </div>
    </tab-switcher>
  </div>
</template>

<script src="./sticker_picker.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.sticker-picker {
  width: 100%;
  position: relative;
  .contents {
    min-height: 250px;
    .sticker-picker-content {
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
