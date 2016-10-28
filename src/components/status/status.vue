<template>
  <div class="status-el">
    <div ng-if="retweet" class="media container retweet-info">
      <div class="media-left">
        <i class='fa fa-retweet'></i>
      </div>
      <div class="media-body">
        Retweeted by {{status.user.screen_name}}
      </div>
    </div>
    <div class="media status container" ng-class="{compact: compact, notify: notify}">
      <div class="media-left">
        <a href="#">
          <img class='avatar' :src="status.user.profile_image_url_original">
        </a>
      </div>
      <div class="media-body">
        <h4 ng-if="!compact" class="media-heading">
          <strong>{{status.user.name}}</strong>
          <small>{{status.user.screen_name}}</small>
          <small ng-if="status.in_reply_to_screen_name"> &gt; {{status.in_reply_to_screen_name}}</small>
          -
          <small ng-click="goToConversation(status.statusnet_conversation_id)">{{status.created_at_parsed | date:'medium'}}</small>
        </h4>

        <p>{{status.text}}</p>

        <div ng-if='status.attachments' class='attachments'>
          <attachment nsfw="nsfw" attachment="attachment" ng-repeat="attachment in status.attachments">
          </attachment>
        </div>

        <div ng-if="!compact">
          <p>
          </p>
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
