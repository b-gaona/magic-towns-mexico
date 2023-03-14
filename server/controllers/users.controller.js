const User = require("../models/Users");

const saveUser = async (req, res) => {
  const { name, lastname, username, email, password, password2 } = req.body;

  if (!name || !lastname || !username || !email || !password || !password2) {
    message = "Todos los campos son obligatorios";
  } else if (password != password2) {
    message = "Las contraseñas no son compatibles";
  } else {
    try {
      await User.create({ name, lastname, username, email, password });
      message = "Usuario creado correctamente";
    } catch (error) {
      message = "Error al crear el usuario";
    }
  }
  res.redirect("/register");
  return;
};

const findUser = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    message = "Todos los campos son obligatorios";
  } else {
    const user = await User.findOne({ where: { username, email, password } });
    if (!user) {
      message = "Verifique sus datos, usuario no encontrado";
    } else {
      message = "";
      req.session.user = user;
      res.redirect("/");
      return;
    }
  }
  res.redirect("/login");
  return;
};

const saveOrFindUser = async (req, res) => {
  const { displayName, given_name, family_name, id, email, verified } =
    req.user;
  if (verified) {
    const [user, created] = await User.findOrCreate({
      where: {
        username: displayName,
        email,
        password: id,
        name: given_name,
        lastname: family_name,
      },
    });

    if (user) {
      req.session.user = user;
      res.redirect("/");
      return;
    }
  }
};

module.exports = {
  saveUser,
  findUser,
  saveOrFindUser,
};
