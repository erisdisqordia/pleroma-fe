<template>
<div class="contrast-ratio">
  <span class="label">
    Contrast:
  </span>
  <span>
    <span>
      {{contrast.text}}
    </span>
    <span class="rating">
      <span v-if="contrast.aaa">
        AAA
      </span>
      <span v-if="!contrast.aaa && contrast.aa">
        AA
      </span>
      <span v-if="!contrast.aaa && !contrast.aa">
        bad
      </span>
    </span>
  </span>
  <span v-if="large">
    <span>
      18pt+:
    </span>
    <span class="rating">
      <span v-if="contrast.aaa">
        AAA
      </span>
      <span v-if="!contrast.aaa && contrast.aa">
        AA
      </span>
      <span v-if="!contrast.aaa && !contrast.aa">
        bad
      </span>
    </span>
  </span>
</div>
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
  justify-content: end;

  .label {
    margin-right: 1em;
  }

  .rating {
    display: inline-block;
    min-width: 3em;
    text-align: center;
  }
}
</style>
