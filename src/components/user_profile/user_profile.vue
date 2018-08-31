<template>
  <div>
    <div v-if="user" class="user-profile panel panel-default">
      <user-card-content :user="user" :switcher="true" :selected="timeline.viewing"></user-card-content>
    </div>
    <Timeline :title="$t('user_profile.timeline_title')" :timeline="timeline" :timeline-name="'user'" :user-id="userId"/>
  </div>
</template>

<script src="./user_profile.js"></script>

<style lang="scss">

.user-profile {
  flex: 2;
  flex-basis: 500px;
  padding-bottom: 10px;
  .panel-heading {
    background: transparent;
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
