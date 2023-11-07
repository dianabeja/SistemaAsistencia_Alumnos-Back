const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "siae",
  password: "root",
  port: 5432,
  connectionConfig: {
    charset: "UTF8",
  },
});

// Obtener todos los estudiantes
const getAllStudents = async () => {
  try {
    const res = await pool.query("SELECT * FROM alumnos");
    return res.rows;
  } catch (error) {
    throw error;
  }
};

// Obtener un estudiante por ID
const getOneStudent = async (id) => {
  try {
    const res = await pool.query(
      "select a.id,a.nombre,a.matricula,a.sexo,a.licenciatura,ca.url_imagen from alumnos a inner join cuenta_alumnos ca on a.matricula=ca.matricula where a.matricula=$1",
      [id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

// Agregar un nuevo estudiante
const createStudent = async (studentData) => {
  try {
    const { nombre, matricula, sexo, licenciatura } = studentData;
    await pool.query(
      "INSERT INTO alumnos (nombre, matricula, sexo, licenciatura) values ($1,$2,$3,$4)",
      [nombre, matricula, sexo, licenciatura]
    );
    return "Estudiante creado exitosamente";
  } catch (error) {
    throw error;
  }
};

// Actualizar un estudiante existente
const updateStudent = async (id, studentData) => {
  try {
    const { nombre, matricula, sexo, licenciatura } = studentData;
    await pool.query(
      "UPDATE alumnos SET nombre=$1, matricula=$2, sexo=$3, licenciatura=$4 WHERE id=$5",
      [nombre, matricula, sexo, licenciatura, id]
    );
    return "Estudiante actualizado exitosamente";
  } catch (error) {
    throw error;
  }
};

// Eliminar un estudiante existente
const deleteStudent = async (id) => {
  try {
    await pool.query("DELETE FROM alumnos WHERE id = $1", [id]);
    return "Estudiante eliminado exitosamente";
  } catch (error) {
    throw error;
  }
};

const verificarCuenta = async (cuenta) => {
  try {
    console.log(cuenta);
    const { correo, contraseña } = cuenta;
    console.log("correo" + correo);
    console.log("contraseña" + contraseña);

    const res = await pool.query(
      "SELECT matricula FROM cuenta_alumnos WHERE correo = $1 AND contraseña = $2 ",
      [correo, contraseña]
    );
    console.log("Verificar cuenta", JSON.stringify(res));
    return res.rows;
  } catch (error) {
    throw error;
  }
};

const materias = async (id) => {
  try {
    //const {correo,contraseña}=cuenta;
    const res = await pool.query(
      "select * from alumno_materias where matricula_alumno=$1; ",
      [id]
    );
    return res.rows;
  } catch (error) {
    throw error;
  }
};

const obtenerMaterias = async (id) => {
  try {
    //const {correo,contraseña}=cuenta;
    const res = await pool.query("select * from materias where nrc=$1; ", [id]);
    return res.rows;
  } catch (error) {
    throw error;
  }
};

const createCuenta = async (cuenta) => {
  try {
    const { matricula, correo, contraseña, url_imagen } = cuenta;

    const result = await pool.query(
      "SELECT * FROM alumnos WHERE matricula = $1",
      [matricula]
    );
    if (result.rows.length === 0) {
      return "No se encontró la matrícula";
    } else {
      await pool.query("INSERT INTO cuenta_alumnos VALUES ($1, $2, $3, $4);", [
        matricula,
        correo,
        contraseña,
        url_imagen,
      ]);
      return "Cuenta creada exitosamente";
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllStudents,
  getOneStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  verificarCuenta,
  obtenerMaterias,
  materias,
  createCuenta,
};
