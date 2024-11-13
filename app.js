import express from "express";
import session from "express-session";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routesTurnos from "./routes/rTurnos.js";
import routesHistorias from "./routes/rHistorias.js";
import routesPlantillas from "./routes/rPlantillas.js";
import error from "./middlewares/error.js";
import routesUsers from "./routes/rUser.js";
import { fileURLToPath } from "url";
import { isAuthenticated } from "./middlewares/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Configurar Pug como motor de plantillas
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdn.quilljs.com",
        ],
        "style-src": [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdn.quilljs.com",
          "'unsafe-inline'",
        ], // Permitir estilos en línea
      },
    },
  })
);

app.use(
  session({
    secret: "mi_secreto",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(routesUsers);
app.use(isAuthenticated, routesTurnos);
app.use(routesHistorias);
app.use(routesPlantillas);

app.use(error.e404);

app.listen(port, () => {
  console.log(`La aplicación está funcionando en: http://localhost:${port}`);
});
