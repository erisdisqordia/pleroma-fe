<template>
<div class="import-export">
  <button class="btn" @click="exportData">{{ exportLabel }}</button>
  <button class="btn" @click="importData">{{ importLabel }}</button>
  <p v-if="importFailed" class="import-warning">{{ importFailedText }}</p>
</div>
</template>

<script>
export default {
  props: [
    'exportObject',
    'importLabel',
    'exportLabel',
    'importFailedText',
    'validator',
    'onImport',
    'onImportFailure'
  ],
  data () {
    return {
      importFailed: false
    }
  },
  methods: {
    exportData () {
      const stringified = JSON.stringify(this.exportObject) // Pretty-print and indent with 2 spaces

      // Create an invisible link with a data url and simulate a click
      const e = document.createElement('a')
      e.setAttribute('download', 'pleroma_theme.json')
      e.setAttribute('href', 'data:application/json;base64,' + window.btoa(stringified))
      e.style.display = 'none'

      document.body.appendChild(e)
      e.click()
      document.body.removeChild(e)
    },
    importData () {
      this.importFailed = false
      const filePicker = document.createElement('input')
      filePicker.setAttribute('type', 'file')
      filePicker.setAttribute('accept', '.json')

      filePicker.addEventListener('change', event => {
        if (event.target.files[0]) {
          // eslint-disable-next-line no-undef
          const reader = new FileReader()
          reader.onload = ({target}) => {
            try {
              const parsed = JSON.parse(target.result)
              const valid = this.validator(parsed)
              if (valid) {
                this.onImport(parsed)
              } else {
                this.importFailed = true
                // this.onImportFailure(valid)
              }
            } catch (e) {
              // This will happen both if there is a JSON syntax error or the theme is missing components
              this.importFailed = true
              // this.onImportFailure(e)
            }
          }
          reader.readAsText(event.target.files[0])
        }
      })

      document.body.appendChild(filePicker)
      filePicker.click()
      document.body.removeChild(filePicker)
    }
  }
}
</script>
