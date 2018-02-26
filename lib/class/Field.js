/** @ignore */ const _         = require('lodash')
/** @ignore */ const Sequelize = require('sequelize')

/**
* Atributo de un modelo.
*/
class Field {
  /**
  * Devuelve un campo de tipo INTEGER que representa un ID.
  * @param {Object} [properties]                - Propiedades del campo.
  * @param {String} [properties.fieldName='id'] - Nombre del campo.
  * @param {String} [properties.validate]       - Objeto para validar el campo.
  * @return {Object}
  */
  static ID (properties = {}) {
    properties.type            = Sequelize.INTEGER()
    properties.primaryKey      = true
    properties.autoIncrement   = true
    properties.allowNull       = false
    properties.validate        = _createValidate(properties.type, { min: [1] }, properties.validate)
    properties._modelAttribute = true
    return properties
  }

  /**
  * Devuelve un campo de tipo STRING que representa un a cadena de texto.
  * @param {Number|Object} [LENGTH]              - Longitud de la cadena o propiedades del campo.
  * @param {Object}        [PROPERTIES]          - Propiedades del campo.
  * @param {String}        [PROPERTIES.validate] - Objeto para validar el campo.
  * @return {Object}
  */
  static STRING (LENGTH, PROPERTIES = {}) {
    const length     = (LENGTH && (typeof LENGTH === 'number')) ? LENGTH : 255
    const properties = (LENGTH && (typeof LENGTH === 'object')) ? LENGTH : PROPERTIES
    properties.type            = Sequelize.STRING(length)
    properties.validate        = _createValidate(properties.type, null, properties.validate)
    properties._modelAttribute = true
    return properties
  }

  /**
  * Devuelve un campo de tipo INTEGER que representa un número entero.
  * @param {Object} [properties]          - Propiedades del campo.
  * @param {String} [properties.validate] - Objeto para validar el campo.
  * @return {Object}
  */
  static INTEGER (properties = {}) {
    properties.type            = Sequelize.INTEGER()
    properties.validate        = _createValidate(properties.type, { min: [0] }, properties.validate)
    properties._modelAttribute = true
    return properties
  }

  /**
  * Devuelve un campo de tipo FLOAT que representa un número en coma flotante.
  * @param {Object} [properties]          - Propiedades del campo.
  * @param {String} [properties.validate] - Objeto para validar el campo.
  * @return {Object}
  */
  static FLOAT (properties = {}) {
    properties.type            = Sequelize.FLOAT()
    properties.validate        = _createValidate(properties.type, { min: [0] }, properties.validate)
    properties._modelAttribute = true
    return properties
  }

  /**
  * Devuelve un campo de tipo BOOLEAN que representa un valor booleano.
  * @param {Object} [properties]          - Propiedades del campo.
  * @param {String} [properties.validate] - Objeto para validar el campo.
  * @return {Object}
  */
  static BOOLEAN (properties = {}) {
    properties.type            = Sequelize.BOOLEAN()
    properties.validate        = _createValidate(properties.type, null, properties.validate)
    properties._modelAttribute = true
    return properties
  }

  /**
  * Devuelve un campo de tipo DATE que representa una fecha.
  * @param {Object} [properties]          - Propiedades del campo.
  * @param {String} [properties.validate] - Objeto para validar el campo.
  * @return {Object}
  */
  static DATE (properties = {}) {
    properties.type            = Sequelize.DATE()
    properties.validate        = _createValidate(properties.type, null, properties.validate)
    properties._modelAttribute = true
    return properties
  }

  /**
  * Devuelve un campo de tipo ARRAY que representa una lista.
  * Tipo de dato soportado: STRING, INTEGER, FLOAT, BOOLEAN o DATE
  * @param {Object} type                  - Tipo de dato de los elementos de la lista.
  * @param {Object} [properties]          - Propiedades del campo.
  * @param {String} [properties.validate] - Objeto para validar el campo.
  * @return {Object}
  */
  static ARRAY (type, properties = {}) {
    const args = (type.key === 'STRING') ? type.options.length : undefined
    properties.type            = Sequelize.ARRAY(Sequelize[type.key](args))
    properties.validate        = _createValidate(properties.type, null, properties.validate)
    properties._modelAttribute = true
    return properties
  }

  /**
  * Devuelve un campo de tipo ENUM que representa un conjunto de valores.
  * @param {!String[]} values               - Valores del campo.
  * @param {Object}   [properties]          - Propiedades del campo.
  * @param {String}   [properties.validate] - Objeto para validar el campo.
  * @return {Object}
  */
  static ENUM (values, properties = {}) {
    properties.type            = Sequelize.ENUM(values)
    properties.validate        = _createValidate(properties.type, null, properties.validate)
    properties._modelAttribute = true
    return properties
  }

  /**
  * Devuelve un campo a partir de un atributo que ya ha sido definido.
  * @param {!Object} field                 - Atributo sequelize.
  * @param {Object}  [properties]          - Propiedades a modificar del campo.
  * @param {String}  [properties.validate] - Objeto para validar el campo.
  * @return {Object}
  */
  static CLONE (field, properties = {}) {
    properties = Object.assign(_.cloneDeep(field), properties)
    properties._modelAttribute = true
    return properties
  }

  /**
  * Convierte las propiedades de un atributo en una referencia THIS.
  * Opcionalmente se puede indicar el nombre del modelo.
  * @param {Object} [properties] - Propiedades del campo.
  * @return {Object}
  */
  static THIS (properties = {}) {
    properties._this = true
    return properties
  }

  /**
  * Crea un objeto con campos definidos en varios niveles a partir de un modelo.
  * Los niveles son las asociaciones que tiene el modelo.
  * @param {SequelizeModel} [model] - Modelo Sequelize.
  * @param {Object}         obj     - Objeto que contiene campos con referencias THIS.
  * @return {Object}
  */
  static group (model, obj) {
    return _updateTHIS(model, obj)
  }
}

/**
* Indica si un objeto es una referencia THIS.
* @param {Object} obj - Objeto.
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
* @param {Object} obj - Objeto.
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
* Si el atributo no tiene un fieldName, se le asigna uno.
* @param {SequelizeModel} model - Modelo Sequelize
* @param {Object}         obj   - Objeto (grupo de fields).
* @return {Object}
*/
function _updateTHIS (model, obj) {
  const RESULT = {}
  if (Array.isArray(obj)) {
    return [_updateTHIS(model, obj[0])]
  }
  Object.keys(obj).forEach(prop => {
    const OBJ = obj[prop]
    if (_isTHIS(OBJ)) {
      delete obj._this
      RESULT[prop] = Object.assign(_.cloneDeep(model.attributes[prop]), OBJ)
      return
    }
    if (_isField(OBJ)) {
      OBJ.fieldName = OBJ.fieldName || prop
      OBJ.field     = OBJ.field     || prop
      RESULT[prop] = OBJ
      return
    }
    if (typeof OBJ === 'object') {
      const SUB_MODEL = (model && model.associations[prop]) ? model.associations[prop].target : undefined
      RESULT[prop] = _updateTHIS(SUB_MODEL, OBJ)
    }
  })
  return RESULT
}

/**
* Devuelve un objeto validate.
* @param {!SequelizeType} type              - Propiedad tipo del atributo de un modelo sequelize.
* @param {Object}         [defaultValidate] - Propiedad validate por defecto.
* @param {Object}         [customValidate]  - Propiedad validate personalizado.
* @return {Object}
*/
function _createValidate (type, defaultValidate = {}, customValidate) {
  if (customValidate === null) { return null }
  let val = {}
  if (type.key === 'STRING')  { val = { len: [0, type.options.length] } }
  if (type.key === 'INTEGER') { val = { isInt: true, min: [-2147483647], max: [2147483647] } }
  if (type.key === 'FLOAT')   { val = { isFloat: true, min: [-1E+308], max: [1E+308] } }
  if (type.key === 'ENUM')    { val = { isIn: [type.values] } }
  if (type.key === 'BOOLEAN') { val = { isBoolean: true } }
  if (type.key === 'DATE')    { val = { isDate: true } }
  if (type.key === 'ARRAY')   { val = { isArray: _isArrayValidate(type.type) } }
  return Object.assign(Object.assign(val, defaultValidate), customValidate)
}

/**
* Devuelve un validador para el tipo de dato ARRAY.
* @param {SequelizeType} type - Propiedad tipo del atributo de un modelo sequelize.
* @return {Function}
*/
function _isArrayValidate (type) {
  return (value) => {
    if (!Array.isArray(value)) {
      throw new Error(`Debe ser un Array.`)
    }
    value.forEach(val => {
      if ((type.key === 'STRING') && !Sequelize.Validator.len(`${val}`, 0, type.options.length)) {
        throw new Error(`Cada elemento debe ser una cadena de texto con un máximo de ${type.options.length} caracteres.`)
      }
      if ((type.key === 'INTEGER') && !Sequelize.Validator.isInt(`${val}`)) {
        throw new Error(`Cada elemento debe ser de un número de tipo INTEGER.`)
      }
      if ((type.key === 'FLOAT') && !Sequelize.Validator.isFloat(`${val}`)) {
        throw new Error(`Cada elemento debe ser de un número de tipo FLOAT.`)
      }
      if ((type.key === 'BOOLEAN') && !Sequelize.Validator.isBoolean(`${val}`)) {
        throw new Error(`Cada elemento debe ser de un número de tipo BOOLEAN.`)
      }
      if ((type.key === 'DATE') && !Sequelize.Validator.isDate(`${val}`)) {
        throw new Error(`Cada elemento debe ser de un número de tipo DATE.`)
      }
    })
  }
}

module.exports = Field
