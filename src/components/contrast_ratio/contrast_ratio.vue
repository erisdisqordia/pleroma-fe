<template>
<span  v-if="contrast" class="contrast-ratio">
  <span :title="`Contrast is ${contrast.text}`" class="rating">
    <span v-if="contrast.aaa">
      <i class="icon-thumbs-up-alt"/>
    </span>
    <span v-if="!contrast.aaa && contrast.aa">
      <i class="icon-adjust"/>
    </span>
    <span v-if="!contrast.aaa && !contrast.aa">
      <i class="icon-attention"/>
    </span>
  </span>
  <span class="rating" v-if="contrast && large" :title="`Contrast is ${contrast.text} (18pt+)`">
    <span v-if="contrast.aaa">
      <i class="icon-thumbs-up-alt"/>
    </span>
    <span v-if="!contrast.aaa && contrast.aa">
      <i class="icon-adjust"/>
    </span>
    <span v-if="!contrast.aaa && !contrast.aa">
      <i class="icon-attention"/>
    </span>
  </span>
</span>
</template>

<script>
export default {
  props: [
    'large', 'contrast'
  ]
}
</script>

<style lang="scss">
.contrast-ratio {
  display: flex;
  justify-content: flex-end;

  .label {
    margin-right: 1em;
  }

  .rating {
    display: inline-block;
    text-align: center;
  }
}
</style>
