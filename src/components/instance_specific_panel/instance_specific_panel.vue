<template>
  <div class="instance-specific-panel">
    <div class="panel panel-default">
      <div class="panel-body">
        <!-- eslint-disable vue/no-v-html -->
        <div v-html="instanceSpecificPanelContent" />
        <!-- eslint-enable vue/no-v-html -->
      </div>
    </div>
  </div>
</template>

<script src="./instance_specific_panel.js" ></script>
