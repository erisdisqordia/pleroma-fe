<template>
  <div class="panel-default panel list-edit">
    <div
      ref="header"
      class="panel-heading"
    >
      <button
        class="button-unstyled go-back-button"
        @click="$router.back"
      >
        <FAIcon
          size="lg"
          icon="chevron-left"
        />
      </button>
    </div>
    <div class="input-wrap">
      <input
        ref="title"
        v-model="title"
        :placeholder="$t('lists.title')"
      >
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
        :placeholder="$t('lists.search')"
        @input="onInput"
      >
    </div>
    <div class="member-list">
      <div
        v-for="user in availableUsers"
        :key="user.id"
        class="member"
      >
        <BasicUserCard
          :user="user"
          :class="isSelected(user) ? 'selected' : ''"
          @click.capture.prevent="selectUser(user)"
        />
      </div>
    </div>
    <button
      :disabled="title && title.length === 0"
      class="btn button-default"
      @click="updateList"
    >
      {{ $t('lists.save') }}
    </button>
    <button
      class="btn button-default"
      @click="deleteList"
    >
      {{ $t('lists.delete') }}
    </button>
  </div>
</template>

<script src="./list_edit.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.list-edit {
  .input-wrap {
    display: flex;
    margin: 0.7em 0.5em 0.7em 0.5em;

    input {
      width: 100%;
    }
  }

  .search-icon {
    margin-right: 0.3em;
  }

  .member-list {
    padding-bottom: 0.7rem;
  }

  .basic-user-card:hover,
  .basic-user-card.selected {
    cursor: pointer;
    background-color: var(--selectedPost, $fallback--lightBg);
  }

  .go-back-button {
    text-align: center;
    line-height: 1;
    height: 100%;
    align-self: start;
    width: var(--__panel-heading-height-inner);
  }

  .btn {
    margin: 0.5em;
  }
}
</style>
