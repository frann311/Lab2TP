import error from "../middlewares/error.js";
import mPlantillas from "../models/mPlantillas.js";

const cPlantillas = {
  getAll: async (req, res) => {
    try {
      const id = req.session.user.id_profesional;

      const plantillas = await mPlantillas.getAll(id);

      res.render("plantillas", {
        title: "Plantillas",
        plantillas,
      });
    } catch (err) {
      error.e500(req, res, err);
    }
  },
  getAddForm: async (req, res) => {
    res.render("plantillas-add", {
      title: "Agregar nueva plantilla",
    });
  },
  create: async (req, res) => {
    try {
      const { title, text } = req.body;
      const id = req.session.user.id_profesional;
      await mPlantillas.create({ title, text, id });
      res.redirect("/plantillas");
    } catch (err) {
      error.e500(req, res, err);
    }
  },
  getEditForm: async (req, res) => {
    try {
      const id_plantilla = parseInt(req.params.id);
      const plantilla = await mPlantillas.getOne(id_plantilla);
      res.render("plantillas-edit", {
        title: "Editar tarea",
        plantilla,
      });
    } catch (err) {
      error.e500(req, res, err);
    }
  },
  update: async (req, res) => {
    try {
      let id_plantilla = parseInt(req.params.id);
      let { title, text } = req.body;
      await mPlantillas.update({ id_plantilla, title, text });
      res.redirect("/plantillas");
    } catch (err) {
      error.e500(req, res, err);
    }
  },
  delete: async (req, res) => {
    try {
      let id_plantilla = parseInt(req.params.id);
      await mPlantillas.delete(id_plantilla);
      res.redirect("/plantillas");
    } catch (err) {
      error.e500(req, res, err);
    }
  },
};

export default cPlantillas;
