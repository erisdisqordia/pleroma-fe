<template>
  <div>
    <conversation v-if="expanded" @toggleExpanded="toggleExpanded" :collapsable="true" :statusoid="statusoid"></conversation>
    <status v-if="!expanded" @toggleExpanded="toggleExpanded" :expandable="true" :inConversation="false" :focused="false" :statusoid="statusoid"></status>
  </div>
</template>

<script src="./status_or_conversation.js"></script>

<style lang="scss">
 .spacer {
   height: 1em
 }
</style>
