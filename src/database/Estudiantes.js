const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sistema',
  password: '24042002',
  port: 5432,
  connectionConfig:{
    charset:'UTF8'
  }
});

// Obtener todos los estudiantes
const getAllStudents = async () => {
  try {
    const res = await pool.query('SELECT * FROM alumnos');
    return res.rows;
  } catch (error) {
    throw error;
  }
};

// Obtener un estudiante por ID
const getOneStudent = async (id) => {
  try {
    const res = await pool.query('select a.id,a.nombres,a.apellidos,a.matricula,a.telefono,a.sexo,a.fechanacimiento,a.licenciatura,ca.url_imagen from alumnos a inner join cuentas_alumno ca on a.matricula=ca.matricula where a.matricula=$1', [id]);
    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

// Agregar un nuevo estudiante
const createStudent = async (studentData) => {
  try {
    const { id, nombres, apellidos, matricula, telefono, sexo, fechanacimiento, licenciatura } = studentData;
    await pool.query(
      'INSERT INTO alumnos (id, nombres, apellidos, matricula, telefono, sexo, fechanacimiento, licenciatura) values ($1,$2,$3,$4,$5,$6,$7,$8)',
      [id, nombres, apellidos, matricula, telefono, sexo, fechanacimiento, licenciatura]
    );
    return 'Estudiante creado exitosamente';
  } catch (error) {
    throw error;
  }
};

// Actualizar un estudiante existente
const updateStudent = async (id, studentData) => {
  try {
    const { nombres, apellidos, matricula, telefono, sexo, fechanacimiento, licenciatura } = studentData;
    await pool.query(
      'UPDATE alumnos SET nombres=$1, apellidos=$2, matricula=$3, telefono=$4, sexo=$5, fechanacimiento=$6, licenciatura=$7 WHERE id=$8',
      [nombres, apellidos, matricula, telefono, sexo, fechanacimiento, licenciatura, id]
    );
    return 'Estudiante actualizado exitosamente';
  } catch (error) {
    throw error;
  }
};

// Eliminar un estudiante existente
const deleteStudent = async (id) => {
  try {
    await pool.query('DELETE FROM alumnos WHERE id = $1', [id]);
    return 'Estudiante eliminado exitosamente';
  } catch (error) {
    throw error;
  }
};

const verificarCuenta=async(cuenta)=>{
  try {
    const {correo,contrasena}=cuenta;
    const res=await pool.query("SELECT matricula FROM cuentas_alumno WHERE correo = $1 AND contrasena = $2 ",[correo,contrasena]);
    return res.rows;
  } catch (error) {
    throw error;
  }
}

const materias=async(id)=>{
  try {
    //const {correo,contrasena}=cuenta;
    const res=await pool.query("select nrc from alumnos_materias where matricula=$1; ",[id]);
    return res.rows;
  } catch (error) {
    throw error;
  }
}

const obtenerMaterias=async(id)=>{
  try {
    //const {correo,contrasena}=cuenta;
    const res=await pool.query("select * from materias where nrc=$1; ",[id]);
    return res.rows;
  } catch (error) {
    throw error;
  }
}

const createCuenta=async(cuenta)=>{
  try {
    const {matricula,correo,contrasena,url_imagen}=cuenta;
    const result = await pool.query('SELECT * FROM alumnos WHERE matricula = $1', [matricula]);
    if (result.rows.length === 0) {
      return 'No se encontró la matrícula';
    } else {
      await pool.query('INSERT INTO cuentas_alumno VALUES ($1, $2, $3, $4);', [matricula, correo, contrasena, url_imagen]);
      return 'Cuenta creada exitosamente';
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllStudents,
  getOneStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  verificarCuenta,
  obtenerMaterias,
  materias,
  createCuenta
};
