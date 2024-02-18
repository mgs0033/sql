$(document).ready(function() {
    $.get('/ratioAprobados', function(data) {
      mostrarGrafico(data);
    }).fail(function(xhr, status, error) {
      console.error('Error al obtener el ratio de aprobados:', error);
    });
  });

  function mostrarGrafico(data) {
    var cursos = [];
    var ratios = [];

    data.forEach(function(curso) {
      cursos.push(curso.curso);
      var ratio = (curso.aprobados / curso.total_alumnos) * 100;
      ratios.push(ratio.toFixed(2)); // Redondear el ratio a 2 decimales
    });

    var ctx = document.getElementById('chart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: cursos,
        datasets: [{
          label: 'Ratio de Aprobados (%)',
          data: ratios,
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }