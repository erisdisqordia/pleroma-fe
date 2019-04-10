<template>
  <div class="who-to-follow-panel">
    <div class="panel panel-default base01-background">
      <div class="panel-heading timeline-heading base02-background base04">
        <div class="title">
          {{$t('who_to_follow.who_to_follow')}}
        </div>
      </div>
      <div class="panel-body who-to-follow">
        <span v-for="user in usersToFollow">
          <img v-bind:src="user.img" />
            <router-link v-bind:to="userProfileLink(user.id, user.name)">
              {{user.name}}
            </router-link><br />
        </span>
        <img v-bind:src="$store.state.instance.logo"> <router-link :to="{ name: 'who-to-follow' }">{{$t('who_to_follow.more')}}</router-link>
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
    padding: 0.5em 1em 0.5em 1em;
    margin: 0px;
    line-height: 40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
