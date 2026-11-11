"""Genera cmm/icono.png (180x180), el ícono de Bidii en la pantalla de inicio del iPhone:
"bi" en Barlow Condensed sobre fondo oscuro, con el punto de la i en rojo de pista (como en el logo).
Ejecutar:  .venv/Scripts/python.exe cmm/generar_icono.py
"""
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.font_manager import FontProperties  # noqa: E402
from matplotlib.patches import Circle, PathPatch  # noqa: E402
from matplotlib.textpath import TextPath  # noqa: E402

CARPETA = Path(__file__).resolve().parent
FONDO = "#1d2126"   # tinta de la app
LETRA = "#f3f2ef"   # fondo de la app
ROJO_PISTA = "#c8442b"
LADO = 180

fuente = FontProperties(fname=CARPETA / "fuentes" / "BarlowCondensed-ExtraBold.ttf")
# "ı" es la i sin punto: el punto lo dibujamos aparte, en rojo
letras = TextPath((0, 0), "bı", size=150, prop=fuente)
caja = letras.get_extents()
i_sola = TextPath((0, 0), "ı", size=150, prop=fuente).get_extents()
assert caja.width > 0 and i_sola.width > 0, "No se pudo leer la fuente"

diametro = i_sola.width * 1.1  # el punto, apenas más ancho que el palo de la i
hueco = i_sola.width * 0.35    # espacio entre el palo y el punto
punto_tope = i_sola.y1 + hueco + diametro  # la i es más baja que la b: el punto va sobre la i
alto_total = max(caja.y1, punto_tope) - caja.y0

# Centrar el conjunto (letras + punto) en el cuadro
dx = (LADO - caja.width) / 2 - caja.x0
dy = (LADO - alto_total) / 2 - caja.y0

fig = plt.figure(figsize=(1.8, 1.8), dpi=100)
fig.patch.set_facecolor(FONDO)  # iOS redondea las esquinas solo
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, LADO)
ax.set_ylim(0, LADO)
ax.axis("off")
ax.add_patch(PathPatch(letras.transformed(matplotlib.transforms.Affine2D().translate(dx, dy)), color=LETRA, lw=0))

# Punto rojo centrado sobre la i (la i es la última letra: termina en el borde derecho)
centro_x = dx + caja.x1 - i_sola.width / 2
centro_y = dy + i_sola.y1 + hueco + diametro / 2
ax.add_patch(Circle((centro_x, centro_y), diametro / 2, color=ROJO_PISTA))

destino = CARPETA / "icono.png"
fig.savefig(destino, dpi=100, facecolor=FONDO)
print(f"Listo: {destino.name}")
