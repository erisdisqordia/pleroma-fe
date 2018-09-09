<template>
  <div class="timeline panel panel-default">
    <div class="panel-heading conversation-heading">
      <span class="title"> {{ $t('timeline.conversation') }} </span>
      <span v-if="collapsable">
        <a href="#" @click.prevent="$emit('toggleExpanded')">{{ $t('timeline.collapse') }}</a>
      </span>
    </div>
    <div class="panel-body">
      <div class="timeline">
        <status
          v-for="status in conversation"
          @goto="setHighlight" :key="status.id"
          :inlineExpanded="collapsable" :statusoid="status"
          :expandable='false' :focused="focused(status.id)"
          :inConversation='true'
          :highlight="highlight"
          :replies="getReplies(status.id)"
          class="status-fadein">
        </status>
      </div>
    </div>
  </div>
</template>

<script src="./conversation.js"></script>
