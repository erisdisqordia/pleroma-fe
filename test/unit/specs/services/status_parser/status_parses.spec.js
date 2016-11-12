const example = '<div class="status-content">@<a href="https://sealion.club/user/4" class="h-card mention" title="dewoo">dwmatiz</a> <a href="https://social.heldscal.la/file/3deb764ada10ce64a61b7a070b75dac45f86d2d5bf213bf18873da71d8714d86.png" title="https://social.heldscal.la/file/3deb764ada10ce64a61b7a070b75dac45f86d2d5bf213bf18873da71d8714d86.png" class="attachment" id="attachment-159853" rel="nofollow external">https://social.heldscal.la/attachment/159853</a></div>'

import { removeAttachmentLinks } from '../../../../../src/services/status_parser/status_parser.js'

describe('statusParser.removeAttachmentLinks', () => {
  const exampleWithoutAttachmentLinks = '<div class="status-content">@<a href="https://sealion.club/user/4" class="h-card mention" title="dewoo">dwmatiz</a> </div>'

  it('removes attachment links', () => {
    const parsed = removeAttachmentLinks(example)
    expect(parsed).to.eql(exampleWithoutAttachmentLinks)
  })

  it('works when the class is empty', () => {
    const parsed = removeAttachmentLinks('<a></a>')
    expect(parsed).to.eql('<a></a>')
  })
})
