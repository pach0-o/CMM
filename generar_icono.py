"""Genera cmm/icono.png (180x180), el ícono de Bidii en la pantalla de inicio del iPhone:
un dorsal blanco hueso con sus 2 agujeros de alfiler y 3 puntos rojos subiendo (3 días de racha).
Ejecutar:  python cmm/generar_icono.py
"""
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Circle  # noqa: E402

FONDO = "#f3f2ef"
LINEA = "#dedcd6"
ROJO_PISTA = "#c8442b"

fig = plt.figure(figsize=(1.8, 1.8), dpi=100)
fig.patch.set_facecolor(FONDO)  # iOS redondea las esquinas solo
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, 180)
ax.set_ylim(0, 180)
ax.axis("off")

# Agujeros del alfiler (arriba, como en un dorsal)
for x in (24, 156):
    ax.add_patch(Circle((x, 156), 8, color=LINEA))

# Tres puntos subiendo como escalones (coordenadas: x, y desde abajo)
for x, y in ((52, 62), (90, 84), (128, 106)):
    ax.add_patch(Circle((x, y), 15, color=ROJO_PISTA))

destino = Path(__file__).resolve().parent / "icono.png"
fig.savefig(destino, dpi=100, facecolor=FONDO)
print(f"Listo: {destino.name}")
