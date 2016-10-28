<template>
  <div class="status-el">
    <div v-if="retweet" class="media container retweet-info">
      <div class="media-left">
        <i class='fa fa-retweet'></i>
      </div>
      <div class="media-body">
        Retweeted by {{retweeter}}
      </div>
    </div>
    <div class="media status container" ng-class="{compact: compact, notify: notify}">
      <div class="media-left">
        <a href="#">
          <img class='avatar' :src="status.user.profile_image_url_original">
        </a>
      </div>
      <div class="media-body">
        <h4 class="media-heading">
          <strong>{{status.user.name}}</strong>
          <small>{{status.user.screen_name}}</small>
          <small v-if="status.in_reply_to_screen_name"> &gt; {{status.in_reply_to_screen_name}}</small>
          -
          <small>{{status.created_at_parsed}}</small>
        </h4>

        <div v-html="status.statusnet_html"></div>

        <div v-if='status.attachments' class='attachments'>
          <attachment :status-id="status.id" :nsfw="status.nsfw" :attachment="attachment" v-for="attachment in status.attachments">
          </attachment>
        </div>

        <div>
          <div class='status-actions'>
            <div ng-click="toggleReplying()">
              <i class='fa fa-reply'></i>
            </div>
            <div>
              <i class='fa fa-retweet'></i>
            </div>
            <favorite-button status=status></favorite-button>
          </div>

          <!-- <post-status-form ng-if="replying" toggle="toggleReplying" reply-to-status="status" reply-to="{{status.id}}"></post-status-form> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./status.js" ></script>

<style lang="scss">
 .status-el {
     word-wrap: break-word;

     a {
         word-break: break-all;
     }
 }
</style>
