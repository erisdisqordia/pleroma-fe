// TODO this func might as well take the entire file and use its mimetype
// or the entire service could be just mimetype service that only operates
// on mimetypes and not files. Currently the naming is confusing.
const fileType = mimetype => {
  if (mimetype.match(/text\/html/)) {
    return 'html'
  }

  if (mimetype.match(/image/)) {
    return 'image'
  }

  if (mimetype.match(/video/)) {
    return 'video'
  }

  if (mimetype.match(/audio/)) {
    return 'audio'
  }

  return 'unknown'
}

const fileMatchesSomeType = (types, file) =>
  types.some(type => fileType(file.mimetype) === type)

const fileTypeService = {
  fileType,
  fileMatchesSomeType
}

export default fileTypeService
