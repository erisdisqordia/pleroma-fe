<template>
  <div class="status-el base00-background" v-if="compact">
    <div @click.prevent="linkClicked" class="status-content" v-html="status.statusnet_html"></div>
    <div v-if="loggedIn">
      <div class='status-actions'>
        <div>
          <a href="#" v-on:click.prevent="toggleReplying">
            <i class="base09 icon-reply" :class="{'icon-reply-active': replying}"></i>
          </a>
        </div>
        <retweet-button :loggedIn="loggedIn" :status=status></retweet-button>
        <favorite-button :loggedIn="loggedIn" :status=status></favorite-button>
      </div>
    </div>
    <post-status-form class="reply-body" :reply-to="status.id" :attentions="status.attentions" :repliedUser="status.user" v-on:posted="toggleReplying" v-if="replying"/>
  </div>
  <div class="status-el base00-background base03-border status-fadein" v-else-if="!status.deleted" v-bind:class="[{ 'base01-background': isFocused }, { 'status-conversation': inConversation }]" >
    <template v-if="muted">
      <div class="media status container muted">
        <small><router-link :to="{ name: 'user-profile', params: { id: status.user.id } }">{{status.user.screen_name}}</router-link></small>
        <small class="muteWords">{{muteWordHits.join(', ')}}</small>
        <a href="#" class="unmute" @click.prevent="toggleMute"><i class="base09 icon-eye-off"></i></a>
      </div>
    </template>
    <template v-if="!muted">
      <div v-if="retweet" class="media container retweet-info">
        <div class="media-left">
          <i class='fa icon-retweet retweeted'></i>
        </div>
        <div class="media-body">
          Repeated by <a :href="statusoid.user.statusnet_profile_url" style="font-weight: bold;" :title="'@'+statusoid.user.screen_name">{{retweeter}}</a>
        </div>
      </div>
      <div class="media status container">
        <div class="media-left">
          <a :href="status.user.statusnet_profile_url">
            <img @click.prevent="toggleUserExpanded" :class="{retweeted: retweet}" class='avatar' :src="status.user.profile_image_url_original">
            <img v-if="retweet" class='avatar-retweeter' :src="statusoid.user.profile_image_url_original"></img>
          </a>
        </div>
        <div class="media-body">
          <div class="base03-border usercard" v-if="userExpanded">
            <user-card-content :user="status.user" :switcher="false"></user-card-content>
          </div>
          <div class="user-content">
            <div class="media-heading">
              <div class="name-and-links">
                <h4 class="user-name">{{status.user.name}}</h4>
                <div class="links">
                  <h4>
                  <small><router-link :to="{ name: 'user-profile', params: { id: status.user.id } }">{{status.user.screen_name}}</router-link></small>
                  <small v-if="status.in_reply_to_screen_name"> &gt;
                    <router-link :to="{ name: 'user-profile', params: { id: status.in_reply_to_user_id } }">
                      {{status.in_reply_to_screen_name}}
                    </router-link>
                  </small>
                  <template v-if="isReply">
                    <small>
                      <a href="#" @click.prevent="gotoOriginal(status.in_reply_to_status_id)"><i class="icon-reply" @mouseenter="replyEnter(status.in_reply_to_status_id, $event)" @mouseout="replyLeave()"></i></a>
                    </small>
                  </template>
                  -
                  <small>
                    <router-link :to="{ name: 'conversation', params: { id: status.id } }">
                      <timeago :since="status.created_at" :auto-update="60"></timeago>
                    </router-link>
                  </small>
                  </h4>
                </div>
                <h4 class="replies" v-if="inConversation">
                  <small v-if="replies.length">Replies:</small>
                  <small v-for="reply in replies">
                    <a href="#" @click.prevent="gotoOriginal(reply.id)" @mouseenter="replyEnter(reply.id, $event)" @mouseout="replyLeave()">{{reply.name}}&nbsp;</a>
                  </small>
                </h4>
              </div>
              <div class="heading-icons">
                <a href="#" @click.prevent="toggleMute" v-if="unmuted"><i class="base09 icon-eye-off"></i></a>
                <a :href="status.external_url" target="_blank" v-if="!status.is_local" class="source_url"><i class="base09 icon-binoculars"></i></a>
                <template v-if="expandable">
                  <a href="#" @click.prevent="toggleExpanded" class="expand"><i class="base09 icon-plus-squared"></i></a>
                </template>
              </div>
            </div>

            <div class="status-preview base00-background base03-border" v-if="showPreview && preview">
              <img class="avatar" :src="preview.user.profile_image_url_original">
              <div class="text">
                <h4>
                  {{ preview.user.name }}
                  <small><a>{{ preview.user.screen_name}}</a></small>
                </h4>
                <div @click.prevent="linkClicked" class="status-content" v-html="preview.statusnet_html"></div>
              </div>
            </div>
            <div class="status-preview status-preview-loading base00-background base03-border" v-else-if="showPreview">
              <i class="base09 icon-spin4 animate-spin"></i>
            </div>

            <div @click.prevent="linkClicked" class="status-content" v-html="status.statusnet_html"></div>

            <div v-if='status.attachments' class='attachments'>
              <attachment v-if="!hideAttachments" :status-id="status.id" :nsfw="status.nsfw" :attachment="attachment" v-for="attachment in status.attachments">
              </attachment>
            </div>
          </div>

          <div class='status-actions'>
            <div v-if="loggedIn">
              <a href="#" v-on:click.prevent="toggleReplying">
                <i class="base09 icon-reply" :class="{'icon-reply-active': replying}"></i>
              </a>
            </div>
            <retweet-button :loggedIn="loggedIn" :status=status></retweet-button>
            <favorite-button :loggedIn="loggedIn" :status=status></favorite-button>
            <delete-button :status=status></delete-button>
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

 status-text-container {
    display: block;
  }

  .status-preview {
    position: absolute;
    max-width: 34em;
    padding: 0.5em;
    display: flex;
    border-color: inherit;
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
    margin-top: 0.5em;
    margin-left: 1em;

    .avatar {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    .text {
      h4 {
        margin-bottom: 0.4em;
        small {
          font-weight: lighter;
        }
      }
      padding: 0 0.5em 0.5em 0.5em;
    }
  }

  .status-preview-loading {
    display: block;
    font-size: 2em;
    min-width: 8em;
    text-align: center;
  }

 .status-el {
     hyphens: auto;
     overflow-wrap: break-word;
     word-wrap: break-word;
     word-break: break-word;
     border-left-width: 0px;
     line-height: 18px;

     .timeline & {
        border-bottom-width: 1px;
        border-bottom-style: solid;
     }

     .notify {
         .avatar {
             border-width: 3px;
             border-style: solid;
         }
     }

     .media-body {
       flex: 1;
       padding-left: 0.5em;
     }


     .user-content {

       min-height: 52px;
       padding-top: 1px;
     }

     .media-heading {
       display: flex;
       min-height: 1.4em;
       margin-bottom: 0.3em;

       small {
           font-weight: lighter;
       }
       h4 {
         margin-right: 0.4em;
       }
       .name-and-links {
         flex: 1 0;
         display: flex;
         flex-wrap: wrap;
       }
       .replies {
         flex-basis: 100%;
       }
     }

     .source_url {

     }

     .expand {
       margin-right: -0.3em;
     }

     a {
         display: inline-block;
         word-break: break-all;
     }

     .status-content {
         margin: 3px 15px 4px 0;
         max-height: 400px;
         overflow-y: auto;
         overflow-x: hidden;

         img, video {
           max-width: 100%;
           max-height: 400px;
           vertical-align: middle;
           object-fit: contain;
         }

         blockquote {
           margin: 0.2em 0 0.2em 2em;
           font-style: italic;
         }
     }

     p {
         margin: 0;
         margin-top: 0.2em;
         margin-bottom: 0.5em;
     }

     .media-left {
        margin: 0.2em 0.3em 0 0;
        img {
          float: right;
          border-radius: 5px;
        }
     }

     .retweet-info {
         padding: 0.7em 0 0 0.6em;

         .media-left {
             display: flex;

             i {
                 align-self: center;
                 text-align: right;
                 flex: 1;
                 padding-right: 0.3em;
             }
         }
     }
 }

 .status-fadein {
   animation-duration: 0.5s;
   animation-name: fadein;
 }

 @keyframes fadein {
   from {
     opacity: 0;
   }
   to {
     opacity: 1;
   }
 }

 .greentext {
     color: green;
 }

 .status-conversation {
   border-left-style: solid;
 }

 .status-actions {
     padding-top: 0.15em;
     width: 100%;
     display: flex;

     div, favorite-button {
        max-width: 6em;
        flex: 1;
     }
 }

 .icon-reply:hover {
     color: $blue;
 }

 .icon-reply.icon-reply-active {
     color: $blue;
 }

 .status .avatar {
   width: 48px;
   height: 48px;

   &.retweeted {
     width: 40px;
     height: 40px;
     margin-right: 8px;
     margin-bottom: 8px;
   }
 }

 .status img.avatar-retweeter {
   width: 24px;
   height: 24px;
   position: absolute;
   margin-left: 24px;
   margin-top: 24px;
 }

 .status.compact .avatar {
     width: 32px;
 }

 .status {
     padding: 0.4em 0.7em 0.45em 0.7em;
     border-left: 4px rgba(255, 48, 16, 0.65);
     border-left-style: inherit;
 }

 .status-conversation:last-child {
    border-bottom: none;
 }

 .timeline .panel.timeline {
    border-radius: 10px;
    overflow: hidden;
 }

 .muted {
   padding: 0.1em 0.4em 0.1em 0.8em;
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

 .reply-left {
   flex: 0;
   min-width: 48px;
 }

 .reply-body {
   flex: 1;
 }

 @media all and (max-width: 960px) {
   .status-el {
     .name-and-links {
       margin-left: -0.25em;
     }
   }
   .status {
     max-width: 100%;
   }

   .status .avatar {
     width: 40px;
     height: 40px;

     &.retweeted {
       width: 34px;
       height: 34px;
       margin-right: 8px;
       margin-bottom: 8px;
     }
   }

   .status img.avatar-retweeter {
     width: 22px;
     height: 22px;
     position: absolute;
     margin-left: 18px;
     margin-top: 18px;
   }
 }

</style>
