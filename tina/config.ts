import { defineConfig, type TinaField } from 'tinacms';

const text = (name:string,label:string,multiline=false):TinaField => ({type:'string',name,label,...(multiline?{ui:{component:'textarea'}}:{})});
const list = (name:string,label:string):TinaField => ({type:'string',name,label,list:true});
const chapters:TinaField = {type:'object',name:'sections',label:'Inhoudelijke hoofdstukken',list:true,ui:{itemProps:(item)=>({label:item?.title||'Hoofdstuk'})},fields:[text('title','Titel'),text('text','Tekst',true),list('items','Opsomming (optioneel)')]};
const common:TinaField[] = [
 {...text('slug','Pagina-adres'),required:true,description:'Behoud dit adres bij tekstwijzigingen. Andere pagina’s verwijzen hiernaar.'},
 {...text('title','Naam'),required:true},text('headline','Grote titel'),text('summary','Korte beschrijving',true),
 {...text('image','Beeld'),options:['leuven','dak-lucht','werf','kempen','zolder','k1_oud','k2_dak','k3_zon','k4_gevel','k5_nest']},
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
  {name:'homepage',label:'Homepage — kernteksten',path:'content',format:'json',match:{include:'homepage'},ui:{allowedActions:{create:false,delete:false}},fields:[
   text('titleStart','Titel — eerste regel'),text('titleEnd','Titel — tweede regel'),text('titleAccent','Titel — accent'),
   text('promise','Welke werken doet NEST?'),text('description','Korte belofte'),text('adviceButton','Adviesknop'),text('servicesLink','Link naar diensten'),
   text('intro','Introductie',true),text('servicesTitle','Diensten — titel'),text('servicesAccent','Diensten — accent'),text('servicesDescription','Diensten — toelichting',true)
  ]}
 ]}
});
