<template>
  <div>
    <div v-if="!currentUser" class="login-hint panel panel-default">
      <div class="panel-body">
        <router-link :to="{ name: 'login' }">
          {{ $t("login.hint") }}
        </router-link>
      </div>
    </div>
    <Timeline :title="$t('nav.public_tl')" v-bind:timeline="timeline" v-bind:timeline-name="'public'"/>
  </div>
</template>

<script src="./public_timeline.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.login-hint {
  text-align: center;

  a {
    display: inline-block;
    padding: 1em 0px;
    width: 100%;
  }
}
</style>
