<template>
  <div
    v-if="!showNothing"
    class="scope-selector"
  >
    <i
      v-if="showDirect"
      class="icon-mail-alt"
      :class="css.direct"
      :title="$t('post_status.scope.direct')"
      @click="changeVis('direct')"
    />
    <i
      v-if="showPrivate"
      class="icon-lock"
      :class="css.private"
      :title="$t('post_status.scope.private')"
      @click="changeVis('private')"
    />
    <i
      v-if="showUnlisted"
      class="icon-lock-open-alt"
      :class="css.unlisted"
      :title="$t('post_status.scope.unlisted')"
      @click="changeVis('unlisted')"
    />
    <i
      v-if="showPublic"
      class="icon-globe"
      :class="css.public"
      :title="$t('post_status.scope.public')"
      @click="changeVis('public')"
    />
  </div>
</template>

<script src="./scope_selector.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.scope-selector {
  i {
    font-size: 1.2em;
    cursor: pointer;

    &.selected {
      color: $fallback--lightText;
      color: var(--lightText, $fallback--lightText);
    }
  }
}
</style>
