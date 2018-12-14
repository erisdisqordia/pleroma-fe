<template>
  <div>
    <div v-if="user" class="user-profile panel panel-default">
      <user-card-content :user="user" :switcher="true" :selected="timeline.viewing"></user-card-content>
    </div>
    <div v-else class="panel user-profile-placeholder">
      <div class="panel-heading">
        <div class="title">
          {{ $t('settings.profile_tab') }}
        </div>
      </div>
      <div class="panel-body">
        <i class="icon-spin3 animate-spin"></i>
      </div>
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
.user-profile-placeholder {
  .panel-body {
    display: flex;
    justify-content: center;
    align-items: middle;
    padding: 7em;
  }
}
</style>
