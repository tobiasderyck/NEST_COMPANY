// Zet juridische platte tekst om naar HTML.
// Lege regel = nieuwe alinea; een regel die met "- " begint = opsomming. Mails en vaste begrippen worden links.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const koppel = (s) => esc(s)
  .replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>')
  .replace(/\b(www\.gegevensbeschermingsautoriteit\.be)\b/g, '<a href="https://$1" target="_blank" rel="noopener">$1</a>')
  .replace(/\b(cookiebeleid)\b/g, '<a href="/cookies/">$1</a>')
  .replace(/\b(privacyverklaring)\b/g, '<a href="/privacy/">$1</a>')
  .replace(/\b(algemene voorwaarden)\b/g, '<a href="/algemene-voorwaarden/">$1</a>');
export const naarHtml = (tekst) => tekst.split(/\n{2,}/).map((alinea) => {
  const regels = alinea.split('\n');
  const lijst = regels.filter((r) => r.startsWith('- '));
  const rest = regels.filter((r) => !r.startsWith('- ')).join(' ').trim();
  return (rest ? '<p>' + koppel(rest) + '</p>' : '') +
    (lijst.length ? '<ul>' + lijst.map((r) => '<li>' + koppel(r.slice(2)) + '</li>').join('') + '</ul>' : '');
}).join('');
