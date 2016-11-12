<template>
  <div class="timeline">
    <a href="#" v-on:click.prevent='showNewStatuses()' v-if="timeline.newStatusCount > 0">
      <div class="new-status-notification">
        <p class="text-center" >
          {{timeline.newStatusCount}} new statuses
        </p>
      </div>
    </a>
    <status v-for="status in timeline.visibleStatuses" :key="status.id" v-bind:statusoid="status"></status>
    <a href="#" v-on:click.prevent='fetchOlderStatuses()' v-if="!timeline.loading">
      <div class="new-status-notification">
        <p class="text-center" >
          Load older statuses.
        </p>
      </div>
    </a>
  </div>
</template>
<script src="./timeline.js"></script>

<style>
 .timeline.panel {
     flex: 2;
     flex-basis: 500px;
 }
</style>
