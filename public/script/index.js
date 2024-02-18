$(document).ready(function() {
    $.get("/infCursos", function(data) {
        // Manejar los datos recibidos
        if (data && data.length > 0) {
            $("#cursos").empty();
            data.forEach(function(curso) {
                var cursoDiv = $("<div>").addClass("curso").html(
                    `
                    <p>Nombre: ${curso.nombreCurso}</p>
                    <p>Nivel academico: ${curso.nivel}</p>
                    <p>Descripcióndel curso: ${curso.descripcion}</p>
                    <p>Fecha en la que se empezo a impartir: ${curso.fecha_importacion}</p>
                    <p>Instituto en el que se imparte: ${curso.lugar}</p>
                );
                $("#cursos").append(cursoDiv);
            });
        } else {
            // Manejar el caso en que no se encuentren cursos
            $("#cursos").html("<p>No hay cursos disponibles</p>");
        }
    });
});
function mostrarAlumnos(idCurso) {
    window.location.href = `/alumnos/${idCurso}`;
}
