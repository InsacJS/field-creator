/** @ignore */ const _ = require('lodash')
/** @ignore */ const Sequelize = require('sequelize')

/**
* Atributo de un modelo.
*/
class Field {
  /**
  * Devuelve un campo de tipo INTEGER que representa un ID.
  * @param {Object} [properties] Propiedades del campo.
  * @param {String} [properties.fieldName='id'] Nombre del campo.
  * @param {String} [properties.validate] Objeto para validar el campo.
  * @return {Object}
  */
  static ID (properties = {}) {
    properties.fieldName = properties.fieldName || 'id'
    properties.type = Sequelize.INTEGER()
    properties.primaryKey = true
    properties.autoIncrement = true
    properties.allowNull = false
    Field.normalize(properties)
    const DEFAULT_VALIDATE = _createValidate(properties.type, { min: 1 })
    if (properties.validate !== null) { properties.validate = Object.assign(DEFAULT_VALIDATE, properties.validate) }
    return properties
  }

  /**
  * Devuelve un campo de tipo STRING que representa un a cadena de texto.
  * @param {Number|Object} [length] Longitud de la cadena o propiedades del campo.
  * @param {Object} [properties] Propiedades del campo.
  * @param {String} [properties.validate] Objeto para validar el campo.
  * @return {Object}
  */
  static STRING (length, properties = {}) {
    const LENGTH = (length && (typeof length === 'number')) ? length : 255
    const PROPERTIES = (length && (typeof length === 'object')) ? length : properties
    PROPERTIES.type = Sequelize.STRING(LENGTH)
    Field.normalize(PROPERTIES)
    const DEFAULT_VALIDATE = _createValidate(PROPERTIES.type)
    if (PROPERTIES.validate !== null) { PROPERTIES.validate = Object.assign(DEFAULT_VALIDATE, PROPERTIES.validate) }
    return PROPERTIES
  }

  /**
  * Devuelve un campo de tipo INTEGER que representa un número entero.
  * @param {Object} [properties] Propiedades del campo.
  * @param {String} [properties.validate] Objeto para validar el campo.
  * @return {Object}
  */
  static INTEGER (properties = {}) {
    properties.type = Sequelize.INTEGER()
    Field.normalize(properties)
    const DEFAULT_VALIDATE = _createValidate(properties.type, { min: 0 })
    if (properties.validate !== null) { properties.validate = Object.assign(DEFAULT_VALIDATE, properties.validate) }
    return properties
  }

  /**
  * Devuelve un campo de tipo FLOAT que representa un número en coma flotante.
  * @param {Object} [properties] Propiedades del campo.
  * @param {String} [properties.validate] Objeto para validar el campo.
  * @return {Object}
  */
  static FLOAT (properties = {}) {
    properties.type = Sequelize.FLOAT()
    Field.normalize(properties)
    const DEFAULT_VALIDATE = _createValidate(properties.type, { min: 0 })
    if (properties.validate !== null) { properties.validate = Object.assign(DEFAULT_VALIDATE, properties.validate) }
    return properties
  }

  /**
  * Devuelve un campo de tipo ENUM que representa un conjunto de valores.
  * @param {String[]} values Valores del campo.
  * @param {Object} [properties] Propiedades del campo.
  * @param {String} [properties.validate] Objeto para validar el campo.
  * @return {Object}
  */
  static ENUM (values, properties = {}) {
    properties.type = Sequelize.ENUM(values)
    Field.normalize(properties)
    const DEFAULT_VALIDATE = _createValidate(properties.type)
    if (properties.validate !== null) { properties.validate = Object.assign(DEFAULT_VALIDATE, properties.validate) }
    return properties
  }

  /**
  * Normaliza las propiedades de un campo.
  * @param {Object} properties Propiedades del campo.
  */
  static normalize (properties) {
    const primitives = ['string', 'number', 'boolean']
    if (properties.validate) {
      Object.keys(properties.validate).forEach(key => {
        const val = properties.validate[key]
        if (primitives.includes(typeof val)) {
          properties.validate[key] = { args: [val] }
          return
        }
        if (Array.isArray(val)) {
          properties.validate[key] = { args: [val] }
          return
        }
        if (typeof val.args === 'undefined') { properties.validate[key].args = [true] }
      })
    }
  }

  /**
  * Copia las propiedades mas relevantes de un atributo de un modelo sequelize.
  * @param {Object} field Atributo sequelize.
  * @param {Object} properties Propiedades a modificar del campo.
  * @return {Object}
  */
  static CLONE (field, properties = {}) {
    const result = _.clone(field)
    delete result.Model
    delete result._modelAttribute
    delete result.field
    delete result.fieldName
    return Object.assign(result, properties)
  }
}

/**
* Devuelve un objeto validate.
* @param {SequelizeType} type Propiedad tipo del atributo de un modelo sequelize.
* @param {Object} [custom] Propiedad validate personalizada.
* @return {Object}
*/
function _createValidate (type, custom = {}) {
  let val = {}
  if (type.key === 'STRING') { val = { len: [0, type._length] } }
  if (type.key === 'INTEGER') { val = { isInt: true, min: -2147483647, max: 2147483647 } }
  if (type.key === 'FLOAT') { val = { isFloat: true, min: -1E+308, max: 1E+308 } }
  if (type.key === 'ENUM') { val = { isIn: type.values } }
  Object.keys(custom).forEach(key => { val[key] = custom[key] })
  return val
}

module.exports = Field
