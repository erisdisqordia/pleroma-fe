<template>
  <span class="user-finder-container">
    <span class="finder-error" v-if="error">
      <i class="icon-cancel user-finder-icon" @click="dismissError"/>
      {{$t('finder.error_fetching_user')}}
    </span>
    <i class="icon-spin4 user-finder-icon animate-spin-slow" v-if="loading" />
    <a href="#" v-if="hidden"><i class="icon-user-plus user-finder-icon" @click.prevent.stop="toggleHidden"/></a>
    <span v-else>
      <input class="user-finder-input" @keyup.enter="findUser(username)" v-model="username" :placeholder="$t('finder.find_user')" id="user-finder-input" type="text"/>
      <i class="icon-cancel user-finder-icon" @click.prevent.stop="toggleHidden"/>
    </span>
  </span>
</template>

<script src="./user_finder.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.user-finder-container {
  height: 21px;
  max-width: 100%;
}

.user-finder-input {
  max-width: 80%;
  padding: 0.1em 0.2em 0.2em 0.2em;
}

.finder-error {
  background-color: rgba(255, 48, 16, 0.65);
  margin: 0.35em;
  border-radius: $fallback--tooltipRadius;
  border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
  padding: 0.25em;
  color: $fallback--faint;
  color: var(--faint, $fallback--faint);
}
</style>
