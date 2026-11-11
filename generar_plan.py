"""Genera cmm/plan.js (las sesiones del plan) a partir de plan_a_calendario.py.

Así el plan vive en un solo lugar: si cambias SEMANAS allá, vuelves a correr esto.
Ejecutar (desde la carpeta del proyecto):  python cmm/generar_plan.py
"""
import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ))
from plan_a_calendario import eventos  # noqa: E402

sesiones = [
    {"fecha": dia.isoformat(), "titulo": titulo, "hora": hora[:2] + ":" + hora[2:4] if hora else None}
    for dia, titulo, _nota, hora in eventos()
]
assert len(sesiones) == 49 and sesiones[0]["fecha"] == "2026-11-17" and sesiones[-1]["fecha"] == "2027-03-07"

# Se guarda como .js (no .json) para que la web app lo cargue con <script> sin depender de fetch
destino = RAIZ / "cmm" / "plan.js"
destino.write_text("window.PLAN = " + json.dumps(sesiones, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
print(f"Listo: {len(sesiones)} sesiones en {destino.name}")
