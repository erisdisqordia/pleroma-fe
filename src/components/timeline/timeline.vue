<template>
  <div class="timeline panel panel-default">
    <div class="panel-heading timeline-heading base01-background base04">
      <div class="title">
        {{title}}
      </div>
      <button @click.prevent="showNewStatuses" class="base06 base02-background loadmore-button" v-if="timeline.newStatusCount > 0 && !timeline.error">
        Show new ({{timeline.newStatusCount}})
      </button>
      <button @click.prevent class="base06 error no-press loadmore-button" v-if="timeline.error">
          Error fetching updates
      </button>
      <button @click.prevent class="base04 base01-background no-press loadmore-button" v-if="!timeline.newStatusCount > 0 && !timeline.error">
        Up-to-date
      </button>
    </div>
    <div class="panel-body">
      <div class="timeline">
        <status-or-conversation v-for="status in timeline.visibleStatuses" :key="status.id" v-bind:statusoid="status"></status-or-conversation>
        <a href="#" v-on:click.prevent='fetchOlderStatuses()' v-if="!timeline.loading">
          <div class="base01-background base05-border new-status-notification text-center">Load older statuses.</div>
        </a>
          <div class="base01-background base05-border new-status-notification text-center" v-else>...</div>
      </div>
    </div>
  </div>
</template>
<script src="./timeline.js"></script>

<style lang="scss">

  .timeline {
    .timeline-heading {
      position: relative;
      display: flex;
    }
    .title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 70%;
    }
    .loadmore-button {
      position: absolute;
      right: 0.6em;
      padding: 0.1em 0.3em 0.25em 0.3em;
      min-width: 6em;
    }
    .error {
      background-color: rgba(255, 48, 16, 0.65);
    }
    .no-press {
      opacity: 0.8;
      cursor: default;
    }
  }


  .new-status-notification {
    position:relative;
    margin-top: -1px;
    font-size: 1.1em;
    border-width: 1px 0 0 0;
    border-style: solid;
    border-radius: 0 0 10px 10px;
    padding: 10px;
    z-index: 1;
  }
</style>
