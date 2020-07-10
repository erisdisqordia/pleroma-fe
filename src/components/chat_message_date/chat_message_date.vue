<template>
  <time>
    {{ displayDate }}
  </time>
</template>

<script>
export default {
  name: 'Timeago',
  props: ['date'],
  computed: {
    displayDate () {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (this.date.getTime() === today.getTime()) {
        return this.$t('display_date.today')
      } else {
        return this.date.toLocaleDateString('en', { day: 'numeric', month: 'long' })
      }
    }
  }
}
</script>
