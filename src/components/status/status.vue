<template>
  <div class="status-el base00-background base03-border" v-if="!status.deleted" v-bind:class="[{ 'base01-background': isFocused }, { 'status-conversation': inConversation }]" >
    <template v-if="muted">
      <div class="media status container muted">
        <small><router-link :to="{ name: 'user-profile', params: { id: status.user.id } }">{{status.user.screen_name}}</router-link></small>
        <small class="muteWords">{{muteWordHits.join(', ')}}</small>
        <a href="#" class="unmute" @click.prevent="toggleMute"><i class="icon-eye-off"></i></a>
      </div>
    </template>
    <template v-if="!muted">
      <div v-if="retweet" class="media container retweet-info">
        <div class="media-left">
          <i class='fa icon-retweet retweeted'></i>
        </div>
        <div class="media-body">
          Retweeted by {{retweeter}}
        </div>
      </div>
      <div class="media status container">
        <div class="media-left">
          <a :href="status.user.statusnet_profile_url">
            <img @click.prevent="toggleUserExpanded" class='avatar' :src="status.user.profile_image_url_original">
          </a>
        </div>
        <div class="media-body">
          <div class="base05 base05=border usercard" v-if="userExpanded">
            <user-card-content :user="status.user"></user-card-content>
          </div>
          <div class="user-content">
            <h4 class="media-heading">
              {{status.user.name}}
              <small><router-link :to="{ name: 'user-profile', params: { id: status.user.id } }">{{status.user.screen_name}}</router-link></small>
              <small v-if="status.in_reply_to_screen_name"> &gt;
                <router-link :to="{ name: 'user-profile', params: { id: status.in_reply_to_user_id } }">
                  {{status.in_reply_to_screen_name}}
                </router-link>
              </small>
              <template v-if="isReply && !expandable">
                <small>
                  <a href="#" @click.prevent="gotoOriginal" ><i class="icon-reply"></i></a>
                </small>
              </template>
              -
              <small>
                <router-link :to="{ name: 'conversation', params: { id: status.id } }">
                  <timeago :since="status.created_at" :auto-update="60"></timeago>
                </router-link>
              </small>
              <template v-if="expandable">
                -
                <small>
                  <a href="#" @click.prevent="toggleExpanded" ><i class="icon-plus-squared"></i></a>
                </small>
              </template>
              <small v-if="unmuted">
                <a href="#" @click.prevent="toggleMute" ><i class="icon-eye-off"></i></a>
              </small>
              <small v-if="!status.is_local" class="source_url">
                <a :href="status.external_url" target="_blank" ><i class="icon-binoculars"></i></a>
              </small>
            </h4>

            <div @click.prevent="linkClicked" class="status-content" v-html="status.statusnet_html"></div>

            <div v-if='status.attachments' class='attachments'>
              <attachment v-if="!hideAttachments" :status-id="status.id" :nsfw="status.nsfw" :attachment="attachment" v-for="attachment in status.attachments">
              </attachment>
            </div>
          </div>

          <div v-if="loggedIn">
            <div class='status-actions'>
              <div>
                <a href="#" v-on:click.prevent="toggleReplying">
                  <i class="fa icon-reply" :class="{'icon-reply-active': replying}"></i>
                </a>
              </div>
              <retweet-button :status=status></retweet-button>
              <favorite-button :status=status></favorite-button>
              <delete-button :status=status></delete-button>
            </div>
          </div>
        </div>
      </div>
      <div class="status base00-background container" v-if="replying">
        <div class="reply-left"/>
        <post-status-form class="reply-body" :reply-to="status.id" :attentions="status.attentions" :repliedUser="status.user" v-on:posted="toggleReplying"/>
      </div>
    </template>
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
     border-left-width: 0px;

     .user-content {
       min-height: 52px;
       padding-top: 1px;
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
         margin: 3px 15px 4px 0;
     }

     p {
         margin: 0;
         margin-top: 0.2em;
         margin-bottom: 0.5em;
     }
 }

 .status-conversation {
   border-left-style: solid;
 }

 .status-actions {
     padding-top: 5px;
 }

 .icon-reply:hover {
     color: $blue;
 }

 .icon-reply-active {
     color: $blue;
 }

 .status .avatar {
     width: 48px;
 }

 .status.compact .avatar {
     width: 32px;
 }

 .status {
     padding: 0.65em 0.7em 0.8em 0.8em;
     border-bottom: 1px solid;
     border-bottom-color: inherit;
     border-left: 4px rgba(255, 48, 16, 0.65);
     border-left-style: inherit;
 }
 .muted {
   padding: 0.1em 0.7em 0.1em 0.8em;
   button {
     margin-left: auto;
   }

   .muteWords {
     margin-left: 10px;
   }
 }

 a.unmute {
   display: block;
   margin-left: auto;
 }

 .usercard {
   border-style: solid;
   border-width: 1px;
   border-radius: 10px;
   margin-bottom: 1em;
   margin-top: 0.2em;
 }

 .reply-left {
   flex: 0;
   min-width: 48px;
 }

 .reply-body {
   flex: 1;
 }

</style>
