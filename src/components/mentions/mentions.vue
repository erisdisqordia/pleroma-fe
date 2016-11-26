<template>
  <div class="timeline panel panel-default">
    <div class="panel-heading">Mentions</div>
    <div class="panel-body">
      <div class="timeline">
        <status v-for="status in mentions" :key="status.id" v-bind:statusoid="status"></status>
      </div>
    </div>
  </div>
</template>

<script src="./mentions.js"></script>
