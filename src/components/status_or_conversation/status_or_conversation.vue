<template>
  <div>
    <conversation
      v-if="expanded"
      @toggleExpanded="toggleExpanded"
      @toggleReplying="toggleReplying"
      :replying="replying"
      :collapsable="true"
      :statusoid="statusoid"
    />
    <status 
      v-else
      @toggleExpanded="toggleExpanded"
      @toggleReplying="toggleReplying"
      :replying="replying"
      :expandable="true"
      :inConversation="false"
      :focused="false"
      :statusoid="statusoid"
    />
  </div>
</template>

<script src="./status_or_conversation.js"></script>

<style lang="scss">
 .spacer {
   height: 1em
 }
</style>
