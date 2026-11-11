// Racha flexible del plan de media maratón.
// Regla: una sesión del plan cuenta si hay un entreno ese día, o el día siguiente
// cuando ese día siguiente no tiene sesión propia (un entreno cuenta primero para su propio día).
// Una sesión sin entreno se pierde recién cuando pasó su día de margen; mientras tanto queda "pendiente".

function sumarDias(fechaIso, dias) {
  const d = new Date(fechaIso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

// Menos de 1 km no es una salida a correr (ej. pesas en el gimnasio con el pulso alto): no tacha la cadena
const KM_MINIMO = 1;
const esSalidaACorrer = (e) => e.km == null || e.km >= KM_MINIMO; // sin dato de km se le cree al atajo

function calcularRacha(sesiones, entrenos, hoy) {
  const fechasEntreno = new Set(entrenos.filter(esSalidaACorrer).map((e) => e.fecha));
  const fechasSesion = new Set(sesiones.map((s) => s.fecha));
  const usadas = new Set();
  let racha = 0;
  let mejor = 0;
  const estados = [];

  for (const sesion of sesiones) {
    if (sesion.fecha > hoy) {
      estados.push({ ...sesion, estado: "futura" });
      continue;
    }
    const manana = sumarDias(sesion.fecha, 1);
    let entreno = null;
    if (fechasEntreno.has(sesion.fecha) && !usadas.has(sesion.fecha)) entreno = sesion.fecha;
    else if (fechasEntreno.has(manana) && !usadas.has(manana) && !fechasSesion.has(manana)) entreno = manana;

    let estado;
    if (entreno) {
      usadas.add(entreno);
      racha += 1;
      mejor = Math.max(mejor, racha);
      estado = "hecha";
    } else if (manana >= hoy) {
      estado = "pendiente"; // todavía está dentro de su margen: no corta la racha
    } else {
      estado = "perdida";
      racha = 0;
    }
    estados.push({ ...sesion, estado, entreno });
  }
  return { racha, mejor, estados };
}

if (typeof module !== "undefined") module.exports = { calcularRacha, sumarDias };
