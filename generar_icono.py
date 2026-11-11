"""Genera cmm/icono.png (180x180), el ícono que aparece en la pantalla de inicio del iPhone.
Ejecutar:  python cmm/generar_icono.py
"""
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

ROJO_PISTA = "#c8442b"
fig = plt.figure(figsize=(1.8, 1.8), dpi=100)
fig.patch.set_facecolor(ROJO_PISTA)  # iOS redondea las esquinas solo
fig.text(0.5, 0.56, "CMM", ha="center", va="center", color="white", fontsize=34, fontweight="bold", family="DejaVu Sans")
fig.text(0.5, 0.25, "21K", ha="center", va="center", color="white", fontsize=14, alpha=0.85, family="DejaVu Sans")
destino = Path(__file__).resolve().parent / "icono.png"
fig.savefig(destino, dpi=100, facecolor=ROJO_PISTA)
print(f"Listo: {destino.name}")
