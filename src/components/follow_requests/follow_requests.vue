<template>
  <div class="settings panel panel-default">
    <div class="panel-heading">
      {{$t('nav.friend_requests')}}
    </div>
    <div class="panel-body">
      <List :items="requests">
        <template slot="item" slot-scope="{item}">
          <FollowRequestCard :user="item" />
        </template>
      </List>
    </div>
  </div>
</template>

<script src="./follow_requests.js"></script>
