/** @ignore */ const fs = require('fs')
/** @ignore */ const path = require('path')

/**
* Busca un archivo y ejecuta una función cuando lo encuentra.
* @param {String} dirPath Directorio de búsqueda.
* @param {String} ext Extensión del archivo.
* @param {Function} onFind Función que se ejecuta cuando encuentra el archivo.
*/
function find (dirPath, ext, onFind) {
  dirPath = path.resolve(path.dirname(require.main.filename), dirPath)
  function _find (filePath) {
    if (fs.statSync(filePath).isDirectory()) {
      fs.readdirSync(filePath).forEach((fileName) => {
        _find(path.resolve(filePath, fileName))
      })
    } else {
      if (filePath.endsWith(ext)) {
        const dirPath = path.dirname(filePath)
        const fileName = filePath.split(path.sep).pop().replace(ext, '')
        const dirName = dirPath.split(path.sep).pop()
        const fileExt = ext
        onFind({ filePath, dirPath, fileName, dirName, fileExt })
      }
    }
  }
  _find(dirPath)
}

module.exports = {
  find
}
