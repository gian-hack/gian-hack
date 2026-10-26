// Uso: node caseificio/render.js grafiche/offerta.html grafiche/offerta-marmellata.json
// Crea in caseificio/esportate/<nome>/ i PNG per post e storia e la locandina A4 in PNG e PDF.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const radice = __dirname;
const [modello, dati] = process.argv.slice(2);
if (!modello || !dati) { console.error("Uso: node render.js <modello.html> <dati.json>"); process.exit(1); }
const nome = path.basename(dati, ".json");
const uscita = path.join(radice, "esportate", nome);
fs.mkdirSync(uscita, { recursive: true });

const tipi = { ".html": "text/html", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  const file = path.join(radice, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!file.startsWith(radice) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": tipi[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

const formati = [
  { f: "post", w: 1080, h: 1080 },
  { f: "story", w: 1080, h: 1920 },
  { f: "a4", w: 2480, h: 3508, pdf: true },
];

server.listen(0, async () => {
  const base = `http://localhost:${server.address().port}`;
  const browser = await chromium.launch();
  for (const { f, w, h, pdf } of formati) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const dir = path.posix.dirname(modello);
    await page.goto(`${base}/${modello}?f=${f}&dati=${path.posix.relative(dir, dati)}`);
    await page.waitForSelector("body[data-pronto]");
    await page.screenshot({ path: path.join(uscita, `${nome}-${f}.png`), clip: { x: 0, y: 0, width: w, height: h } });
    if (pdf) {
      // A4 vero: la tela da 2480 px viene scalata a 210 mm
      await page.emulateMedia({ media: "screen" });
      await page.addStyleTag({ content: "@page{size:A4;margin:0} html,body{width:2480px;height:3508px;overflow:hidden}" });
      await page.pdf({ path: path.join(uscita, `${nome}-a4.pdf`), format: "A4", printBackground: true, scale: 793.7 / 2480, pageRanges: "1" });
    }
    await page.close();
    console.log("ok", f);
  }
  await browser.close();
  server.close();
});
