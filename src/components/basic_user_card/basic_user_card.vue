<template>
  <div class="basic-user-card">
    <router-link :to="userProfileLink(user)">
      <UserAvatar
        class="avatar"
        :user="user"
        @click.prevent.native="toggleUserExpanded"
      />
    </router-link>
    <div class="basic-user-card-expanded-content" v-if="userExpanded">
      <UserCard :user="user" :rounded="true" :bordered="true"/>
    </div>
    <div class="basic-user-card-collapsed-content" v-else>
      <div :title="user.name" class="basic-user-card-user-name">
        <span v-if="user.name_html" class="basic-user-card-user-name-value" v-html="user.name_html"></span>
        <span v-else class="basic-user-card-user-name-value">{{ user.name }}</span>
      </div>
      <div>
        <router-link class="basic-user-card-screen-name" :to="userProfileLink(user)">
          @{{user.screen_name}}
        </router-link>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script src="./basic_user_card.js"></script>

<style lang="scss">
.basic-user-card {
  display: flex;
  flex: 1 0;
  margin: 0;
  padding: 0.6em 1em;

  &-collapsed-content {
    margin-left: 0.7em;
    text-align: left;
    flex: 1;
    min-width: 0;
  }

  &-user-name {
    img {
      object-fit: contain;
      height: 16px;
      width: 16px;
      vertical-align: middle;
    }
  }

  &-user-name-value,
  &-screen-name {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &-expanded-content {
    flex: 1;
    margin-left: 0.7em;
  }
}
</style>
