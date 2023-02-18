const express = require("express");

const magicTownsRouter = require("./magicTowns/magicTowns.router");

const api = express.Router();

api.use("/magicTowns", magicTownsRouter);

module.exports = api;
