const express = require("express");

const { httpGetAllMagicTowns } = require("./magicTowns.controller");

const magicTownsRouter = express.Router();

magicTownsRouter.get("/", httpGetAllMagicTowns);

module.exports = magicTownsRouter;
