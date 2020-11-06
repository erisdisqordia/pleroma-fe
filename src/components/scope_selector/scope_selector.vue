<template>
  <div
    v-if="!showNothing"
    class="ScopeSelector"
  >
    <span
      v-if="showDirect"
      class="scope"
      :class="css.direct"
      :title="$t('post_status.scope.direct')"
      @click="changeVis('direct')"
    >
      <FAIcon
        icon="envelope"
        class="fa-scale-110 fa-old-padding"
      />
    </span>
    <span
      v-if="showPrivate"
      class="scope"
      :class="css.private"
      :title="$t('post_status.scope.private')"
      @click="changeVis('private')"
    >
      <FAIcon
        icon="lock"
        class="fa-scale-110 fa-old-padding"
      />
    </span>
    <span
      v-if="showUnlisted"
      class="scope"
      :class="css.unlisted"
      :title="$t('post_status.scope.unlisted')"
      @click="changeVis('unlisted')"
    >
      <FAIcon
        icon="lock-open"
        class="fa-scale-110 fa-old-padding"
      />
    </span>
    <span
      v-if="showPublic"
      class="scope"
      :class="css.public"
      :title="$t('post_status.scope.public')"
      @click="changeVis('public')"
    >
      <FAIcon
        icon="globe"
        class="fa-scale-110 fa-old-padding"
      />
    </span>
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
