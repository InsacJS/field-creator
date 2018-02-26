# Field creator

Simplifica la definición de atributos para crear un modelo Sequelize.

# Características

- Define atributos con la propiedad validate incluida.
- Crea objetos de attributos.

## Atributos soportados:

Tipos básicos:

| Tipo       | Descripción                                                             |
|------------|-------------------------------------------------------------------------|
| `STRING`   | Atributo para representar cadenas de texto.                             |
| `INTEGER`  | Atributo para representar números enteros.                              |
| `FLOAT`    | Atributo para representar números en coma flotante.                     |
| `BOOLEAN`  | Atributo para representar valores booleanos.                            |
| `DATE`     | Atributo para representar fechas (día y hora).                          |
| `ENUM`     | Atributo para representar datos enumerados.                             |
| `ARRAY`    | Atributo para representar una lista de valores.                         |

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

$ `npm install --save field-creator`

# Ejemplos

## Ejemplo 1. Definición de modelos

Podemos crear modelos Sequelize de la siguiente manera:

Archivo `libro.model.js`
``` js
const { Field } = require('field-creator')

module.exports = (sequelize, Sequelize) => {
  return sequelize.define('libro', {
    id     : Field.ID(),
    titulo : Field.STRING(10),
    precio : Field.FLOAT()
  })
}
```

Es lo mismo que hacer:
``` js
module.exports = (sequelize, Sequelize) => {
  return sequelize.define('libro', {
    id: {
      type          : Sequelize.INTEGER(),
      primaryKey    : true,
      autoIncrement : true,
      allowNull     : false,
      validate      : {
        isInt : { args: [true] },
        min   : { args: [1] },
        max   : { args: [2147483647] }
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
        isFloat : { args: [true] },
        min     : { args: [0] },
        max     : { args: [1E+308] }
      }
    }
  })
}
```

## Ejemplo 2. Definiendo grupos de fields

``` js
const { Field, THIS } = require('field-creator')
const fieldGroup = Field.group(sequelize.models.libro, {
  id_libro : THIS(),
  titulo   : THIS({ allowNull: false }),
  precio   : THIS({ allowNull: false }),
  autor    : {
    id_autor : THIS(),
    nombre   : THIS()
  },
  custom: Field.STRING({ comment: 'custom' })
})
```

La función `THIS`, indica que el campo es parte del modelo definido en el `group`.
