<template>
  <div>
    <label for="interface-language-switcher">
      {{ $t('settings.interfaceLanguage') }}
    </label>
    <label
      for="interface-language-switcher"
      class="select"
    >
      <select
        id="interface-language-switcher"
        v-model="language"
      >
        <option
          v-for="(langCode, i) in languageCodes"
          :key="langCode"
          :value="langCode"
        >
          {{ languageNames[i] }}
        </option>
      </select>
      <FAIcon
        class="select-down-icon"
        icon="chevron-down"
      />
    </label>
  </div>
</template>

<script>
import languagesObject from '../../i18n/messages'
import ISO6391 from 'iso-639-1'
import _ from 'lodash'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faChevronDown
)

export default {
  computed: {
    languageCodes () {
      return languagesObject.languages
    },

    languageNames () {
      return _.map(this.languageCodes, this.getLanguageName)
    },

    language: {
      get: function () { return this.$store.getters.mergedConfig.interfaceLanguage },
      set: function (val) {
        this.$store.dispatch('setOption', { name: 'interfaceLanguage', value: val })
      }
    }
  },

  methods: {
    getLanguageName (code) {
      const specialLanguageNames = {
        'ja': 'Japanese (日本語)',
        'ja_easy': 'Japanese (やさしいにほんご)',
        'zh': 'Chinese (简体中文)'
      }
      return specialLanguageNames[code] || ISO6391.getName(code)
    }
  }
}
</script>
