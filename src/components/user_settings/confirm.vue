<template>
<div>
  <slot></slot>
  <button class="btn btn-default" @click="confirm" :disabled="disabled">
    {{$t('general.confirm')}}
  </button>
  <button class="btn btn-default" @click="cancel" :disabled="disabled">
    {{$t('general.cancel')}}
  </button>
</div>
</template>

<script src="./confirm.js">
</script>
