<template>
<span  v-if="contrast" class="contrast-ratio">
  <span :title="hint" class="rating">
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
  <span class="rating" v-if="contrast && large" :title="hint_18pt">
    <span v-if="contrast.laaa">
      <i class="icon-thumbs-up-alt"/>
    </span>
    <span v-if="!contrast.laaa && contrast.laa">
      <i class="icon-adjust"/>
    </span>
    <span v-if="!contrast.laaa && !contrast.laa">
      <i class="icon-attention"/>
    </span>
  </span>
</span>
</template>

<script>
export default {
  props: [
    'large', 'contrast'
  ],
  computed: {
    hint () {
      const levelVal = this.contrast.aaa ? 'aaa' : (this.contrast.aa ? 'aa' : 'bad')
      const level = this.$t(`settings.style.common.contrast.level.${levelVal}`)
      const context = this.$t('settings.style.common.contrast.context.text')
      const ratio = this.contrast.text
      return this.$t('settings.style.common.contrast.hint', { level, context, ratio })
    },
    hint_18pt () {
      const levelVal = this.contrast.laaa ? 'aaa' : (this.contrast.laa ? 'aa' : 'bad')
      const level = this.$t(`settings.style.common.contrast.level.${levelVal}`)
      const context = this.$t('settings.style.common.contrast.context.18pt')
      const ratio = this.contrast.text
      return this.$t('settings.style.common.contrast.hint', { level, context, ratio })
    }
  }
}
</script>

<style lang="scss">
.contrast-ratio {
  display: flex;
  justify-content: flex-end;

  margin-top: -4px;
  margin-bottom: 5px;

  .label {
    margin-right: 1em;
  }

  .rating {
    display: inline-block;
    text-align: center;
  }
}
</style>
