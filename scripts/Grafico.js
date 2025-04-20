// grafico.js
function renderizar_grafico(data, minCap, maxCap, años) {
  const labels = Array.from({ length: años * 12 }, (_, i) => {
    const mes = monthNames[(indiceMesActual + i) % 12];
    const año = new Date().getFullYear() + Math.floor((indiceMesActual + i) / 12);
    return `${mes} ${año}`;
  });

  if (instanciaGrafico) instanciaGrafico.destroy();
  const ctx = document.getElementById("resultChart").getContext("2d");
  instanciaGrafico = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Carga por Analista",
          data,
          borderColor: "#0d6efd",
          backgroundColor: "rgba(13,110,253,0.2)",
          fill: true,
          tension: 0.3
        },
        {
          label: "Capacidad Máxima",
          data: Array(data.length).fill(maxCap),
          borderDash: [5,5],
          borderColor: "#dc3545",
          fill: false
        },
        {
          label: "Capacidad Mínima",
          data: Array(data.length).fill(minCap),
          borderDash: [5,5],
          borderColor: "#198754",
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      animation: { duration: 1000, easing: "easeOutQuart" }
    }
  });
}

function renderizar_comparativo(datasets, simulaciones) {
  const años = simulaciones[0].añosASimular;
  const labels = Array.from({ length: años * 12 }, (_, i) => {
    const mes = monthNames[(indiceMesActual + i) % 12];
    const año = new Date().getFullYear() + Math.floor((indiceMesActual + i) / 12);
    return `${mes} ${año}`;
  });

  if (instanciaGrafico) instanciaGrafico.destroy();
  const ctx = document.getElementById("resultChart").getContext("2d");
  // Líneas de capacidad por cada simulación
  const capacityLines = simulaciones.flatMap((sim, idx) => [
    {
      label: `Capacidad Máx S${idx+1}`,
      data: Array(labels.length).fill(sim.capacidadMaxima),
      borderDash: [5,5],
      borderColor: idx===0? "#dc3545" : "#ff6384",
      pointRadius: 0, fill:false
    },
    {
      label: `Capacidad Mín S${idx+1}`,
      data: Array(labels.length).fill(sim.capacidadMinima),
      borderDash: [5,5],
      borderColor: idx===0? "#198754" : "#4bc0c0",
      pointRadius: 0, fill:false
    }
  ]);

  instanciaGrafico = new Chart(ctx, {
    type: "line",
    data: { labels, datasets: [...datasets, ...capacityLines] },
    options: {
      responsive: true,
      animation: { duration: 1000 },
      plugins: { legend: { position: "top" } }
    }
  });
}
