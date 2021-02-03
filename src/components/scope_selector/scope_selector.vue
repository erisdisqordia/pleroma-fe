<template>
  <div
    v-if="!showNothing"
    class="ScopeSelector"
  >
    <button
      v-if="showDirect"
      class="button-unstyled scope"
      :class="css.direct"
      :title="$t('post_status.scope.direct')"
      @click="changeVis('direct')"
      type="button"
    >
      <FAIcon
        icon="envelope"
        class="fa-scale-110 fa-old-padding"
      />
    </button>
    <button
      v-if="showPrivate"
      class="button-unstyled scope"
      :class="css.private"
      :title="$t('post_status.scope.private')"
      @click="changeVis('private')"
      type="button"
    >
      <FAIcon
        icon="lock"
        class="fa-scale-110 fa-old-padding"
      />
    </button>
    <button
      v-if="showUnlisted"
      class="button-unstyled scope"
      :class="css.unlisted"
      :title="$t('post_status.scope.unlisted')"
      @click="changeVis('unlisted')"
      type="button"
    >
      <FAIcon
        icon="lock-open"
        class="fa-scale-110 fa-old-padding"
      />
    </button>
    <button
      v-if="showPublic"
      class="button-unstyled scope"
      :class="css.public"
      :title="$t('post_status.scope.public')"
      @click="changeVis('public')"
      type="button"
    >
      <FAIcon
        icon="globe"
        class="fa-scale-110 fa-old-padding"
      />
    </button>
  </div>
</template>

<script src="./scope_selector.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.ScopeSelector {

  .scope {
    display: inline-block;
    cursor: pointer;
    min-width: 1.3em;
    min-height: 1.3em;
    text-align: center;

    &.selected svg {
      color: $fallback--lightText;
      color: var(--lightText, $fallback--lightText);
    }
  }
}
</style>
