// simulacion.js
function ejecutar_simulacion() {
  // Lectura de inputs
  const clientesIniciales   = parseFloat(document.getElementById("initialClients").value);
  const crecimientoMensual  = parseFloat(document.getElementById("monthlyGrowth").value) / 100;
  const diasFacturacion     = parseInt  (document.getElementById("billingDays").value, 10);
  const porcentajeRevision  = parseFloat(document.getElementById("reviewPercentage").value) / 100;
  const capacidadMinima     = parseInt  (document.getElementById("minCapacity").value, 10);
  const capacidadMaxima     = parseInt  (document.getElementById("maxCapacity").value, 10);
  const añosASimular        = parseInt  (document.getElementById("yearsToSimulate").value, 10);

  // VALIDACIÓN: capacidad mínima debe ser menor que la máxima
  if (capacidadMinima > capacidadMaxima) {
    alert("La capacidad mínima diaria debe ser menor o igual que la capacidad máxima.");
    return;
  }

  let analistas = (() => {
    const val = document.getElementById("analysts").value;
    return val === "" ? null : parseInt(val, 10);
  })();

  const totalMeses = añosASimular * 12;
  const cargasMensuales = [];
  const cuerpoTabla = document.getElementById("resultsTableBody");
  cuerpoTabla.innerHTML = "";

  // Cálculo automático de analistas si no hay valor o ≤ 0
  if (!analistas || analistas <= 0) {
    let maxCarga = 0;
    let tempClientes = clientesIniciales;
    for (let i = 0; i < totalMeses; i++) {
      tempClientes *= (1 + crecimientoMensual);
      const rev = tempClientes * porcentajeRevision;
      const cargaMes = Math.ceil(rev / diasFacturacion);
      maxCarga = Math.max(maxCarga, cargaMes);
    }
    analistas = Math.ceil(maxCarga / capacidadMaxima);
    document.getElementById("analysts").value = analistas;
  }

  // Bucle principal: generar filas y array de cargas
  let clientes = clientesIniciales;
  for (let i = 0; i < totalMeses; i++) {
    const mesIdx = (indiceMesActual + i) % 12;
    const año    = new Date().getFullYear() + Math.floor((indiceMesActual + i) / 12);
    const mesStr = monthNames[mesIdx];

    clientes *= (1 + crecimientoMensual);
    const rev       = clientes * porcentajeRevision;
    const carga     = Math.ceil(rev / (diasFacturacion * analistas));
    const excedeStr = carga > capacidadMaxima ? "Sí" : "No";

    cargasMensuales.push(carga);

    cuerpoTabla.innerHTML += `
      <tr>
        <td>${año}</td>
        <td>${mesStr}</td>
        <td>${Math.ceil(clientes).toLocaleString()}</td>
        <td>${Math.ceil(rev).toLocaleString()}</td>
        <td>${carga}</td>
        <td>${excedeStr}</td>
      </tr>`;
  }

  // Gráfico y historial
  renderizar_grafico(cargasMensuales, capacidadMinima, capacidadMaxima, añosASimular);
  const nuevaSim = {
    clientesIniciales,
    crecimientoMensual: crecimientoMensual * 100,
    diasFacturacion,
    analistas,
    porcentajeRevision: porcentajeRevision * 100,
    capacidadMinima,
    capacidadMaxima,
    añosASimular
  };
  historialSimulaciones.push(nuevaSim);
  agregar_al_historial(nuevaSim, historialSimulaciones.length - 1);
}
