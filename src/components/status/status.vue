<template>
  <div class="status-el">
    <div v-if="retweet" class="media container retweet-info">
      <div class="media-left">
        <i class='fa icon-retweet'></i>
      </div>
      <div class="media-body">
        Retweeted by {{retweeter}}
      </div>
    </div>
    <div class="media status container" ng-class="{compact: compact, notify: notify}">
      <div class="media-left">
        <a :href="status.user.statusnet_profile_url">
          <img class='avatar' :src="status.user.profile_image_url_original">
        </a>
      </div>
      <div class="media-body">
        <h4 class="media-heading">
          <strong>{{status.user.name}}</strong>
          <small><a :href="status.user.statusnet_profile_url">{{status.user.screen_name}}</a></small>
          <small v-if="status.in_reply_to_screen_name"> &gt; <a :href="status.in_reply_to_profileurl">{{status.in_reply_to_screen_name}}</a></small>
          -
          <small>{{status.created_at_parsed}}</small>
        </h4>

        <p>
          <div v-html="status.statusnet_html"></div>
        </p>

        <div v-if='status.attachments' class='attachments'>
          <attachment :status-id="status.id" :nsfw="status.nsfw" :attachment="attachment" v-for="attachment in status.attachments">
          </attachment>
        </div>

        <div v-if="loggedIn">
          <div class='status-actions'>
            <div>
              <a href="#" v-on:click.prevent="toggleReplying">
                <i class='fa icon-reply'></i>
              </a>
            </div>
            <div>
              <i class='fa icon-retweet'></i>
            </div>
            <favorite-button :status=status></favorite-button>
          </div>

          <post-status-form v-if="replying" :reply-to="status.id" :attentions="status.attentions" :repliedUser="status.user" v-on:posted="toggleReplying"></post-status-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./status.js" ></script>

<style lang="scss">
 .status-el {
     hyphens: auto;
     overflow-wrap: break-word;
     word-wrap: break-word;
     word-break: break-word;

     a {
         display: inline-block;
         word-break: break-all;
     }
 }

 .status-actions {
     padding-top: 5px;
 }
</style>
