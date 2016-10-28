<template>
  <div class="timeline">
    <a href="#" v-on:click.prevent='showNewStatuses()' v-if="timeline.newStatusCount > 0">
      <div class="new-status-notification">
        <p class="text-center" >
          {{timeline.newStatusCount}} new statuses
        </p>
      </div>
    </a>
    <status v-for="status in timeline.visibleStatuses" v-bind:statusoid="status"></status>
  </div>
</template>
<script src="./timeline.js"></script>
