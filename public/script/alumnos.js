$(document).ready(function() {
    $.get('/infAlumnos', function(data) {
        mostrarAlumnos(data);
    }).fail(function(xhr, status, error) {
        console.error('Error al obtener la información de los alumnos:', error);
    });
});

function mostrarAlumnos(data) {
    $('#alumnosLista').empty();

    $.each(data, function(index, alumno) {
        var alumnoDiv = $('<div>').addClass('alumno');
        var nombreP = $('<p>').text('Nombre: ' + alumno.nombreAlumno);
        var correoP = $('<p>').text('Correo: ' + alumno.correo);
        var telefonoP = $('<p>').text('Teléfono: ' + alumno.telefono);
        var cursoP = $('<p>').text('Curso: ' + alumno.curso);
        var notaP = $('<p>').text('Nota: ' + alumno.nota);
        
        // Crear el botón para eliminar al alumno
        var btnEliminar = $('<button>').text('Eliminar').click(function() {
            eliminarAlumno(alumno.idAlumno);
        });
        
        // Agregar los elementos al div del alumno
        alumnoDiv.append(nombreP, correoP, telefonoP, cursoP, notaP, btnEliminar);
        
        // Agregar el div del alumno al elemento "alumnosLista"
        $('#alumnosLista').append(alumnoDiv);
    });
}

function eliminarAlumno(idAlumno) {
    // Hacer una solicitud DELETE al servidor para eliminar al alumno por su ID
    $.ajax({
        url: '/eliminarAlumno/' + idAlumno,
        type: 'DELETE',
        success: function(response) {
            console.log('Alumno eliminado correctamente');
            // Actualizar la lista de alumnos después de eliminar uno
            $.get('/infAlumnos', function(data) {
                mostrarAlumnos(data);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error al eliminar el alumno:', error);
        }
    });
}
