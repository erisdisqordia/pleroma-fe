<template>
  <div class="timeline">
    <a href="#" v-on:click.prevent='showNewStatuses()' v-if="timeline.newStatusCount > 0">
      <div class="base00-background base05-border new-status-notification">
        <p class="text-center" >
          {{timeline.newStatusCount}} new statuses
        </p>
      </div>
    </a>
    <status-or-conversation v-for="status in timeline.visibleStatuses" :key="status.id" v-bind:statusoid="status"></status-or-conversation>
    <a href="#" v-on:click.prevent='fetchOlderStatuses()' v-if="!timeline.loading">
      <div class="base01-background base05-border new-status-notification">
        <p class="text-center" >
          Load older statuses.
        </p>
      </div>
    </a>
  </div>
</template>
<script src="./timeline.js"></script>

<style lang="scss">
 .new-status-notification {
   border-style: solid;
   float: right;
   border-width: 1px 1px 0px 1px;
   border-radius: 5px 5px 0 0;
   font-size: 1.1em;
   margin-top: -2.08em;
   margin-right: 0.8em;
   max-width: 200px;
   max-height: 2em;

   p {
     margin: 0px;
     padding: 0.6em;
   }
 }
</style>
