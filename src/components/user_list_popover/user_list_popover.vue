<template>
  <Popover
    trigger="hover"
    placement="top"
    :offset="{ y: 5 }"
  >
    <template slot="trigger">
      <slot />
    </template>
    <div
      slot="content"
      class="user-list-popover"
    >
      <div v-if="users.length">
        <div
          v-for="(user) in usersCapped"
          :key="user.id"
          class="user-list-row"
        >
          <UserAvatar
            :user="user"
            class="avatar-small"
            :compact="true"
          />
          <div class="user-list-names">
            <!-- eslint-disable vue/no-v-html -->
            <span v-html="user.name_html" />
            <!-- eslint-enable vue/no-v-html -->
            <span class="user-list-screen-name">{{ user.screen_name }}</span>
          </div>
        </div>
      </div>
      <div v-else>
        <i class="icon-spin4 animate-spin" />
      </div>
    </div>
  </Popover>
</template>

<script src="./user_list_popover.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.user-list-popover {
  padding: 0.5em;

  .user-list-row {
    padding: 0.25em;
    display: flex;
    flex-direction: row;

    .user-list-names {
      display: flex;
      flex-direction: column;
      margin-left: 0.5em;
      min-width: 5em;

      img {
        width: 1em;
        height: 1em;
      }
    }

    .user-list-screen-name {
      font-size: 9px;
    }
  }
}

</style>
