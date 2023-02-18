const http = require("http");

require("dotenv").config(); //To able the configurations in the .env file

const app = require("./app");
const { mongoConnect } = require("./services/mongo");

const { loadMagicTownsData } = require("./src/models/magicTowns.model");

const PORT = process.env.PORT || 3000; //To avoid conflict with the 3000 that's using React

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadMagicTownsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

startServer();
