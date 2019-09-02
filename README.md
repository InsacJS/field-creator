# Field Creator

Sequelize es una excelente herramienta para realizar consultas con la base de datos. Cuando se define un modelo, se especifica el tipo de dato, el tipo de validador, si acepta valores nulos o no. Propiedades que pueden ser requeridas en otros lugares, por ejemplo para crear el APIDOC, para validar los datos, etc.

Aprovechando la implementación de estos modelos, Field Creator permite reutilizar estas propiedades para crear objetos de tipo FieldGroup que pueden ser utilizados en todas estas situaciones.

Además se cuenta con una serie de campos predefinidos que facilitan la creación de modelos.

## Características

- Es posible crear atributos predefinidos que con la propiedad `validate` incluida por defecto.
- Es posible crear objetos de tipo `FieldGroup`. Un fieldGroup es un objeto formado por los campos de los modelos.
- Incluye varios tipos de datos personalizados.
- Los tipos de datos personalizados pueden ser sobreescritos con el método `add` junto con la opción `{ force: true }`.

## Tipos de datos básicos

| Tipo       | Descripción                  | Validadores por defecto                    |
|------------|------------------------------|--------------------------------------------|
| `STRING`   | Cadena de texto.             | len: `[0, LENGHT]`                         |
| `TEXT`     | Bloque de texto.             | len: `[0, 2147483647]`                     |
| `INTEGER`  | Número entero.               | isInt: `true`, min: `0`, max: `2147483647` |
| `FLOAT`    | Número en coma flotante.     | isFloat: `true`, min: `0`, max: `1E+308`   |
| `BOOLEAN`  | Valor booleano.              | isBoolean: `true`                          |
| `DATE`     | Fecha (día y hora).          | isDate: `true`                             |
| `DATEONLY` | Solamente fecha.             | isDate: `true`                             |
| `TIME`     | Solamente hora.              | isTime: `custom`                           |
| `JSON`     | Objeto de tipo JSON.         | isJson: `custom`                           |
| `JSONB`    | Objeto de tipo JSONB.        | isJson: `custom`                           |
| `UUID`     | Código de tipo UUID.         | isUUID: `4`                                |
| `ENUM`     | Tipo enumerado.              | isIn: `[VALUES]`                           |
| `ARRAY`    | Lista de valores.            | isArray: `custom`                          |

## Tipos de datos personalizados

Algunos tipos de datos se usan con mayor frecuencia, es por eso que se definieron en base a los tipos de datos básicos.

### - Clave primaria

```js
Field.add('ID', Field.INTEGER({
  primaryKey    : true,
  autoIncrement : true,
  allowNull     : false,
  validate      : { min: 1 }
}))
Field.add('PK_INTEGER', Field.INTEGER({
  primaryKey : true,
  allowNull  : false,
  validate   : { min: 1 }
}))
Field.add('PK_UUID', Field.UUID({
  primaryKey : true,
  allowNull  : false
}))
```

### - Auditoria

```js
Field.add('_STATUS', Field.ENUM(['ACTIVO', 'INACTIVO', 'ELIMINADO'], {
  comment      : 'Estado en el que se encuentra el registro.',
  defaultValue : 'ACTIVO'
}))
Field.add('_CREATED_AT', Field.DATE({
  comment: 'Fecha de creación del registro.'
}))
Field.add('_UPDATED_AT', Field.DATE({
  comment: 'Fecha de modificación del registro.'
}))
Field.add('_DELETED_AT', Field.DATE({
  comment: 'Fecha de eliminación del registro.'
}))
Field.add('_CREATED_USER', Field.INTEGER({
  comment: 'ID del usuario que crea el registro.'
}))
Field.add('_UPDATED_USER', Field.INTEGER({
  comment: 'ID del usuario que modifica el registro.'
}))
Field.add('_DELETED_USER', Field.INTEGER({
  comment: 'ID del usuario que elimina el registro.'
}))

```

### - Filtros y consultas

```js
Field.add('FIELDS', Field.STRING({
  comment : 'Campos a devolver en el resultado.',
  example : 'id_usuario,username,persona(id_persona,nombres)'
}))
Field.add('ORDER', Field.STRING({
  comment : 'Orden en el que se devolverá el resultado.',
  example : 'apellido,-nombres'
}))
Field.add('LIMIT', Field.INTEGER({
  comment      : 'Límite de registros por página.',
  defaultValue : 50,
  validate     : { min: 1 }
}))
Field.add('PAGE', Field.INTEGER({
  comment      : 'Número de página de una lista de registros.',
  defaultValue : 1,
  validate     : { min: 1 }
}))

```

### - Autenticación

```js
Field.add('BASIC_AUTHORIZATION', Field.TEXT({
  comment : 'Credenciales de acceso. <code>Basic [username:password] base64</code>',
  example : 'Basic FDS234SF=='
}))
Field.add('BEARER_AUTHORIZATION', Field.TEXT({
  comment : 'Credenciales del acceso. <code>Bearer [accessToken]</code>',
  example : 'Bearer s83hs7.sdf423.f23f'
}))
Field.add('ACCESS_TOKEN', Field.TEXT({
  comment : 'Token de acceso.',
  example : 's83hs7.sdf423.f23f'
}))
Field.add('REFRESH_TOKEN', Field.TEXT({
  comment : 'Token de refresco.',
  example : 's83hs7.sdf423.f23f'
}))
Field.add('TOKEN_EXPIRATION_DATE', Field.DATE({
  comment: 'Fecha de expiración del token.'
}))
Field.add('TOKEN_EXPIRE_IN', Field.DATE({
  comment : 'Tiempo de expiración del token en segundos.',
  example : '86400'
}))
Field.add('TOKEN_TYPE', Field.DATE({
  comment : 'Tipo de token.',
  example : 'Bearer'
}))
Field.add('ACCESS_TYPE', Field.ENUM(['offline', 'online'], {
  comment      : 'Parámetro que indica el tipo de acceso. <code>offline</code> incluirá en la respuesta un token de refresco.',
  defaultValue : 'online'
}))
Field.add('USERNAME', Field.STRING(100, {
  comment  : 'Nombre de usuario.',
  example  : 'admin',
  validate : { len: { args: [3, 100], msg: 'El nombre de usuario debe tener entre 3 y 100 caracteres.' } }
}))
Field.add('PASSWORD', Field.STRING(50, {
  comment  : 'Contraseña de usuario.',
  example  : '123',
  validate : { len: { args: [3, 50], msg: 'La contraseña debe tener entre 3 y 50 caracteres.' } }
}))

```

### - Otros tipos de datos

```js
Field.add('EMAIL', Field.STRING({
  comment  : 'Dirección de correo electrónico',
  example  : 'alguien@example.com',
  validate : { isEmail: true }
}))
```

## Propiedades de un atributo

| Propiedad         | Descripción                                                         |
| ------------------|---------------------------------------------------------------------|
| `primaryKey`      | Indica si es una clave primaria.                                    |
| `autoIncrement`   | Indica si es autoincrementable.                                     |
| `unique`          | Indica si el registro debe ser único.                               |
| `defaultValue`    | Valor por defecto.                                                  |
| `example`         | Valor de ejemplo.                                                   |
| `allowNull`       | Indica si el campo acepta valores nulos.                            |
| `allowNullObj`    | Indica si el objeto al que pertenece el campo acepta valores nulos. |
| `comment`         | Descripción del atributo.                                           |
| `uniqueMsg`       | Mensaje de error para validar `unique`.                             |
| `allowNullMsg`    | Mensaje de error para validar `allowNull`.                          |
| `allowNullObjMsg` | Mensaje de error para validar `allowNullObj`.                       |
| `validate`        | Objeto para validar el tipo de dato.                                |

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
  validate      : { min: { args: 1, msg: 'Debe ser mayor o igual a 1.' } },
})
```

## Propiedad validate

Un validador puede tener uno de los siguientes formatos:

```js
const validate = { min: 10 }
const validate = { min: { args: 10 } }
const validate = { min: { args: 10, msg: 'Mensaje de error personalizado.' } }

const validate = { len: [2, 5] }
const validate = { len: { args: [2, 5] } }
const validate = { len: { args: [2, 5], msg: 'Mensaje de error personalizado.' } }

const validate = { isIn: [['A', 'B']] }
const validate = { isIn: { args: [['A', 'B']] } }
const validate = { isIn: { args: [['A', 'B']], msg: 'Mensaje de error personalizado.' } }
```

Cuando se trata de validadores booleanos, son válidos los siguientes formatos:

```js
const validate = { isEmail: true }
const validate = { isEmail: { msg: 'Mensaje de error personalizado.' } }
```

Para validadores personalizados:

```js
const validate = {
  esNumeroPar: (value) => {
    if (parseInt(value) % 2 !== 0) {
      throw new Error(`Debe ser un número par.`)
    }
  }
}
```

## Lista de validadores

A continuación se muestra una lista de opciones de la propiedad `validate`. Puede encontrar más información en: [http://docs.sequelizejs.com/manual/tutorial/models-definition.html#validations](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#validations)

```js
const validate = {
  is             : ['^[a-z]+$', 'i'],
  is             : /^[a-z]+$/i,
  not            : ['[a-z]', 'i'],
  isEmail        : true,
  isUrl          : true,
  isIP           : true,
  isIPv4         : true,
  isIPv6         : true,
  isAlpha        : true,
  isAlphanumeric : true,
  isNumeric      : true,
  isInt          : true,
  isFloat        : true,
  isDecimal      : true,
  isLowercase    : true,
  isUppercase    : true,
  notEmpty       : true,
  equals         : 'ABC123',
  contains       : 'def',
  notContains    : 'def',
  notIn          : [['A', 'B']],
  isIn           : [['A', 'B']],
  len            : [2, 5],
  isUUID         : 4,
  isDate         : true,
  isAfter        : '2010-05-30',
  isBefore       : '2020-05-30',
  min            : 10,
  max            : 12,
  isCreditCard   : true,
}
```

## Función `clone`

Crea una copia a partir de otro atributo, modificando algunas de sus propiedades si fuera necesario.

```js
const ID = Field.ID()

const INPUT = {
  id: Field.clone(ID, { allowNull: false })
}
```

## Función `add`

Adiciona un tipo de dato personalizado que luego puede ser utilizado como un tipo de dato básico.

```js
// Es posible adicionar nuevos tipos de datos.
Field.add('TITULO', Field.INTEGER({
  comment: 'Título del libro'
}))

// Es posible actualizar los valores de un tipo de dato personalizado.
Field.add('ID', Field.INTEGER({
  comment       : 'Identificador único',
  autoIncrement : false
}), { force: true })

const LIBRO = sequelize.define('libro', {
  id     : Field.ID(),
  titulo : Field.TITULO(),
  precio : Field.FLOAT()
})
```

## Función `use`

Adiciona o modifica un tipo de dato. Similar a la función `add` pero con la opción `force` por defecto en `true`.

```js
// Modifica el tipo de dato ID predefinido.
Field.use('ID', Field.INTEGER({
  comment       : 'Identificador único del autor',
  autoIncrement : false
}))

const AUTOR = sequelize.define('autor', {
  id     : Field.ID(),
  nombre : Field.STRING()
})

Field.use('ID', Field.INTEGER({
  comment       : 'Identificador único del libro',
  autoIncrement : false
}))

const LIBRO = sequelize.define('libro', {
  id     : Field.ID(),
  precio : Field.FLOAT()
})
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

Definición de un modelo `libro` de la forma tradicional:

``` js
const LIBRO = sequelize.define('libro', {
  id: {
    type          : Sequelize.INTEGER(),
    primaryKey    : true,
    autoIncrement : true,
    allowNull     : false,
    validate      : {
      isInt : true,
      min   : 1,
      max   : 2147483647
    }
  },
  titulo: {
    type: Sequelize.STRING(10),
    validate: {
      len: [0, 10]
    }
  },
  precio: {
    type: Sequelize.FLOAT(),
    validate: {
      isFloat : true,
      min     : 0,
      max     : 1E+308
    }
  }
})
```

Definición del mismo modelo `libro` utilizando la librería:

``` js
const LIBRO = sequelize.define('libro', {
  id_libro : Field.ID(),
  titulo   : Field.STRING(10),
  precio   : Field.FLOAT()
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
