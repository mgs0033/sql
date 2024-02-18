const express = require('express');
var fs = require('fs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var https = require('https');

const app = express();
app.set('view engine', 'ejs');
var port = process.env.PORT || 3001;
var server =require ('http').Server(app);

app.use(express.json());
app.use(express.static('public'));

//conexion clever cloud
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'bsvrqzj7pww3zaffigtf-mysql.services.clever-cloud.com',
    user: 'uieabwm7oahdfoqe',
    password: 'niN0SgkS8Hr3d9TmIHHp',
    database: 'bsvrqzj7pww3zaffigtf'
})



//FUNCIONES GET
app.get('/', (req, response) => {
    var contenido = fs.readFileSync("public/index.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
    
});

app.get('/centros',(req,res)=>{
    var contenido=fs.readFileSync('public/centros.html');
    res.setHeader('Content-type','text/html');
    res.send(contenido);
});

app.get('/alumnos',(req,res)=>{
    var contenido=fs.readFileSync('public/alumnos.html');
    res.setHeader('Content-type','text/html');
    res.send(contenido);
});

app.get('/graficos',(req,res)=>{
    var contenido=fs.readFileSync('public/graficos.html');
    res.setHeader('Content-type','text/html');
    res.send(contenido);
});
app.get('/modificar',(req,res)=>{
    var contenido=fs.readFileSync('public/modificar.html');
    res.setHeader('Content-type','text/html');
    res.send(contenido);
});

app.get("/infCursos", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            throw err;
        }
        console.log('Conectado con id ' + connection.threadId);
        connection.query('SELECT cu.id AS idCurso, cu.nombreCurso, cu.nivel, cu.descripcion, cu.fecha_importacion, cu.lugar FROM cursos AS cu', 
        (err, rows) => {
            connection.release(); 
                    
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
                res.status(500).send('Error al obtener los cursos');
            }
        });
    });
});

app.get("/infCentros", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            throw err;
        }
        console.log('Conectado con id ' + connection.threadId);
        connection.query(`SELECT 
            ce.id AS idCentro,
            ce.lugar AS lugarCentro,
            ce.direccion AS direccionCentro,
            ce.telefono AS telefonoCentro,
            GROUP_CONCAT(cu.nombreCurso) AS cursosImpartidos
        FROM 
            centros ce
        JOIN 
            cursosCentros cc ON ce.id = cc.id_centro
        JOIN 
            cursos cu ON cc.id_curso = cu.id
        GROUP BY 
            ce.id`, (err, rows) => {
            connection.release(); 
                    
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
                res.status(500).send('Error al obtener los centros');
            }
        });
    });
});

app.get("/infAlumnos", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error al obtener los alumnos');
            return;
        }
        console.log('Conectado con id ' + connection.threadId);
        connection.query(`SELECT 
        a.id AS idAlumno,
        a.nombre_completo AS nombreAlumno,
        a.correo AS correo,
        a.telefono AS telefono,
        c.nombreCurso AS curso,
        ac.nota AS nota
    FROM 
        alumnos AS a
    JOIN 
        alumnosCursos AS ac ON a.id = ac.id_alumno
    JOIN 
        cursos AS c ON ac.id_curso = c.id;
    
    
        `, (err, rows) => {
            connection.release(); 
                    
            if (!err) {
                res.json(rows); // Enviar los datos como un objeto JSON
            } else {
                console.log(err);
                res.status(500).send('Error al obtener los alumnos');
            }
        });
    });
});


app.delete("/eliminarAlumno/:id", (req, res) => {
    const idAlumno = req.params.id;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al conectar con la base de datos');
            return;
        }

        connection.beginTransaction(function(err) {
            if (err) {
                console.error(err);
                res.status(500).send('Error al iniciar la transacción');
                return;
            }

            connection.query('DELETE FROM alumnosCursos WHERE id_alumno = ?', idAlumno, function(err, result) {
                if (err) {
                    connection.rollback(function() {
                        console.error(err);
                        res.status(500).send('Error al eliminar los registros relacionados en la tabla alumnosCursos');
                        return;
                    });
                }

                connection.query('DELETE FROM alumnos WHERE id = ?', idAlumno, function(err, result) {
                    if (err) {
                        connection.rollback(function() {
                            console.error(err);
                            res.status(500).send('Error al eliminar el alumno');
                            return;
                        });
                    }

                    connection.commit(function(err) {
                        if (err) {
                            connection.rollback(function() {
                                console.error(err);
                                res.status(500).send('Error al confirmar la eliminación del alumno');
                                return;
                            });
                        }

                        console.log(`Alumno con ID ${idAlumno} eliminado correctamente`);
                        res.status(200).send('Alumno eliminado correctamente');
                    });
                });
            });
        });
    });
});


app.get("/ratioAprobados", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error al obtener el ratio de aprobados');
            return;
        }
        console.log('Conectado con id ' + connection.threadId);
        connection.query(`SELECT 
                c.nombreCurso AS curso,
                SUM(CASE WHEN ac.nota >= 5 THEN 1 ELSE 0 END) AS aprobados,
                COUNT(*) AS total_alumnos
            FROM 
                cursos c
            JOIN 
                alumnosCursos ac ON c.id = ac.id_curso
            GROUP BY 
                c.nombreCurso`, (err, rows) => {
            connection.release(); 
                    
            if (!err) {
                res.json(rows); // Enviar los datos como un objeto JSON
            } else {
                console.log(err);
                res.status(500).send('Error al obtener el ratio de aprobados');
            }
        });
    });
});


app.get('/obtenerCursos', (req, res) => {
    pool.query('SELECT id, nombreCurso FROM cursos', (error, results) => {
        if (error) {
            console.error('Error al obtener los cursos:', error);
            res.status(500).send('Error al obtener los cursos');
            return;
        }
        res.json(results);
    });
});

// Ruta para obtener la información de un curso específico
app.get('/obtenerCurso/:idCurso', (req, res) => {
    const idCurso = req.params.idCurso;
    pool.query('SELECT * FROM cursos WHERE id = ?', idCurso, (error, results) => {
        if (error) {
            console.error('Error al obtener el curso:', error);
            res.status(500).send('Error al obtener el curso');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('Curso no encontrado');
            return;
        }
        res.json(results[0]);
    });
});

// Ruta para actualizar la información de un curso
app.put('/actualizarCurso/:idCurso', (req, res) => {
    const idCurso = req.params.idCurso;
    const nuevoCurso = req.body;

    pool.query('UPDATE cursos SET ? WHERE id = ?', [nuevoCurso, idCurso], (error, results) => {
        if (error) {
            console.error('Error al actualizar el curso:', error);
            res.status(500).send('Error al actualizar el curso');
            return;
        }
        res.send('Curso actualizado correctamente');
    });
});



app.listen(port, () => {
    console.log('App escuchando en el puerto 3001');
});
