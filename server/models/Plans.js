const Sequelize = require("sequelize");
const db = require("../config/dbConnection");

const Plan = db.define("plans", {
  plan: {
    type: Sequelize.STRING,
  },
  registered_people: {
    type: Sequelize.INTEGER,
  },
  price: {
    type: Sequelize.DECIMAL,
  },
  services: {
    type: Sequelize.STRING,
  },
  image: {
    type: Sequelize.STRING,
  },
});

module.exports = Plan;
