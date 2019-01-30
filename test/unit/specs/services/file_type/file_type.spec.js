import fileType from 'src/services/file_type/file_type.service.js'

describe('fileType service', () => {
  describe('fileMatchesSomeType', () => {
    it('should be true when file type is one of the listed', () => {
      const file = { mimetype: 'audio/mpeg' }
      const types = ['video', 'audio']

      expect(fileType.fileMatchesSomeType(types, file)).to.eql(true)
    })

    it('should be false when files type is not included in type list', () => {
      const file = { mimetype: 'audio/mpeg' }
      const types = ['image', 'video']

      expect(fileType.fileMatchesSomeType(types, file)).to.eql(false)
    })
  })
})
