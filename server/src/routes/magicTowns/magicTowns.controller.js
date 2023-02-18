const { getAllMagicTowns } = require("../../models/magicTowns.model");

const { getPagination } = require("../../../services/query");

async function httpGetAllMagicTowns(req, res) {
  const { skip, limit } = getPagination(req.query);
  const magicTowns = await getAllMagicTowns({ skip, limit });
  return res.status(200).json(magicTowns);
}

module.exports = {
  httpGetAllMagicTowns,
};
