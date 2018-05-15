# Field Creator

Sequelize es una excelente herramienta para realizar consultas con la base de datos. Cuando se define un modelo, se especifica el tipo de dato, el tipo de validador, si acepta valores nulos o no. Propiedades que pueden ser requeridas en otros lugares, por ejemplo para crear el APIDOC, para validar los datos, etc.

Aprovechando la implementación de estos modelos, Field Creator permite reutilizar estas propiedades para crear objetos de tipo FieldGroup que pueden ser utilizados en todas estas situaciones.

Ademas se cuenta con una serie de campos predefinidos que facilitan la creación de modelos.

## Características

- Es posible crear atributos predefinidos que con la propiedad `validate` incluida por defecto.
- Es posible crear objetos de tipo `FieldGroup`.

## Tipos de datos predefinidos

| Tipo       | Descripción                                  |
|------------|----------------------------------------------|
| `ID`       | Clave primaria.                              |
| `STRING`   | Cadena de texto.                             |
| `TEXT`     | Bloque de texto.                             |
| `INTEGER`  | Número entero.                               |
| `FLOAT`    | Número en coma flotante.                     |
| `BOOLEAN`  | Valor booleano.                              |
| `DATE`     | Fecha (día y hora).                          |
| `DATEONLY` | Solamente fecha.                             |
| `TIME`     | Solamente hora.                              |
| `JSON`     | Objeto de tipo JSON.                         |
| `JSONB`    | Objeto de tipo JSONB.                        |
| `UUID`     | Código de tipo UUID.                         |
| `ENUM`     | Tipo enumerado.                              |
| `ARRAY`    | Lista de valores.                            |

## Propiedades de un atributo

| Propiedad       | Descripción                                |
| ----------------|--------------------------------------------|
| `primaryKey`    | Indica si es una clave primaria.           |
| `autoIncrement` | Indica si es autoincrementable.            |
| `unique`        | Indica si el registro debe ser único.      |
| `defaultValue`  | Valor por defecto.                         |
| `example`       | Valor de ejemplo.                          |
| `allowNull`     | Indica si acepta valores nulos.            |
| `comment`       | Descripción del atributo.                  |
| `uniqueMsg`     | Mensaje de error para validar `unique`.    |
| `allowNullMsg`  | Mensaje de error para validar `allowNull`. |
| `validate`      | Objeto para validar el tipo de dato.       |

A continuación se muestra un ejemplo para crear un campo de tipo ID:

```js
const ID = Field.INTEGER({
  primaryKey    : true,
  autoIncrement : true,
  unique        : true,
  defaultValue  : null,
  example       : 1
  allowNull     : false,
  comment       : 'Identificador único.',
  uniqueMsg     : 'El campo ID debe ser único.',
  allowNullMsg  : 'El campo ID es requerido.',
  validate      : { min: { args: [1], msg: 'Debe ser mayor o igual a 1.' } },
})
```

## Función `CLONE`

Crea una copia a partir de otro atributo, modificando algunas de sus propiedades si fuera necesario.

```js
const ID = Field.ID()

const INPUT = {
  id: Field.CLONE(ID, { allowNull: false })
}
```

## Función `group`

Crea un objeto de tipo **FieldGroup**. Un fieldGroupd es un objeto formado por atributos de un modelo Sequelize.

Por ejemplo, si se tienen los modelos `autor` y `libro`, relacionados de `1:N`.

```js
const AUTOR = sequelize.define('autor', {
  id_autor : Field.ID(),
  nombre   : Field.STRING()
})
const LIBRO = sequelize.define('libro', {
  id_libro : Field.ID(),
  titulo   : Field.STRING(10),
  precio   : Field.FLOAT()
})
LIBRO.belongsTo(AUTOR, { as: 'autor' })
AUTOR.hasMany(LIBRO, { as: 'libros' })
```

Se pueden crear los siguientes **FieldGroups**.

```js
const AUTOR_OUTPUT = Field.group(AUTOR, {
  id_autor : THIS(),
  nombre   : THIS(),
  libros   : [{ // Lista de libros
    id_libro : THIS(),
    titulo   : THIS(),
    precio   : THIS()
  }]
})

const LIBRO_OUTPUT = Field.group(LIBRO, {
  id_libro : THIS(),
  titulo   : THIS(),
  precio   : THIS(),
  autor    : { // Un autor
    id_autor : THIS(),
    titulo   : THIS(),
    precio   : THIS()
  }
})
```

La función `THIS`, indica que el campo, es parte del modelo especificado en el `group`.

## Instalación

Para instalar sobre un proyecto, ejecutar el siguiente comando:

$ `npm install --save field-creator`

## Ejemplo 1. Creando un modelo

Definiendo modelos de esta forma:

``` js
const LIBRO = sequelize.define('libro', {
  id_libro : Field.ID(),
  titulo   : Field.STRING(10),
  precio   : Field.FLOAT()
})
```

Es lo mismo que hacer:

``` js
const LIBRO = sequelize.define('libro', {
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
```

## Ejemplo 2. Definiendo FieldGroups anidados

``` js
const { Field, THIS } = require('field-creator')

const fieldGroup = Field.group(LIBRO, {
  id_libro : THIS(),
  titulo   : THIS({ allowNull: false }),
  precio   : THIS({ allowNull: false }),
  autor    : Field.group(AUTOR, {
    id_autor : THIS(),
    nombre   : THIS()
  }),
  other: Field.STRING({ comment: 'other field.' })
})
```
