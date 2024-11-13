import mTurnos from "../models/mTurnos.js";

import error from "../middlewares/error.js";
const cTurnos = {
  getAll: async (req, res) => {
    try {
      let date = req.query.date || new Date();
      let dateNow = new Date().toISOString().split("T")[0];
      const isShortDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(date);

      if (!isShortDateFormat) {
        date = new Date(date).toISOString().split("T")[0];
      }

      const profesional = req.session.user.id_profesional;

      let turnos = await mTurnos.getAll(date, profesional);

      res.render("index", {
        dateNow,
        date,
        title: "Lista de turnos",
        turnos,
        profesional,
      });
    } catch (err) {
      error.e500(req, res, err);
    }
  },
  handleDate: async (req, res) => {
    try {
      // Obtener la fecha desde el formulario
      let dateString = req.body.date;
      // Redirigir a la misma página usando una solicitud GET con la fecha como parámetro
      res.redirect(`/?date=${dateString}`);
    } catch (err) {
      // Manejo de errores
      error.e500(req, res, err);
    }
  },
  getAtencionForm: async (req, res) => {
    try {
      const profesional = req.session.user.id_profesional;

      let id = parseInt(req.params.id);
      let turno = await mTurnos.getOne(id);
      let plantillas = await mTurnos.getTemplate(profesional);
      let alergias = await mTurnos.getAlergias();
      if (!turno) {
        error.e404(req, res);
      } else {
        res.render("turno-atencion", {
          title: "Atencion Paciente",
          turno,
          plantillas,
          alergias,
        });
      }
    } catch (err) {
      error.e500(req, res, err);
    }
  },

  complete: async (req, res) => {
    try {
      let id = parseInt(req.params.id);
      await mTurnos.complete(id);
      res.redirect("/");
    } catch (err) {
      error.e500(req, res, err);
    }
  },
  delete: async (req, res) => {
    try {
      let id = parseInt(req.params.id);
      await mTurnos.delete(id);
      res.redirect("/");
    } catch (err) {
      error.e500(req, res, err);
    }
  },
  listPacientes: async (req, res) => {
    try {
      const pacientes = await mTurnos.getAllPacientes();
      res.render("pacientes", {
        pacientes,
        title: "Pacientes",
      });
    } catch (err) {
      error.e500(req, res, err);
    }
  },
  getAddForm: async (req, res) => {
    const id_paciente = parseInt(req.params.id);

    res.render("turno-add", { title: "Agregar Turno", id_paciente });
  },
  create: async (req, res) => {
    try {
      const id_profesional = req.session.user.id_profesional;
      const { date, motivo, hora, id_paciente } = req.body;
      await mTurnos.create({ date, motivo, hora, id_paciente, id_profesional });

      res.redirect("/");
    } catch (err) {
      error.e500(req, res, err);
    }
  },
};

export default cTurnos;
