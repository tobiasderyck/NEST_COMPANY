import serviceData from '../../content/services.json';
import editorialData from '../../content/editorial.json';
export const services = serviceData.items;
export const editorial = editorialData.items;
export const url = (slug: string) => `/${slug}/`;
// Laatste woord van een titel apart, voor de oranje nadruk (zoals op de homepage).
export const nadruk = (titel: string) => { const i = titel.trimEnd().lastIndexOf(' '); return i < 0 ? ['', titel] : [titel.slice(0, i + 1), titel.slice(i + 1)]; };
export const asset = (name: string) => `/assets/web/${name}.webp`;
import fotoData from './fotos.json';
export const fotos: Record<string, { alt: string; focus: string; soort: string; staand: boolean; b: number[]; w: number; h: number }> = fotoData;
export const srcset = (name: string) => {
  const b = fotos[name]?.b ?? [800, 1280, 1700];
  const delen = [`/assets/web/${name}-800.webp ${b[0]}w`, `/assets/web/${name}-1280.webp ${b[1]}w`, `/assets/web/${name}.webp ${b[2]}w`];
  return delen.filter((d, i) => i === 0 || b[i] > b[i - 1]).join(', ');
};
export const fotoAlt = (name: string) => fotos[name]?.alt;
export const serviceById = (id: string) => services.find(s => s.slug.split('/').pop() === id);
export const groups = [
 {id:'dak',name:'Dakwerken',line:'De basis van een goed nest.',image:'gerenoveerd-dak',url:'/dakwerken/'},
 {id:'energie',name:'Energieoplossingen',line:'Meer doen met je eigen energie.',image:'pannendak-zonnepanelen',url:'/energieoplossingen/'},
 {id:'gevel',name:'Gevelrenovatie',line:'Een vertrouwd huis. Een nieuw gezicht.',image:'gevel-crepi',url:'/gevelrenovatie/'},
 {id:'totaal',name:'Totaalrenovatie',line:'Veel plannen. Eén geheel.',image:'werf',url:'/totaalrenovatie/'}
];
export const contact = {phone:'0492 86 42 02',tel:'+32492864202',email:'info@nestcompany.be'};
export const team = [
 ['Tessa','Backoffice'],['Glenn','Elektricien'],['Frederic','Elektricien'],['Christophe','Dakwerker'],
 ['Jeroen','Energiearchitect'],['Ruben','Elektricien'],['Danny','Projectleiding dakwerken'],['Peter','Dakwerker']
];
