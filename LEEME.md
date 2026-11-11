# Bidii (antes CMM · Coach Media Maratón)

La marca es **Bidii** (ver `docs/marca-y-negocio.md`); la carpeta, el repo y los atajos del iPhone siguen llamándose CMM.

Web app en **https://pach0-o.github.io/CMM/** (GitHub Pages, repo público `pach0-o/CMM`).
El código fuente vive en la carpeta `cmm/` del proyecto privado `claude-pruebas`; el repo CMM es solo una copia publicada.

## Publicar un cambio

Desde la carpeta de `claude-pruebas`, con el cambio ya en un commit:

```bash
git subtree split --prefix cmm -b cmm-pages
git push https://github.com/pach0-o/CMM.git cmm-pages:main
```

GitHub Pages tarda ~1 minuto en mostrar la versión nueva.

## Antes de publicar

- **Cambió el plan** (`plan_a_calendario.py`): corre `python cmm/generar_plan.py` para regenerar `plan.js`. Ese script solo funciona en `claude-pruebas`, no en el repo CMM.
- **Cambió la racha o la lectura de datos:** corre `node cmm/racha.test.js` y revisa que todo diga OK.
- **Cambió `coach.txt`:** no hay que tocar nada en el iPhone; el atajo lo descarga cada vez.
