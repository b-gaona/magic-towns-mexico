const Sequelize = require("sequelize");
const db = require("../config/dbConnection");

const User = db.define("users", {
  username: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.CHAR,
  },
  name: {
    type: Sequelize.STRING,
  },
  lastname: {
    type: Sequelize.STRING,
  },
});

module.exports = User;
