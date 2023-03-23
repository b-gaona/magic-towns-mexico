const {
  getAllMagicTowns,
  getOneMagicTown,
  getMagicTownByKeyword,
} = require("../../models/magicTowns.model");

const { getPagination } = require("../../../services/query");

async function httpGetAllMagicTowns(req, res) {
  const { skip, limit } = getPagination(req.query);
  const magicTowns = await getAllMagicTowns({ skip, limit });
  return res.status(200).json(magicTowns);
}

async function httpGetOneMagicTown(req, res) {
  const { id } = req.params;
  const magicTown = await getOneMagicTown(id);

  if (!magicTown) {
    return res.status(404).json({
      message: "No existe un pueblo mágico con ese ID",
    });
  }

  return res.status(200).json(magicTown);
}

async function httpGetMagicTownByKeyword(req, res) {
  const { keyword } = req.params;
  const magicTown = await getMagicTownByKeyword(keyword);

  if (!magicTown || magicTown.length == 0) {
    return res.status(404).json({
      message: "No existe un pueblo mágico con esa palabra",
    });
  }

  return res.status(200).json(magicTown);
}

module.exports = {
  httpGetAllMagicTowns,
  httpGetOneMagicTown,
  httpGetMagicTownByKeyword,
};
