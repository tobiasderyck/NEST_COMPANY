// Verwerkt extra realisatiefoto's op dezelfde manier als de eerste reeks: rechtzetten, één kleurbehandeling, webformaten.
import sharp from "sharp"; import fs from "node:fs";
const I = process.argv[2] + "/";
const KEUZE = [
  { f: "2.jpg", slug: "victron-technische-ruimte", soort: "offgrid", alt: "Technische ruimte met drie Victron-omvormers, een Dyness-thuisbatterij en de zekeringkast", focus: "45% 40%" },
  { f: "3.jpg", slug: "victron-pylontech", soort: "offgrid", alt: "Drie Victron Quattro-omvormers op een zwart paneel, met Pylontech-batterijen ernaast", focus: "55% 45%", draai: -2 },
  { f: "4.jpg", slug: "leien-dakwerkers", soort: "dak", alt: "Twee dakwerkers leggen leien op een dak met dakramen, gezien vanaf de stelling", focus: "50% 45%" },
  { f: "5.jpg", slug: "stalen-dak", soort: "dak", alt: "Nieuw antraciet stalen dak met lichtstroken, met uitzicht over de wijk", focus: "50% 60%" },
  { f: "7.jpg", slug: "solis-dyness", soort: "batterij", alt: "Solis-omvormer met een Dyness-thuisbatterij tegen een wit geschilderde muur", focus: "55% 50%" },
  { f: "9.jpg", slug: "solis-pylontech", soort: "batterij", alt: "Solis-omvormer boven drie gestapelde Pylontech-batterijen", focus: "50% 55%" }
];
const klem = (v, a, z) => Math.min(z, Math.max(a, v));
async function graad(buf) {
  const { data, info } = await sharp(buf).resize(320, 320, { fit: "inside" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let r = 0, g = 0, b = 0, n = 0, l = 0;
  for (let i = 0; i < data.length; i += 3) { const y = .2126 * data[i] + .7152 * data[i + 1] + .0722 * data[i + 2]; l += y; if (y < 45 || y > 210) continue; r += data[i]; g += data[i + 1]; b += data[i + 2]; n++; }
  r /= n; g /= n; b /= n; const gem = (r + g + b) / 3, luma = l / (data.length / 3), bel = klem(122 / luma, .9, 1.16);
  return [gem * 1.025 / r, gem / g, gem * .955 / b].map(v => klem(v, .92, 1.08) * bel);
}
const fotos = JSON.parse(fs.readFileSync("src/data/fotos.json"));
for (const k of KEUZE) {
  let buf = await sharp(I + k.f).rotate().toBuffer(); let m = await sharp(buf).metadata();
  if (k.draai) {
    const t = Math.abs(k.draai) * Math.PI / 180, c = Math.cos(t), s = Math.sin(t), sch = Math.min(m.height / (m.height * c + m.width * s), m.width / (m.width * c + m.height * s));
    const w = Math.floor(m.width * sch), h = Math.floor(m.height * sch), g = await sharp(buf).rotate(k.draai, { background: "#000" }).toBuffer(), gm = await sharp(g).metadata();
    buf = await sharp(g).extract({ left: Math.floor((gm.width - w) / 2), top: Math.floor((gm.height - h) / 2), width: w, height: h }).toBuffer(); m = await sharp(buf).metadata();
  }
  const uit = await sharp(buf).linear(await graad(buf), [0, 0, 0]).modulate({ saturation: .86 }).linear(1.04, -5).toBuffer();
  await sharp(uit).webp({ quality: 88 }).toFile(`bron/realisaties-bewerkt/${k.slug}.webp`);
  const b = [Math.min(800, m.width), Math.min(1280, m.width), Math.min(1700, m.width)];
  await sharp(uit).resize(b[2]).webp({ quality: 80 }).toFile(`public/assets/web/${k.slug}.webp`);
  await sharp(uit).resize(b[1]).webp({ quality: 76 }).toFile(`public/assets/web/${k.slug}-1280.webp`);
  await sharp(uit).resize(b[0]).webp({ quality: 76 }).toFile(`public/assets/web/${k.slug}-800.webp`);
  await sharp(uit).resize(240).webp({ quality: 72 }).toFile(`public/assets/web/${k.slug}-240.webp`);
  fotos[k.slug] = { alt: k.alt, focus: k.focus, soort: k.soort, staand: m.height > m.width, b, h: Math.round(m.height * b[2] / m.width), w: b[2] };
  console.log(k.slug, m.width + "x" + m.height);
}
fs.writeFileSync("src/data/fotos.json", JSON.stringify(fotos, null, 1) + "\n");
