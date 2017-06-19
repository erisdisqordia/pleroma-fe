<template>
  <div class="timeline panel panel-default base00-background">
    <div class="panel-heading base01-background base04 base03-border conversation-heading">
      Conversation
      <span v-if="collapsable" style="float:right;">
        <small><a href="#" @click.prevent="$emit('toggleExpanded')">Collapse</a></small>
      </span>
    </div>
    <div class="panel-body">
      <div class="timeline">
        <status v-for="status in conversation" @goto="setHighlight" :key="status.id" @preview="setPreview"  :statusoid="status" :expandable='false' :focused="focused(status.id)" :inConversation='true' :highlight="highlight" :replies="getReplies(status.id)"></status>
      </div>
    </div>
    <div class="status-preview base00-background base03-border" :style="{ left: preview.x + 'px', top: preview.y + 'px'}" v-if="preview.status">
      <img class="avatar" :src="preview.status.user.profile_image_url_original">
      <div class="text">
        <h4>
          {{ preview.status.user.name }}
          <small><a>{{ preview.status.user.screen_name}}</a></small>
        </h4>
        <div @click.prevent="linkClicked" class="status-content" v-html="preview.status.statusnet_html"></div>
      </div>
    </div>
  </div>
</template>

<script src="./conversation.js"></script>

<style lang="scss">
  .conversation-heading {
    border-bottom-style: solid;
    border-bottom-width: 1px;
  }

  .status-preview {
    position: absolute;
    max-width: 35em;
    padding: 0.5em;
    display: flex;
    border-color: inherit;
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
    .avatar {
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
</style>
