<template>
  <div class="timeline panel panel-default">
    <div class="panel-heading base01-background base04">Public Timeline</div>
    <div class="panel-body">
      <Timeline v-bind:timeline="timeline" v-bind:timeline-name="'public'"/>
    </div>
  </div>
</template>

<script src="./public_timeline.js"></script>
