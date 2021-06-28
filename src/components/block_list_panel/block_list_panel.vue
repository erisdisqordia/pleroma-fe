<template>
  <div class="block-list-panel">
    <div class="panel panel-default base01-background">
      <div class="panel-heading timeline-heading base02-background">
        <div class="title">
          Instance Blocks
        </div>
      </div>
      <div class="panel-body">
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="block-section"
          v-html="instanceBlocks"
        />
        <!-- eslint-enable vue/no-v-html -->
      </div>
    </div>
  </div>
</template>

<script src="./block_list_panel.js" ></script>

<style lang="scss">
.block-section {
  margin: 1em;
}
</style>
