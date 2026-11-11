import { defineConfig, type TinaField } from 'tinacms';

const text = (name:string,label:string,multiline=false):TinaField => ({type:'string',name,label,...(multiline?{ui:{component:'textarea'}}:{})});
const list = (name:string,label:string):TinaField => ({type:'string',name,label,list:true});
const chapters:TinaField = {type:'object',name:'sections',label:'Inhoudelijke hoofdstukken',list:true,ui:{itemProps:(item)=>({label:item?.title||'Hoofdstuk'})},fields:[text('title','Titel'),text('text','Tekst',true),list('items','Opsomming (optioneel)')]};
const common:TinaField[] = [
 {...text('slug','Pagina-adres'),required:true,description:'Behoud dit adres bij tekstwijzigingen. Andere pagina’s verwijzen hiernaar.'},
 {...text('title','Naam'),required:true},text('headline','Grote titel'),text('summary','Korte beschrijving',true),
 {...text('image','Beeld'),options:['pannendak-zonnepanelen','nieuwbouw-zonnepanelen','villa-zonnepanelen','plat-dak-zonnepanelen','zonnepanelen-blauwe-lucht','gerenoveerd-dak','dakrenovatie-werf','dakwerkers-drone','dakwerkers-onderdak','thuisbatterij','laadpaal','airco-zolder','airco-buitenunit','nest-bestelwagen','leuven','dak-lucht','werf','kempen','zolder','k1_oud','k2_dak','k3_zon','k4_gevel','k5_nest']},
 chapters,text('question','Afsluitende vraag'),text('cta','Tekst bij de adviesknop',true)
];
const collection = (name:string,label:string,fields:TinaField[]) => ({
 name,label,path:'content',format:'json' as const,match:{include:name},
 ui:{allowedActions:{create:false,delete:false}},
 fields:[{type:'object' as const,name:'items',label:'Pagina’s',list:true,ui:{itemProps:(item:any)=>({label:item?.title||'Pagina'})},fields}]
});

export default defineConfig({
 branch:process.env.GITHUB_BRANCH||process.env.HEAD||'main',
 clientId:process.env.NEXT_PUBLIC_TINA_CLIENT_ID||null,
 token:process.env.TINA_TOKEN||null,
 build:{outputFolder:'admin',publicFolder:'public'},
 media:{tina:{mediaRoot:'assets',publicFolder:'public'}},
 schema:{collections:[
  collection('services','Diensten',[
   ...common,
   {...text('group','Categorie'),options:[{label:'Dakwerken',value:'dak'},{label:'Energieoplossingen',value:'energie'},{label:'Gevelrenovatie',value:'gevel'},{label:'Totaalrenovatie',value:'totaal'}],required:true},
   text('imageAlt','Beschrijving van het beeld'),text('intro','Introductie',true),list('benefits','Voordelen'),list('brands','Merken'),
   {...list('related','Gerelateerde diensten'),description:'Laatste deel van het pagina-adres, bijvoorbeeld thuisbatterijen.'},text('source','Interne bronnotitie')
  ]),
  collection('editorial','Begeleiding, team & projectverhalen',[
   ...common,{...text('kind','Soort pagina'),options:['guidance','story','team','case'],required:true}
  ]),
  {name:'homepage',label:'Homepage',path:'content',format:'json',match:{include:'homepage'},ui:{allowedActions:{create:false,delete:false}},fields:[
   {type:'object',name:'hero',label:'1. Bovenaan: het huis',fields:[
    text('regel1','Titel — eerste regel'),text('regel2','Titel — tweede regel'),
    {...text('nadruk','Uitgerekt woord'),description:'Dit woord uit de tweede regel wordt breed gezet, zoals het NEST-logo. Moet letterlijk in de tweede regel staan.'},
    text('tekst','Korte uitleg',true),text('knop','Tekst op de knop'),text('bewijs','Regel over de Google-score')
   ]},
   {type:'object',name:'delen',label:'1b. De vier delen van het huis',list:true,ui:{itemProps:(i:any)=>({label:i?.titel||'Deel'})},fields:[
    {...text('naam','Kort label op het huis'),description:'Zo kort mogelijk, het staat op de foto.'},text('titel','Titel in het paneel'),text('tekst','Uitleg',true),list('punten','Drie punten'),
    text('link','Link naar de dienstpagina'),text('knop','Tekst op de knop'),
    {...text('film','Filmfragment'),options:['v1_dak','v2_zon','v3_gevel','v4_nest']},
    {type:'image',name:'foto',label:'Foto van echt werk'},text('fotoTekst','Bijschrift bij de foto')
   ]},
   {type:'object',name:'ploeg',label:'2. De ploeg',fields:[
    text('titel','Titel'),text('tekst','Uitleg',true),text('fotoNoot','Tekst zolang er geen groepsfoto is'),
    {...text('googleLink','Link naar de reviews op Google'),description:'De link uit het Google-bedrijfsprofiel.'},
    {type:'object',name:'mensen',label:'Mensen, van links naar rechts op de foto',list:true,ui:{itemProps:(i:any)=>({label:i?.naam||'Persoon'})},fields:[text('naam','Voornaam'),text('vak','Wat hij of zij doet')]}
   ]},
   {type:'object',name:'meter',label:'3. De plooimeter',fields:[
    text('titel','Titel'),text('tekst','Uitleg',true),text('slotTitel','Titel na de laatste vraag'),text('slotTekst','Tekst na de laatste vraag',true),text('knop','Tekst op de knop')
   ]}
  ]},
  {name:'verkenner',label:'NEST-verkenner',path:'content',format:'json',match:{include:'verkenner'},ui:{allowedActions:{create:false,delete:false}},fields:[
   text('titel','Titel'),text('intro','Korte intro onder de titel'),
   {type:'object',name:'formulier',label:'Aanvraagformulier',fields:[
    {...text('sleutel','Web3Forms access key'),description:'Maak gratis een sleutel aan op web3forms.com met het e-mailadres dat de aanvragen moet ontvangen. Leeg = de bezoeker krijgt een ingevulde e-mail om zelf te versturen.'},
    {...text('ontvanger','E-mailadres voor de terugvaloptie'),description:'Gebruikt zolang er geen sleutel is.'},
    text('onderwerp','Onderwerp van de e-mail')]}]},
  {name:'reviews',label:'Google-reviews',path:'content',format:'json',match:{include:'reviews'},ui:{allowedActions:{create:false,delete:false}},fields:[
   {...text('gemiddelde','Gemiddelde score'),description:'Zoals op Google, bijvoorbeeld 5,0.'},{type:'number',name:'aantal',label:'Aantal reviews op Google'},
   {type:'object',name:'items',label:'Reviews',list:true,ui:{itemProps:(i:any)=>({label:i?.klant||'Review'})},fields:[
    text('klant','Naam van de klant'),{...text('tekst','Tekst',true),description:'Letterlijk overnemen van Google. Inkorten mag, herschrijven niet.'},
    {type:'number',name:'sterren',label:'Sterren (1 tot 5)'},
    {...text('over','Over wie gaat het?'),description:'Voornamen van de ploeg die genoemd worden, gescheiden door een komma. Leeg = de ploeg in het algemeen.'}
   ]}
  ]},
  ...['privacy','cookies'].map(naam=>({name:naam,label:naam==='privacy'?'Privacyverklaring':'Cookiebeleid',path:'content/juridisch',format:'json' as const,match:{include:naam},ui:{allowedActions:{create:false,delete:false}},fields:[
   text('titel','Titel'),text('intro','Inleiding',true),text('bijgewerkt','Laatst bijgewerkt'),
   {type:'object' as const,name:'secties',label:'Delen',list:true,ui:{itemProps:(i:any)=>({label:i?.titel||'Deel'})},fields:[text('titel','Titel'),{...text('tekst','Tekst',true),description:'Lege regel = nieuwe alinea. Begin een regel met "- " voor een opsomming.'}]}
  ]})),
  {name:'voorwaarden',label:'Algemene voorwaarden',path:'content/juridisch',format:'json',match:{include:'algemene-voorwaarden'},ui:{allowedActions:{create:false,delete:false}},fields:[
   text('titel','Titel'),text('versie','Versie'),
   {type:'object',name:'artikels',label:'Artikels',list:true,ui:{itemProps:(i:any)=>({label:`${i?.nr||''}. ${i?.titel||''}`})},fields:[
    {type:'number',name:'nr',label:'Nummer'},text('titel','Titel'),
    {type:'object',name:'leden',label:'Leden',list:true,ui:{itemProps:(i:any)=>({label:i?.nr||'Lid'})},fields:[text('nr','Nummer, bijvoorbeeld 2.1'),text('tekst','Tekst',true)]}
   ]}
  ]}
 ]}
});
