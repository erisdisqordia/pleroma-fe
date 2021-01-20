const specialLanguageCodes = {
  'ja_easy': 'ja',
  'zh_Hant': 'zh-HANT'
}

const internalToBrowserLocale = code => specialLanguageCodes[code] || code

const localeService = {
  internalToBrowserLocale
}

export default localeService
