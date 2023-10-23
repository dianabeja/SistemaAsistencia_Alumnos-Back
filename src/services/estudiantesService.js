const Estudiante=require('../database/Estudiantes')

const getAllStudents=()=>{
    const allStudents=Estudiante.getAllStudents();
    return allStudents;
};
const getOneStudent=(id)=>{
    const oneStudent=Estudiante.getOneStudent(id);
    return oneStudent;
};
const createStudent=(newStudent)=>{
    const createStudent=Estudiante.createStudent(newStudent);
    return createStudent;
};
const updateStudent=()=>{
    //const up
    return ;
};
const deleteStudent=()=>{
    return ;
};

const verificarCuenta=(cuenta)=>{
    const cuentaVer=Estudiante.verificarCuenta(cuenta);
    return cuentaVer;
};

const materias=(id)=>{
    const materias=Estudiante.materias(id);
    return materias;
};

const obtenerMaterias=(id)=>{
    const materias=Estudiante.obtenerMaterias(id);
    return materias;
};

const createCuenta=(cuenta)=>{
    const materias=Estudiante.createCuenta(cuenta);
    return materias;
};

module.exports={
    getAllStudents,
    getOneStudent,
    createStudent,
    verificarCuenta,
    obtenerMaterias,
    materias,
    createCuenta
}