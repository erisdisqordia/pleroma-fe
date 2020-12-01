/*
  Emoji merger script, quick hack of a tool to:
  - update some missing emoji from an external source
  - sort the emoji
  - remove all multipart emoji (reactions don't allow them)

  Merges emoji from here: https://gist.github.com/oliveratgithub/0bf11a9aff0d6da7b46f1490f86a71eb
  to the simpler format we're using.
*/

// Existing emojis we have
const oldEmojiFilename = '../static/emoji.json'

// The file downloaded from https://gist.github.com/oliveratgithub/0bf11a9aff0d6da7b46f1490f86a71eb
const newEmojiFilename = 'emojis.json'

// Output, replace the static/emoji.json with this file if it looks correct
const outputFilename = 'output.json'

const run = () => {
  const fs = require('fs')

  let newEmojisObject = {}
  let emojisObject = {}

  let data = fs.readFileSync(newEmojiFilename, 'utf8')

  // First filter out anything that's more than one codepoint
  const newEmojis = JSON.parse(data).emojis.filter(e => e.emoji.length <= 2)

  // Create a table with format { shortname: emoji }, remove the :
  newEmojis.forEach(e => {
    const name = e.shortname.slice(1, e.shortname.length - 1).toLowerCase()
    if (name.length > 0) {
      newEmojisObject[name] = e.emoji
    }
  })

  data = fs.readFileSync(oldEmojiFilename, 'utf8')

  emojisObject = JSON.parse(data)

  // Get rid of longer emojis that don't play nice with reactions
  Object.keys(emojisObject).forEach(e => {
    if (emojisObject[e].length > 2) emojisObject[e] = undefined
  })

  // Add new emojis from the new tables to the old table
  Object.keys(newEmojisObject).forEach(e => {
    if (!emojisObject[e] && newEmojisObject[e].length <= 2) {
      emojisObject[e] = newEmojisObject[e]
    }
  })

  // Sort by key
  const sorted = Object.keys(emojisObject).sort().reduce((acc, key) => {
    if (key.length === 0) return acc
    acc[key] = emojisObject[key]
    return acc
  }, {})

  fs.writeFile(outputFilename, JSON.stringify(sorted, null, 2), 'utf8', (err) => {
    if (err) console.log('Error writing file', err)
  })
}

run()
