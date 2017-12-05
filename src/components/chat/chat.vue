<template>
  <div class="chat-panel panel panel-default">
    <div class="panel-heading timeline-heading base02-background base04">
      <div class="title">
        {{$t('chat.title')}}
      </div>
    </div>
    <div class="panel-body base01-background">
      <div class="chat-window">
        <div class="chat-message" v-for="message in messages">
          <span class="chat-avatar">
            <img :src="message.author.avatar" />
            {{message.author.username}}:
          </span>
          <span class="chat-text">
            {{message.text}}
          </span>
        </div>
      </div>
      <div class="chat-input">
        <input v-model="currentMessage" type="text" @keyup.enter="submit(currentMessage)">
      </div>
    </div>
  </div>
</template>

<script src="./chat.js"></script>


<style lang="scss">
 .chat-message {
   padding: 0.2em 0.5em
 }
 .chat-avatar {
     img {
         height: 32px;
         width: 32px;
         border-radius: 5px;
         margin-right: 0.5em;
     }
 }
 .chat-input {
     display: flex;
     input {
         flex: auto;
         margin: 0.5em;
     }
 }
</style>
