<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-body">
        <div
          class="tos-content"
          v-html="content"
        />
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
