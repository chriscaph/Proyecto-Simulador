// utils.js
function generar_color_aleatorio() {
    const r = Math.floor(Math.random()*200);
    const g = Math.floor(Math.random()*200);
    const b = Math.floor(Math.random()*200);
    return `rgb(${r},${g},${b})`;
  }