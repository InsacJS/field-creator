module.exports = {
  username : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME,
  params   : {
    dialect : 'postgres',
    lang    : 'es',
    logging : false,
    define  : {
      underscored     : true,
      freezeTableName : true,
      timestamps      : false
    }
  }
}
