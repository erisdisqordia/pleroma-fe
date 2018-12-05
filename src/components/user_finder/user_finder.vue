<template>
  <div class="user-finder-container">
    <i class="icon-spin4 user-finder-icon animate-spin-slow" v-if="loading" />
    <a href="#" v-if="hidden"  :title="$t('finder.find_user')" ><i class="icon-user-plus user-finder-icon" @click.prevent.stop="toggleHidden" /></a>
    <span v-else>
      <input class="user-finder-input" @keyup.enter="findUser(username)" v-model="username" :placeholder="$t('finder.find_user')" id="user-finder-input" type="text"/>
      <i class="icon-cancel user-finder-icon" @click.prevent.stop="toggleHidden"/>
    </span>
  </div>
</template>

<script src="./user_finder.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.user-finder-container {
  max-width: 100%;
}

.user-finder-input {
  max-width: 80%;
  vertical-align: middle;
}

</style>
