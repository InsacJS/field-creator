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
    properties.type = Sequelize.INTEGER()
    properties.primaryKey = true
    properties.autoIncrement = true
    properties.allowNull = false
    properties.validate = _createValidate(properties.type, { min: [1] }, properties.validate)
    properties._modelAttribute = true
    return properties
  }

  /**
  * Devuelve un campo de tipo STRING que representa un a cadena de texto.
  * @param {Number|Object} [LENGTH] Longitud de la cadena o propiedades del campo.
  * @param {Object} [PROPERTIES] Propiedades del campo.
  * @param {String} [PROPERTIES.validate] Objeto para validar el campo.
  * @return {Object}
  */
  static STRING (LENGTH, PROPERTIES = {}) {
    const length = (LENGTH && (typeof LENGTH === 'number')) ? LENGTH : 255
    const properties = (LENGTH && (typeof LENGTH === 'object')) ? LENGTH : PROPERTIES
    properties.type = Sequelize.STRING(length)
    properties.validate = _createValidate(properties.type, null, properties.validate)
    properties._modelAttribute = true
    return properties
  }

  /**
  * Devuelve un campo de tipo INTEGER que representa un número entero.
  * @param {Object} [properties] Propiedades del campo.
  * @param {String} [properties.validate] Objeto para validar el campo.
  * @return {Object}
  */
  static INTEGER (properties = {}) {
    properties.type = Sequelize.INTEGER()
    properties.validate = _createValidate(properties.type, { min: [0] }, properties.validate)
    properties._modelAttribute = true
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
    properties.validate = _createValidate(properties.type, { min: [0] }, properties.validate)
    properties._modelAttribute = true
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
    properties.validate = _createValidate(properties.type, null, properties.validate)
    properties._modelAttribute = true
    return properties
  }

  /**
  * Devuelve un campo a partir de un atributo que ya ha sido definido.
  * @param {Object} field Atributo sequelize.
  * @param {Object} properties Propiedades a modificar del campo.
  * @return {Object}
  */
  static CLONE (field, properties = {}) {
    properties = Object.assign(_.cloneDeep(field), properties)
    properties._modelAttribute = true
    return properties
  }
}

/**
* Devuelve un objeto validate.
* @param {SequelizeType} type Propiedad tipo del atributo de un modelo sequelize.
* @param {Object} [defaultValidate] Propiedad validate por defecto.
* @param {Object} [customValidate] Propiedad validate personalizado.
* @return {Object}
*/
function _createValidate (type, defaultValidate = {}, customValidate) {
  if (customValidate === null) { return null }
  let val = {}
  if (type.key === 'STRING') { val = { len: [0, type._length] } }
  if (type.key === 'INTEGER') { val = { isInt: true, min: [-2147483647], max: [2147483647] } }
  if (type.key === 'FLOAT') { val = { isFloat: true, min: [-1E+308], max: [1E+308] } }
  if (type.key === 'ENUM') { val = { isIn: [type.values] } }
  return Object.assign(Object.assign(val, defaultValidate), customValidate)
}

module.exports = Field
