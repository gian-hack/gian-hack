# Caseificio Perrusio · grafiche

Grafiche costruite sulla [scheda del marchio](Scheda-marchio-Caseificio-Perrusio.pdf).

- `logo/`: loghi originale, crema e marrone (estratti dalla scheda, bassa risoluzione: sostituire con i file originali per la stampa)
- `fonts/`: Karla e Gelasio (gratuiti, Gelasio ha le stesse misure di Georgia)
- `grafiche/`: modelli HTML + un file `.json` con i testi di ogni grafica
- `esportate/`: PNG e PDF pronti

## Creare o aggiornare una grafica

1. Modifica i testi e i prezzi nel `.json` (es. `grafiche/offerta-marmellata.json`). Un campo vuoto viene nascosto.
2. Esporta:

```
node caseificio/render.js grafiche/offerta.html grafiche/offerta-marmellata.json
```

Escono post 1080×1080, storia 1080×1920 e locandina A4 (PNG a 300 dpi + PDF).
