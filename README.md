# Insac Field

Simplifica la definición de atributos para crear un modelo Sequelize.

# Características

- Define atributos con la propiedad validate incluida.
- Crea objetos utilizando atributos predefinidos.

## Atributos soportados:

Tipos básicos:

| Tipo       | Descripción                                                             |
|------------|-------------------------------------------------------------------------|
| `STRING`   | Atributo para representar cadenas de texto.                             |
| `INTEGER`  | Atributo para representar números enteros.                              |
| `FLOAT`    | Atributo para representar números coma flotante.                        |
| `ENUM`     | Atributo para representar valores.                                      |

Tipos personalizados:

| Tipo       | Descripción                                                             |
|------------|-------------------------------------------------------------------------|
| `ID`       | Atributo para representar una clave primaria.                           |

Funciones adicionales:

| Tipo       | Descripción                                                             |
|------------|-------------------------------------------------------------------------|
| `CLONE`    | Crea una copia a partir de otro atributo.                               |

# Instalación

Para instalar sobre un proyecto, ejecutar el siguiente comando:

$ `sudo npm install --save insac-field`

# Ejemplos
## Ejemplo 1. Definición de modelos

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

## Ejemplo 2. Contenedor de atributos

Podemos crear un objeto que almacene los atributos de todos los modelos.
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

Podemos construir objetos a partir de un modelo.
``` js
const OUTPUT = container.group('libro', {
  id: container.THIS()
  titulo: container.THIS(),
  precio: container.THIS()
})
```
