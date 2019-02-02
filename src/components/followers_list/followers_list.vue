<template>
  <div>
    <user-card v-for="follower in followers" :key="follower.id" :user="follower" :showFollows="true"></user-card>
    <div @click="fetchFollowers" class="new-status-notification text-center panel-footer">
      <span v-if="error" class="alert error">Error loading followers</span>
      <i v-else-if="loading" class="icon-spin3 animate-spin"/>
      <span v-else-if="bottomedOut"></span>
    </div>
  </div>
</template>

<script src="./followers_list.js" />
