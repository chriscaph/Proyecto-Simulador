// historial.js
function agregar_al_historial(simulacion, idx) {
  const tbody = document.getElementById("simulationHistoryTableBody");
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>
      <input type="checkbox" class="form-check-input compare-check"
             value="${idx}" onchange="comparar_seleccionadas()">
    </td>
    <td><strong>Simulación ${idx+1}</strong></td>
    <td>${simulacion.clientesIniciales.toLocaleString()}</td>
    <td>${simulacion.crecimientoMensual.toFixed(2)}%</td>
    <td>${simulacion.diasFacturacion}</td>
    <td>${simulacion.analistas ?? "Calculado"}</td>
    <td>${simulacion.porcentajeRevision.toFixed(2)}%</td>
    <td>${simulacion.capacidadMinima}/${simulacion.capacidadMaxima}</td>
    <td>${simulacion.añosASimular}</td>
    <td>
      <button class="btn btn-sm btn-outline-primary"
              onclick="cargar_simulacion(${idx})">Editar</button>
    </td>`;
  tbody.appendChild(tr);
}

function cargar_simulacion(idx) {
  const sim = historialSimulaciones[idx];
  [
    ["initialClients",    sim.clientesIniciales],
    ["monthlyGrowth",     sim.crecimientoMensual],
    ["billingDays",       sim.diasFacturacion],
    ["analysts",          sim.analistas],
    ["reviewPercentage",  sim.porcentajeRevision],
    ["minCapacity",       sim.capacidadMinima],
    ["maxCapacity",       sim.capacidadMaxima],
    ["yearsToSimulate",   sim.añosASimular]
  ].forEach(([id, val]) => {
    document.getElementById(id).value = val;
  });
  document.getElementById("simulatorForm")
          .scrollIntoView({ behavior: "smooth" });
}

function comparar_seleccionadas() {
  const checks = Array.from(document.querySelectorAll(".compare-check"));
  const triggered = checks.find(cb => cb === document.activeElement);
  if (!triggered) return;

  const idx = parseInt(triggered.value,10);
  if (triggered.checked) {
    seleccionadosOrden.push(idx);
  } else {
    seleccionadosOrden = seleccionadosOrden.filter(i => i!==idx);
  }
  if (seleccionadosOrden.length > 2) {
    const drop = seleccionadosOrden.shift();
    checks.find(cb => parseInt(cb.value,10)===drop).checked = false;
  }
  const selec = checks.filter(cb => cb.checked)
                      .map(cb => historialSimulaciones[cb.value]);
  if (selec.length) {
    const datasets = selec.map((sim, i) => {
      let clientes = sim.clientesIniciales;
      const data = [];
      for (let m=0; m<sim.añosASimular*12; m++) {
        clientes *= (1 + sim.crecimientoMensual/100);
        const rev = clientes * (sim.porcentajeRevision/100);
        data.push(Math.ceil(rev / (sim.diasFacturacion * sim.analistas)));
      }
      return {
        label: `Sim ${i+1}`,
        data,
        borderColor: generar_color_aleatorio(),
        fill:false,
        tension:0.3
      };
    });
    renderizar_comparativo(datasets, selec);
  }
}

function exportar_a_excel() {
  if (!historialSimulaciones.length) {
    alert("No hay simulaciones para exportar.");
    return;
  }
  const header = "clientesIniciales,crecimientoMensual,diasFacturacion,analistas,porcentajeRevision,capacidadMinima,capacidadMaxima,añosASimular";
  const rows = historialSimulaciones
                .map(sim => [
                  sim.clientesIniciales,
                  sim.crecimientoMensual,
                  sim.diasFacturacion,
                  sim.analistas ?? "",
                  sim.porcentajeRevision,
                  sim.capacidadMinima,
                  sim.capacidadMaxima,
                  sim.añosASimular
                ].join(","))
                .join("\n");
  const blob = new Blob([header+"\n"+rows], { type:"text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "historial_simulaciones.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function importar_csv(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const lines = ev.target.result.split("\n").filter(l=>l.trim());
    const [, ...data] = lines;
    historialSimulaciones.length = 0;
    document.getElementById("simulationHistoryTableBody").innerHTML = "";
    data.forEach((ln, i) => {
      const [ci,cg,df,an,pr,minC,maxC,añ] = ln.split(",");
      const sim = {
        clientesIniciales:  Number(ci),
        crecimientoMensual: Number(cg),
        diasFacturacion:    Number(df),
        analistas:          an?Number(an):null,
        porcentajeRevision: Number(pr),
        capacidadMinima:    Number(minC),
        capacidadMaxima:    Number(maxC),
        añosASimular:       Number(añ)
      };
      historialSimulaciones.push(sim);
      agregar_al_historial(sim, i);
    });
    alert("Historial cargado exitosamente.");
  };
  reader.readAsText(file);
}
