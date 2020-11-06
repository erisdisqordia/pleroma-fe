<template>
  <div class="preview-container">
    <div class="underlay underlay-preview" />
    <div class="panel dummy">
      <div class="panel-heading">
        <div class="title">
          {{ $t('settings.style.preview.header') }}
          <span class="badge badge-notification">
            99
          </span>
        </div>
        <span class="faint">
          {{ $t('settings.style.preview.header_faint') }}
        </span>
        <span class="alert error">
          {{ $t('settings.style.preview.error') }}
        </span>
        <button class="btn">
          {{ $t('settings.style.preview.button') }}
        </button>
      </div>
      <div class="panel-body theme-preview-content">
        <div class="post">
          <div class="avatar still-image">
            ( ͡° ͜ʖ ͡°)
          </div>
          <div class="content">
            <h4>
              {{ $t('settings.style.preview.content') }}
            </h4>

            <i18n path="settings.style.preview.text">
              <code style="font-family: var(--postCodeFont)">
                {{ $t('settings.style.preview.mono') }}
              </code>
              <a style="color: var(--link)">
                {{ $t('settings.style.preview.link') }}
              </a>
            </i18n>

            <div class="icons">
              <FAIcon
                fixed-width
                style="color: var(--cBlue)"
                class="fa-scale-110 fa-old-padding"
                icon="reply"
              />
              <FAIcon
                fixed-width
                style="color: var(--cGreen)"
                class="fa-scale-110 fa-old-padding"
                icon="retweet"
              />
              <FAIcon
                fixed-width
                style="color: var(--cOrange)"
                class="fa-scale-110 fa-old-padding"
                icon="star"
              />
              <FAIcon
                fixed-width
                style="color: var(--cRed)"
                class="fa-scale-110 fa-old-padding"
                icon="times"
              />
            </div>
          </div>
        </div>

        <div class="after-post">
          <div class="avatar-alt">
            :^)
          </div>
          <div class="content">
            <i18n
              path="settings.style.preview.fine_print"
              tag="span"
              class="faint"
            >
              <a style="color: var(--faintLink)">
                {{ $t('settings.style.preview.faint_link') }}
              </a>
            </i18n>
          </div>
        </div>
        <div class="separator" />

        <span class="alert error">
          {{ $t('settings.style.preview.error') }}
        </span>
        <input
          :value="$t('settings.style.preview.input')"
          type="text"
        >

        <div class="actions">
          <span class="checkbox">
            <input
              id="preview_checkbox"
              checked="very yes"
              type="checkbox"
            >
            <label for="preview_checkbox">{{ $t('settings.style.preview.checkbox') }}</label>
          </span>
          <button class="btn">
            {{ $t('settings.style.preview.button') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTimes,
  faStar,
  faRetweet,
  faReply
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faTimes,
  faStar,
  faRetweet,
  faReply
)

export default {}
</script>

<style lang="scss">
.preview-container {
  position: relative;
}
.underlay-preview {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 10px;
  right: 10px;
}
</style>
