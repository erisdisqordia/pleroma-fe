const fileSizeFormat = (num, t) => {
  var exponent
  var unit
  var units = [t('file_size_units.B'), t('file_size_units.KB'), t('file_size_units.MB'), t('file_size_units.GB'), t('file_size_units.TB')]
  if (num < 1) {
    return num + ' ' + units[0]
  }

  exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
  num = (num / Math.pow(1000, exponent)).toFixed(2) * 1
  unit = units[exponent]
  return num + ' ' + unit
}
const fileSizeFormatService = {
  fileSizeFormat
}
export default fileSizeFormatService
