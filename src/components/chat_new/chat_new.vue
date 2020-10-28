<template>
  <div
    id="nav"
    class="panel-default panel chat-new"
  >
    <div
      ref="header"
      class="panel-heading"
    >
      <a
        class="go-back-button"
        @click="goBack"
      >
        <FAIcon
          size="lg"
          icon="chevron-left"
        />
      </a>
    </div>
    <div class="input-wrap">
      <div class="input-search">
        <FAIcon
          class="search-icon fa-scale-110 fa-old-padding"
          icon="search"
        />
      </div>
      <input
        ref="search"
        v-model="query"
        placeholder="Search people"
        @input="onInput"
      >
    </div>
    <div class="member-list">
      <div
        v-for="user in availableUsers"
        :key="user.id"
        class="member"
      >
        <div @click.capture.prevent="goToChat(user)">
          <BasicUserCard :user="user" />
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./chat_new.js"></script>
<style lang="scss">
@import '../../_variables.scss';
@import './chat_new.scss';
</style>
