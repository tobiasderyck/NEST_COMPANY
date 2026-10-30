import serviceData from '../../content/services.json';
import editorialData from '../../content/editorial.json';
export const services = serviceData.items;
export const editorial = editorialData.items;
export const url = (slug: string) => `/${slug}/`;
export const asset = (name: string) => `/assets/web/${name}.webp`;
export const srcset = (name: string) => `/assets/web/${name}-800.webp 800w, /assets/web/${name}-1280.webp 1280w, /assets/web/${name}.webp 1700w`;
export const serviceById = (id: string) => services.find(s => s.slug.split('/').pop() === id);
export const groups = [
 {id:'dak',name:'Dakwerken',line:'De basis van een goed nest.',image:'dak-lucht',url:'/dakwerken/'},
 {id:'energie',name:'Energieoplossingen',line:'Meer doen met je eigen energie.',image:'leuven',url:'/energieoplossingen/'},
 {id:'gevel',name:'Gevelrenovatie',line:'Een vertrouwd huis. Een nieuw gezicht.',image:'k4_gevel',url:'/gevelrenovatie/'},
 {id:'totaal',name:'Totaalrenovatie',line:'Veel plannen. Eén geheel.',image:'werf',url:'/totaalrenovatie/'}
];
export const contact = {phone:'0492 86 42 02',tel:'+32492864202',email:'info@nestcompany.be'};
export const team = [
 ['Tessa','Backoffice'],['Glenn','Elektricien'],['Frederic','Elektricien'],['Christophe','Dakwerker'],
 ['Jeroen','Energiearchitect'],['Ruben','Elektricien'],['Danny','Projectleiding dakwerken'],['Peter','Dakwerker']
];
