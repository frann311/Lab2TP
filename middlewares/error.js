const error = {
  e404: (req, res) => {
    res.status(404).render("error", {
      title: "error 404 Not Found",
      message: "la ruta que estas buscando no existe",
    });
  },
  e401: (req, res, err) => {
    res.status(401).render("error", {
      title: "error 401 Authorization required",
      message: err.message,
    });
  },
  e403: (req, res, err) => {
    res.status(403).render("error", {
      title: "error 403 Forbidden",
      message: err.message,
    });
  },
  e500: (req, res, err) => {
    res.status(500).render("error", {
      title: "Error 500 internal server",
      message: err.message,
    });
  },
};

export default error;
