<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-body">
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="tos-content"
          v-html="content"
        />
      <!-- eslint-enable vue/no-v-html -->
      </div>
    </div>
  </div>
</template>

<script src="./terms_of_service_panel.js" ></script>

<style lang="scss">
.tos-content {
  margin: 1em
}
</style>
