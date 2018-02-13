/** @ignore */ const _ = require('lodash')
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const Util = require('./../tools/Util.js')

/**
* Contenedor de campos.
*/
class FieldContainer {
  /**
  * Instancia un contenedor.
  * Recibe un objeto sequelize solamente para obtener algunas configuraciones,
  * no se modifica en absoluto la instancia original.
  * @param {Sequelize} [sequelize] Instancia sequelize.
  */
  constructor (sequelize) {
    /**
    * Contiene una función por cada modelo.
    * @type {Object}
    */
    this.models = {}

    /**
    * Instancia sequelize que almacenará los campos.
    * @type {Sequelize}
    */
    this.sequelize = new Sequelize(null, null, null, {
      dialect: 'postgres',
      lang: 'es',
      logging: false,
      operatorsAliases: false,
      define: { underscored: true, freezeTableName: true, timestamps: false }
    })
    if (sequelize) { this.sequelize.options = sequelize.options }
  }

  /**
  * Importa los campos desde un archivo que contiene un modelo sequelize.
  * @param {String} dirPath Ruta del directorio donde se encuentran los modelos.
  * @param {Object} [options] Opciones de importación.
  * @param {String} [options.ext='.model.js'] Extensión del archivo que contiene al modelo.
  */
  import (dirPath, options = {}) {
    const EXT = options.ext || '.model.js'
    const modelsName = []
    Util.find(dirPath, EXT, ({ filePath }) => {
      const MODEL = this.sequelize.import(filePath)
      modelsName.push(MODEL.name)
    })
    const models = this.sequelize.models
    Object.keys(models).forEach((key) => {
      if (modelsName.includes(key)) {
        if ('associate' in models[key]) { models[key].associate(models) }
        this.models[key] = _createModelFunction(models[key])
      }
    })
  }

  /**
  * Define un nuevo modelo.
  * @param {String} modelName Nombre del modelo.
  * @param {Object} attributes Atributos del modelo.
  */
  define (modelName, attributes) {
    const MODEL = this.sequelize.define(modelName, attributes)
    this.models[MODEL.name] = _createModelFunction(MODEL)
  }

  /**
  * Crea un objeto con campos definidos en varios niveles a partir de un modelo.
  * Los niveles son las asociaciones que tiene el modelo.
  * @param {String} modelName Nombre del modelo.
  * @param {Object} obj Objeto que contiene campos con referencias THIS.
  * @return {Object}
  */
  group (modelName, obj) {
    return _updateTHIS(this.sequelize.models[modelName], obj, this.models)
  }

  /**
  * Convierte las propiedades de un atributo en una referencia THIS.
  * Opcionalmente se puede indicar el nombre del modelo.
  * @param {String|Object} arg1 Nombre del modelo ó propiedades del campo.
  * @param {Object} arg2 Propiedades del campo.
  * @return {Object}
  */
  static THIS (arg1, arg2) {
    let properties = {}
    let modelName
    if (arguments.length === 1) {
      if (typeof arguments[0] === 'string') { modelName = arguments[0] }
      if (typeof arguments[0] === 'object') { properties = arguments[0] }
    }
    if (arguments.length === 2) {
      modelName = arguments[0]
      properties = arguments[1]
    }
    properties.modelName = modelName
    properties._this = true
    return properties
  }
}

/**
* Indica si un objeto es una referencia THIS.
* @param {Object} obj Objeto.
* @return {Boolean}
*/
function _isTHIS (obj) {
  if (obj && obj._this && (obj._this === true)) {
    return true
  }
  return false
}

/**
* Indica si un objeto es atributo de un modelo.
* @param {Object} obj Objeto.
* @return {Boolean}
*/
function _isField (obj) {
  if (obj && obj._modelAttribute && (obj._modelAttribute === true)) {
    return true
  }
  return false
}

/**
* Devuelve un objeto cuyos campos han sido definidos como THIS, con el valor que le corresponde.
* @param {SequelizeModel} MODEL Modelo Sequelize
* @param {Object} obj Objeto conformado por campos.
* @param {Object} modelsFunction Objeto que contiene, funciones de los modelos que permiten crear nuevos campos.
* @return {Object}
*/
function _updateTHIS (MODEL, obj, modelsFunction) {
  const RESULT = {}
  if (Array.isArray(obj)) {
    return [_updateTHIS(MODEL, obj[0], modelsFunction)]
  }
  Object.keys(obj).forEach(prop => {
    const OBJ = obj[prop]
    if (_isTHIS(OBJ)) {
      const modelName = OBJ.modelName || MODEL.name
      RESULT[prop] = modelsFunction[modelName](prop, OBJ)
      return
    }
    if (_isField(OBJ)) {
      RESULT[prop] = OBJ
      return
    }
    const SUB_MODEL = (MODEL && MODEL.associations[prop]) ? MODEL.associations[prop].target : undefined
    RESULT[prop] = _updateTHIS(SUB_MODEL, OBJ, modelsFunction)
  })
  return RESULT
}

/**
* Devuelve una función que permitirá crear nuevos campos, a partir de un modelo.
* @param {SequelizeModel} MODEL Modelo Sequelize
* @return {Function}
*/
function _createModelFunction (MODEL) {
  return (fieldName, properties = {}) => {
    if (!(fieldName in MODEL.attributes)) {
      throw new Error(`El campo '${fieldName}' no se encuentra definido. Modelo: ${MODEL.name}`)
    }
    const FIELD = _.cloneDeep(MODEL.attributes[fieldName])
    Object.keys(properties).forEach(prop => {
      FIELD[prop] = properties[prop]
    })
    return FIELD
  }
}

module.exports = FieldContainer
