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
    properties.validate = _createValidate(properties.type, { min: [1] }, properties.validate)
    return _instanceAttribute(properties)
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
    PROPERTIES.validate = _createValidate(PROPERTIES.type, null, PROPERTIES.validate)
    return _instanceAttribute(PROPERTIES)
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
    return _instanceAttribute(properties)
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
    return _instanceAttribute(properties)
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
    return _instanceAttribute(properties)
  }

  /**
  * Copia las propiedades mas relevantes de un atributo de un modelo sequelize.
  * @param {Object} field Atributo sequelize.
  * @param {Object} properties Propiedades a modificar del campo.
  * @return {Object}
  */
  static CLONE (field, properties = {}) {
    return _instanceAttribute(Object.assign(_.cloneDeep(field), properties))
  }
}

/**
* Devuelve un objeto validate.
* @param {SequelizeType} type Propiedad tipo del atributo de un modelo sequelize.
* @param {Object} [validate] Propiedad validate predefinida.
* @param {Object} [custom] Propiedad validate personalizadas.
* @return {Object}
*/
function _createValidate (type, validate = {}, custom) {
  if (custom === null) { return null }
  let val = {}
  if (type.key === 'STRING') { val = { len: [0, type._length] } }
  if (type.key === 'INTEGER') { val = { isInt: true, min: [-2147483647], max: [2147483647] } }
  if (type.key === 'FLOAT') { val = { isFloat: true, min: [-1E+308], max: [1E+308] } }
  if (type.key === 'ENUM') { val = { isIn: [type.values] } }
  val = Object.assign(val, validate)
  val = Object.assign(val, custom)
  return val
}

/**
* Crea un atributo con todas las características del atributo de un modelo instanciado.
* @param {Object} properties Propiedades del atributo.
* @return {Object}
*/
function _instanceAttribute (properties) {
  const sequelize = new Sequelize(null, null, null, {
    dialect: 'postgres',
    lang: 'es',
    logging: false,
    operatorsAliases: false,
    define: { underscored: true, freezeTableName: true, timestamps: false }
  })
  return sequelize.define('default', { field: properties }).attributes.field
}

module.exports = Field
