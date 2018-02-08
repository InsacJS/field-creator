
# Ejemplo 1.

## Definición de modelos

Podemos crear modelos Sequelize de la siguiente manera:

Archivo `libro.model.js`
``` js
const { Field } = require('insac-field')

module.exports = (sequelize, Sequelize) => {
  return sequelize.define('libro', {
    id: Field.ID(),
    titulo: Field.STRING(10),
    precio: Field.FLOAT()
  })
}
```

Es lo mismo que hacer:
``` js
module.exports = (sequelize, Sequelize) => {
  return sequelize.define('libro', {
    id: {
      type: Sequelize.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      validate: {
        isInt: { args: [true] },
        min: { args: [1] },
        max: { args: [2147483647] }
      }
    },
    titulo: {
      type: Sequelize.STRING(10),
      validate: {
        len: { args: [0, 10] }
      }
    },
    precio: {
      type: Sequelize.INTEGER(),
      validate: {
        isFloat: { args: [true] },
        min: { args: [0] },
        max: { args: [1E+308] }
      }
    }
  })
}
```
# Ejemplo 2.

## Contenedor de attributos

Podemos crear un objeto que almacene todos los atributos.
``` js
const { Field, FieldContainer } = require('insac-field')

const container = new FieldContainer()
container.define('libro', {
  id: Field.ID(),
  titulo: Field.STRING(10),
  precio: Field.FLOAT()
})
```

Podemos construir objetos en base a los atributos almacenados.
``` js
const OUTPUT = {
  id: container.libro('id'),
  titulo: container.libro('titulo'),
  precio: container.libro('precio')
}
```

Podemos construir objetos modificando algunas propiedades del atributo original.
``` js
const INPUT = {
  titulo: container.libro('titulo', { allowNull: false }),
  precio: container.libro('precio', { allowNull: false })
}
```
