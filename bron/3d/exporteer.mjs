// Zet de Blender-renders om naar webformaten voor de site: public/assets/huis/<naam>.webp en <naam>-800.webp
import sharp from "sharp"; import fs from "node:fs";
const IN = "bron/3d/renders/set/", UIT = "public/assets/huis/"; fs.mkdirSync(UIT, { recursive: true });
let totaal = 0;
// De schaduwvanger laat een heel lichte waas achter over het hele beeld; die halen we uit het alfakanaal,
// zodat het huis zonder zichtbare rand op de pagina staat.
async function zuiverBuf(pad, w) {
  const { data, info } = await sharp(pad).resize(w).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) data[i] = Math.max(0, Math.min(255, Math.round((data[i] - 13) * 1.054)));
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}
const wacht = [];
function zuiver(pad, w) { return { webp: o => ({ toFile: async uit => sharp(await zuiverBuf(pad, w)).webp(o).toFile(uit) }) }; }
for (const f of fs.readdirSync(IN).filter(x => x.endsWith(".png"))) {
  const n = f.replace(".png", ""), laag = /-(wp|steiger|laadpaal|bord|bank)$/.test(n);
  for (const [w, s] of [[1280, ""], [800, "-800"]]) {
    const i = await zuiver(IN + f, w).webp({ quality: laag ? 82 : 80, alphaQuality: 90, effort: 5 }).toFile(`${UIT}${n}${s}.webp`); totaal += i.size;
  }
}
console.log(fs.readdirSync(UIT).length, "bestanden,", (totaal / 1e6).toFixed(1), "MB");
