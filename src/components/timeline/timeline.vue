<template>
  <div class="timeline panel panel-default" v-if="viewing == 'statuses'">
    <div class="panel-heading timeline-heading base01-background base04">
      <div class="title">
        {{title}}
      </div>
      <button @click.prevent="showNewStatuses" class="base05 base01-background loadmore-button" v-if="timeline.newStatusCount > 0 && !timelineError">
        Show new ({{timeline.newStatusCount}})
      </button>
      <div @click.prevent class="base06 error  loadmore-text" v-if="timelineError">
          Error fetching updates
      </div>
      <div @click.prevent class="base04 base01-background loadmore-text" v-if="!timeline.newStatusCount > 0 && !timelineError">
        Up-to-date
      </div>
    </div>
    <div class="panel-body">
      <div class="timeline">
        <status-or-conversation v-for="status in timeline.visibleStatuses" :key="status.id" v-bind:statusoid="status"></status-or-conversation>
        <a href="#" v-on:click.prevent='fetchOlderStatuses()' v-if="!timeline.loading">
          <div class="base01-background base03-border new-status-notification text-center">Load older statuses.</div>
        </a>
          <div class="base01-background base03-border new-status-notification text-center" v-else>...</div>
      </div>
    </div>
  </div>
  <div class="timeline panel panel-default" v-else-if="viewing == 'followers'">
    <div class="panel-heading timeline-heading base01-background base04">
      <div class="title">
        Followers
      </div>
    </div>
    <div class="panel-body">
      <div class="timeline">
        <user-card v-for="follower in followers" :user="follower" :showFollows="false"></user-card>
      </div>
    </div>
  </div>
  <div class="timeline panel panel-default" v-else-if="viewing == 'friends'">
    <div class="panel-heading timeline-heading base01-background base04">
      <div class="title">
        Following
      </div>
    </div>
    <div class="panel-body">
      <div class="timeline">
        <user-card v-for="friend in friends" :user="friend" :showFollows="true"></user-card>
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
      font-size: 14px;

      min-width: 6em;
      height: 1.8em;
      line-height: 100%;
    }
    .loadmore-text {
      position: absolute;
      right: 0.6em;
      font-size: 14px;
      min-width: 6em;
      border-radius: 5px;
      font-family: sans-serif;
      text-align: center;
      padding: 0 0.5em 0 0.5em;
      opacity: 0.8;
    }
    .error {
      background-color: rgba(255, 48, 16, 0.65);
    }
  }

  .avatar {
  padding-top: 0.3em;
  width:32px;
  height: 32px;
  border-radius: 50%;
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
