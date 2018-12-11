<template>
  <div class="timeline panel panel-default" v-if="viewing == 'statuses'">
    <div class="panel-heading timeline-heading">
      <div class="title">
        {{title}}
      </div>
      <div @click.prevent class="loadmore-error alert error" v-if="timelineError">
        {{$t('timeline.error_fetching')}}
      </div>
      <button @click.prevent="showNewStatuses" class="loadmore-button" v-if="timeline.newStatusCount > 0 && !timelineError">
        {{$t('timeline.show_new')}}{{newStatusCountStr}}
      </button>
      <div @click.prevent class="loadmore-text faint" v-if="!timeline.newStatusCount > 0 && !timelineError">
        {{$t('timeline.up_to_date')}}
      </div>
    </div>
    <div class="panel-body">
      <div class="timeline">
        <status-or-conversation v-for="status in timeline.visibleStatuses" :key="status.id" v-bind:statusoid="status" class="status-fadein"></status-or-conversation>
      </div>
    </div>
    <div class="panel-footer">
      <a href="#" v-on:click.prevent='fetchOlderStatuses()' v-if="!timeline.loading">
        <div class="new-status-notification text-center panel-footer">{{$t('timeline.load_older')}}</div>
      </a>
      <div class="new-status-notification text-center panel-footer" v-else>...</div>
    </div>
  </div>
  <div class="timeline panel panel-default" v-else-if="viewing == 'followers'">
    <div class="panel-heading timeline-heading">
      <div class="title">
        {{$t('user_card.followers')}}
      </div>
    </div>
    <div class="panel-body">
      <div class="timeline">
        <user-card v-for="follower in followers" :key="follower.id" :user="follower" :showFollows="false"></user-card>
      </div>
    </div>
  </div>
  <div class="timeline panel panel-default" v-else-if="viewing == 'friends'">
    <div class="panel-heading timeline-heading">
      <div class="title">
        {{$t('user_card.followees')}}
      </div>
    </div>
    <div class="panel-body">
      <div class="timeline">
        <user-card v-for="friend in friends" :key="friend.id" :user="friend" :showFollows="true"></user-card>
      </div>
    </div>
  </div>
</template>
<script src="./timeline.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.timeline {
  .loadmore-text {
    opacity: 1;
  }
}

.new-status-notification {
  position:relative;
  margin-top: -1px;
  font-size: 1.1em;
  border-width: 1px 0 0 0;
  border-style: solid;
  border-color: var(--border, $fallback--border);
  padding: 10px;
  z-index: 1;
  background-color: $fallback--fg;
  background-color: var(--panel, $fallback--fg);
}
</style>
