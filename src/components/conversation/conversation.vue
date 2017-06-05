<template>
  <div class="timeline panel panel-default base00-background">
    <div class="panel-heading base01-background base04 base03-border conversation-heading">
      Conversation
      <span v-if="collapsable" style="float:right;">
        <small><a href="#" @click.prevent="$emit('toggleExpanded')">Collapse</a></small>
      </span>
    </div>
    <div class="panel-body">
      <div class="timeline">
        <status v-for="status in conversation" @goto="setHighlight" :key="status.id" :statusoid="status" :expandable='false' :focused="focused(status.id)" :inConversation='true' :highlight="highlight" :replies="getReplies(status.id)"></status>
      </div>
    </div>
  </div>
</template>

<script src="./conversation.js"></script>

<style lang="scss">
  .conversation-heading {
    border-bottom-style: solid;
    border-bottom-width: 1px;
  }
</style>
