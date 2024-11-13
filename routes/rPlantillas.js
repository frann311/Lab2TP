import { Router } from "express";
import cPlantillas from "../controllers/cPlantillas.js";
const routes = Router();

routes.get("/plantillas", cPlantillas.getAll);
routes.get("/plantillas-add", cPlantillas.getAddForm);
routes.post("/plantillas-add", cPlantillas.create);
routes.get("/plantillas-edit/:id", cPlantillas.getEditForm);
routes.post("/plantillas-edit/:id", cPlantillas.update);
routes.get("/plantillas-delete/:id", cPlantillas.delete);
export default routes;
