import { replaceWord, addPositionToWords, wordAtPosition, splitByWhitespaceBoundary } from '../../../../../src/services/completion/completion.js'

describe('addPositiontoWords', () => {
  it('adds the position to a word list', () => {
    const words = ['hey', ' ', 'this', ' ', 'is', ' ', 'fun']

    const expected = [
      {
        word: 'hey',
        start: 0,
        end: 3
      },
      {
        word: ' ',
        start: 3,
        end: 4
      },
      {
        word: 'this',
        start: 4,
        end: 8
      },
      {
        word: ' ',
        start: 8,
        end: 9
      },
      {
        word: 'is',
        start: 9,
        end: 11
      },
      {
        word: ' ',
        start: 11,
        end: 12
      },
      {
        word: 'fun',
        start: 12,
        end: 15
      }
    ]

    const res = addPositionToWords(words)

    expect(res).to.eql(expected)
  })
})

describe('splitByWhitespaceBoundary', () => {
  it('splits at whitespace boundaries', () => {
    const str = 'This is a #nice @test for you,    @idiot@idiot.com'
    const expected = ['This', ' ', 'is', ' ', 'a', ' ', '#nice', ' ', '@test', ' ', 'for', ' ', 'you,', '    ', '@idiot@idiot.com']
    const res = splitByWhitespaceBoundary(str)

    expect(res).to.eql(expected)
  })
})

describe('wordAtPosition', () => {
  it('returns the word for a given string and postion, plus the start and end position of that word', () => {
    const str = 'Hey this is fun'

    const { word, start, end } = wordAtPosition(str, 4)

    expect(word).to.eql('this')
    expect(start).to.eql(4)
    expect(end).to.eql(8)
  })
})

describe('replaceWord', () => {
  it('replaces a word (with start and end) with another word in a given string', () => {
    const str = 'hey @take , how are you'
    const wordsWithPosition = addPositionToWords(splitByWhitespaceBoundary(str))
    const toReplace = wordsWithPosition[2]

    expect(toReplace.word).to.eql('@take')

    const expected = 'hey @takeshitakenji , how are you'
    const res = replaceWord(str, toReplace, '@takeshitakenji')
    expect(res).to.eql(expected)
  })
})
