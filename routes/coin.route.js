const express = require("express");
const isAuth = require("../middleware/is-auth.middleware");
const coin = require("../controllers/coin.controller");
const { body } = require("express-validator");
const router = express.Router();

router.post(
    '/add_coin',
    isAuth,
    [
    body("coin")
        .exists()
        .withMessage("La criptomoneda es requerida.")
        .matches(/^[A-Za-z0-9_]+$/, "i")
        .withMessage("La criptomoneda debe ser solo alfanumerica")
        .isLength({ min: 3, max: 10 })
        .withMessage("La criptomoneda debe ser entre 3-10 caracteres")
        .trim()
        .escape()
    ],
    coin.saveCoin
);

router.post(
    '/convert',
    isAuth,
    [
        body("from")
            .exists()
            .withMessage("La criptomoneda es requerida.")
            .isLength({ min: 3, max: 10 })
            .withMessage("La criptomoneda debe ser entre 3-10 caracteres")
            .matches(/^[A-Za-z0-9]+$/, "i")
            .withMessage("La criptomoneda debe ser solo alfanumerica")
            .trim()
            .escape(),
        body('qty')
            .exists()
            .withMessage("La cantidad es requerida")
            .matches(/^[0-9]+$/, "i")
            .withMessage("La cantidad es numerica")
            .custom((value, { req, loc, path }) => {
                if (value > 0) {
                    return true;
                  } else {
                    return false;
                }
              })
            .withMessage("La cantidad debe ser mayor que 0")
            .trim()
            .escape()
    ],
    coin.convert
);

router.get('/list_my_coin', isAuth, coin.listMyCoin);
router.post('/my_favorite_coins', isAuth,[
    body("order")
    .exists()
    .withMessage("El orden es requerido.")
    .matches(/^[A-Za-z]+$/, "i")
    .withMessage("El orden debe ser alfabetico")
    .custom((value, { req, loc, path }) => {

      const valueString = value.toLowerCase();
      switch (valueString) {
        case "asc":
        case "desc":
          return true;
        default:
          return false;
      }
    })
    .withMessage("El orden ingresado es invalido.")
    .trim()
    .escape()
],coin.listfavorite);

module.exports = router;