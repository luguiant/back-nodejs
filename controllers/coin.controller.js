const { validationResult } = require("express-validator");
const request = require("request-promise-native");
const { QueryTypes } = require("sequelize");

const db = require("../models/index");
const User = require("../models/users");
const Coin = require("../models/usercoins");
const History = require("../models/history");

const apiConfig = require("../config/braveApi.config");
const config = require("../config/global.config");
const sequelize = db.sequelize;
const dataInToken = require("../utils/data-in-token-async.helper");
const errorHelper = require("../utils/error-async.helper");

// Consulta la data de la cripto moneda y valdia su existencia
const getDigitalCoin = async (coin_favorite, coin, res, next) => {
  const options = {
    method: "GET",
    url: `https://${apiConfig.apiUrl}/ticker`,
    qs: { show: coin_favorite, coin },
    headers: {
      "x-rapidapi-host": apiConfig.apiUrl,
      "x-rapidapi-key": apiConfig.apiKey
    }
  };
  let result;
  try {
    result = await request(options).then(result => JSON.parse(result));
  } catch (err) {
    await errorHelper(res, next, "Error", 500, "Coin service failed.");
  }

  if (!result || (result && !result.success)) {
    await errorHelper(res, next, "Error", 422, "Cripto moneda no encontrada.");
  }

  return result;
};

// Consulta la existencia del usuario
const userSearh = async (userId, res, next) => {
  const dataUser = await User.getUser(userId);

  if (!dataUser) {
    await errorHelper(res, next, "Error", 422, "User not found.");
  }
  return dataUser;
};

// Valida que no este registrada ya la criptomoneda al usuario
const validateExistCoin = async (user_id, code_coin, res, next) => {
  const coinExist = await Coin.findOne({ where: { user_id, code_coin } });

  if (coinExist) {
    await errorHelper(
      res,
      next,
      "Error",
      422,
      "La cripto moneda ya fue registrada."
    );
  }
};

// registra la moneda
const registerCoin = async (result, user_id, code_coin, res, next) => {
  let register;
  try {
    register = await sequelize.transaction(async t => {
      return await Coin.create({
        user_id,
        code_coin,
        counter: 0,
        price_coin: result.last_price,
        name_coin: result.coin_name,
        source: result.source
      });
    });
  } catch (err) {
    await errorHelper(
      res,
      next,
      "Error",
      422,
      "Error al registrar la cripto moneda."
    );
  }

  return register;
};

exports.saveCoin = async (req, res, next) => {
  const errors = validationResult(req);
  const authHeader = req.get("Authorization");

  if (!errors.isEmpty()) {
    await errorHelper(res, next, "Validation error", 422, errors.array());
  }

  const coin = req.body.coin;

  let decodedToken = await dataInToken(authHeader, config.keyToken, res, next);

  const dataUser = await userSearh(decodedToken.userId, res, next);

  const result = await getDigitalCoin(dataUser.coin_favorite, coin, res, next);

  // alternativa findorcreate
  const existCoin = await validateExistCoin(dataUser.id, coin, res, next);

  const registerCointData = await registerCoin(
    result,
    dataUser.id,
    coin,
    res,
    next
  );

  res.status(201).json({
    message: "Coin resgitered!",
    data: {
      secret: registerCointData.secret,
      code_coin: registerCointData.code_coin,
      price_coin: registerCointData.price_coin,
      name_coin: registerCointData.name_coin,
      source: registerCointData.source
    }
  });
};

exports.listMyCoin = async (req, res, next) => {
  const errors = validationResult(req);
  const authHeader = req.get("Authorization");

  if (!errors.isEmpty()) {
    await errorHelper(res, next, "Validation error", 422, errors.array());
  }

  let decodedToken = await dataInToken(authHeader, config.keyToken, res, next);

  const dataUser = await userSearh(decodedToken.userId, res, next);
  const user_id = dataUser.id;
  let listCoin;
  try {
    listCoin = await Coin.findAll({
      attributes: ["price_coin", "name_coin","code_coin", "source", "secret"],
      where: { user_id }
    });
  } catch (err) {
    await errorHelper(res, next, "Error", 500, "Error al listar las monedas");
  }

  res.status(201).json({ message: "Coin resgitered!", data: listCoin });
};

exports.convert = async (req, res, next) => {
  const errors = validationResult(req);
  const authHeader = req.get("Authorization");

  if (!errors.isEmpty()) {
    await errorHelper(res, next, "Validation error", 422, errors.array());
  }
  const decodedToken = await dataInToken(
    authHeader,
    config.keyToken,
    res,
    next
  );
  const dataUser = await userSearh(decodedToken.userId, res, next);
  const user_id = dataUser.id;
  const qty = req.body.qty;
  const code_coin = req.body.from;

  const result = await getDigitalCoin(
    dataUser.coin_favorite,
    code_coin,
    res,
    next
  );

  let listCoin;
  try {
    listCoin = await Coin.findAll({
      attributes: ["price_coin", "name_coin", "source", "secret"],
      where: { user_id, code_coin }
    });
  } catch (err) {
    await errorHelper(res, next, "Error", 500, "Error al listar las monedas");
  }

  if (listCoin.length <= 0) {
    await errorHelper(
      res,
      next,
      "Error",
      422,
      "La moneda aun no fue registrada"
    );
  }

  const options = {
    method: "GET",
    url: `https://${apiConfig.apiUrl}/convert`,
    qs: {
      qty,
      from: code_coin,
      to: dataUser.coin_favorite
    },
    headers: {
      "x-rapidapi-host": apiConfig.apiUrl,
      "x-rapidapi-key": apiConfig.apiKey
    }
  };
  let conver;
  try {
    convert = await request(options).then(result => JSON.parse(result));
  } catch (err) {
    await errorHelper(res, next, "Error", 500, "Coin service failed.");
  }

  if (!convert || (convert && !convert.success)) {
    await errorHelper(
      res,
      next,
      "Error",
      422,
      "Error al realizar la convercion."
    );
  }

  let coinData;
  try {
    coinData = await Coin.findOne({ where: { secret: listCoin[0].secret } });
  } catch (err) {
    await errorHelper(res, next, "Error", 422, "Moneda no encontrada.");
  }

  const price_now = (convert.to_quantity / convert.from_quantity).toString();
  let register;
  try {
    register = await sequelize.transaction(async t => {
      const price_coin = price_now;
      await Coin.update(
        { price_coin, counter: coinData.counter + 1 },
        {
          where: {
            id: coinData.id
          }
        },
        { transaction: t }
      );

      const historyCreate = await History.create(
        {
          coin_id: coinData.id,
          price_now,
          price_last: coinData.price_coin
        },
        { transaction: t }
      );

      return historyCreate;
    });
  } catch (err) {
    await errorHelper(res, next, "Error", 422, "Error al crear historico.");
  }

  res.status(201).json({
    message: "Convert",
    data: {
      qty,
      from: code_coin,
      to_quantity: convert.to_quantity,
      coin_name: coinData.coin_name,
      favorite: dataUser.coin_favorite
    }
  });
};

exports.listfavorite = async (req, res, next) => {
  const errors = validationResult(req);
  const authHeader = req.get("Authorization");

  if (!errors.isEmpty()) {
    await errorHelper(res, next, "Validation error", 422, errors.array());
  }
  const order = req.body.order;
  const decodedToken = await dataInToken(
    authHeader,
    config.keyToken,
    res,
    next
  );
  const dataUser = await userSearh(decodedToken.userId, res, next);
  const user_id = dataUser.id;

  const result = await Coin.getFavorite(user_id, order, res, next);

  res.status(201).json({ message: "Favorite", data: result });
};
