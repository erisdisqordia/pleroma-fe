<template>
  <time>
    {{ displayDate }}
  </time>
</template>

<script>
import localeService from 'src/services/locale/locale.service.js'

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
        return this.date.toLocaleDateString(localeService.internalToBrowserLocale(this.$i18n.locale), { day: 'numeric', month: 'long' })
      }
    }
  }
}
</script>
