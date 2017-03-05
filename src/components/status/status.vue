<template>
  <div class="status-el base00-background" v-if="!status.deleted" v-bind:class="[{ 'expanded-status': !expandable }, { 'base01-background': focused }]">
    <template v-if="muted">
      <div class="media status container muted">
        <small><router-link :to="{ name: 'user-profile', params: { id: status.user.id } }">{{status.user.screen_name}}</router-link></small>
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
              <template v-if="isReply">
                  <small>
                      <router-link :to="{ name: 'conversation', params: { id: status.in_reply_to_status_id } }">
                          <i class="icon-reply"></i>
                      </router-link>
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
                <small v-if="status.user.muted">
                  <a href="#" @click.prevent="toggleMute" ><i class="icon-eye-off"></i></a>
                </small>
              </template>
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
                  <i class='fa icon-reply'></i>
                </a>
              </div>
              <retweet-button :status=status></retweet-button>
              <favorite-button :status=status></favorite-button>
              <delete-button :status=status></delete-button>
            </div>

            <post-status-form v-if="replying" :reply-to="status.id" :attentions="status.attentions" :repliedUser="status.user" v-on:posted="toggleReplying"></post-status-form>
          </div>
        </div>
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

 .expanded-status {
   border-left: 4px solid rgba(255, 48, 16, 0.65);
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
     padding: 0.65em 0.7em 0.8em 0.8em;
     border-bottom: 1px solid;
 }
 .muted button {
   margin-left: auto;
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
</style>
