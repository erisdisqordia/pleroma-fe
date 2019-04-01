<template>
<div v-if="!showNothing">
  <i class="icon-mail-alt"
     :class="css.direct"
     :title="$t('post_status.scope.direct')"
     v-if="showDirect"
     @click="changeVis('direct')">
  </i>
  <i class="icon-lock"
     :class="css.private"
     :title="$t('post_status.scope.private')"
     v-if="showPrivate"
     v-on:click="changeVis('private')">
  </i>
  <i class="icon-lock-open-alt"
     :class="css.unlisted"
     :title="$t('post_status.scope.unlisted')"
     v-if="showUnlisted"
     @click="changeVis('unlisted')">
  </i>
  <i class="icon-globe"
     :class="css.public"
     :title="$t('post_status.scope.public')"
     v-if="showPublic"
     @click="changeVis('public')">
  </i>
</div>
</template>

<script src="./scope_selector.js"></script>
