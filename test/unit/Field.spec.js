/* global describe it expect */
const Field     = require('../../lib/class/Field')
const path      = require('path')
const Sequelize = require('sequelize')
const DB_CONFIG = require('../db_config')

describe('\n - Clase: Field\n', () => {
  describe(` Método: ID`, () => {
    it('Ejecución sin parámetros', () => {
      const FIELD = Field.ID()
      expect(FIELD).to.have.property('type')
      expect(FIELD.type).to.have.property('key', 'INTEGER')
      expect(FIELD).to.have.property('primaryKey', true)
      expect(FIELD).to.have.property('allowNull', false)
      expect(FIELD).to.have.property('autoIncrement', true)
      expect(FIELD).to.have.property('validate')
      expect(FIELD.validate).to.have.property('isInt')
      expect(FIELD.validate).to.have.property('min')
      expect(FIELD.validate).to.have.property('max')
    })
    it('Ejecución con parámetros', () => {
      const params = { comment: 'ID field', validate: null }
      const FIELD = Field.ID(params)
      expect(FIELD).to.have.property('comment', params.comment)
      expect(FIELD.validate).to.equal(null)
    })
  })

  describe(` Método: STRING`, () => {
    it('Ejecución sin parámetros', () => {
      const FIELD = Field.STRING()
      expect(FIELD).to.have.property('type')
      expect(FIELD.type).to.have.property('key', 'STRING')
      expect(FIELD).to.have.property('validate')
      expect(FIELD.validate).to.have.property('len')
    })
    it('Ejecución con 1 parámetro de tipo entero', () => {
      const length = 10
      const FIELD = Field.STRING(length)
      expect(FIELD.type).to.have.property('_length', length)
      expect(FIELD.validate.len.args[1]).to.equal(length)
    })
    it('Ejecución con 1 parámetro de tipo objeto', () => {
      const params = { comment: 'String field', validate: null }
      const FIELD = Field.STRING(params)
      expect(FIELD).to.have.property('comment', params.comment)
      expect(FIELD.validate).to.equal(null)
    })
    it('Ejecución con 2 parámetros', () => {
      const length = 10
      const params = { comment: 'String field', validate: null }
      const FIELD = Field.STRING(length, params)
      expect(FIELD.type).to.have.property('_length', length)
      expect(FIELD).to.have.property('comment', params.comment)
      expect(FIELD.validate).to.equal(null)
    })
  })

  describe(` Método: INTEGER`, () => {
    it('Ejecución sin parámetros', () => {
      const FIELD = Field.INTEGER()
      expect(FIELD).to.have.property('type')
      expect(FIELD.type).to.have.property('key', 'INTEGER')
      expect(FIELD).to.have.property('validate')
      expect(FIELD.validate).to.have.property('isInt')
      expect(FIELD.validate).to.have.property('min')
      expect(FIELD.validate).to.have.property('max')
    })
  })

  describe(` Método: FLOAT`, () => {
    it('Ejecución sin parámetros', () => {
      const FIELD = Field.FLOAT()
      expect(FIELD).to.have.property('type')
      expect(FIELD.type).to.have.property('key', 'FLOAT')
      expect(FIELD).to.have.property('validate')
      expect(FIELD.validate).to.have.property('isFloat')
      expect(FIELD.validate).to.have.property('min')
      expect(FIELD.validate).to.have.property('max')
    })
  })

  describe(` Método: ENUM`, () => {
    it('Ejecución con parámetros', () => {
      const values = ['A', 'B']
      const FIELD = Field.ENUM(values)
      expect(FIELD).to.have.property('type')
      expect(FIELD.type).to.have.property('key', 'ENUM')
      expect(FIELD).to.have.property('validate')
      expect(FIELD.validate).to.have.property('isIn')
    })
  })

  describe(` Método: group`, () => {
    it('Ejecución con parámetros', () => {
      const sequelize = new Sequelize(DB_CONFIG.database, DB_CONFIG.username, DB_CONFIG.password, DB_CONFIG.params)
      const pathModels = path.resolve(__dirname, './models')
      sequelize.import(`${pathModels}/autor.model.js`)
      sequelize.import(`${pathModels}/libro.model.js`)
      sequelize.models.autor.associate(sequelize.models)
      sequelize.models.libro.associate(sequelize.models)
      const THIS = Field.THIS
      const RESULT1 = Field.group(sequelize.models.libro, {
        id_libro : THIS(),
        titulo   : THIS(),
        precio   : THIS()
      })
      const RESULT2 = Field.group(sequelize.models.libro, {
        titulo : THIS({ allowNull: false }),
        precio : THIS({ allowNull: true })
      })
      expect(sequelize.models.libro.attributes.titulo).to.not.have.property('allowNull')
      expect(sequelize.models.libro.attributes.precio).to.not.have.property('allowNull')
      expect(RESULT1.titulo).to.not.have.property('allowNull')
      expect(RESULT1.precio).to.not.have.property('allowNull')
      expect(RESULT2.titulo).to.have.property('allowNull', false)
      expect(RESULT2.precio).to.have.property('allowNull', true)
    })
  })
})
