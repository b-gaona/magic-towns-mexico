const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); //To control the logs and the requests, to avoid multiple requests and sature the server
const helmet = require("helmet");
const bodyParser = require("body-parser");
const session = require("express-session");

const passport = require("passport");
require("./services/auth");
const url = require("url");

const path = require("path");

const db = require("./config/dbConnection");
const api = require("./src/routes/api");

const {
  getAllMagicTowns,
  getOneMagicTown,
} = require("./src/models/magicTowns.model");

const {
  saveUser,
  findUser,
  saveOrFindUser,
} = require("./controllers/users.controller");

const { getAllPlans } = require("./controllers/plans.controller");

const {
  saveReservation,
  validateReservation,
} = require("./controllers/reservations.controller");

const Plan = require("./models/Plans");
const Reservation = require("./models/Reservations");

const app = express(helmet());

//Database connection
db.authenticate()
  .then(() => console.log("Base de datos conectada"))
  .catch((error) => console.log("Error al conectarse a la BD", error));

app.set("view engine", "pug");

//Parse the form's body
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(session({ secret: "myKey", resave: true, saveUninitialized: true }));

app.use(
  cors({
    origin: "https://magic-towns.onrender.com/", //This server can do requests to the server, it's like a whitelist
  })
); //To allow cross origin

app.use(morgan("combined"));

app.use(express.json());

app.use(express.static(__dirname));

app.use("/v1", api);

app.use(passport.initialize());

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  saveOrFindUser
);

app.get("/", async (req, res) => {
  const session = req.session.user || false;

  res.render(path.join(__dirname, "views", "home.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Inicio",
    selected: "home",
    magicTowns: await getAllMagicTowns({ limit: 5, skip: 0 }),
    banners: await getAllMagicTowns({ limit: 4, skip: 100 }),
    session,
    googleAPI: process.env.GOOGLE_API_KEY,
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
        description:
          "Nombre de Dios es el pueblo más antiguo del estado, llamado originalmente Villa de los Cuatro Templos.",
        image:
          "https://cdn.mexicodestinos.com/lugares/nombre-de-dios-durango-princ-min.jpg",
      },
      {
        limit: "Oferta termina 17 de marzo",
        magicTown: "Mazunta, Oaxaca",
        nDays: 6,
        description:
          "Es un atractivo mundial porque ofrece las condiciones ideales para practicar el surf en sus playas y por el cuidado de sus tortugas marinas.",
        image:
          "https://traveltooaxaca.com/wp-content/uploads/2022/07/best-things-to-do-in-mazunte-mexico.jpg",
      },
      {
        limit: "Oferta termina 16 de abril",
        magicTown: "Cosalá, Sinaloa",
        nDays: 9,
        description:
          "Es un reflejo del México antiguo con atributos simbólicos, leyendas e historias.",
        image:
          "https://i0.wp.com/themazatlanpost.com/wp-content/uploads/sites/18/2021/11/cOSALa-sinaloa.jpg?fit=1200%2C675&ssl=1",
      },
      {
        limit: "Oferta termina 1 de mayo",
        magicTown: "Ajijic, Jalisco",
        nDays: 3,
        description:
          "Del náhuatl Axixic, “donde brota el agua”, es una de las villas más antiguas del país.",
        image:
          "https://mexiconewsdaily.com/wp-content/uploads/2021/11/01-Ajijic_Malecon_Somniphobiac.jpg",
      },
    ],
    session,
  });
});

app.get("/reservation", async (req, res) => {
  const session = req.session.user || false;
  const plans = await getAllPlans();
  const magicTowns = await getAllMagicTowns({ skip: 0, limit: 1000 });

  res.render(path.join(__dirname, "views", "reservation.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Planifica ahora",
    selected: "reservation",
    session,
    plans,
    magicTowns,
    googleAPI: process.env.GOOGLE_API_KEY,
  });
});

app.get("/login", (req, res) => {
  const session = req.session.user || false;

  if (session) {
    res.redirect("/");
    return;
  } else {
    res.render(path.join(__dirname, "views", "login.pug"), {
      siteName: "Descubre pueblos mágicos!",
      page: "Iniciar sesión",
      selected: "login/register",
    });
  }
});

app.get("/register", (req, res) => {
  const session = req.session.user || false;

  if (session) {
    res.redirect("/");
    return;
  } else {
    res.render(path.join(__dirname, "views", "register.pug"), {
      siteName: "Descubre pueblos mágicos!",
      page: "Registrarse",
      selected: "login/register",
    });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/checkout", async (req, res) => {
  const session = req.session.user || false;
  const reservation = req.query;

  if (!session || isNaN(reservation.plan_id)) {
    res.redirect("/");
    return;
  }

  const plan = await Plan.findOne({ where: { id: reservation.plan_id } });

  res.render(path.join(__dirname, "views", "checkout.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Compra",
    selected: "",
    session,
    paypalAPI: process.env.PAYPAL_API_KEY,
    reservation,
    plan,
  });
});

app.get("/magicTowns", async (req, res) => {
  const session = req.session.user || false;

  res.render(path.join(__dirname, "views", "allTowns.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Pueblos mágicos",
    selected: "",
    session,
    magicTowns: await getAllMagicTowns({ skip: 0, limit: 10 }),
  });
});

app.get("/magicTowns/:id", async (req, res) => {
  const { id } = req.params;
  const session = req.session.user || false;

  if (
    isNaN(id) ||
    id > (await getAllMagicTowns({ skip: 0, limit: "" })).length
  ) {
    res.redirect("/");
    return;
  }

  const magicTown = await getOneMagicTown(id);

  res.render(path.join(__dirname, "views", "magicTown.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: magicTown.magicTown,
    selected: "",
    session,
    magicTown,
  });
});

app.get("/trips", async (req, res) => {
  const session = req.session.user || false;

  if (!session) {
    res.redirect("/");
    return;
  }

  const trips = await Reservation.findAll({
    where: { user_id: session.id },
    order: [["check_in", "ASC"]],
  });

  const plans = await Plan.findAll({});

  res.render(path.join(__dirname, "views", "trips.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Mis viajes",
    selected: "trips",
    session,
    trips,
    plans,
  });
});

app.post("/register", saveUser);
app.post("/login", findUser);
app.post("/reservation", saveReservation);
app.post("/checkout", validateReservation);

module.exports = app;
