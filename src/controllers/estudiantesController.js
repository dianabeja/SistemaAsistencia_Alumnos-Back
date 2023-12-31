const estudiantesService = require("../services/estudiantesService");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getAllStudents = async (req, res) => {
  const allStudents = await estudiantesService.getAllStudents();
  res.send({ status: "OK", data: allStudents });
};

const getOneStudent = async (req, res) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    const newToken = token.split("Bearer ");
    const token1 = newToken[1];
    const decodedToken = jwt.verify(token1, 'Centenito');
    console.log(decodedToken);
    const studentId = decodedToken.matricula;
    const student = await estudiantesService.getOneStudent(studentId);
    res.send({ status: "OK", data: student });
  } catch (error) {
    res
      .status(500)
      .send({ status: "Error", message: "Error al obtener el estudiante" });
  }
};

const createStudent = async (req, res) => {
  const { body } = req;
  if (!body.nombre || !body.matricula || !body.sexo || !body.licenciatura) {
    return;
  }
  const newStudent = {
    nombre: body.nombre,
    matricula: body.matricula,
    sexo: body.sexo,
    licenciatura: body.licenciatura,
  };
  const createdStudent = await estudiantesService.createStudent(newStudent);
  res.status(201).send({ status: "OK", data: createdStudent });
};

const updateStudent = (req, res) => {
  const updatedStudent = estudiantesService.updateStudent(req.params.studentId);
  res.send(`Update student ${req.params.studentId}`);
};

const deleteStudent = (req, res) => {
  estudiantesService.deleteStudent(req.params.studentId);
  res.send(`Delete student ${req.params.studentId}`);
};

//Token
const generarToken = async (req, res) => {
  try {
    const valor = req.body;
    const token = jwt.sign({ Valor: valor }, 'Centenito');
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Inicio de sesion
const IniciarSesion = async (req, res) => {
  try {
    const resp = req.body;
    let correo = resp[0];
    let contraseña = resp[1];

    const cuenta = {
      correo,
      contraseña,
    };
    result = await estudiantesService.verificarCuenta(cuenta);

    if (result.length === 1) {
      const { matricula } = result[0];
      console.log("matriculaaa Inicio de sesion", result[0]);
      const token = jwt.sign({ matricula: matricula }, 'Centenito');
      res.json({ token });
    } else {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  } catch (error) {
    console.log("Hubo un error");
    res.status(500).json({ error: error.message });
  }
};

const materiasAlumno = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, 'Centenito');
    const studentMat = decodedToken.matricula;
    const materias = await estudiantesService.obtenerMaterias(studentMat);
    res.send({ status: "OK", data: materias });
  } catch (error) {
    res
      .status(500)
      .send({ status: "Error", message: "Error al obtener materias" });
  }
};
//new code
const alumnoMaterias = async (req, res) => {
  try {
    const token = req.headers.authorization;

    const newToken = token.split("Bearer ");
    const token1 = newToken[1];
    const decodedToken = jwt.verify(token1, 'Centenito');
    const { matricula } = decodedToken;

    const result = await estudiantesService.materias(matricula);
    const nrcs = result.map((row) => row.ncr_materias);

    res.json({ nrcs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const encontrarMateriaAlumno = async (req, res) => {
  const token = req.headers.authorization;

  const newToken = token.split("Bearer ");
  const token1 = newToken[1];
  const decodedToken = jwt.verify(token1, "Centenito");
  const { Valor } = decodedToken;
  console.log(Valor);
  let NRCs = Valor;
  if (!Array.isArray(NRCs)) {
    NRCs = [NRCs];
  }

  try {
    const result = await Promise.all(
      NRCs.map((NRC) => estudiantesService.obtenerMaterias(NRC))
    );

    console.log(result);

    const responseData = result.map((resp) => resp[0]);

    res.send(responseData);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const createCuenta = async (req, res) => {
  console.log("Pasa por estudiantes Controller 1");

  const { body } = req;
  if (!body.matricula || !body.correo || !body.contraseña || !body.url_imagen) {
    return;
  }

  const newCuenta = {
    matricula: body.matricula,
    correo: body.correo,
    contraseña: body.contraseña,
    url_imagen: body.url_imagen,
  };
  const createdStudent = await estudiantesService.createCuenta(newCuenta);

  res.status(201).send({ status: "OK", data: createdStudent });
};

module.exports = {
  getAllStudents,
  getOneStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  generarToken,
  IniciarSesion,
  materiasAlumno,
  alumnoMaterias,
  encontrarMateriaAlumno,
  createCuenta,
};
