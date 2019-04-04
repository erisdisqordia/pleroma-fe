<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      {{$t('who_to_follow.who_to_follow')}}
    </div>
    <div class="panel-body">
      <List :items="users">
        <template slot="item" scope="p">
          <FollowCard :user="p.item" />
        </template>
      </List>
    </div>
  </div>
</template>

<script src="./who_to_follow.js"></script>

<style lang="scss">
</style>
