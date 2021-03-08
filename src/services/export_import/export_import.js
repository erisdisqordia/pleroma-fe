export const newExporter = ({
  filename = 'data',
  getExportedObject
}) => ({
  exportData () {
    const stringified = JSON.stringify(getExportedObject(), null, 2) // Pretty-print and indent with 2 spaces

    // Create an invisible link with a data url and simulate a click
    const e = document.createElement('a')
    e.setAttribute('download', `${filename}.json`)
    e.setAttribute('href', 'data:application/json;base64,' + window.btoa(stringified))
    e.style.display = 'none'

    document.body.appendChild(e)
    e.click()
    document.body.removeChild(e)
  }
})

export const newImporter = ({
  onImport,
  onImportFailure,
  validator = () => true
}) => ({
  importData () {
    const filePicker = document.createElement('input')
    filePicker.setAttribute('type', 'file')
    filePicker.setAttribute('accept', '.json')
    console.log(1)

    filePicker.addEventListener('change', event => {
      if (event.target.files[0]) {
        // eslint-disable-next-line no-undef
        const reader = new FileReader()
        reader.onload = ({ target }) => {
          try {
            const parsed = JSON.parse(target.result)
            const validationResult = validator(parsed)
            if (validationResult === true) {
              onImport(parsed)
            } else {
              onImportFailure({ validationResult })
            }
          } catch (error) {
            onImportFailure({ error })
          }
        }
        console.log(2)
        reader.readAsText(event.target.files[0])
      }
    })

    document.body.appendChild(filePicker)
    filePicker.click()
    document.body.removeChild(filePicker)
  }
})
