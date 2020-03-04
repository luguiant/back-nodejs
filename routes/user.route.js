const express  = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth.middleware");
const User = require("../models/users");
const usersController = require("../controllers/users.controlles");

const router = express.Router();

router.post(
  "/signup",
  [
    body("names")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre es minimo 5 caracteres maximo 50")
      .matches(/^[A-Za-z0-9_\s]+$/, "i")
      .withMessage("El nombre debe ser alfa numerico")
      .exists()
      .withMessage("El nombre es requerido")
      .trim()
      .escape(),
    body('username')
      .exists()
      .withMessage("El nombre de usuario es requerido")
      .matches(/^[A-Za-z0-9_]+$/, "i")
      .withMessage("El nombre de usuario debe ser alfa numerico")
      .custom((value, { req, loc, path }) => {
        return User.findOne({where: { username: value }}).then(userDoc => {
            if (userDoc) {
              return Promise.reject('El nombre usuario ya existe!');
            }
          });
      })
      .trim()
      .escape(),
    body("lastnames")
      .isLength({ min: 2, max: 50 })
      .withMessage("Los apellidos son minimo 2 caracteres maximo 50")
      .matches(/^[A-Za-z0-9_\s]+$/, "i")
      .withMessage("Los apellidos deben ser alfa numericos")
      .exists()
      .withMessage("Los apellidos son requeridos")
      .trim()
      .escape(),
    body("confirm_password")
      .exists()
      .withMessage("La confirmación del password es requerida")
      .trim()
      .escape(),  
    body("password")
      .isLength({ min: 8, max: 8 })
      .withMessage("El password debe ser de 8 carcateres")
      .exists()
      .withMessage("El password es requerido")
      .custom((value, { req, loc, path }) => {
        if (req.body.password === req.body.confirm_password) {
            return true;
          } else {
            return false;
        }
      })
      .withMessage("La confirmación del password no coincide")
      .trim()
      .escape(),
    body("coin_favorite")
      .exists()
      .withMessage("La moneda favorita es requerida")
      .custom((value, { req, loc, path }) => {
        switch (value) {
          case "cop":
          case "eur":
          case "usd":
            return value;
          default:
            throw new Error("Moneda favorita es invalida");
        }
      })
      .trim()
      .escape(),
    body("is_active")
      .optional()
      .isBoolean()
      .withMessage("El campo is_acttive debe ser booleano")
      .trim()
      .escape()
  ],
  usersController.signup
);

router.post(
  "/auth",
  [
    body('username')
      .exists()
      .withMessage("El nombre de usuario es requerido")
      .matches(/^[A-Za-z0-9_]+$/, "i")
      .withMessage("El nombre de usuario debe ser alfa numerico")
      .trim()
      .escape(),
    body("password")
      .isLength({ min: 8, max: 8 })
      .withMessage("El password debe ser de 8 carcateres")
      .exists()
      .withMessage("El password es requerido")
      .trim()
      .escape(),
  ],
  usersController.login
);

router.get("/data_user",isAuth, usersController.datalogin);

module.exports = router;