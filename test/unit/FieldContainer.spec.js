/* global describe it expect */
const path = require('path')
const Field = require('../../lib/class/Field')
const FieldContainer = require('../../lib/class/FieldContainer')

describe('\n - Clase: FieldContainer\n', () => {
  describe(` Método: import`, () => {
    it('Ejecución con parámetros', () => {
      const fieldContainer = new FieldContainer()
      fieldContainer.import(path.resolve(__dirname, 'models'))
      expect(Object.keys(fieldContainer.models).length).to.equal(1)
      expect(fieldContainer.models.libro).to.be.an('function')
      const FIELD = fieldContainer.models.libro('id', { allowNull: false })
      expect(FIELD).to.be.an('object')
      expect(FIELD.allowNull).to.equal(false)
    })
  })

  describe(` Método: define`, () => {
    it('Ejecución con parámetros', () => {
      const fieldContainer = new FieldContainer()
      fieldContainer.define('libro', {
        id: Field.ID(),
        titulo: Field.STRING(10),
        precio: Field.FLOAT()
      })
      expect(Object.keys(fieldContainer.models).length).to.equal(1)
      expect(fieldContainer.models.libro).to.be.an('function')
      const FIELD = fieldContainer.models.libro('id', { allowNull: true })
      expect(FIELD).to.be.an('object')
      expect(FIELD.allowNull).to.equal(true)
    })
  })

  describe(` Método: THIS`, () => {
    it('Ejecución con parámetros', () => {
      const THIS = FieldContainer.THIS
      expect(THIS).to.be.an('function')
      const FIELD = THIS()
      expect(FIELD).to.be.an('object')
    })
  })

  describe(` Método: isTHIS`, () => {
    it('Ejecución con parámetros', () => {
      const THIS = FieldContainer.THIS
      const field = THIS()
      const isThis = FieldContainer.isTHIS(field)
      expect(isThis).to.be.an('boolean')
      expect(isThis).to.equal(true)
    })
  })

  describe(` Método: group`, () => {
    it('Ejecución con parámetros', () => {
      const fieldContainer = new FieldContainer()
      fieldContainer.define('libro', {
        id: Field.ID(),
        titulo: Field.STRING(10),
        precio: Field.FLOAT()
      })
      const THIS = FieldContainer.THIS
      const OBJ = {
        titulo: THIS({ allowNull: false }),
        precio: THIS({ allowNull: true })
      }
      const BODY = fieldContainer.group('libro', OBJ)
      expect(Object.keys(BODY).length).to.equal(2)
      expect(BODY).to.have.property('titulo')
      expect(BODY).to.have.property('precio')
      expect(BODY.titulo).to.be.an('object')
      expect(BODY.precio).to.be.an('object')
      expect(Field.isField(OBJ.titulo)).to.equal(false)
      expect(Field.isField(OBJ.precio)).to.equal(false)
      expect(Field.isField(BODY.titulo)).to.equal(true)
      expect(Field.isField(BODY.precio)).to.equal(true)
      expect(FieldContainer.isTHIS(OBJ.titulo)).to.equal(true)
      expect(FieldContainer.isTHIS(BODY.titulo)).to.equal(true)
      expect(fieldContainer.models.libro('titulo')).to.not.have.property('allowNull')
      expect(fieldContainer.models.libro('precio')).to.not.have.property('allowNull')
      expect(BODY.titulo).to.have.property('allowNull', false)
      expect(BODY.precio).to.have.property('allowNull', true)
    })
  })
})
