module.exports = (Field) => {
  // |=============================================================|
  // |-------------- CAMPOS DE TIPO CLAVE PRIMARIA ----------------|
  // |=============================================================|

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

  // |=============================================================|
  // |-------------- CAMPOS DE AUDITORIA --------------------------|
  // |=============================================================|

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
  Field.add('_STATUS', Field.ENUM(['ACTIVO', 'INACTIVO', 'ELIMINADO'], {
    comment      : 'Estado en el que se encuentra el registro.',
    defaultValue : 'ACTIVO'
  }))

  // |=============================================================|
  // |-------------- CAMPOS DE FILTROS Y CONSULTAS ----------------|
  // |=============================================================|

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

  // |=============================================================|
  // |-------------- CAMPOS DE AUTENTICACIÓN ----------------------|
  // |=============================================================|

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

  // |=============================================================|
  // |-------------- OTROS CAMPOS ---------------------------------|
  // |=============================================================|

  Field.add('EMAIL', Field.STRING({
    comment  : 'Dirección de correo electrónico',
    example  : 'alguien@example.com',
    validate : { isEmail: true }
  }))

  return Field
}
