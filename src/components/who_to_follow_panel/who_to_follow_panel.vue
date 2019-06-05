<template>
  <div class="who-to-follow-panel">
    <div class="panel panel-default base01-background">
      <div class="panel-heading timeline-heading base02-background base04">
        <div class="title">
          {{$t('who_to_follow.who_to_follow')}}
        </div>
      </div>
      <div class="who-to-follow">
        <p v-for="user in usersToFollow" class="who-to-follow-items">
          <img v-bind:src="user.img" />
            <router-link v-bind:to="userProfileLink(user.id, user.name)">
              {{user.name}}
            </router-link><br />
        </p>
        <p class="who-to-follow-more">
          <router-link :to="{ name: 'who-to-follow' }">
            {{$t('who_to_follow.more')}}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script src="./who_to_follow_panel.js" ></script>

<style lang="scss">
  .who-to-follow * {
    vertical-align: middle;
  }
  .who-to-follow img {
    width: 32px;
    height: 32px;
  }
  .who-to-follow {
    padding: 0em 1em;
    margin: 0px;
  }
  .who-to-follow-items {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0px;
    margin: 1em 0em;
  }
  .who-to-follow-more {
    padding: 0px;
    margin: 1em 0em;
    text-align: center;
  }
</style>
