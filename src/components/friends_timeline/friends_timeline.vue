<template>
  <div class="timeline panel panel-default">
    <div class="panel-heading">Friends Timeline</div>
    <div class="panel-body">
      <Timeline v-bind:timeline="timeline" v-bind:timeline-name="'friends'"/>
    </div>
  </div>
</template>

<script src="./friends_timeline.js"></script>
