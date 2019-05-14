<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <div class="title">
        Interactions
      </div>
    </div>
    <tab-switcher
      ref="tabSwitcher"
      :onSwitch="onModeSwitch"
      >
      <span data-tab-dummy data-filter="mentions" :label="$t('MENTIONS')"/>
      <span data-tab-dummy data-filter="likes+repeats" :label="$t('LIKES AND REPEATS')"/>
      <span data-tab-dummy data-filter="follows" :label="$t('FOLLOWS')"/>
    </tab-switcher>
    <Notifications
      ref="notifications"
      :noHeading="true"
      :minimalMode="true"
      :filterMode="filterMode"
      />
  </div>
</template>

<script src="./interactions.js"></script>
