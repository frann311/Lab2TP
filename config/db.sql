CREATE DATABASE IF NOT EXISTS consultas;

USE consultas;

CREATE TABLE IF NOT EXISTS profesionales (
    id_profesional INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS pacientes (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS alergias (
    id_alergia INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    importancia VARCHAR(20) CHECK (importancia IN ('leve', 'normal', 'alta')),
    fecha_inicio DATE,
    fecha_fin DATE,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS antecedentes_patologicos (
    id_antecedente INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS habitos (
    id_habito INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS medicamentos (
    id_medicamento INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

-- Nueva tabla de horarios
CREATE TABLE IF NOT EXISTS horarios (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    hora TIME NOT NULL
);

-- Tabla de turnos con FK de horarios, pacientes y profesionales
CREATE TABLE IF NOT EXISTS turnos (
    id_turno INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    motivo_consulta TEXT,
    id_paciente INT NOT NULL,
    id_profesional INT NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
    FOREIGN KEY (id_profesional) REFERENCES profesionales(id_profesional) ON DELETE CASCADE,
    FOREIGN KEY (hora) REFERENCES horarios(id_horario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS historias_clinicas (
    id_historia INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_profesional INT NOT NULL,
    fecha_atencion DATE NOT NULL,
    evolucion TEXT NOT NULL,
    diagnostico TEXT NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
    FOREIGN KEY (id_profesional) REFERENCES profesionales(id_profesional) ON DELETE CASCADE
);
