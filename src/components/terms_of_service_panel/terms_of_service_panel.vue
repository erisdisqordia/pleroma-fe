<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-body">
        <div v-html="content" class="tos-content">
        </div>
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
