<template>
  <div>
    <label for="interface-language-switcher">
      {{ $t('settings.interfaceLanguage') }}
    </label>
    <label for="interface-language-switcher" class='select'>
      <select id="interface-language-switcher" v-model="language">
        <option v-for="(langCode, i) in languageCodes" :value="langCode">
          {{ languageNames[i] }}
        </option>
      </select>
      <i class="icon-down-open"/>
    </label>
  </div>
</template>

<script>
  import languagesObject from '../../i18n/messages'
  import ISO6391 from 'iso-639-1'
  import _ from 'lodash'

  export default {
    computed: {
      languageCodes () {
        return Object.keys(languagesObject)
      },

      languageNames () {
        return _.map(this.languageCodes, ISO6391.getName)
      },

      language: {
        get: function () { return this.$store.state.config.interfaceLanguage },
        set: function (val) {
          this.$store.dispatch('setOption', { name: 'interfaceLanguage', value: val })
          this.$i18n.locale = val
        }
      }
    }
  }
</script>
