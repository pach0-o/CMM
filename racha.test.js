// Autoverificación de la racha. Ejecutar:  node cmm/racha.test.js
const assert = require("assert");
const { calcularRacha } = require("./racha.js");

// Semana 1 del plan: martes 17, jueves 19, sábado 21
const plan = [{ fecha: "2026-11-17" }, { fecha: "2026-11-19" }, { fecha: "2026-11-21" }];
const corri = (...fechas) => fechas.map((fecha) => ({ fecha }));

// Corre el martes: racha 1
assert.strictEqual(calcularRacha(plan, corri("2026-11-17"), "2026-11-17").racha, 1);

// Jueves sin correr, pero el viernes sí: cuenta por la regla flexible → 2
assert.strictEqual(calcularRacha(plan, corri("2026-11-17", "2026-11-20"), "2026-11-20").racha, 2);

// Viernes sin correr todavía: el jueves sigue "pendiente", no corta
const viernes = calcularRacha(plan, corri("2026-11-17"), "2026-11-20");
assert.strictEqual(viernes.racha, 1);
assert.strictEqual(viernes.estados[1].estado, "pendiente");

// Recién el sábado: el jueves venció → se corta y el sábado suma 1; la mejor queda en 1
const sabado = calcularRacha(plan, corri("2026-11-17", "2026-11-21"), "2026-11-21");
assert.deepStrictEqual([sabado.racha, sabado.mejor, sabado.estados[1].estado], [1, 1, "perdida"]);

// Dos entrenos el mismo día no suman doble
assert.strictEqual(calcularRacha(plan, corri("2026-11-17", "2026-11-17"), "2026-11-18").racha, 1);

// Sábado + domingo de carrera: el entreno del domingo cuenta para la carrera, no se lo "roba" el sábado
const final = [{ fecha: "2027-03-06" }, { fecha: "2027-03-07" }];
const carrera = calcularRacha(final, corri("2027-03-06", "2027-03-07"), "2027-03-07");
assert.strictEqual(carrera.racha, 2);

// Sin datos: racha 0, nada perdido antes de empezar
assert.strictEqual(calcularRacha(plan, [], "2026-11-12").racha, 0);

console.log("racha: 7 pruebas OK");

// --- Lectura del link que manda el atajo ---
const { leerEntrenos, numero } = require("./datos.js");
const aBase64 = (obj) => Buffer.from(JSON.stringify(obj), "utf-8").toString("base64");

const e1 = { fecha: "2026-11-17", km: "4,1 km", fc_media: "151 lpm", rodilla: "1", feedback: "Bien hecho 🔥 Z2 cumplida" };
const e2 = { fecha: "2026-11-19", km: 3.5 };
const link = "#d=" + encodeURIComponent(aBase64(e1) + "," + "basura!!" + "," + aBase64(e2));
const leidos = leerEntrenos(link);
assert.strictEqual(leidos.length, 2); // la línea dañada se ignora
assert.deepStrictEqual([leidos[0].km, leidos[0].fcMedia, leidos[0].rodilla], [4.1, 151, 1]);
assert.strictEqual(leidos[0].feedback, "Bien hecho 🔥 Z2 cumplida");
assert.deepStrictEqual(leerEntrenos(""), []);
assert.strictEqual(numero(""), null);
console.log("datos: 5 pruebas OK");
