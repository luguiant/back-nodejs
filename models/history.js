const { Sequelize, Model,Deferrable } = require("sequelize");
const db = require("./index");
const usercoins = require("./usercoins");
const sequelize = db.sequelize;

class History extends Model {}
History.init(
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    coin_id: {
      type: Sequelize.INTEGER,
      references: {
        model: usercoins,
        key: "id",
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    },
    price_now: {
        type: Sequelize.STRING(45),
        allowNull: false,
    },
    price_last: {
        type: Sequelize.STRING(45),
        allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  {
    sequelize,
    modelName: "history"
  }
);

module.exports = History;