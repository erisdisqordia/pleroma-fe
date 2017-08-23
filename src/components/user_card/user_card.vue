<template>
  <div class="card base00-background base03-border">
    <a href="#">
      <img @click.prevent="toggleUserExpanded" class="avatar" :src="user.profile_image_url">
    </a>
    <div class="base05 base05=border usercard" v-if="userExpanded">
      <user-card-content :user="user" :switcher="false"></user-card-content>
    </div>
    <div class="name-and-screen-name" v-else>
      <div class="user-name">{{ user.name }}</div>
      <a href="user.statusnet_profile_url"><div class="user-screen-name">@{{ user.screen_name }}</div></a>
    </div>
    <span class="follows-you" v-if="!userExpanded && showFollows">
      <div class="follows" v-if="user.follows_you">
        Follows you!
      </div>
    </span>
  </div>
</template>

<script src="./user_card.js"></script>

<style lang="scss">
  .name-and-screen-name {
    margin-left: 0.7em;
    min-width: 16em;
    display:block;
    margin-top:0.0em;
    margin-right: 2em;
    text-align: left;
  }

  .follows-you {
    margin-left: 2em;
    width:-webkit-fill-available;
    width: -moz-webkit-fill-available;
  }

  .follows {
    float: right;
  }

  .card {
    display: flex;
    flex: 1 0;
    padding-top: 0.6em;
    padding-right: 1em;
    padding-bottom: 0.6em;
    padding-left: 1em;
    border-bottom: 1px solid;
    margin: 0;
    border-bottom-color: inherit;
  }

  .usercard {
    width: -webkit-fill-available;
    width: -moz-webkit-fill-available;
    stretch: fill;
    margin-left: 0.7em;
  }
</style>
