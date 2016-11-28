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
    <div class="media status container">
      <div class="media-left">
        <a :href="status.user.statusnet_profile_url">
          <img class='avatar' :src="status.user.profile_image_url_original">
        </a>
      </div>
      <div class="media-body">
        <div class="user-content">
          <h4 class="media-heading">
            {{status.user.name}}
            <small><a :href="status.user.statusnet_profile_url">{{status.user.screen_name}}</a></small>
            <small v-if="status.in_reply_to_screen_name"> &gt; <a :href="status.in_reply_to_profileurl">{{status.in_reply_to_screen_name}}</a></small>
            -
            <small>
              <router-link :to="{ name: 'conversation', params: { id: status.id } }">
                <timeago :since="status.created_at" :auto-update="60"></timeago>
              </router-link>
            </small>
            <small v-if="!status.is_local" class="source_url">
              <a :href="status.external_url" target="_blank" >Source</a>
            </small>
          </h4>

          <div class="status-content" v-html="status.statusnet_html"></div>

          <div v-if='status.attachments' class='attachments'>
            <attachment :status-id="status.id" :nsfw="status.nsfw" :attachment="attachment" v-for="attachment in status.attachments">
            </attachment>
          </div>
        </div>

        <div v-if="loggedIn">
          <div class='status-actions'>
            <div>
              <a href="#" v-on:click.prevent="toggleReplying">
                <i class='fa icon-reply'></i>
              </a>
            </div>
            <retweet-button :status=status></retweet-button>
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
 @import '../../_variables.scss';
 .status-el {
     hyphens: auto;
     overflow-wrap: break-word;
     word-wrap: break-word;
     word-break: break-word;

     .user-content {
       min-height: 52px;
     }

     .source_url {
       float: right;
     }

     .greentext {
         color: green;
     }

     a {
         display: inline-block;
         word-break: break-all;
     }

     .status-content {
         margin-top: 3px;
         margin-bottom: 3px;
     }

     p {
         margin: 0;
         margin-top: 0.2em;
         margin-bottom: 0.5em;
     }
 }

 .status-actions {
     padding-top: 5px;
 }

 .icon-reply:hover {
     color: $blue;
 }

 .status .avatar {
     width: 48px;
 }

 .status.compact .avatar {
     width: 32px;
 }

 .status {
     padding: 0.5em;
     padding-right: 1em;
     border-bottom: 1px solid silver;
 }

 .status-el:last-child .status {
     border: none
 }
</style>
