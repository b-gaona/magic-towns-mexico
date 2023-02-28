const Sequelize = require("sequelize");
const db = require("../config/dbConnection");

const Reservation = db.define("reservations", {
  phone_number: {
    type: Sequelize.STRING,
  },
  guests: {
    type: Sequelize.INTEGER,
  },
  check_in: {
    type: Sequelize.DATE,
  },
  magicTown: {
    type: Sequelize.STRING,
  },
  user_id: {
    type: Sequelize.INTEGER,
  },
  plan_id: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Reservation;
