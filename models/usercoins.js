const { Sequelize, Model, Deferrable, QueryTypes } = require("sequelize");
const db = require("./index");
const user = require("./users");
const sequelize = db.sequelize;

class UserCoin extends Model {}
UserCoin.init(
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.BIGINT,
      references: {
        model: user,
        key: "id",
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    },
    code_coin: {
        type: Sequelize.STRING(45),
        allowNull: false,
    },
    source: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    secret: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    price_coin: {
        type: Sequelize.STRING(45),
        allowNull: false,
    },
    counter: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    name_coin: {
        type: Sequelize.STRING(45),
        allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  {
    sequelize,
    modelName: "usercoins"
  }
);

module.exports = UserCoin;

module.exports.getFavorite = async (user_id, order, res, next) => {
  let result;
  try {
    result = await UserCoin.sequelize.query(
      "SELECT t1.counter, t1.price_coin, t1.name_coin, t1.source, t1.secret FROM usercoins as t1 inner join (SELECT id FROM usercoins as t2 order by t2.counter desc limit 3) as t2 ON t1.id = t2.id and t1.user_id = :user_id order by t1.counter "+order,
      {
        replacements:{user_id},
        type: QueryTypes.SELECT
      }
    );
  } catch (err) {
    console.log(err);
    await errorHelper(
      res,
      next,
      "Error",
      422,
      "Error al listar las monedas favoritas."
    );
  }

  return result;
}