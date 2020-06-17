<template>
  <div class="domain-mute-card">
    <div class="domain-mute-card-domain">
      {{ domain }}
    </div>
    <ProgressButton
      v-if="muted"
      :click="unmuteDomain"
      class="btn btn-default"
    >
      {{ $t('domain_mute_card.unmute') }}
      <template slot="progress">
        {{ $t('domain_mute_card.unmute_progress') }}
      </template>
    </ProgressButton>
    <ProgressButton
      v-else
      :click="muteDomain"
      class="btn btn-default"
    >
      {{ $t('domain_mute_card.mute') }}
      <template slot="progress">
        {{ $t('domain_mute_card.mute_progress') }}
      </template>
    </ProgressButton>
  </div>
</template>

<script src="./domain_mute_card.js"></script>

<style lang="scss">
.domain-mute-card {
  flex: 1 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6em 1em 0.6em 0;

  &-domain {
    margin-right: 1em;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  button {
    width: 10em;
  }

  .autosuggest-results & {
    padding-left: 1em;
  }
}
</style>
