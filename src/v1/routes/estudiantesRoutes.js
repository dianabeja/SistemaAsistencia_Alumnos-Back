const express= require('express');
const router=express.Router();
const estudiantesController= require("../../controllers/estudiantesController")

router
    .get('/',estudiantesController.getOneStudent)
    .get('/materiasAlumno',estudiantesController.alumnoMaterias)
    .get('/materias',estudiantesController.encontrarMateriaAlumno)
    .get('/alumnos', estudiantesController.getAllStudents)
    .post('/',estudiantesController.createStudent)
    .post('/crearCuenta',estudiantesController.createCuenta)
    .patch('/:studentId',estudiantesController.updateStudent)
    .delete('/:studentId',estudiantesController.deleteStudent)
    .post("/IniciarSesion", estudiantesController.IniciarSesion)
    .post("/generarToken", estudiantesController.generarToken);

module.exports=router;