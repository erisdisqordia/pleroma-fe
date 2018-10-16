<template>
  <div class="features-panel">
    <div class="panel panel-default base01-background">
      <div class="panel-heading timeline-heading base02-background base04">
        <div class="title">
          {{$t('features_panel.title')}}
        </div>
      </div>
      <div class="panel-body features-panel">
        <ul>
          <li v-if="chat">{{$t('features_panel.chat')}}</li>
          <li v-if="gopher">{{$t('features_panel.gopher')}}</li>
          <li v-if="whoToFollow">{{$t('features_panel.who_to_follow')}}</li>
          <li v-if="mediaProxy">{{$t('features_panel.media_proxy')}}</li>
          <li v-if="scopeOptions">{{$t('features_panel.scope_options')}}</li>
          <li>{{$t('features_panel.text_limit')}} = {{textlimit}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script src="./features_panel.js" ></script>

<style lang="scss">
  .features-panel li {
    line-height: 24px;
  }
</style>
