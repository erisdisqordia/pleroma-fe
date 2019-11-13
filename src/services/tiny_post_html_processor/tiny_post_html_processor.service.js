/**
 * This is a tiny purpose-built HTML parser/processor. This basically detects any type of visual newline and
 * allows it to be processed, useful for greentexting, mostly
 *
 * @param {Object} input - input data
 * @param {(string) => string} processor - function that will be called on every line
 * @return {string} processed html
 */
export const processHtml = (html, processor) => {
  const handledTags = new Set(['p', 'br', 'div'])
  const openCloseTags = new Set(['p', 'div'])

  let buffer = '' // Current output buffer
  const level = [] // How deep we are in tags and which tags were there
  let textBuffer = '' // Current line content
  let tagBuffer = null // Current tag buffer, if null = we are not currently reading a tag

  // Extracts tag name from tag, i.e. <span a="b"> => span
  const getTagName = (tag) => {
    const result = /(?:<\/(\w+)>|<(\w+)\s?[^/]*?\/?>)/gi.exec(tag)
    return result && (result[1] || result[2])
  }

  const flush = () => { // Processes current line buffer, adds it to output buffer and clears line buffer
    buffer += processor(textBuffer)
    textBuffer = ''
  }

  const handleBr = (tag) => { // handles single newlines/linebreaks
    flush()
    buffer += tag
  }

  const handleOpen = (tag) => { // handles opening tags
    flush()
    buffer += tag
    level.push(tag)
  }

  const handleClose = (tag) => { // handles closing tags
    flush()
    buffer += tag
    if (level[level.length - 1] === tag) {
      level.pop()
    }
  }

  for (let i = 0; i < html.length; i++) {
    const char = html[i]
    if (char === '<' && tagBuffer === null) {
      tagBuffer = char
    } else if (char !== '>' && tagBuffer !== null) {
      tagBuffer += char
    } else if (char === '>' && tagBuffer !== null) {
      tagBuffer += char
      const tagFull = tagBuffer
      tagBuffer = null
      const tagName = getTagName(tagFull)
      if (handledTags.has(tagName)) {
        if (tagName === 'br') {
          handleBr(tagFull)
        }
        if (openCloseTags.has(tagFull)) {
          if (tagFull[1] === '/') {
            handleClose(tagFull)
          } else {
            handleOpen(tagFull)
          }
        }
      } else {
        textBuffer += tagFull
      }
    } else if (char === '\n') {
      handleBr(char)
    } else {
      textBuffer += char
    }
  }

  flush()

  return buffer
}
