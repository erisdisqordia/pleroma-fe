<template>
  <time
    :datetime="time"
    :title="localeDateString"
  >
    {{ $t(relativeTime.key, [relativeTime.num]) }}
  </time>
</template>

<script>
import * as DateUtils from 'src/services/date_utils/date_utils.js'
import localeService from 'src/services/locale/locale.service.js'

export default {
  name: 'Timeago',
  props: ['time', 'autoUpdate', 'longFormat', 'nowThreshold'],
  data () {
    return {
      relativeTime: { key: 'time.now', num: 0 },
      interval: null
    }
  },
  computed: {
    localeDateString () {
      const browserLocale = localeService.internalToBrowserLocale(this.$i18n.locale)
      return typeof this.time === 'string'
        ? new Date(Date.parse(this.time)).toLocaleString(browserLocale)
        : this.time.toLocaleString(browserLocale)
    }
  },
  created () {
    this.refreshRelativeTimeObject()
  },
  destroyed () {
    clearTimeout(this.interval)
  },
  methods: {
    refreshRelativeTimeObject () {
      const nowThreshold = typeof this.nowThreshold === 'number' ? this.nowThreshold : 1
      this.relativeTime = this.longFormat
        ? DateUtils.relativeTime(this.time, nowThreshold)
        : DateUtils.relativeTimeShort(this.time, nowThreshold)

      if (this.autoUpdate) {
        this.interval = setTimeout(
          this.refreshRelativeTimeObject,
          1000 * this.autoUpdate
        )
      }
    }
  }
}
</script>
