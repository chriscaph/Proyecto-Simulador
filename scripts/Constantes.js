// Constantes.js
// Nombres de los meses
const monthNames = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];
  
  // Índice del mes siguiente al actual (0–11)
  const indiceMesActual = (new Date().getMonth() + 1) % 12;
  