const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); //To control the logs and the requests, to avoid multiple requests and sature the server
const helmet = require("helmet");

const path = require("path");

const api = require("./src/routes/api");
const { getAllMagicTowns } = require("./src/models/magicTowns.model");

const app = express(helmet());

app.set("view engine", "pug");

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
  res.render(path.join(__dirname, "views", "home.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Inicio",
    selected: "home",
    magicTowns: await getAllMagicTowns({ limit: 5, skip: 0 }),
    banners: await getAllMagicTowns({ limit: 4, skip: 100 }), //16
  });
});
app.get("/about", async (req, res) => {
  res.render(path.join(__dirname, "views", "about.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Sobre nosotros",
    selected: "about",
    cards: await getAllMagicTowns({ limit: 10, skip: 27 }),
    familyTowns: await getAllMagicTowns({ limit: 5, skip: 63 }),
  });
});
app.get("/deals", (req, res) => {
  res.render(path.join(__dirname, "views", "deals.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Planes",
    selected: "deals",
    plans: [
      {
        type: "Básico",
        checkIn: 310,
        include: ["3 Días de Viaje", "Hospedaje", "Transporte"],
        price: 30,
        image: "https://www.mexicodesconocido.com.mx/wp-content/uploads/2020/09/grutas-de-bustamante-gobierno-de-mexico.jpg",
      },
      {
        type: "Estándar",
        checkIn: 153,
        include: ["7 Días de Viaje", "Hospedaje", "Transporte", "Visitas turísticas"],
        price: 50,
        image: "https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/quintanaroo/DJI_0091_2998e25a-0680-4935-855b-8aca050a3667.png",
      },
      {
        type: "Premium",
        checkIn: 96,
        include: ["10+ Días de Viaje", "Hospedaje", "Transporte", "Visitas turísticas", "Guía/Instructor experto"],
        price: 100,
        image: "https://www.got2globe.com/wp-content/uploads/2022/02/real-de-catorce-mexico-tunel-ogarrio.jpg",
      },
    ],
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
  });
});
app.get("/reservation", (req, res) => {
  res.render(path.join(__dirname, "views", "reservation.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Planifica ahora",
    selected: "reservation",
  });
});
app.get("/login", (req, res) => {
  res.render(path.join(__dirname, "views", "login.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Iniciar sesión",
    selected: "login/register",
  });
});
app.get("/register", (req, res) => {
  res.render(path.join(__dirname, "views", "register.pug"), {
    siteName: "Descubre pueblos mágicos!",
    page: "Registrarse",
    selected: "login/register",
  });
});

module.exports = app;
