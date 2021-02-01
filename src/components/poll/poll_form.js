import * as DateUtils from 'src/services/date_utils/date_utils.js'
import { uniq } from 'lodash'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTimes,
  faChevronDown,
  faPlus
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faTimes,
  faChevronDown,
  faPlus
)

export default {
  name: 'PollForm',
  props: ['visible'],
  data: () => ({
    pollType: 'single',
    options: ['', ''],
    expiryAmount: 10,
    expiryUnit: 'minutes'
  }),
  computed: {
    pollLimits () {
      return this.$store.state.instance.pollLimits
    },
    maxOptions () {
      return this.pollLimits.max_options
    },
    maxLength () {
      return this.pollLimits.max_option_chars
    },
    expiryUnits () {
      const allUnits = ['minutes', 'hours', 'days']
      const expiry = this.convertExpiryFromUnit
      return allUnits.filter(
        unit => this.pollLimits.max_expiration >= expiry(unit, 1)
      )
    },
    minExpirationInCurrentUnit () {
      return Math.ceil(
        this.convertExpiryToUnit(
          this.expiryUnit,
          this.pollLimits.min_expiration
        )
      )
    },
    maxExpirationInCurrentUnit () {
      return Math.floor(
        this.convertExpiryToUnit(
          this.expiryUnit,
          this.pollLimits.max_expiration
        )
      )
    }
  },
  methods: {
    clear () {
      this.pollType = 'single'
      this.options = ['', '']
      this.expiryAmount = 10
      this.expiryUnit = 'minutes'
    },
    nextOption (index) {
      const element = this.$el.querySelector(`#poll-${index + 1}`)
      if (element) {
        element.focus()
      } else {
        // Try adding an option and try focusing on it
        const addedOption = this.addOption()
        if (addedOption) {
          this.$nextTick(function () {
            this.nextOption(index)
          })
        }
      }
    },
    addOption () {
      if (this.options.length < this.maxOptions) {
        this.options.push('')
        return true
      }
      return false
    },
    deleteOption (index, event) {
      if (this.options.length > 2) {
        this.options.splice(index, 1)
        this.updatePollToParent()
      }
    },
    convertExpiryToUnit (unit, amount) {
      // Note: we want seconds and not milliseconds
      switch (unit) {
        case 'minutes': return (1000 * amount) / DateUtils.MINUTE
        case 'hours': return (1000 * amount) / DateUtils.HOUR
        case 'days': return (1000 * amount) / DateUtils.DAY
      }
    },
    convertExpiryFromUnit (unit, amount) {
      // Note: we want seconds and not milliseconds
      switch (unit) {
        case 'minutes': return 0.001 * amount * DateUtils.MINUTE
        case 'hours': return 0.001 * amount * DateUtils.HOUR
        case 'days': return 0.001 * amount * DateUtils.DAY
      }
    },
    expiryAmountChange () {
      this.expiryAmount =
        Math.max(this.minExpirationInCurrentUnit, this.expiryAmount)
      this.expiryAmount =
        Math.min(this.maxExpirationInCurrentUnit, this.expiryAmount)
      this.updatePollToParent()
    },
    updatePollToParent () {
      const expiresIn = this.convertExpiryFromUnit(
        this.expiryUnit,
        this.expiryAmount
      )

      const options = uniq(this.options.filter(option => option !== ''))
      if (options.length < 2) {
        this.$emit('update-poll', { error: this.$t('polls.not_enough_options') })
        return
      }
      this.$emit('update-poll', {
        options,
        multiple: this.pollType === 'multiple',
        expiresIn
      })
    }
  }
}
