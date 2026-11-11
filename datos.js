// Lee los entrenos que manda el atajo en el link: #d=<base64>,<base64>,...
// Cada base64 es un JSON con un entreno (fecha, hora, sesion, km, fc_media, fc_max,
// pct_sobre_z2, rodilla, sensacion, feedback). El atajo los guarda en iCloud y manda todos cada vez.

function base64ATexto(b64) {
  const limpio = b64.replace(/\s/g, "").replace(/-/g, "+").replace(/_/g, "/");
  const binario = atob(limpio);
  const bytes = Uint8Array.from(binario, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes); // UTF-8, para tildes y emojis
}

// Atajos puede mandar "5,23 km" o "148 lpm": se toma el primer número y la coma decimal pasa a punto
function numero(valor) {
  if (typeof valor === "number") return valor;
  const encontrado = String(valor ?? "").replace(",", ".").match(/-?\d+(\.\d+)?/);
  return encontrado ? Number(encontrado[0]) : null;
}

// Pasa un entreno tal como lo arma el atajo (el mismo JSON viaja por el link o por el buzón) al formato de la app.
// Devuelve null si no tiene fecha válida: sin fecha no sirve para la racha.
function normalizar(e) {
  if (!e || !/^\d{4}-\d{2}-\d{2}$/.test(e.fecha)) return null;
  return {
    fecha: e.fecha,
    hora: e.hora || "",
    sesion: e.sesion || "",
    km: numero(e.km),
    fcMedia: numero(e.fc_media),
    fcMax: numero(e.fc_max),
    pctSobreZ2: numero(e.pct_sobre_z2),
    rodilla: numero(e.rodilla),
    sensacion: e.sensacion || "",
    feedback: e.feedback || "",
  };
}

function leerEntrenos(hash) {
  let crudo = (hash || "").replace(/^#/, "");
  if (!crudo.startsWith("d=")) return [];
  try { crudo = decodeURIComponent(crudo.slice(2)); } catch { crudo = crudo.slice(2); }
  const entrenos = [];
  for (const parte of crudo.split(/[,\n]/)) {
    if (!parte.trim()) continue;
    try {
      const e = normalizar(JSON.parse(base64ATexto(parte)));
      if (e) entrenos.push(e);
    } catch {
      // una línea dañada no debe botar las demás
    }
  }
  return entrenos;
}

if (typeof module !== "undefined") module.exports = { leerEntrenos, numero, normalizar };
