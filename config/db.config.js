module.exports = {
  development: {
    host: "localhost",
    username: "root",
    port: 3306,
    password: "123456",
    database: "testdb",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      underscored: false,
      freezeTableName: false,
      charset: "utf8",
      dialectOptions: {
        collate: "utf8_general_ci",
        useUTC: false,
        dateStrings: true,
        typeCast: true
      },
      timestamps: true
    }
  },
  production: {
    host: "localhost",
    username: "root",
    port: 3306,
    password: "123456",
    database: "testdb",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      underscored: false,
      freezeTableName: false,
      charset: "utf8",
      dialectOptions: {
        collate: "utf8_general_ci",
        useUTC: false,
        dateStrings: true,
        typeCast: true
      },
      timestamps: true
    }
  },
  test: {
    host: "localhost",
    username: "root",
    port: 3306,
    password: "123456",
    database: "testdb",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      underscored: false,
      freezeTableName: false,
      charset: "utf8",
      dialectOptions: {
        collate: "utf8_general_ci",
        useUTC: false,
        dateStrings: true,
        typeCast: true
      },
      timestamps: true
    }
  }
};
