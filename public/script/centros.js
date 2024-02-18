$(document).ready(function() {
    // Realizar la solicitud GET al servidor para obtener la información de los centros
    $.get("/infCentros", function(data) {
        if (data && data.length > 0) {
            $("#centros").empty();
            data.forEach(function(centro) {
                var centroDiv = $("<div>").addClass("centro").html(
                    `<p>Nombre: ${centro.lugarCentro}</p>
                    <p>Dirección: ${centro.direccionCentro}</p>
                    <p>Teléfono: ${centro.telefonoCentro}</p>
                    <p>Cursos Impartidos: ${centro.cursosImpartidos}</p>`
                );
                $("#centros").append(centroDiv);
            });
        } else {
            $("#centros").html("<p>No hay centros disponibles</p>");
        }
    });
});
