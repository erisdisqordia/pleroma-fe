import { replaceWord, addPositionToWords, wordAtPosition, splitIntoWords } from '../../../../../src/services/completion/completion.js'

describe('addPositiontoWords', () => {
  it('adds the position to a word list', () => {
    const words = ['hey', 'this', 'is', 'fun']

    const expected = [
      {
        word: 'hey',
        start: 0,
        end: 3
      },
      {
        word: 'this',
        start: 3,
        end: 7
      },
      {
        word: 'is',
        start: 7,
        end: 9
      },
      {
        word: 'fun',
        start: 9,
        end: 12
      }
    ]

    const res = addPositionToWords(words)

    expect(res).to.eql(expected)
  })
})

describe('splitIntoWords', () => {
  it('splits at whitespace boundaries', () => {
    const str = 'This is a #nice @test for you, @idiot.'
    const expected = ['This', ' ', 'is', ' ', 'a', ' ', '#nice', ' ', '@test', ' ', 'for', ' ', 'you', ', ', '@idiot', '.']
    const res = splitIntoWords(str)

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
    const str = 'hey @take, how are you'
    const wordsWithPosition = addPositionToWords(splitIntoWords(str))
    const toReplace = wordsWithPosition[2]

    expect(toReplace.word).to.eql('@take')

    const expected = 'hey @takeshitakenji, how are you'
    const res = replaceWord(str, toReplace, '@takeshitakenji')
    expect(res).to.eql(expected)
  })
})
