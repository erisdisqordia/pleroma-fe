<template>
  <div class="timeline panel panel-default">
    <div class="panel-heading base01-background base04">{{title}}</div>
    <div class="panel-body">
      <div class="timeline">
        <a href="#" v-on:click.prevent='showNewStatuses()' v-if="timeline.newStatusCount > 0">
          <div class="base01-background base05-border new-status-notification">
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
    </div>
  </div>
</template>
<script src="./timeline.js"></script>

<style lang="scss">
 .new-status-notification {
   border-style: solid;
   border-width: 1px 0 1px 0;
   font-size: 1.1em;

   p {
     margin: 0px;
     padding: 10px;
   }
 }
</style>
