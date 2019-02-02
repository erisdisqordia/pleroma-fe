<template>
  <div>
    <user-card v-for="friend in friends" :key="friend.id" :user="friend" :showFollows="true"></user-card>
    <div @click="fetchFriends" class="new-status-notification text-center panel-footer">
      <span v-if="error" class="alert error">Error loading follows</span>
      <i v-else-if="loading" class="icon-spin3 animate-spin"/>
      <span v-else-if="bottomedOut"></span>
    </div>
  </div>
</template>

<script src="./friends_list.js" />
