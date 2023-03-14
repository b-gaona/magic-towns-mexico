const url = require("url");

const Reservation = require("../models/Reservations");

const saveReservation = async (req, res) => {
  const { user_id, phone_number, guests, check_in, magicTown, plan_id } =
    req.body;

  if (
    !user_id ||
    !phone_number ||
    !guests ||
    !check_in ||
    !magicTown ||
    !plan_id
  ) {
    message = "Para reservar ocupa tener una cuenta registrada";
  } else {
    try {
      await Reservation.create({
        user_id,
        phone_number,
        guests,
        check_in,
        magicTown,
        plan_id,
      });
      message = "Reservación realizada correctamente";
    } catch (error) {
      message = "Verifique sus datos, error al reservar";
    }
    return res.status(200).json({ message });
  }

  res.redirect("/reservation");
  return;
};

const validateReservation = (req, res) => {
  const { user_id, phone_number, guests, check_in, magicTown, plan_id } =
    req.body;

  if (
    !user_id ||
    !phone_number ||
    !guests ||
    !check_in ||
    !magicTown ||
    !plan_id
  ) {
    message = "Para reservar ocupa tener una cuenta registrada";
    res.redirect("/reservation");
    return;
  }
  res.redirect(
    url.format({
      pathname: "/checkout",
      query: req.body,
    })
  );
  return;
};

module.exports = {
  saveReservation,
  validateReservation,
};
