import db from "../config/db.js";

const mTurnos = {
  getAll: async (date, profesional) => {
    try {
      const [results] = await db.query(
        `
      SELECT turnos.*, pacientes.nombre AS nombre_paciente, horarios.horario AS hora_turno
      FROM turnos
      JOIN pacientes ON turnos.id_paciente = pacientes.id_paciente
      JOIN horarios ON turnos.hora = horarios.id_horarios
      WHERE turnos.fecha = (?)  AND turnos.id_profesional = (?)
      ORDER BY horarios.horario ASC`,
        [date, profesional]
      );
      return results;
    } catch (err) {
      throw { status: 500, message: "Error al cargar los turnos" };
    }
  },
  getOne: async (id) => {
    try {
      const [results] = await db.query(
        `SELECT * FROM turnos t
        JOIN pacientes p ON t.id_paciente = p.id_paciente
        WHERE id_turno = (?)`,
        [id]
      );
      return results[0];
    } catch (err) {
      throw {
        status: 500,
        message: `Error al obtener la tarea con el id ${id}`,
      };
    }
  },
  getTemplate: async (id) => {
    try {
      const [results] = await db.query(
        "SELECT * FROM plantillas WHERE id_profesional = (?)",
        [id]
      );
      return results;
    } catch (err) {
      throw {
        status: 500,
        message: `Error al obtener plantillas`,
      };
    }
  },
  getAlergias: async () => {
    try {
      const [results] = await db.query("SELECT * FROM tipos_alergias ");
      return results;
    } catch (err) {
      throw {
        status: 500,
        message: `Error al obtener plantillas`,
      };
    }
  },
  complete: async (id) => {
    try {
      await db.query(
        "UPDATE turnos SET estado = 'atendido' WHERE id_turno = (?)",
        [id]
      );
    } catch (err) {
      throw {
        status: 500,
        message: `Error al completar la tarea con el id: ${id}`,
      };
    }
  },
  delete: async (id) => {
    try {
      await db.query("DELETE  FROM turnos WHERE id_turno = (?)", [id]);
    } catch (err) {
      throw {
        status: 500,
        message: `Error al eliminar el turno con el id: ${id}`,
      };
    }
  },
  getAllPacientes: async () => {
    try {
      const [results] = await db.query("SELECT * FROM pacientes");
      return results;
    } catch (err) {
      throw {
        status: 500,
        message: `Error al obtener pacientes`,
      };
    }
  },
  create: async (data) => {
    console.log(
      data.date,
      data.hora,
      data.motivo,
      data.id_paciente,
      data.id_profesional
    );
    try {
      await db.query(
        `INSERT INTO turnos (fecha,hora,estado,motivo_consulta,id_paciente,id_profesional) VALUES
        (?,?,"pendiente",?,?,?)`,
        [
          data.date,
          data.hora,
          data.motivo,
          data.id_paciente,
          data.id_profesional,
        ]
      );
    } catch (err) {
      throw {
        status: 500,
        message: `Error al agregar turno`,
      };
    }
  },
};

export default mTurnos;
