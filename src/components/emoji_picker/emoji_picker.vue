<template>
  <div class="emoji-picker panel panel-default panel-body">
    <div class="heading">
      <span class="emoji-tabs">
        <span
          v-for="group in emojis"
          :key="group.id"
          class="emoji-tabs-item"
          :class="{
            active: activeGroupView === group.id,
            disabled: group.emojis.length === 0
          }"
          :title="group.text"
          @click.prevent="highlight(group.id)"
        >
          <i :class="group.icon" />
        </span>
      </span>
      <span
        v-if="stickerPickerEnabled"
        class="additional-tabs"
      >
        <span
          class="stickers-tab-icon additional-tabs-item"
          :class="{active: showingStickers}"
          :title="$t('emoji.stickers')"
          @click.prevent="toggleStickers"
        >
          <i class="icon-star" />
        </span>
      </span>
    </div>
    <div class="content">
      <div
        class="emoji-content"
        :class="{hidden: showingStickers}"
      >
        <div class="emoji-search">
          <input
            v-model="keyword"
            type="text"
            class="form-control"
            :placeholder="$t('emoji.search_emoji')"
          >
        </div>
        <div
          ref="emoji-groups"
          class="emoji-groups"
          :class="groupsScrolledClass"
          @scroll="scrolledGroup"
        >
          <div
            v-for="group in emojisView"
            :key="group.id"
            class="emoji-group"
          >
            <h6
              :ref="'group-' + group.id"
              class="emoji-group-title"
            >
              {{ group.text }}
            </h6>
            <span
              v-for="emoji in group.emojis"
              :key="group.id + emoji.displayText"
              :title="emoji.displayText"
              class="emoji-item"
              @click.stop.prevent="onEmoji(emoji)"
            >
              <span v-if="!emoji.imageUrl">{{ emoji.replacement }}</span>
              <img
                v-else
                :src="emoji.imageUrl"
              >
            </span>
          </div>
        </div>
        <div
          class="keep-open"
        >
          <input
            :id="labelKey + 'keep-open'"
            v-model="keepOpen"
            type="checkbox"
          >
          <label
            class="keep-open-label"
            :for="labelKey + 'keep-open'"
          >
            <div class="keep-open-label-text">
              {{ $t('emoji.keep_open') }}
            </div>
          </label>
        </div>
        <div
          v-if="askForSanity"
          class="too-many-emoji"
        >
          <div class="alert warning hint">
            {{ $t('emoji.load_all_hint', { saneAmount } ) }}
          </div>
          <button
            class="btn btn-default"
            @click="loadEmojiInsane"
          >
            {{ $t('emoji.load_all', { emojiAmount: filteredEmoji.length } ) }}
          </button>
        </div>
      </div>
      <div
        v-if="showingStickers"
        class="stickers-content"
      >
        <sticker-picker
          @uploaded="onStickerUploaded"
          @upload-failed="onStickerUploadFailed"
        />
      </div>
    </div>
  </div>
</template>

<script src="./emoji_picker.js"></script>
<style lang="scss" src="./emoji_picker.scss"></style>
