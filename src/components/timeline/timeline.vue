<template>
  <div class="timeline">
    <status v-for="status in timeline.visibleStatuses" v-bind:status="status"></status>
  </div>
</template>
<script src="./timeline.js"></script>
