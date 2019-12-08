<template>
  <div :class="classes.root">
    <div :class="classes.header">
      <div class="title">
        {{ title }}
      </div>
      <div
        v-if="timelineError"
        class="loadmore-error alert error"
        @click.prevent
      >
        {{ $t('timeline.error_fetching') }}
      </div>
      <button
        v-if="timeline.newStatusCount > 0 && !timelineError"
        class="loadmore-button"
        @click.prevent="showNewStatuses"
      >
        {{ $t('timeline.show_new') }}{{ newStatusCountStr }}
      </button>
      <div
        v-if="!timeline.newStatusCount > 0 && !timelineError"
        class="loadmore-text faint"
        @click.prevent
      >
        {{ $t('timeline.up_to_date') }}
      </div>
    </div>
    <div :class="classes.body">
      <div class="timeline">
        <template v-for="statusId in pinnedStatusIds">
          <conversation
            v-if="timeline.statusesObject[statusId]"
            :key="statusId + '-pinned'"
            class="status-fadein"
            :status-id="statusId"
            :collapsable="true"
            :pinned-status-ids-object="pinnedStatusIdsObject"
            :in-profile="inProfile"
            :profile-user-id="userId"
          />
        </template>
        <template v-for="status in timeline.visibleStatuses">
          <conversation
            v-if="!excludedStatusIdsObject[status.id]"
            :key="status.id"
            class="status-fadein"
            :status-id="status.id"
            :collapsable="true"
            :in-profile="inProfile"
            :profile-user-id="userId"
          />
        </template>
      </div>
    </div>
    <div :class="classes.footer">
      <div
        v-if="count===0"
        class="new-status-notification text-center panel-footer faint"
      >
        {{ $t('timeline.no_statuses') }}
      </div>
      <div
        v-else-if="bottomedOut"
        class="new-status-notification text-center panel-footer faint"
      >
        {{ $t('timeline.no_more_statuses') }}
      </div>
      <a
        v-else-if="!timeline.loading"
        href="#"
        @click.prevent="fetchOlderStatuses()"
      >
        <div class="new-status-notification text-center panel-footer">{{ $t('timeline.load_older') }}</div>
      </a>
      <div
        v-else
        class="new-status-notification text-center panel-footer"
      >
        <i class="icon-spin3 animate-spin" />
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
