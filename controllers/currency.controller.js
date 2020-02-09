const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const url = require('url');
const apiConfig = require("../config/braveApi.config");
const request = require("request");

exports.AssetTickers = (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const show = req.body.show;
    const coin = req.body.coin;

    const options = {
        method: 'GET',
        url: `https://${apiConfig.apiUrl}/ticker`,
        qs: {show, coin},
        headers: {
          'x-rapidapi-host': apiConfig.apiUrl,
          'x-rapidapi-key': apiConfig.apiKey
        } 
    };

    request(options, (error, response, body) => {
        if (error) {
            const error = new Error('Error');
            error.statusCode = 500;
            error.data = errors.array();
            throw error;
        }

        try{
           res.status(201).json({ message: 'tickers', body: JSON.parse(body) });
        } catch(err){
            const error = new Error('Error');
            error.statusCode = 500;
            error.data = err;
            throw error;
        }
    });
};

exports.digitalCurrency = (req, res, next) => {
    const options = {
        method: 'GET',
        url: `https://${apiConfig.apiUrl}/digital-currency-symbols`,
        headers: {
          'x-rapidapi-host': apiConfig.apiUrl,
          'x-rapidapi-key': apiConfig.apiKey
        } 
    };

    request(options, (error, response, body) => {
        if (error) {
            const err = new Error('Error');
            err.statusCode = 500;
            err.data = error;
            throw err;
        }

        try{
           res.status(201).json({ message: 'tickers', body: JSON.parse(body) });
        } catch(err){
            const error = new Error('Error');
            error.statusCode = 500;
            error.data = err;
            throw error;
        }
    });
};

