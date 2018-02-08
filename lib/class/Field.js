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
    properties._modelAttribute = true
    properties.fieldName = properties.fieldName || 'id'
    properties.type = Sequelize.INTEGER()
    properties.primaryKey = true
    properties.autoIncrement = true
    properties.allowNull = false
    properties.validate = (typeof properties.validate !== 'undefined') ? properties.validate : {}
    if (properties.validate !== null) {
      if (!properties.validate.isInt) { properties.validate.isInt = { args: [true] } }
      if (!properties.validate.min) { properties.validate.min = { args: [1] } }
      if (!properties.validate.max) { properties.validate.max = { args: [2147483647] } }
    }
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
    PROPERTIES._modelAttribute = true
    PROPERTIES.type = Sequelize.STRING(LENGTH)
    PROPERTIES.validate = (typeof PROPERTIES.validate !== 'undefined') ? PROPERTIES.validate : {}
    if (PROPERTIES.validate !== null) {
      if (!PROPERTIES.validate.len) { PROPERTIES.validate.len = { args: [0, LENGTH] } }
    }
    return PROPERTIES
  }

  /**
  * Devuelve un campo de tipo INTEGER que representa un número entero.
  * @param {Object} [properties] Propiedades del campo.
  * @param {String} [properties.validate] Objeto para validar el campo.
  * @return {Object}
  */
  static INTEGER (properties = {}) {
    properties._modelAttribute = true
    properties.type = Sequelize.INTEGER()
    properties.validate = (typeof properties.validate !== 'undefined') ? properties.validate : {}
    if (properties.validate !== null) {
      if (!properties.validate.isInt) { properties.validate.isInt = { args: [true] } }
      if (!properties.validate.min) { properties.validate.min = { args: [0] } }
      if (!properties.validate.max) { properties.validate.max = { args: [2147483647] } }
    }
    return properties
  }

  /**
  * Devuelve un campo de tipo FLOAT que representa un número en coma flotante.
  * @param {Object} [properties] Propiedades del campo.
  * @param {String} [properties.validate] Objeto para validar el campo.
  * @return {Object}
  */
  static FLOAT (properties = {}) {
    properties._modelAttribute = true
    properties.type = Sequelize.FLOAT()
    properties.validate = (typeof properties.validate !== 'undefined') ? properties.validate : {}
    if (properties.validate !== null) {
      if (!properties.validate.isFloat) { properties.validate.isFloat = { args: [true] } }
      if (!properties.validate.min) { properties.validate.min = { args: [0] } }
      if (!properties.validate.max) { properties.validate.max = { args: [1E+308] } }
    }
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
    properties._modelAttribute = true
    properties.type = Sequelize.ENUM(values)
    properties.validate = (typeof properties.validate !== 'undefined') ? properties.validate : {}
    if (properties.validate !== null) {
      if (!properties.validate.isIn) { properties.validate.isIn = { args: [values] } }
    }
    return properties
  }

  /**
  * Indica si un objeto es el campo de un modelo.
  * @param {Object} obj Objeto.
  * @return {Boolean}
  */
  static isField (obj) {
    if (obj && obj._modelAttribute && (obj._modelAttribute === true)) {
      return true
    }
    return false
  }
}

module.exports = Field
