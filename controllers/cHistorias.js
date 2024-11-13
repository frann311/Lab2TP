import mHistorias from "../models/mHistorias.js";
import mTurnos from "../models/mTurnos.js";

import error from "../middlewares/error.js";

const cHistorias = {
  create: async (req, res) => {
    try {
      let {
        diagnostico = null,
        diagnosticoFinal = null,
        evolucion = null,
        alergias = null,
        alergiasEstado = null,
        alergiasInicio = null,
        alergiasFinal = null,
        antecedentes = null,
        antecedentesInicio = null,
        antecedentesFinal = null,
        habitos = null,
        habitosInicio = null,
        habitosFinal = null,
        medicamentos = null,
        medicamentosInicio = null,
        medicamentosFinal = null,
        turno = null,
      } = req.body;

      const data = {
        evolucion,
        turno: parseInt(turno),
        groupDiagnostico: {
          diagnostico,
          diagnosticoFinal,
        },
        groupAlergias: {
          alergias: alergias ? parseInt(alergias) : null,
          alergiasEstado,
          alergiasInicio,
          alergiasFinal,
        },
        groupAntecedentes: {
          antecedentes,
          antecedentesInicio,
          antecedentesFinal,
        },
        groupHabitos: {
          habitos,
          habitosInicio,
          habitosFinal,
        },
        groupMedicamentos: {
          medicamentos,
          medicamentosInicio,
          medicamentosFinal,
        },
      };
      await mTurnos.complete(turno);
      await mHistorias.create(data);
      res.redirect("/");
    } catch (err) {
      error.e500(req, res, err);
    }
  },
  getAll: async (req, res) => {
    let paciente = parseInt(req.params.idP);
    let turno = parseInt(req.params.idT);
    try {
      let historial = await mHistorias.getAll(paciente);
      res.render("historial", {
        title: "Historial clinico",
        historial,
        turno,
        paciente,
      });
    } catch (err) {
      error.e500(req, res, err);
    }
  },
  getAllProfesional: async (req, res) => {
    let paciente = parseInt(req.params.idP);
    let turno = parseInt(req.params.idT);
    const profesional = req.session.user.id_profesional;

    try {
      let historial = await mHistorias.getAllProfesional(paciente, profesional);
      res.render("historial", {
        title: "Historial clinico",
        historial,
        turno,
        paciente,
      });
    } catch (err) {
      error.e500(req, res, err);
    }
  },
  getOne: async (req, res) => {
    try {
      let id_historia = parseInt(req.params.idH);
      let id_paciente = parseInt(req.params.idP);
      let id_turno = parseInt(req.params.idT);
      const id_profesional = req.session.user.id_profesional;

      const historial = await mHistorias.getOne(id_historia);
      let mismoProfesional;
      if (!historial) {
        error.e500(req, res);
      } else {
        function formatFecha(fecha) {
          if (!fecha) return null;
          if (fecha instanceof Date) {
            return fecha.toISOString().split("T")[0];
          }
          return fecha.split("T")[0];
        }

        if (historial.fecha_inicio_alergia || historial.fecha_fin_alergia) {
          historial.fecha_inicio_alergia = formatFecha(
            historial.fecha_inicio_alergia
          );
          historial.fecha_fin_alergia = formatFecha(
            historial.fecha_fin_alergia
          );
        }

        if (
          historial.fecha_inicio_habito ||
          historial.fecha_fin_habito ||
          historial.descripcion_habito
        ) {
          historial.fecha_inicio_habito = formatFecha(
            historial.fecha_inicio_habito
          );
          historial.fecha_fin_habito = formatFecha(historial.fecha_fin_habito);
        }

        if (
          historial.fecha_inicio_antecedente ||
          historial.fecha_fin_antecedente ||
          historial.descripcion_antecedente
        ) {
          historial.fecha_inicio_antecedente = formatFecha(
            historial.fecha_inicio_antecedente
          );
          historial.fecha_fin_antecedente = formatFecha(
            historial.fecha_fin_antecedente
          );
        }

        if (
          historial.fecha_inicio_medicamento ||
          historial.fecha_fin_medicamento ||
          historial.descripcion_medicamento
        ) {
          historial.fecha_inicio_medicamento = formatFecha(
            historial.fecha_inicio_medicamento
          );
          historial.fecha_fin_medicamento = formatFecha(
            historial.fecha_fin_medicamento
          );
        }
        historial.fecha = formatFecha(historial.fecha);

        mismoProfesional = historial.id_profesional !== id_profesional;
        res.render("historia-clinica", {
          title: "Historia clinica",
          id_paciente,
          id_turno,
          id_profesional,
          mismoProfesional,
          historial,
        });
      }
    } catch (err) {
      error.e500(req, res, err);
    }
  },
};
export default cHistorias;
