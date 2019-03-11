<template>
  <div class="timeline panel-default" :class="[expanded ? 'panel' : 'panel-disabled']">
    <div v-if="expanded" class="panel-heading conversation-heading">
      <span class="title"> {{ $t('timeline.conversation') }} </span>
      <span v-if="collapsable">
        <a href="#" @click.prevent="toggleExpanded">{{ $t('timeline.collapse') }}</a>
      </span>
    </div>
    <div class="panel-body">
      <div class="timeline">
        <status
          v-for="status in conversation"
          @goto="setHighlight"
          @toggleExpanded="toggleExpanded"
          :key="status.id"
          :inlineExpanded="collapsable"
          :statusoid="status"
          :expandable='!expanded'
          :focused="focused(status.id)"
          :inConversation="expanded"
          :highlight="getHighlight()"
          :replies="getReplies(status.id)"
          class="status-fadein"
        />
      </div>
    </div>
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
