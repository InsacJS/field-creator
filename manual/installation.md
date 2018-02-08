# Instalación

Para instalar sobre un proyecto, ejecutar el siguiente comando:

$ `sudo npm install --save insac-field`

# Modo de uso

``` js
const { Field } = require('insac-field')

const id = Field.ID()
const nombre = Field.STRING(100, { comment: 'Nombre' })
```
