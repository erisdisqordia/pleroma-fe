<template>
  <div
    class="Conversation"
    :class="{ '-expanded' : isExpanded, 'panel' : isExpanded }"
  >
    <div
      v-if="isExpanded"
      class="panel-heading conversation-heading"
    >
      <span class="title"> {{ $t('timeline.conversation') }} </span>
      <span v-if="collapsable">
        <a
          href="#"
          @click.prevent="toggleExpanded"
        >{{ $t('timeline.collapse') }}</a>
      </span>
    </div>
    <status
      v-for="status in conversation"
      :key="status.id"
      :inline-expanded="collapsable && isExpanded"
      :statusoid="status"
      :expandable="!isExpanded"
      :show-pinned="pinnedStatusIdsObject && pinnedStatusIdsObject[status.id]"
      :focused="focused(status.id)"
      :in-conversation="isExpanded"
      :highlight="getHighlight()"
      :replies="getReplies(status.id)"
      :in-profile="inProfile"
      :profile-user-id="profileUserId"
      class="conversation-status status-fadein panel-body"
      @goto="setHighlight"
      @toggleExpanded="toggleExpanded"
    />
  </div>
</template>

<script src="./conversation.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.Conversation {
  .conversation-status {
    border-left: none;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: var(--border, $fallback--border);
    border-radius: 0;
  }

  &.-expanded {
    .conversation-status {
      border-color: $fallback--border;
      border-color: var(--border, $fallback--border);
      border-left: 4px solid $fallback--cRed;
      border-left: 4px solid var(--cRed, $fallback--cRed);
    }

    .conversation-status:last-child {
      border-bottom: none;
      border-radius: 0 0 $fallback--panelRadius $fallback--panelRadius;
      border-radius: 0 0 var(--panelRadius, $fallback--panelRadius) var(--panelRadius, $fallback--panelRadius);
    }
  }
}
</style>
