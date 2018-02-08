/* global describe it expect */
const Field = require('../../lib/class/Field')

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
      expect(FIELD.validate).to.have.property('isInt', true)
      expect(FIELD.validate).to.have.property('min', 1)
      expect(FIELD.validate).to.have.property('max', 2147483647)
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
      expect(FIELD.validate.len).to.be.an('array').to.have.lengthOf(2)
      expect(FIELD.validate.len[0]).to.equal(0)
      expect(FIELD.validate.len[1]).to.equal(255)
    })
    it('Ejecución con 1 parámetro de tipo entero', () => {
      const length = 10
      const FIELD = Field.STRING(length)
      expect(FIELD.type).to.have.property('_length', length)
      expect(FIELD.validate.len[1]).to.equal(length)
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
      expect(FIELD.validate).to.have.property('isInt', true)
      expect(FIELD.validate).to.have.property('min', 0)
      expect(FIELD.validate).to.have.property('max', 2147483647)
    })
  })

  describe(` Método: FLOAT`, () => {
    it('Ejecución sin parámetros', () => {
      const FIELD = Field.FLOAT()
      expect(FIELD).to.have.property('type')
      expect(FIELD.type).to.have.property('key', 'FLOAT')
      expect(FIELD).to.have.property('validate')
      expect(FIELD.validate).to.have.property('isFloat', true)
      expect(FIELD.validate).to.have.property('min', 0.0)
      expect(FIELD.validate).to.have.property('max', 1E+308)
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
      expect(FIELD.validate.isIn).to.be.an('array').to.have.lengthOf(1)
      expect(FIELD.validate.isIn[0]).to.be.an('array').to.have.lengthOf(values.length)
    })
  })
})
