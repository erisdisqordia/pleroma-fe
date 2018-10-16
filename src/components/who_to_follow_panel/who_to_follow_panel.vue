<template>
  <div class="who-to-follow-panel">
    <div class="panel panel-default base01-background">
      <div class="panel-heading timeline-heading base02-background base04">
        <div class="title">
          {{$t('who_to_follow.who_to_follow')}}
        </div>
      </div>
      <div class="panel-body who-to-follow">
        <p>
          <img v-bind:src="img1"/> <router-link :to="{ name: 'user-profile', params: { id: id1 } }">{{ name1 }}</router-link><br>
          <img v-bind:src="img2"/> <router-link :to="{ name: 'user-profile', params: { id: id2 } }">{{ name2 }}</router-link><br>
          <img v-bind:src="img3"/> <router-link :to="{ name: 'user-profile', params: { id: id3 } }">{{ name3 }}</router-link><br>
          <img v-bind:src="$store.state.instance.logo"> <a v-bind:href="moreUrl" target="_blank">{{$t('who_to_follow.more')}}</a>
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
  .who-to-follow p {
    line-height: 40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
