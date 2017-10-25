import { reduce, find } from 'lodash'

export const replaceWord = (str, toReplace, replacement) => {
  return str.slice(0, toReplace.start) + replacement + str.slice(toReplace.end)
}

export const wordAtPosition = (str, pos) => {
  const words = splitIntoWords(str)
  const wordsWithPosition = addPositionToWords(words)

  return find(wordsWithPosition, ({start, end}) => start <= pos && end > pos)
}

export const addPositionToWords = (words) => {
  return reduce(words, (result, word) => {
    const data = {
      word,
      start: 0,
      end: word.length
    }

    if (result.length > 0) {
      const previous = result.pop()

      data.start += previous.end
      data.end += previous.end

      result.push(previous)
    }

    result.push(data)

    return result
  }, [])
}

export const splitIntoWords = (str) => {
  // Split at word boundaries
  const regex = /\b/
  const triggers = /[@#:]+$/

  let split = str.split(regex)

  // Add trailing @ and # to the following word.
  const words = reduce(split, (result, word) => {
    if (result.length > 0) {
      let previous = result.pop()
      const matches = previous.match(triggers)
      if (matches) {
        previous = previous.replace(triggers, '')
        word = matches[0] + word
      }
      result.push(previous)
    }
    result.push(word)

    return result
  }, [])

  return words
}

const completion = {
  wordAtPosition,
  addPositionToWords,
  splitIntoWords,
  replaceWord
}

export default completion
