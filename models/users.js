const { Sequelize, Model} = require("sequelize");
const db = require('./index');
const sequelize = db.sequelize;

class User extends Model {}
User.init(
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    names: {
      type: Sequelize.STRING(250),
      allowNull: false,
      validate: {
        max: 250,
        min: 3,
        is:{
            args: /^[A-Za-z0-9_\s]+$/g,
            msg: 'Solo puede ingresar letras, numeros y espacio'
        }
      }
    },
    lastnames: {
      type: Sequelize.STRING(250),
      allowNull: false,
      validate:{
        is:{
            args: /^[A-Za-z0-9_\s]+$/g,
            msg: 'Solo puede ingresar letras, numeros y espacio'
        }
      }
    },
    username:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'El nombre de usuario ya existe'
        },
        validate: {
            isAlphanumeric:{
                args: true,
                msg:'El user name debe ser alphanumerico'
            }
        }
    },
    password: {
      type: Sequelize.STRING(250),
      allowNull: false,
    },
    secret: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    coin_favorite: {
      type: Sequelize.ENUM("cop", "eur", "usd"),
      validate: {
        isIn: {
          args: [["cop", "eur", "usd"]],
          msg: "Solo se permite pesos colombianos, euros y dolares"
        }
      }
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  {
    sequelize,
    modelName: 'user'
  }
);

module.exports = User;


