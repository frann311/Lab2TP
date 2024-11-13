import { Router } from "express";
import cTurnos from "../controllers/cTurnos.js";
const routes = Router();

routes.get("/", cTurnos.getAll);
routes.post("/", cTurnos.handleDate);
routes.get("/add/:id", cTurnos.getAddForm);
routes.post("/add", cTurnos.create);
routes.get("/atencion/:id", cTurnos.getAtencionForm);
routes.get("/atencion/:id", cTurnos.complete);
routes.get("/delete/:id", cTurnos.delete);
routes.get("/pacientes", cTurnos.listPacientes);

export default routes;
