// This somewhat mysterious module
module.exports = function(source) {
  var object = JSON.parse(source)
  var smol = {
    notifications: object.notifications || {}
  }

  return JSON.stringify(smol)
}
