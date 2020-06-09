// When contributing, please sort JSON before committing so it would be easier to see what's missing and what's being added compared to English and other languages. It's not obligatory, but just an advice.
// To sort json use jq https://stedolan.github.io/jq and invoke it like `jq -S . xx.json > xx.sorted.json`, AFAIK, there's no inplace edit option like in sed
// Also, when adding a new language to "messages" variable, please do it alphabetically by language code so that users can search or check their custom language easily.

// For anyone contributing to old huge messages.js and in need to quickly convert it to JSON
// sed command for converting currently formatted JS to JSON:
// sed -i -e "s/'//gm" -e 's/"/\\"/gm' -re 's/^( +)(.+?): ((.+?))?(,?)(\{?)$/\1"\2": "\4"/gm' -e 's/\"\{\"/{/g' -e 's/,"$/",/g' file.json
// There's only problem that apostrophe character ' gets replaced by \\ so you have to fix it manually, sorry.

const loaders = {
  ar: () => import('./ar.json'),
  ca: () => import('./ca.json'),
  cs: () => import('./cs.json'),
  de: () => import('./de.json'),
  eo: () => import('./eo.json'),
  es: () => import('./es.json'),
  et: () => import('./et.json'),
  eu: () => import('./eu.json'),
  fi: () => import('./fi.json'),
  fr: () => import('./fr.json'),
  ga: () => import('./ga.json'),
  he: () => import('./he.json'),
  hu: () => import('./hu.json'),
  it: () => import('./it.json'),
  ja: () => import('./ja_pedantic.json'),
  ja_easy: () => import('./ja_easy.json'),
  ko: () => import('./ko.json'),
  nb: () => import('./nb.json'),
  nl: () => import('./nl.json'),
  oc: () => import('./oc.json'),
  pl: () => import('./pl.json'),
  pt: () => import('./pt.json'),
  ro: () => import('./ro.json'),
  ru: () => import('./ru.json'),
  te: () => import('./te.json'),
  zh: () => import('./zh.json')
}

const messages = {
  languages: ['en', ...Object.keys(loaders)],
  default: {
    en: require('./en.json')
  },
  setLanguage: async (i18n, language) => {
    if (loaders[language]) {
      let messages = await loaders[language]()
      i18n.setLocaleMessage(language, messages)
    }
    i18n.locale = language
  }
}

export default messages
