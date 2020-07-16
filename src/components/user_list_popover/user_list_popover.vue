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
      class="reacted-users"
    >
      <div v-if="users.length">
        <div
          v-for="(user) in users"
          :key="user.id"
          class="reacted-user"
        >
          <UserAvatar
            :user="user"
            class="avatar-small"
            :compact="true"
          />
          <div class="reacted-user-names">
            <!-- eslint-disable vue/no-v-html -->
            <span
              class="reacted-user-name"
              v-html="user.name_html"
            />
            <!-- eslint-enable vue/no-v-html -->
            <span class="reacted-user-screen-name">{{ user.screen_name }}</span>
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

.reacted-users {
  padding: 0.5em;
}

.reacted-user {
  padding: 0.25em;
  display: flex;
  flex-direction: row;

  .reacted-user-names {
    display: flex;
    flex-direction: column;
    margin-left: 0.5em;
    min-width: 5em;

    img {
      width: 1em;
      height: 1em;
    }
  }

  .reacted-user-screen-name {
    font-size: 9px;
  }
}

</style>
