<template>
  <div class="settings panel panel-default">
    <div class="panel-heading">
      {{$t('nav.friend_requests')}}
    </div>
    <div class="panel-body">
      <FollowRequestCard v-for="request in requests" :key="request.id" :user="request"/>
    </div>
  </div>
</template>

<script src="./follow_requests.js"></script>
