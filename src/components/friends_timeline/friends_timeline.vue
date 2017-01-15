<template>
  <div class="timeline panel panel-default base00-background">
    <div class="panel-heading base01-background base04">Friends Timeline</div>
    <div class="panel-body">
      <Timeline v-bind:timeline="timeline" v-bind:timeline-name="'friends'"/>
    </div>
  </div>
</template>

<script src="./friends_timeline.js"></script>
