<template>
  <div class="timeline panel panel-default base00-background">
    <div class="panel-heading base01-background base04">
      Conversation
      <div v-if="collapsable">
        <small><a href="#" @click.prevent="$emit('toggleExpanded')">Collapse</a></small>
      </div>
    </div>
    <div class="panel-body">
      <div class="timeline">
        <status v-for="status in conversation" :key="status.id" v-bind:statusoid="status":expandable='false'></status>
      </div>
    </div>
  </div>
</template>

<script src="./conversation.js"></script>
