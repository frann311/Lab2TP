import db from "../config/db.js";

const mHistorias = {
  getAll: async (paciente) => {
    try {
      const [results] = await db.query(
        `SELECT hc.id_historia,
            pr.nombre AS nombre_profesional,
            t.fecha, t.motivo_consulta,
            p.nombre
            FROM historias_clinicas hc
            LEFT JOIN turnos t ON hc.id_turno = t.id_turno
            LEFT JOIN pacientes p ON t.id_paciente = p.id_paciente
            LEFT JOIN profesionales pr ON t.id_profesional = pr.id_profesional
            WHERE t.id_paciente = (?)
            ORDER BY hc.id_historia DESC;`,
        [paciente]
      );

      results.forEach((hisotria) => {
        hisotria.fecha = new Date(hisotria.fecha).toISOString().split("T")[0];
      });
      return results;
    } catch (err) {
      throw { status: 500, message: "Error al cargar las historias clinicas" };
    }
  },

  getAllProfesional: async (paciente, profesional) => {
    try {
      const [results] = await db.query(
        `SELECT hc.id_historia,
            pr.nombre AS nombre_profesional,
            t.fecha, t.motivo_consulta,
            p.nombre
            FROM historias_clinicas hc
            LEFT JOIN turnos t ON hc.id_turno = t.id_turno
            LEFT JOIN pacientes p ON t.id_paciente = p.id_paciente
            LEFT JOIN profesionales pr ON t.id_profesional = pr.id_profesional
            WHERE t.id_paciente = (?) AND t.id_profesional = (?)
            ORDER BY hc.id_historia DESC;`,
        [paciente, profesional]
      );

      results.forEach((hisotria) => {
        hisotria.fecha = new Date(hisotria.fecha).toISOString().split("T")[0];
      });
      return results;
    } catch (err) {
      throw { status: 500, message: "Error al cargar las historias clinicas" };
    }
  },
  getOne: async (id, profesional) => {
    try {
      const [results] = await db.query(
        `SELECT 
    hc.id_historia,hc.evolucion,hc.id_turno, 
    t.*, t.motivo_consulta,
    d.id_diagnostico,d.diagnostico,d.estado AS estado_diagnostico, 
    a.fecha_inicio AS fecha_inicio_alergia, a.fecha_fin AS fecha_fin_alergia, a.importancia AS importancia_alergia,
    ha.fecha_inicio AS fecha_inicio_habito, ha.fecha_fin AS fecha_fin_habito,
    ha.descripcion AS descripcion_habito,
    ap.fecha_inicio AS fecha_inicio_antecedente, ap.fecha_fin AS fecha_fin_antecedente,
    ap.descripcion AS descripcion_antecedente,
    m.fecha_inicio AS fecha_inicio_medicamento, m.fecha_fin AS fecha_fin_medicamento,
    m.descripcion AS descripcion_medicamento,
    ta.nombre_alergia,
    pr.nombre AS nombre_profesional
FROM historias_clinicas hc
JOIN turnos t ON hc.id_turno = t.id_turno
JOIN diagnosticos d ON hc.id_diagnostico = d.id_diagnostico
LEFT JOIN alergias a ON hc.id_alergia = a.id_alergia
LEFT JOIN habitos ha ON hc.id_habito = ha.id_habito
LEFT JOIN antecedentes_patologicos ap ON hc.id_antecedente = ap.id_antecedente
LEFT JOIN medicamentos m ON hc.id_medicamento = m.id_medicamento
LEFT JOIN tipos_alergias ta ON a.id_tipo_alergia = ta.id_tipo_alergia
LEFT JOIN profesionales pr ON t.id_profesional = pr.id_profesional
WHERE hc.id_historia = (?);`,
        [id]
      );
      return results[0];
    } catch (err) {
      throw {
        status: 500,
        message: `Error al obtener el historial clinico con el id ${id}`,
      };
    }
  },
  create: async (data) => {
    let id_diagnostico = null,
      id_alergias = null,
      id_antecedentes = null,
      id_habitos = null,
      id_medicamentos = null;

    //   ALERGIAS
    if (data.groupAlergias && data.groupAlergias.alergias) {
      try {
        const [results] = await db.query(
          "INSERT INTO alergias (id_tipo_alergia, importancia, fecha_inicio, fecha_fin) VALUES (?,?,?,?)",
          [
            data.groupAlergias.alergias,
            data.groupAlergias.alergiasEstado,
            data.groupAlergias.alergiasInicio,
            data.groupAlergias.alergiasFinal,
          ]
        );
        id_alergias = results.insertId;
      } catch (err) {
        throw { status: 500, message: "Error al insertar alergias" };
      }
    }
    //   ANTECEDENTES
    if (data.groupAntecedentes && data.groupAntecedentes.antecedentes) {
      try {
        const [results] = await db.query(
          "INSERT INTO antecedentes_patologicos (descripcion, fecha_inicio, fecha_fin) VALUES (?,?,?)",
          [
            data.groupAntecedentes.antecedentes,
            data.groupAntecedentes.antecedentesInicio,
            data.groupAntecedentes.antecedentesFinal,
          ]
        );
        id_antecedentes = results.insertId;
      } catch (err) {
        throw { status: 500, message: "Error al insertar antecedentes" };
      }
    }
    //   HABITOS
    if (data.groupHabitos && data.groupHabitos.habitos) {
      try {
        const [results] = await db.query(
          "INSERT INTO habitos (descripcion, fecha_inicio, fecha_fin) VALUES (?,?,?)",
          [
            data.groupHabitos.habitos,
            data.groupHabitos.habitosInicio,
            data.groupHabitos.habitosFinal,
          ]
        );
        id_habitos = results.insertId;
      } catch (err) {
        throw { status: 500, message: "Error al insertar hábitos" };
      }
    }
    //   MEDICAMENTOS
    if (data.groupMedicamentos && data.groupMedicamentos.medicamentos) {
      try {
        const [results] = await db.query(
          "INSERT INTO medicamentos (descripcion, fecha_inicio, fecha_fin) VALUES (?,?,?)",
          [
            data.groupMedicamentos.medicamentos,
            data.groupMedicamentos.medicamentosInicio,
            data.groupMedicamentos.medicamentosFinal,
          ]
        );
        id_medicamentos = results.insertId;
      } catch (err) {
        throw { status: 500, message: "Error al insertar medicamentos" };
      }
    }
    //   DIAGNOSTICOS
    try {
      const [diagnosticoResults] = await db.query(
        "INSERT INTO diagnosticos (diagnostico, estado) VALUES (?,?)",
        [
          data.groupDiagnostico.diagnostico,
          data.groupDiagnostico.diagnosticoFinal,
        ]
      );
      id_diagnostico = diagnosticoResults.insertId;
    } catch (err) {
      throw { status: 500, message: "Error al insertar diagnóstico" };
    }
    //   HISTORIAS
    try {
      await db.query(
        "INSERT INTO historias_clinicas (id_turno, evolucion, id_habito, id_medicamento, id_antecedente, id_diagnostico, id_alergia) VALUES (?,?,?,?,?,?,?)",
        [
          data.turno,
          data.evolucion,
          id_habitos,
          id_medicamentos,
          id_antecedentes,
          id_diagnostico,
          id_alergias,
        ]
      );
    } catch (err) {
      throw { status: 500, message: "Error al crear registro" };
    }
  },
  update: async (data) => {
    // ALERGIAS
    if (data.groupAlergias && data.groupAlergias.alergias) {
      try {
        const [results] = await db.query(
          "UPDATE alergias SET id_tipo_alergia = ?, importancia = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_alergia = ?",
          [
            data.groupAlergias.alergias,
            data.groupAlergias.alergiasEstado,
            data.groupAlergias.alergiasInicio,
            data.groupAlergias.alergiasFinal,
            data.groupAlergias.id_alergia, // Asegúrate de tener el identificador para hacer la actualización
          ]
        );
      } catch (err) {
        throw { status: 500, message: "Error al actualizar alergias" };
      }
    }

    // ANTECEDENTES
    if (data.groupAntecedentes && data.groupAntecedentes.antecedentes) {
      try {
        const [results] = await db.query(
          "UPDATE antecedentes_patologicos SET descripcion = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_antecedente = ?",
          [
            data.groupAntecedentes.antecedentes,
            data.groupAntecedentes.antecedentesInicio,
            data.groupAntecedentes.antecedentesFinal,
            data.groupAntecedentes.id_antecedente,
          ]
        );
      } catch (err) {
        throw { status: 500, message: "Error al actualizar antecedentes" };
      }
    }
    // HABITOS
    if (data.groupHabitos && data.groupHabitos.habitos) {
      try {
        const [results] = await db.query(
          "UPDATE habitos SET descripcion = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_habito = ?",
          [
            data.groupHabitos.habitos,
            data.groupHabitos.habitosInicio,
            data.groupHabitos.habitosFinal,
            data.groupHabitos.id_habito, // Asegúrate de tener el identificador para hacer la actualización
          ]
        );
      } catch (err) {
        throw { status: 500, message: "Error al actualizar hábitos" };
      }
    }

    //   MEDICAMENTOS
    if (data.groupMedicamentos && data.groupMedicamentos.medicamentos) {
      try {
        const [results] = await db.query(
          "UPDATE medicamentos SET descripcion = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_medicamento = ?",
          [
            data.groupMedicamentos.medicamentos,
            data.groupMedicamentos.medicamentosInicio,
            data.groupMedicamentos.medicamentosFinal,
            data.groupMedicamentos.id_medicamento, // Asegúrate de tener el identificador para hacer la actualización
          ]
        );
      } catch (err) {
        throw { status: 500, message: "Error al actualizar medicamentos" };
      }
    }
    //   DIAGNOSTICO
    if (data.groupDiagnostico && data.groupDiagnostico.diagnostico) {
      try {
        const [diagnosticoResults] = await db.query(
          "UPDATE diagnosticos SET diagnostico = ?, estado = ? WHERE id_diagnostico = ?",
          [
            data.groupDiagnostico.diagnostico,
            data.groupDiagnostico.diagnosticoFinal,
            data.groupDiagnostico.id_diagnostico, // Asegúrate de tener el identificador para hacer la actualización
          ]
        );
      } catch (err) {
        throw { status: 500, message: "Error al actualizar diagnóstico" };
      }
    }
    //   EVOLUCION
    if (data.diagnostico) {
      try {
        await db.query(
          "UPDATE historias_clinicas SET evolucion = ? WHERE id_historia_clinica = ?",
          [data.evolucion, data.id_historia_clinica]
        );
      } catch (err) {
        throw { status: 500, message: "Error al actualizar evolución" };
      }
    }
  },
};

export default mHistorias;
