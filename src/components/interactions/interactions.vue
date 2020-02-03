<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <div class="title">
        {{ $t("nav.interactions") }}
      </div>
    </div>
    <tab-switcher
      ref="tabSwitcher"
      :on-switch="onModeSwitch"
    >
      <span
        key="mentions"
        :label="$t('nav.mentions')"
      />
      <span
        key="likes+repeats"
        :label="$t('interactions.favs_repeats')"
      />
      <span
        key="follows"
        :label="$t('interactions.follows')"
      />
      <span
        v-if="!allowFollowingMove"
        key="moves"
        :label="$t('interactions.moves')"
      />
    </tab-switcher>
    <Notifications
      ref="notifications"
      :no-heading="true"
      :minimal-mode="true"
      :filter-mode="filterMode"
    />
  </div>
</template>

<script src="./interactions.js"></script>
