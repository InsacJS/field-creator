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
      expect(FIELD).to.have.property('_modelAttribute', true)
      expect(FIELD.validate).to.have.property('isInt')
      expect(FIELD.validate.isInt).to.have.property('args')
      expect(FIELD.validate.isInt.args).to.be.an('array').to.have.lengthOf(1)
      expect(FIELD.validate.isInt.args[0]).to.equal(true)
      expect(FIELD.validate).to.have.property('min')
      expect(FIELD.validate.min).to.have.property('args')
      expect(FIELD.validate.min.args).to.be.an('array').to.have.lengthOf(1)
      expect(FIELD.validate.min.args[0]).to.equal(1)
      expect(FIELD.validate).to.have.property('max')
      expect(FIELD.validate.max).to.have.property('args')
      expect(FIELD.validate.max.args).to.be.an('array').to.have.lengthOf(1)
      expect(FIELD.validate.max.args[0]).to.equal(2147483647)
    })
    it('Ejecución con parámetros', () => {
      const params = { comment: 'ID field', validate: null }
      const FIELD = Field.ID(params)
      expect(FIELD).to.have.property('comment', params.comment)
      expect(FIELD).to.have.property('_modelAttribute', true)
      expect(FIELD.validate).to.be.a('null')
    })
  })

  describe(` Método: STRING`, () => {
    it('Ejecución sin parámetros', () => {
      const FIELD = Field.STRING()
      expect(FIELD).to.have.property('type')
      expect(FIELD.type).to.have.property('key', 'STRING')
      expect(FIELD).to.have.property('_modelAttribute', true)
      expect(FIELD).to.have.property('validate')
      expect(FIELD.validate).to.have.property('len')
      expect(FIELD.validate.len).to.have.property('args')
      expect(FIELD.validate.len.args).to.be.an('array').to.have.lengthOf(2)
      expect(FIELD.validate.len.args[0]).to.equal(0)
      expect(FIELD.validate.len.args[1]).to.equal(255)
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
      expect(FIELD.validate).to.be.a('null')
    })
    it('Ejecución con 2 parámetros', () => {
      const length = 10
      const params = { comment: 'String field', validate: null }
      const FIELD = Field.STRING(length, params)
      expect(FIELD.type).to.have.property('_length', length)
      expect(FIELD).to.have.property('comment', params.comment)
      expect(FIELD.validate).to.be.a('null')
    })
  })

  describe(` Método: INTEGER`, () => {
    it('Ejecución sin parámetros', () => {
      const FIELD = Field.INTEGER()
      expect(FIELD).to.have.property('type')
      expect(FIELD.type).to.have.property('key', 'INTEGER')
      expect(FIELD).to.have.property('_modelAttribute', true)
      expect(FIELD).to.have.property('validate')
      expect(FIELD.validate).to.have.property('isInt')
      expect(FIELD.validate.isInt).to.have.property('args')
      expect(FIELD.validate.isInt.args).to.be.an('array').to.have.lengthOf(1)
      expect(FIELD.validate.isInt.args[0]).to.equal(true)
      expect(FIELD.validate).to.have.property('min')
      expect(FIELD.validate.min).to.have.property('args')
      expect(FIELD.validate.min.args).to.be.an('array').to.have.lengthOf(1)
      expect(FIELD.validate.min.args[0]).to.equal(0)
      expect(FIELD.validate).to.have.property('max')
      expect(FIELD.validate.max).to.have.property('args')
      expect(FIELD.validate.max.args).to.be.an('array').to.have.lengthOf(1)
      expect(FIELD.validate.max.args[0]).to.equal(2147483647)
    })
  })

  describe(` Método: FLOAT`, () => {
    it('Ejecución sin parámetros', () => {
      const FIELD = Field.FLOAT()
      expect(FIELD).to.have.property('type')
      expect(FIELD.type).to.have.property('key', 'FLOAT')
      expect(FIELD).to.have.property('_modelAttribute', true)
      expect(FIELD).to.have.property('validate')
      expect(FIELD.validate).to.have.property('isFloat')
      expect(FIELD.validate.isFloat).to.have.property('args')
      expect(FIELD.validate.isFloat.args).to.be.an('array').to.have.lengthOf(1)
      expect(FIELD.validate.isFloat.args[0]).to.equal(true)
      expect(FIELD.validate).to.have.property('min')
      expect(FIELD.validate.min).to.have.property('args')
      expect(FIELD.validate.min.args).to.be.an('array').to.have.lengthOf(1)
      expect(FIELD.validate.min.args[0]).to.equal(0)
      expect(FIELD.validate).to.have.property('max')
      expect(FIELD.validate.max).to.have.property('args')
      expect(FIELD.validate.max.args).to.be.an('array').to.have.lengthOf(1)
      expect(FIELD.validate.max.args[0]).to.equal(1E+308)
    })
  })

  describe(` Método: ENUM`, () => {
    it('Ejecución con parámetros', () => {
      const values = ['A', 'B']
      const FIELD = Field.ENUM(values)
      expect(FIELD).to.have.property('type')
      expect(FIELD.type).to.have.property('key', 'ENUM')
      expect(FIELD).to.have.property('_modelAttribute', true)
      expect(FIELD).to.have.property('validate')
      expect(FIELD.validate).to.have.property('isIn')
      expect(FIELD.validate.isIn).to.have.property('args')
      expect(FIELD.validate.isIn.args).to.be.an('array').to.have.lengthOf(1)
      expect(FIELD.validate.isIn.args[0]).to.be.an('array').to.have.lengthOf(values.length)
    })
  })

  describe(` Método: isField`, () => {
    it('Ejecución con parámetros', () => {
      const FIELD = Field.STRING()
      expect(Field.isField(FIELD)).to.equal(true)
      expect(Field.isField({})).to.equal(false)
    })
  })
})
