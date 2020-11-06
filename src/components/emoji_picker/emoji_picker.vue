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
          <FAIcon
            :icon="group.icon"
            fixed-width
          />
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
          <FAIcon
            icon="sticky-note"
            fixed-width
          />
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
          @scroll="onScroll"
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
            <span :ref="'group-end-' + group.id" />
          </div>
        </div>
        <div class="keep-open">
          <Checkbox v-model="keepOpen">
            {{ $t('emoji.keep_open') }}
          </Checkbox>
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
