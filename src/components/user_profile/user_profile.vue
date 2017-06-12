<template>
  <div>
    <div v-if="user" class="user-profile panel panel-default base00-background">
      <user-card-content :user="user"></user-card-content>
    </div>
    <Timeline :title="'User Timeline'" v-bind:timeline="timeline" v-bind:timeline-name="'user'"/>
  </div>
</template>

<script src="./user_profile.js"></script>

<style lang="scss">

.user-profile {
  flex: 2;
  flex-basis: 500px;
}

</style>
