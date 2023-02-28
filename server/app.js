const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); //To control the logs and the requests, to avoid multiple requests and sature the server
const helmet = require("helmet");
const bodyParser = require("body-parser")
const session = require('express-session')

const path = require("path");

const db = require("./config/dbConnection");
const api = require("./src/routes/api");

const { getAllMagicTowns } = require("./src/models/magicTowns.model");

const { saveUser, findUser } = require("./controllers/users.controller");
const { getAllPlans } = require("./controllers/plans.controller");
const { saveReservation } = require("./controllers/reservations.controller");

const app = express(helmet());

//Database connection
db.authenticate()
  .then(() => console.log("Base de datos conectada"))
  .catch((error) => console.log("Error al conectarse a la BD", error));

app.set("view engine", "pug");

//Parse the form's body
app.use(bodyParser.urlencoded({
  extended:true
}));

app.use(session({secret: 'myKey', resave: true, saveUninitialized: true}))

app.use(
  cors({
    origin: "http://localhost:3000/", //This server can do requests to the server, it's like a whitelist
  })
); //To allow cross origin

app.use(morgan("combined"));

app.use(express.json());

app.use(express.static(__dirname));

app.use("/v1", api);

app.get("/", async (req, res) => {
  const session = req.session.user || false;
  
  res.render(path.join(__dirname, "views", "home.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Inicio",
    selected: "home",
    magicTowns: await getAllMagicTowns({ limit: 5, skip: 0 }),
    banners: await getAllMagicTowns({ limit: 4, skip: 100 }),
    session,
  });
});

app.get("/about", async (req, res) => {
  const session = req.session.user || false;

  res.render(path.join(__dirname, "views", "about.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Sobre nosotros",
    selected: "about",
    cards: await getAllMagicTowns({ limit: 10, skip: 27 }),
    familyTowns: await getAllMagicTowns({ limit: 5, skip: 63 }),
    session,
  });
});

app.get("/deals", async (req, res) => {
  const session = req.session.user || false;
  const plans = await getAllPlans();

  res.render(path.join(__dirname, "views", "deals.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Planes",
    selected: "deals",
    plans,
    limitedDeals: [
      {
        limit: "Oferta termina 29 de junio",
        magicTown: "Nombre de Dios, Durango",
        nDays: 5,
        description: "Nombre de Dios es el pueblo más antiguo del estado, llamado originalmente Villa de los Cuatro Templos.",
        image: "https://cdn.mexicodestinos.com/lugares/nombre-de-dios-durango-princ-min.jpg",
      },
      {
        limit: "Oferta termina 17 de marzo",
        magicTown: "Mazunta, Oaxaca",
        nDays: 6,
        description: "Es un atractivo mundial porque ofrece las condiciones ideales para practicar el surf en sus playas y por el cuidado de sus tortugas marinas.",
        image: "https://traveltooaxaca.com/wp-content/uploads/2022/07/best-things-to-do-in-mazunte-mexico.jpg",
      },
      {
        limit: "Oferta termina 16 de abril",
        magicTown: "Cosalá, Sinaloa",
        nDays: 9,
        description: "Es un reflejo del México antiguo con atributos simbólicos, leyendas e historias.",
        image: "https://i0.wp.com/themazatlanpost.com/wp-content/uploads/sites/18/2021/11/cOSALa-sinaloa.jpg?fit=1200%2C675&ssl=1",
      },
      {
        limit: "Oferta termina 1 de mayo",
        magicTown: "Ajijic, Jalisco",
        nDays: 3,
        description: "Del náhuatl Axixic, “donde brota el agua”, es una de las villas más antiguas del país.",
        image: "https://mexiconewsdaily.com/wp-content/uploads/2021/11/01-Ajijic_Malecon_Somniphobiac.jpg",
      },
    ],
    session,
  });
});

app.get("/reservation", async (req, res) => {
  const session = req.session.user || false;
  const plans = await getAllPlans();
  const magicTowns = await getAllMagicTowns({skip: 0, limit: 1000});

  res.render(path.join(__dirname, "views", "reservation.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Planifica ahora",
    selected: "reservation",
    session,
    plans,
    magicTowns,
  });
});

app.get("/login", (req, res) => {
  const session = req.session.user || false;
  
  if(session){
    res.redirect("/");
  }else{
  res.render(path.join(__dirname, "views", "login.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Iniciar sesión",
    selected: "login/register",
  });
  }
});

app.get("/register", (req, res) => {
  const session = req.session.user || false;

  if(session){
    res.redirect("/");
  }else{
  res.render(path.join(__dirname, "views", "register.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Registrarse",
    selected: "login/register",
  });
  }
});

app.get("/logout", (req, res) =>{
  req.session.destroy();
  res.redirect("/");
})

app.post("/register", saveUser);
app.post("/login", findUser);
app.post("/reservation", saveReservation);

module.exports = app;
