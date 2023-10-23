const estudiantesService=require("../services/estudiantesService")
const jwt = require("jsonwebtoken");
require('dotenv').config();


const getAllStudents=async(req,res)=>{
    const allStudents= await estudiantesService.getAllStudents();
    res.send({status:'OK',data:allStudents});
};

const getOneStudent=async(req,res)=>{
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const studentId = decodedToken.matricula;
        const student = await estudiantesService.getOneStudent(studentId);
        res.send({ status: 'OK', data: student });
      } catch (error) {
        res.status(500).send({ status: 'Error', message: 'Error al obtener el estudiante' });
      }
};

const createStudent=async(req,res)=>{
    const {body}=req
    if (
      !body.id||
	    !body.nombres||
	    !body.apellidos||
	    !body.matricula||
	    !body.telefono||
	    !body.sexo||
	    !body.fechanacimiento||
	    !body.licenciatura
        ){
        return;
    }
    const newStudent={
        id:body.id,
        nombres:body.nombres,
        apellidos:body.apellidos,
        matricula:body.matricula,
        telefono:body.telefono,
        sexo:body.sexo,
        fechanacimiento:body.fechanacimiento,
        licenciatura:body.licenciatura,
    }
    const createdStudent= await estudiantesService.createStudent(newStudent);
    res.status(201).send({status:'OK',data:createdStudent});
};

const updateStudent=(req,res)=>{
    const updatedStudent= estudiantesService.updateStudent(req.params.studentId);
    res.send(`Update student ${req.params.studentId}`);
};

const deleteStudent=(req,res)=>{
    estudiantesService.deleteStudent(req.params.studentId);
    res.send(`Delete student ${req.params.studentId}`);
};

//Token
const generarToken = async (req, res) => {
    try {
      const valor = req.body;
      const token = jwt.sign({ Valor: valor }, process.env.JWT_SECRET);
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

//Inicio de sesion
const IniciarSesion = async (req, res) => {
    try {
        const resp= req.body;
        let correo=resp[0];
        let contrasena=resp[1];

        const cuenta={
            correo,
            contrasena
        }
        result = await estudiantesService.verificarCuenta(cuenta);

        if (result.length === 1) {
            const { matricula } = result[0];
            const token = jwt.sign(
                { matricula: matricula },
                process.env.JWT_SECRET
            );
            res.json({ token });
        } else {
            res.status(401).json({ message: "Credenciales inválidas" });
        }
    } catch (error) {
        console.log("Hubo un error")
        res.status(500).json({ error: error.message });
    }
};

const materiasAlumno=async(req,res)=>{
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const studentMat = decodedToken.matricula;
        const materias = await estudiantesService.obtenerMaterias(studentMat);
        res.send({ status: 'OK', data: materias });
      } catch (error) {
        res.status(500).send({ status: 'Error', message: 'Error al obtener materias' });
      }
};
//new code
const alumnoMaterias = async (req, res) => {
    try {
      const token = req.headers.authorization;
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const { matricula } = decodedToken;
  
      const result = await estudiantesService.materias(matricula);
      const nrcs = result.map((row) => row.nrc);
  
      res.json({ nrcs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const encontrarMateriaAlumno = async (req, res) => {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { Valor } = decodedToken;
    let NRCs = Valor;
    if (!Array.isArray(NRCs)) {
      NRCs = [NRCs];
    }
  
    try {
      const result = await Promise.all(
        NRCs.map((NRC) => estudiantesService.obtenerMaterias(NRC))
      );
  
      const responseData = result.map((resp) => resp[0]);
  
      res.send(responseData);
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  };

  const createCuenta=async(req,res)=>{
    const {body}=req
    if (
        !body.matricula||
        !body.correo||
        !body.contrasena||
        !body.url_imagen
        ){
        return;
    }
    const newCuenta={
      matricula: body.matricula,
      correo: body.correo,
      contrasena: body.contrasena,
      url_imagen: body.url_imagen
    }
    const createdStudent= await estudiantesService.createCuenta(newCuenta);
    res.status(201).send({status:'OK',data:createdStudent});
};
  

module.exports={
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
    createCuenta
}