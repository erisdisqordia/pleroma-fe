<template>
  <div class="timeline panel-default" :class="[isExpanded ? 'panel' : 'panel-disabled']">
    <div v-if="isExpanded" class="panel-heading conversation-heading">
      <span class="title"> {{ $t('timeline.conversation') }} </span>
      <span v-if="collapsable">
        <a href="#" @click.prevent="toggleExpanded">{{ $t('timeline.collapse') }}</a>
      </span>
    </div>
    <status
      v-for="status in conversation"
      @goto="setHighlight"
      @toggleExpanded="toggleExpanded"
      :key="status.id"
      :inlineExpanded="collapsable && isExpanded"
      :statusoid="status"
      :expandable='!isExpanded'
      :showPinned="showPinned"
      :focused="focused(status.id)"
      :inConversation="isExpanded"
      :highlight="getHighlight()"
      :replies="getReplies(status.id)"
      class="status-fadein panel-body"
    />
  </div>
</template>

<script src="./conversation.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.timeline {
  .panel-disabled {
    .status-el {
      border-left: none;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-color: var(--border, $fallback--border);
      border-radius: 0;
    }
  }
}
</style>
