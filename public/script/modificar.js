$(document).ready(function() {
    // Cargar la lista de cursos al cargar la página
    cargarCursos();
  
    // Evento al cambiar la selección del curso
    $('#selectCurso').change(function() {
      var idCurso = $(this).val();
      if (idCurso !== '') {
        obtenerCurso(idCurso);
      }
    });
  
    // Evento al hacer clic en el botón "Actualizar Curso"
    $('#actualizarCurso').click(function() {
      actualizarCurso();
    });
  });
  
  function cargarCursos() {
    $.get('/obtenerCursos', function(cursos) {
      $('#selectCurso').empty().append('<option value="">Selecciona un curso</option>');
      cursos.forEach(function(curso) {
        $('#selectCurso').append('<option value="' + curso.id + '">' + curso.nombreCurso + '</option>');
      });
    });
  }
  
  function obtenerCurso(idCurso) {
    $.get('/obtenerCurso/' + idCurso, function(curso) {
      $('#nombreCurso').val(curso.nombreCurso);
      $('#nivelCurso').val(curso.nivel);
      $('#descripcionCurso').val(curso.descripcion);
      $('#fechaCurso').val(curso.fecha_importacion);
      $('#lugarCurso').val(curso.lugar);
    });
  }
  
  function actualizarCurso() {
    var idCurso = $('#selectCurso').val();
    var nombreCurso = $('#nombreCurso').val();
    var nivelCurso = $('#nivelCurso').val();
    var descripcionCurso = $('#descripcionCurso').val();
    var fechaCurso = $('#fechaCurso').val();
    var lugarCurso = $('#lugarCurso').val();
  
    $.ajax({
      url: '/actualizarCurso/' + idCurso,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        nombreCurso: nombreCurso,
        nivel: nivelCurso,
        descripcion: descripcionCurso,
        fecha_importacion: fechaCurso,
        lugar: lugarCurso
      }),
      success: function(response) {
        console.log('Curso actualizado correctamente');
        // Limpia el formulario después de la actualización
        $('#formularioCurso')[0].reset();
        // Vuelve a cargar la lista de cursos para actualizarla
        cargarCursos();
      },
      error: function(xhr, status, error) {
        console.error('Error al actualizar el curso:', error);
      }
    });
  }
  