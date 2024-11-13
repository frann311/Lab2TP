import { Router } from "express";
import cHistorias from "../controllers/cHistorias.js";
const routes = Router();

routes.post("/atencion/:id", cHistorias.create);
routes.get("/historial/:idP/:idT", cHistorias.getAll);
routes.get("/historial_profesional/:idP/:idT", cHistorias.getAllProfesional);
routes.get("/historia_clinica/:idH/:idP/:idT", cHistorias.getOne);

export default routes;
