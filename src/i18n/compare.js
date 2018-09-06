#!/usr/bin/env node
const arg = process.argv[2]
const english = require('./en.json')
const foreign = require(`./${arg}.json`)

function walker (a, b, path = []) {
  Object.keys(a).forEach(k => {
    const aVal = a[k]
    const bVal = b[k]
    const aType = typeof aVal
    const bType = typeof bVal
    const currentPath = [...path, k]
    const article = aType[0] === 'o' ? 'an' : 'a'

    if (bType === 'undefined') {
      console.log(`Foreign language is missing ${article} ${aType} at path ${currentPath.join('.')}`)
    } else if (aType === 'object') {
      if (bType !== 'object') {
        console.log(`Type mismatch! English has ${aType} while foreign has ${bType} at path ${currentPath.join['.']}`)
      } else {
        walker(aVal, bVal, currentPath)
      }
    }
  })
}

walker(english, foreign)
