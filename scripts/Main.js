// main.js
// Instancia de Chart.js
let instanciaGrafico = null;
// Orden para comparar hasta dos simulaciones
let seleccionadosOrden = [];
// Historial en memoria
const historialSimulaciones = [];

// Al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("simulatorForm")
    .addEventListener("submit", e => {
      e.preventDefault();
      ejecutar_simulacion();
    });

  document
    .getElementById("csvImportInput")
    .addEventListener("change", importar_csv);

  // Hacer accesibles estas funciones desde los botones del HTML
  window.exportar_a_excel = exportar_a_excel;
  window.limpiar_campos    = limpiar_campos;
});

/**
 * Resetea el formulario, destruye el gráfico y limpia la tabla de resultados.
 */
function limpiar_campos() {
  // Reinicia todos los inputs del formulario
  document.getElementById("simulatorForm").reset();

  // Destruye la instancia previa del gráfico si existe
  if (instanciaGrafico) {
    instanciaGrafico.destroy();
    instanciaGrafico = null;
  }

  // Limpia la tabla de resultados
  const cuerpoResultados = document.getElementById("resultsTableBody");
  if (cuerpoResultados) cuerpoResultados.innerHTML = "";
}