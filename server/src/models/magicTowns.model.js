const { parse } = require("csv-parse");

const path = require("path");
const fs = require("fs");

const magicTowns = require("./magicTowns.mongo");

function loadMagicTownsData() {
  return new Promise((resolve, reject) => {
    //With .createReadStream we create a new stram data and we read it
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "magicTowns.csv")
    )
      //Pipe function will parse all the data given, this functions only works with readable streams
      .pipe(
        parse({
          comment: "#", //Treats this lines as comments
          columns: true, //Returns it as a JS object
        })
      )
      //If it gets data, the results array will push it
      .on("data", async (data) => {
        saveMagicTown(data);
        //console.log(data.magicTown);
      })
      .on("error", (error) => {
        console.log(error);
        reject(error);
      })
      .on("end", async () => {
        const magicTownsFound = (await getAllMagicTowns({})).length;
        console.log(`${magicTownsFound} magic towns!`);
        resolve();
      });
  });
}

async function getAllMagicTowns({ skip, limit }) {
  return await magicTowns
    .find({}, { _id: 0, _v: 0 })
    .skip(skip)
    .limit(limit)
    .sort({ id: "asc" });
}

async function getOneMagicTown(id) {
  return await magicTowns.findOne({ id });
}

async function getMagicTownByKeyword(keyword) {
  return await magicTowns.find({
    $text: {
      $search: keyword,
    },
  });
}

async function saveMagicTown(town) {
  try {
    await magicTowns.updateOne(
      {
        magicTown: town.magicTown,
      },
      town,
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(`Couldn't save that magic town ${error}`);
  }
}

module.exports = {
  loadMagicTownsData,
  getAllMagicTowns,
  getOneMagicTown,
  getMagicTownByKeyword,
};
