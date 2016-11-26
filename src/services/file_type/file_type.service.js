const fileType = (typeString) => {
  let type = 'unknown'

  if (typeString.match(/text\/html/)) {
    type = 'html'
  }

  if (typeString.match(/image/)) {
    type = 'image'
  }

  if (typeString.match(/video\/(webm|mp4)/)) {
    type = 'video'
  }

  if (typeString.match(/audio|ogg/)) {
    type = 'audio'
  }

  return type
}

const fileTypeService = {
  fileType
}

export default fileTypeService
