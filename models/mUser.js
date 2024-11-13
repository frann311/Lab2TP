import db from "../config/db.js";
import bcrypt from "bcrypt";
const mUser = {
  getOne: async (username) => {
    try {
      const [results] = await db.query(
        "SELECT * FROM profesionales WHERE usuario = (?)",
        [username]
      );
      return results;
    } catch (err) {
      throw { status: 500, message: `error al obtener el usuario ${username}` };
    }
  },
  create: async (user) => {
    try {
      const hash = await bcrypt.hash(user.password, 10);

      const [results] = await db.query(
        "INSERT INTO profesionales (nombre, usuario, password,email ) VALUES (?,?,?,?)",
        [user.name, user.username, hash, user.email]
      );
      return results;
    } catch (err) {
      throw {
        status: 500,
        message: `Error al crear el usuario ${user.username} `,
      };
    }
  },
};

export default mUser;
