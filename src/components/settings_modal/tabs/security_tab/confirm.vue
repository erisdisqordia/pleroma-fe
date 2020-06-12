<template>
  <div>
    <slot />
    <button
      class="btn btn-default"
      :disabled="disabled"
      @click="confirm"
    >
      {{ $t('general.confirm') }}
    </button>
    <button
      class="btn btn-default"
      :disabled="disabled"
      @click="cancel"
    >
      {{ $t('general.cancel') }}
    </button>
  </div>
</template>

<script src="./confirm.js">
</script>
