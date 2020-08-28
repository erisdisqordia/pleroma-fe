import { reduce, find } from 'lodash'

export const replaceWord = (str, toReplace, replacement) => {
  return str.slice(0, toReplace.start) + replacement + str.slice(toReplace.end)
}

export const wordAtPosition = (str, pos) => {
  const words = splitByWhitespaceBoundary(str)
  const wordsWithPosition = addPositionToWords(words)

  return find(wordsWithPosition, ({ start, end }) => start <= pos && end > pos)
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

export const splitByWhitespaceBoundary = (str) => {
  let result = []
  let currentWord = ''
  for (let i = 0; i < str.length; i++) {
    const currentChar = str[i]
    // Starting a new word
    if (!currentWord) {
      currentWord = currentChar
      continue
    }
    // current character is whitespace while word isn't, or vice versa:
    // add our current word to results, start over the current word.
    if (!!currentChar.trim() !== !!currentWord.trim()) {
      result.push(currentWord)
      currentWord = currentChar
      continue
    }
    currentWord += currentChar
  }
  // Add the last word we were working on
  if (currentWord) {
    result.push(currentWord)
  }
  return result
}

const completion = {
  wordAtPosition,
  addPositionToWords,
  splitByWhitespaceBoundary,
  replaceWord
}

export default completion
