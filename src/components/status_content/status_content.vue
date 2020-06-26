<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="status-body">
    <slot name="header" />
    <div
      v-if="status.summary_html"
      class="summary-wrapper"
      :class="{ 'tall-subject': (longSubject && !showingLongSubject) }"
    >
      <div
        class="media-body summary"
        @click.prevent="linkClicked"
        v-html="status.summary_html"
      />
      <a
        v-if="longSubject && showingLongSubject"
        href="#"
        class="tall-subject-hider"
        @click.prevent="showingLongSubject=false"
      >{{ $t("status.hide_full_subject") }}</a>
      <a
        v-else-if="longSubject"
        class="tall-subject-hider"
        :class="{ 'tall-subject-hider_focused': focused }"
        href="#"
        @click.prevent="showingLongSubject=true"
      >
        {{ $t("status.show_full_subject") }}
      </a>
    </div>
    <div
      :class="{'tall-status': hideTallStatus}"
      class="status-content-wrapper"
    >
      <a
        v-if="hideTallStatus"
        class="tall-status-hider"
        :class="{ 'tall-status-hider_focused': focused }"
        href="#"
        @click.prevent="toggleShowMore"
      >
        {{ $t("general.show_more") }}
      </a>
      <div
        v-if="!hideSubjectStatus"
        class="status-content media-body"
        @click.prevent="linkClicked"
        v-html="postBodyHtml"
      />
      <a
        v-if="hideSubjectStatus"
        href="#"
        class="cw-status-hider"
        @click.prevent="toggleShowMore"
      >
        {{ $t("status.show_content") }}
        <span
          v-if="hasImageAttachments"
          class="icon-picture"
        />
        <span
          v-if="hasVideoAttachments"
          class="icon-video"
        />
        <span
          v-if="status.card"
          class="icon-link"
        />
      </a>
      <a
        v-if="showingMore"
        href="#"
        class="status-unhider"
        @click.prevent="toggleShowMore"
      >
        {{ tallStatus ? $t("general.show_less") : $t("status.hide_content") }}
      </a>
    </div>

    <div v-if="status.poll && status.poll.options">
      <poll :base-poll="status.poll" />
    </div>

    <div
      v-if="status.attachments.length !== 0 && (!hideSubjectStatus || showingLongSubject)"
      class="attachments media-body"
    >
      <attachment
        v-for="attachment in nonGalleryAttachments"
        :key="attachment.id"
        class="non-gallery"
        :size="attachmentSize"
        :nsfw="nsfwClickthrough"
        :attachment="attachment"
        :allow-play="true"
        :set-media="setMedia()"
      />
      <gallery
        v-if="galleryAttachments.length > 0"
        :nsfw="nsfwClickthrough"
        :attachments="galleryAttachments"
        :set-media="setMedia()"
      />
    </div>

    <div
      v-if="status.card && !hideSubjectStatus && !noHeading"
      class="link-preview media-body"
    >
      <link-preview
        :card="status.card"
        :size="attachmentSize"
        :nsfw="nsfwClickthrough"
      />
    </div>
    <slot name="footer" />
  </div>
  <!-- eslint-enable vue/no-v-html -->
</template>

<script src="./status_content.js" ></script>
<style lang="scss">
@import '../../_variables.scss';

$status-margin: 0.75em;

.status-body {
  flex: 1;
  min-width: 0;

  .status-content-wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .tall-status {
    position: relative;
    height: 220px;
    overflow-x: hidden;
    overflow-y: hidden;
    z-index: 1;
    .status-content {
      min-height: 0;
      mask: linear-gradient(to top, white, transparent) bottom/100% 70px no-repeat,
            linear-gradient(to top, white, white);
      /* Autoprefixed seem to ignore this one, and also syntax is different */
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
  }

  .tall-status-hider {
    display: inline-block;
    word-break: break-all;
    position: absolute;
    height: 70px;
    margin-top: 150px;
    width: 100%;
    text-align: center;
    line-height: 110px;
    z-index: 2;
  }

  .status-unhider, .cw-status-hider {
    width: 100%;
    text-align: center;
    display: inline-block;
    word-break: break-all;
  }

  img, video {
    max-width: 100%;
    max-height: 400px;
    vertical-align: middle;
    object-fit: contain;

    &.emoji {
      width: 32px;
      height: 32px;
    }
  }

  .summary-wrapper {
    margin-bottom: 0.5em;
    border-style: solid;
    border-width: 0 0 1px 0;
    border-color: var(--border, $fallback--border);
    flex-grow: 0;
  }

  .summary {
    font-style: italic;
    padding-bottom: 0.5em;
  }

  .tall-subject {
    position: relative;
    .summary {
      max-height: 2em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .tall-subject-hider {
    display: inline-block;
    word-break: break-all;
    // position: absolute;
    width: 100%;
    text-align: center;
    padding-bottom: 0.5em;
  }

  .status-content {
    font-family: var(--postFont, sans-serif);
    line-height: 1.4em;
    white-space: pre-wrap;

    blockquote {
      margin: 0.2em 0 0.2em 2em;
      font-style: italic;
    }

    pre {
      overflow: auto;
    }

    code, samp, kbd, var, pre {
      font-family: var(--postCodeFont, monospace);
    }

    p {
      margin: 0 0 1em 0;
    }

    p:last-child {
      margin: 0 0 0 0;
    }

    h1 {
      font-size: 1.1em;
      line-height: 1.2em;
      margin: 1.4em 0;
    }

    h2 {
      font-size: 1.1em;
      margin: 1.0em 0;
    }

    h3 {
      font-size: 1em;
      margin: 1.2em 0;
    }

    h4 {
      margin: 1.1em 0;
    }
  }
}

.greentext {
  color: $fallback--cGreen;
  color: var(--postGreentext, $fallback--cGreen);
}

.timeline :not(.panel-disabled) > {
  .status-el:last-child {
    border-radius: 0 0 $fallback--panelRadius $fallback--panelRadius;
    border-radius: 0 0 var(--panelRadius, $fallback--panelRadius) var(--panelRadius, $fallback--panelRadius);
    border-bottom: none;
  }
}

</style>
