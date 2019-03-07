<template>
  <div class="user-card">
    <router-link :to="userProfileLink(user)">
      <UserAvatar class="avatar" @click.prevent.native="toggleUserExpanded" :src="user.profile_image_url"/>
    </router-link>
    <div class="user-card-expanded-content" v-if="userExpanded">
      <user-card-content :user="user" :switcher="false"></user-card-content>
    </div>
    <div class="user-card-collapsed-content" v-else>
      <div :title="user.name" class="user-card-user-name">
        <span v-if="user.name_html" v-html="user.name_html"></span>
        <span v-else>{{ user.name }}</span>
      </div>
      <div>
        <router-link class="user-card-screen-name" :to="userProfileLink(user)">
          @{{user.screen_name}}
        </router-link>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script src="./basic_user_card.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.user-card {
  display: flex;
  flex: 1 0;
  padding-top: 0.6em;
  padding-right: 1em;
  padding-bottom: 0.6em;
  padding-left: 1em;
  border-bottom: 1px solid;
  margin: 0;
  border-bottom-color: $fallback--border;
  border-bottom-color: var(--border, $fallback--border);

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

  &-expanded-content {
    flex: 1;
    margin-left: 0.7em;
    border-radius: $fallback--panelRadius;
    border-radius: var(--panelRadius, $fallback--panelRadius);
    border-style: solid;
    border-color: $fallback--border;
    border-color: var(--border, $fallback--border);
    border-width: 1px;
    overflow: hidden;

    .panel-heading {
      background: transparent;
      flex-direction: column;
      align-items: stretch;
    }

    p {
      margin-bottom: 0;
    }
  }
}
</style>
