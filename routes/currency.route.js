const express = require("express");
const isAuth = require("../middleware/is-auth.middleware");
const braveController = require("../controllers/currency.controller");
const { body } = require("express-validator");
const router = express.Router();

router.post(
    "/ticker", 
    isAuth, 
    [
        body("show")
            .exists()
            .withMessage("La moneda a covertir es requerida.")
            .matches(/^[A-Za-z]+$/, "i")
            .withMessage("La moneda debe ser solo alfabetica")
            .isLength({ min: 3, max: 3 })
            .withMessage("La moneda debe ser de 3 caracteres")
            .custom((value, { req, loc, path }) => {
              const valueInput = value.toLowerCase();
              switch (valueInput) {
                case "cop":
                case "eur":
                case "usd":
                  return valueInput;
                default:
                  throw new Error("Moneda ingresada es invalida; cop, eur, usd.");
              }
            })
            .trim()
            .escape(),
        body("coin")
            .exists()
            .withMessage("La criptomoneda es requerida.")
            .matches(/^[A-Za-z]+$/, "i")
            .withMessage("La criptomoneda debe ser solo alfabetica")
            .isLength({ min: 3, max: 10 })
            .withMessage("La criptomoneda debe ser entre 3-10 caracteres")
            .trim()
            .escape()
    ], 
    braveController.AssetTickers);

router.get('/list_digital_currency', isAuth, braveController.digitalCurrency);

module.exports = router;
