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
        data-tab-dummy
        data-filter="mentions"
        :label="$t('nav.mentions')"
      />
      <span
        data-tab-dummy
        data-filter="likes+repeats"
        :label="$t('interactions.favs_repeats')"
      />
      <span
        data-tab-dummy
        data-filter="follows"
        :label="$t('interactions.follows')"
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
