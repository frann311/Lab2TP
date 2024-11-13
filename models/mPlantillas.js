import db from "../config/db.js";

const mPlantillas = {
  getAll: async (id) => {
    try {
      const [results] = await db.query(
        `SELECT * FROM plantillas WHERE id_profesional = (?)`,
        [id]
      );
      return results;
    } catch (err) {
      throw {
        status: 500,
        message: "Error al obtener plantillas",
      };
    }
  },
  getOne: async (id) => {
    try {
      const [results] = await db.query(
        "SELECT * FROM plantillas WHERE id_plantilla = (?)",
        [id]
      );
      return results[0];
    } catch (err) {
      throw {
        status: 500,
        message: `Error al obtener plantilla con el id ${id}`,
      };
    }
  },
  create: async (data) => {
    try {
      await db.query(
        "INSERT INTO plantillas (title_plantilla, texto_plantilla, id_profesional) VALUES (?,?,?)",
        [data.title, data.text, data.id]
      );
    } catch (err) {
      throw {
        status: 500,
        message: "Error al crear plantilla",
      };
    }
  },
  update: async (data) => {
    try {
      await db.query(
        "UPDATE plantillas SET title_plantilla = (?), texto_plantilla = (?) WHERE id_plantilla = (?)",
        [data.title, data.text, data.id_plantilla]
      );
    } catch (err) {
      throw {
        status: 500,
        message: `Error al editar plantilla con el id ${data.id_plantilla}`,
      };
    }
  },
  delete: async (id) => {
    try {
      await db.query("DELETE  FROM plantillas WHERE id_plantilla = (?)", [id]);
    } catch (err) {
      throw {
        status: 500,
        message: `Error al eliminar plantilla con el id: ${id}`,
      };
    }
  },
};
export default mPlantillas;
