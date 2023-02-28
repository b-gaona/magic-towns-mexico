const Plan = require("../models/Plans");

async function getAllPlans() {
  return await Plan.findAll();
}

module.exports = {
  getAllPlans,
};
