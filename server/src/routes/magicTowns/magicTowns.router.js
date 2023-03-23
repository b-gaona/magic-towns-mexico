const express = require("express");

const { httpGetAllMagicTowns, httpGetOneMagicTown, httpGetMagicTownByKeyword } = require("./magicTowns.controller");

const magicTownsRouter = express.Router();

magicTownsRouter.get("/", httpGetAllMagicTowns);

magicTownsRouter.get("/:id", httpGetOneMagicTown);

magicTownsRouter.get("/query/:keyword", httpGetMagicTownByKeyword);

module.exports = magicTownsRouter;
