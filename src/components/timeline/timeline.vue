<template>
  <div class="timeline">
    <h1>Timeline goes here</h1>
    <h2 v-for="status in timeline.visibleStatuses">{{status.text}}</h2>
  </div>
</template>
<script src="./timeline.js"></script>
