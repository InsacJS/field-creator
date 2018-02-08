const { Field } = require(global.LIB)

module.exports = (sequelize, Sequelize) => {
  return sequelize.define('libro', {
    id: Field.ID(),
    titulo: Field.STRING(10),
    precio: Field.FLOAT()
  })
}
