<template>
  <div>
    <a class="link-preview-card" :href="card.url" target="_blank" rel="noopener">
      <div class="image">
        <div :style="{ backgroundImage: 'url(' + card.image + ')' }"></div>
      </div>
      <div class="content">
        <strong>{{ card.title }}</strong>
        <p>{{ card.description }}</p>
        <span class="host">{{ card.provider_name }}</span>
      </div>
    </a>
  </div>
</template>

<script src="./link-preview.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.link-preview-card {
  display: flex !important;
  flex-direction: row;
  cursor: pointer;
  margin: 0.5em 0.7em 0.6em 0.0em;

  .image {
    flex: 0 0 100px;
    position: relative;
  }

  .image > div {
    display: block;
    margin: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-size: cover;
    background-position: center center;
  }

  .content {
    padding: 1em;
    flex: 1;

    .host {
      font-size: 90%;
    }
  }

  color: $fallback--text;
  border-style: solid;
  border-width: 1px;
  border-radius: $fallback--attachmentRadius;
  border-radius: var(--attachmentRadius, $fallback--attachmentRadius);
  border-color: $fallback--border;
  border-color: var(--border, $fallback--border);
}
</style>
