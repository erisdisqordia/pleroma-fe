<template>
  <div class="timeline panel panel-default">
    <div class="panel-heading">Status</div>
    <div class="panel-body">
      <div class="timeline">
        <status v-for="status in conversation" :key="status.id" v-bind:statusoid="status"></status>
      </div>
    </div>
  </div>
</template>

<script src="./conversation.js"></script>
