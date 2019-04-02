<template>
  <div class="user-autosuggest">
    <input v-model="query" placeholder="Search..." />
    <div class="user-autosuggest-results">
      <BasicUserCard v-for="user in results" :key="user.id" :user="user"/>
    </div>
  </div>
</template>

<script src="./user_autosuggest.js"></script>

<style lang="scss">
.user-autosuggest {
  position: relative;

  &-results {
    position: absolute;
    left: 0;
    top: 100%;
    right: 0;
    background: #FFF;
    max-height: 400px;
    overflow-y: auto;
    z-index: 1;
  }
}
</style>
