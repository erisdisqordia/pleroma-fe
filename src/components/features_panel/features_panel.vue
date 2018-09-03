<template>
  <div class="features-panel">
    <div class="panel panel-default base01-background">
      <div class="panel-heading timeline-heading base02-background base04">
        <div class="title">
          Features
        </div>
      </div>
      <div class="panel-body features-panel">
        <ul>
          <li v-if="mediaProxy">Media proxy</li>
          <li v-if="whoToFollow">Who to follow</li>
          <li v-if="scopeOptions">Scope options</li>
          <li v-if="formattingOptions">Formatting options</li>
          <li>Text limit = {{textlimit}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script src="./features_panel.js" ></script>

<style lang="scss">
  .features-panel li {
    line-height: 24px;
  }
</style>
