// When contributing, please sort JSON before committing so it would be easier to see what's missing and what's being added compared to English and other languages. It's not obligatory, but just an advice.
// To sort json use jq https://stedolan.github.io/jq and invoke it like `jq -S . xx.json > xx.sorted.json`, AFAIK, there's no inplace edit option like in sed

// For anyone contributing to old huge messages.js and in need to quickly convert it to JSON
// sed command for converting currently formatted JS to JSON:
// sed -i -e "s/'//gm" -e 's/"/\\"/gm' -re 's/^( +)(.+?): ((.+?))?(,?)(\{?)$/\1"\2": "\4"/gm' -e 's/\"\{\"/{/g' -e 's/,"$/",/g' file.json
// There's only problem that apostrophe character ' gets replaced by \\ so you have to fix it manually, sorry.

const messages = {
  de: require('./de.json'),
  fi: require('./fi.json'),
  en: require('./en.json'),
  eo: require('./eo.json'),
  et: require('./et.json'),
  hu: require('./hu.json'),
  ro: require('./ro.json'),
  ja: require('./ja.json'),
  fr: require('./fr.json'),
  it: require('./it.json'),
  oc: require('./oc.json'),
  pl: require('./pl.json'),
  es: require('./es.json'),
  pt: require('./pt.json'),
  ru: require('./ru.json'),
  nb: require('./nb.json'),
  he: require('./he.json')
}

export default messages
