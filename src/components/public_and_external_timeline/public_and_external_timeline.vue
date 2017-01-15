<template>
  <div class="timeline panel panel-default base00-background">
    <div class="panel-heading base01-background base04">THE WHOLE KNOWN NETWORK</div>
    <div class="panel-body">
      <Timeline v-bind:timeline="timeline" v-bind:timeline-name="'publicAndExternal'"/>
    </div>
  </div>
</template>

<script src="./public_and_external_timeline.js"></script>
