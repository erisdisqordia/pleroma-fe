<template>
  <div v-if="show" class="instance-specific-panel">
    <div class="panel panel-default">
      <div class="panel-body">
        <div v-html="instanceSpecificPanelContent">
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./instance_specific_panel.js" ></script>

<style lang="scss">
</style>
