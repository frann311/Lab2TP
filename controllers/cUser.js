import error from "../middlewares/error.js";
import mUser from "../models/mUser.js";
import bcrypt from "bcryptjs";

const cUser = {
  getLoginForm: (req, res) => {
    res.render("login");
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const results = await mUser.getOne(username);
      if (results.length === 0) {
        let err = {
          status: 401,
          message: `El ususario ${username} no fue encontrado en la base de datos`,
        };
        error.e401(req, res, err);
      }

      let user = results[0];
      let isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        let err = {
          status: 403,
          message: "Contraseña incorrecta",
        };
        error.e403(req, res, err);
      }

      req.session.user = user;

      res.redirect("/");
    } catch (err) {
      error.e500(req, res, err);
    }
  },
  getSigninForm: (req, res) => {
    res.render("signin");
  },
  signin: async (req, res) => {
    try {
      const { email, name, username, password } = req.body;

      await mUser.create({ email, name, username, password });
      res.render("signin", { newUser: true, username });
    } catch (err) {
      error.e500(req, res, err);
    }
  },
  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/login");
  },
};

export default cUser;
