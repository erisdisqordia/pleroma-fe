<template>
  <div class="user-autosuggest" v-click-outside="onClickOutside">
    <input v-model="query" placeholder="Search whom you want to block" @click="onInputClick" class="user-autosuggest-input" />
    <div class="user-autosuggest-results" v-if="resultsVisible && results.length > 0">
      <BlockCard v-for="user in results" :key="user.id" :userId="user.id"/>
    </div>
  </div>
</template>

<script src="./user_autosuggest.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.user-autosuggest {
  position: relative;

  &-input {
    display: block;
    width: 100%;
  }

  &-results {
    position: absolute;
    left: 0;
    top: 100%;
    right: 0;
    max-height: 400px;
    background-color: $fallback--lightBg;
    background-color: var(--lightBg, $fallback--lightBg);
    border-style: solid;
    border-width: 1px;
    border-color: $fallback--border;
    border-color: var(--border, $fallback--border);
    border-radius: $fallback--inputRadius;
    border-radius: var(--inputRadius, $fallback--inputRadius);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
    box-shadow: var(--panelShadow);
    overflow-y: auto;
    z-index: 1;
  }
}
</style>
