import Modal from 'src/components/modal/modal.vue'
import PanelLoading from 'src/components/panel_loading/panel_loading.vue'
import AsyncComponentError from 'src/components/async_component_error/async_component_error.vue'
import getResettableAsyncComponent from 'src/services/resettable_async_component.js'
import Popover from '../popover/popover.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { cloneDeep } from 'lodash'
import {
  newImporter,
  newExporter
} from 'src/services/export_import/export_import.js'
import {
  faTimes,
  faFileUpload,
  faFileDownload,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'
import {
  faWindowMinimize
} from '@fortawesome/free-regular-svg-icons'

library.add(
  faTimes,
  faWindowMinimize,
  faFileUpload,
  faFileDownload,
  faChevronDown
)

const SettingsModal = {
  data () {
    return {
      dataImporter: newImporter({
        validator: this.importValidator,
        onImport: this.onImport,
        onImportFailure: this.onImportFailure
      }),
      dataThemeExporter: newExporter({
        filename: 'pleromafe_settings.full',
        getExportedObject: () => this.generateExport(true)
      }),
      dataExporter: newExporter({
        filename: 'pleromafe_settings',
        getExportedObject: () => this.generateExport()
      })
    }
  },
  components: {
    Modal,
    Popover,
    SettingsModalContent: getResettableAsyncComponent(
      () => import('./settings_modal_content.vue'),
      {
        loading: PanelLoading,
        error: AsyncComponentError,
        delay: 0
      }
    )
  },
  methods: {
    closeModal () {
      this.$store.dispatch('closeSettingsModal')
    },
    peekModal () {
      this.$store.dispatch('togglePeekSettingsModal')
    },
    importValidator (data) {
      return data._pleroma_settings_version[0] === 1
    },
    onImportFailure () {
      this.$store.dispatch('pushGlobalNotice', { messageKey: 'settings.invalid_settings_imported', level: 'error' })
    },
    onImport (data) {
      this.$store.dispatch('loadSettings', data)
    },
    restore () {
      console.log(this.dataImporter)
      this.dataImporter.importData()
    },
    backup () {
      this.dataExporter.exportData()
    },
    backupWithTheme () {
      this.dataThemeExporter.exportData()
    },
    generateExport (theme = false) {
      const { config } = this.$store.state
      let sample = config
      if (!theme) {
        const ignoreList = new Set([
          'customTheme',
          'customThemeSource',
          'colors'
        ])
        sample = Object.fromEntries(
          Object
            .entries(sample)
            .filter(([key]) => !ignoreList.has(key))
        )
      }
      const clone = cloneDeep(sample)
      clone._pleroma_settings_version = [1, 0]
      return clone
    }
  },
  computed: {
    currentSaveStateNotice () {
      return this.$store.state.interface.settings.currentSaveStateNotice
    },
    modalActivated () {
      return this.$store.state.interface.settingsModalState !== 'hidden'
    },
    modalOpenedOnce () {
      return this.$store.state.interface.settingsModalLoaded
    },
    modalPeeked () {
      return this.$store.state.interface.settingsModalState === 'minimized'
    }
  }
}

export default SettingsModal
