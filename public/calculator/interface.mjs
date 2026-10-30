import {calculate,MODEL_VERSION} from './model.mjs';
import {missingStartValues,PROFILE_LOADS} from './presets.mjs';
const form=document.getElementById('energy-form');
const $=(s)=>document.querySelector(s);
const $$=(s)=>[...document.querySelectorAll(s)];
const names={pv:'Zonnepanelen',battery:'Thuisbatterij',boiler:'Warmtepompboiler',roof:'Dakisolatie'};
const money=n=>new Intl.NumberFormat('nl-BE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
const number=n=>new Intl.NumberFormat('nl-BE',{maximumFractionDigits:0}).format(n);
const precise=n=>new Intl.NumberFormat('nl-BE',{maximumFractionDigits:3}).format(n);
let current=null,submitted=false;
const estimates=new Set();
const estimateLabels={load:'Verbruik: Europese verbruikscategorie',importRate:'Stroomprijs: € 0,30/kWh (voorbeeld)',panelCount:'10 panelen (voorbeeld)',panelPower:'430 Wp per paneel (voorbeeld)',specificYield:'900 kWh/kWp per jaar (grove rekenaanname)',exportRate:'Teruglevering: € 0,04/kWh (voorbeeld)',charge:'Batterijlading: 1.400 kWh/jaar (voorbeeld)',boilerUse:'Boilerverbruik: 2.000 kWh/jaar (voorbeeld)'};
function activeEstimates(){return [...estimates].filter(key=>!['panelCount','panelPower','specificYield','exportRate'].includes(key)||form.elements.pv.checked).filter(key=>key!=='specificYield'||form.elements.production.value.trim()==='').filter(key=>key!=='charge'||form.elements.battery.checked).filter(key=>key!=='boilerUse'||form.elements.boiler.checked);}
function fillStart(){for(const [key,value] of Object.entries(missingStartValues(read()))){form.elements[key].value=value;estimates.add(key);}}
function presetState(){const active=activeEstimates();$('[data-preset-box]').hidden=!active.length;$('[data-preset-title]').textContent=active.length?`Richtwaarden actief · ${active.length} aannames`:'Richtwaarden actief · bekijk aannames';$('[data-preset-state]').textContent=active.length?'Met richt- en voorbeeldwaarden · '+active.map(key=>key==='load'?`Verbruik: ${number(Number(form.elements.load.value))} kWh/jaar (richtwaarde)`:estimateLabels[key]).join(' · ')+'. Pas aan voor jouw woning.':'';$$('[data-profile]').forEach(button=>button.setAttribute('aria-pressed',String(estimates.has('load')&&Number(button.dataset.profile)===Number(form.elements.load.value))));}
function read(){const data={};for(const el of form.elements){if(!el.name)continue;data[el.name]=el.type==='checkbox'?el.checked:el.value.trim()===''?null:Number(el.value);}return data;}
function sections(){for(const [key] of Object.entries(names)){const on=form.elements[key].checked;$(`[data-inputs="${key}"]`).hidden=!on;const cost=$(`[data-cost="${key}"]`);if(cost)cost.hidden=!on;}$('[data-quick-pv]').hidden=!form.elements.pv.checked;for(const key of ['pv','battery','boiler'])$(`[data-house-${key}]`).toggleAttribute('hidden',!form.elements[key].checked);$('[data-house-roof-note]').toggleAttribute('hidden',!form.elements.roof.checked);const count=Number(form.elements.panelCount.value)||0;$$('.panel-tile').forEach((tile,index)=>tile.hidden=!form.elements.pv.checked||index>=Math.min(count,12));$('[data-house-count]').textContent=form.elements.pv.checked&&count?`${count} PANELEN`:'GEEN PV';const power=Number(form.elements.panelPower.value)||0;$('[data-panel-capacity]').textContent=count&&power?`${precise(count*power/1000)} kWp geïnstalleerd piekvermogen`:'Vul aantal en Wp per paneel in voor het piekvermogen.';$('.plan-house').classList.toggle('has-roof',form.elements.roof.checked);}
function markErrors(errors,show){$$('[data-error]').forEach(el=>el.textContent=show?(errors[el.dataset.error]||''):'');for(const el of form.elements){if(!el.name)continue;if(errors[el.name]&&show)el.setAttribute('aria-invalid','true');else el.removeAttribute('aria-invalid');}}
function summary(r){const v=r.values;return [
 `NEST-verkenner · jaarmodel ${MODEL_VERSION}`,
 `${activeEstimates().length?'SCENARIO MET RICHT- EN VOORBEELDWAARDEN':'EIGEN INVOER MET ZICHTBARE MODELAANNAMES'} · Geen offerte of garantie.`,
 ...activeEstimates().map(key=>`${estimateLabels[key]}${key==='load'?': '+number(v.load)+' kWh/jaar':''}.`),
 'Vertrekpunt: zonder bestaande zonnepanelen of batterij.',
 'Gekozen: '+Object.keys(names).filter(k=>r.selected[k]).map(k=>names[k]).join(', '),
 `Stroomvraag vóór: ${number(v.load)} kWh/jaar; ná: ${number(r.demand)} kWh/jaar.`,
 `Afnameprijs: ${precise(v.importRate)} €/kWh; injectietarief: ${precise(r.selected.pv?v.exportRate:0)} €/kWh.`,
 ...(r.selected.pv?[`PV: ${v.panelCount===null?'aantal onbekend':number(v.panelCount)+' panelen'}${r.capacity===null?'':` × ${number(v.panelPower)} Wp = ${precise(r.capacity)} kWp`}. Productie: ${number(r.generation)} kWh/jaar (${v.production===null?'aantal × Wp × grove jaaropbrengst':'eigen productie-invoer'}); direct aandeel: ${precise(v.directShare)}%.`]:[]),
 ...(r.selected.battery?[`Gevraagde jaarlading: ${number(v.charge)} kWh; berekend: ${number(r.charge)} kWh; retourrendement ${precise(v.efficiency)}%.`]:[]),
 ...(r.selected.boiler?[`Oude elektrische boiler: ${number(v.boilerUse)} kWh/jaar (in totaal inbegrepen); jaarfactor nieuw: ${precise(v.boilerFactor)}.`]:[]),
 `Netafname ná: ${r.gridUncertain?'niet berekend; theoretische jaarbalans komt op nul, werkelijk tijdsprofiel nodig':number(r.grid)+' kWh/jaar in het vereenvoudigde jaarmodel'}; injectie: ${number(r.injection)} kWh; opslagverlies: ${number(r.loss)} kWh.`,
 ...(r.selected.roof?[r.roofKnown?`Dak: ${number(v.heatSaving)} kWh minder gekochte brandstof × ${precise(v.heatRate)} €/kWh.`:'Dak: nog niet financieel berekend; energieadvies nodig.']:[]),
 `${r.gridUncertain?'Theoretische jaaruitkomst bij onbewezen nulbalans':'Berekend verschil variabele kosten'}: ${money(r.saving)} per jaar (positief = besparing).`,
 v.totalCost!==null?`Eigen totaalbudget/offerte: ${money(v.totalCost)}.`:'Kosten per onderdeel: '+Object.keys(names).filter(k=>r.selected[k]).map(k=>`${names[k]} ${v[k+'Cost']===null?'onbekend':money(v[k+'Cost'])}`).join('; '),
 `Eenvoudige terugverdientijd: ${r.payback===null?'niet bepaald':precise(r.payback)+' jaar'}.`,
 'Exclusief vaste kosten, capaciteitstarief, premies, onderhoud, vervanging, financiering en prijswijzigingen. Zonder uur-/kwartierverbruik geen betrouwbaar werkelijk netverbruik of off-grid bewijs.',
 ...(r.selected.boiler?['Extra ruimteverwarming bij warmteonttrekking door de boiler uit verwarmde binnenlucht is niet meegerekend. Laat de opstelling beoordelen.']:[]),
 'Bronnen en aannames: /nestverkenner/#rekenbronnen'
].join('\n');}
function render(announce=false){
 sections();presetState();const r=calculate(read());markErrors(r.errors||{},submitted);current=r.ok&&!r.warning?r:null;
 $('[data-result-empty]').hidden=!!current;$('[data-result-filled]').hidden=!current;
 $('[data-result-state]').textContent=activeEstimates().length?'Met richtwaarden':current?'Eigen invoer':'Nog in te vullen';
 if(!current){$('[data-calc-status]').textContent=submitted?(r.warning||'Vul de ontbrekende gegevens in. Er is nog geen resultaat berekend.') : '';return;}
 $('[data-saving-label]').textContent=r.gridUncertain?'Theoretische uitkomst · geen prognose':r.saving<0?'Hogere variabele energiekosten':r.complete?'Lagere variabele energiekosten':'Besparing berekende onderdelen';
 $('[data-saving]').textContent=money(Math.abs(r.saving));$('.saving-value').classList.toggle('is-cost',r.saving<0);
 $('[data-result-context]').textContent=(activeEstimates().length?'Scenario met richt- en voorbeeldwaarden. ':'Op basis van je invoer en modelaannames. ')+(r.complete?'Geen voorspelling of gegarandeerd rendement.':'Je dak is nog niet financieel meegerekend.');
 $('[data-grid-caution]').hidden=!r.gridUncertain;$('[data-grid-caution]').textContent='De optelsom over een jaar komt theoretisch op 0 kWh netafname. Dat bewijst geen onafhankelijkheid van het net. Voor echt netverbruik en terugverdientijd is een tijdsprofiel nodig; het getoonde jaarbedrag is hier geen betrouwbare voorspelling.';
 for(const key of ['demand','direct','discharge','grid','injection','loss'])$(`[data-result="${key}"]`).textContent=key==='grid'&&r.gridUncertain?'Niet te bepalen':number(r[key])+' kWh/jaar';
 let offset=0;for(const [key,value] of [['direct',r.direct],['battery',r.discharge],['grid',r.grid]]){const fraction=r.demand?value/r.demand:0;$(`[data-bar="${key}"]`).style.transform=`translateX(${offset*100}%) scaleX(${fraction})`;offset+=fraction;}
 $('[data-roof-result]').hidden=!r.selected.roof;$('[data-roof-result]').textContent=r.roofKnown?`Dakisolatie: ${money(r.roofSaving)} per jaar op basis van je opgegeven brandstofvermindering, opgenomen in het verschil hierboven.`:'Dakisolatie zit in je plan. Het financiële effect is nog onbekend; daarvoor is energieadvies nodig.';
 $('[data-charge-note]').hidden=!r.chargeLimited;
 $('[data-investment]').textContent=r.investment===null?'Geen bedrag ingevoerd':money(r.investment);
 $('[data-budget-link]').hidden=r.investment!==null;
 $('[data-payback]').textContent=r.payback===null?'Nog niet te bepalen':r.payback>50?'Meer dan 50 jaar':new Intl.NumberFormat('nl-BE',{maximumFractionDigits:1}).format(r.payback)+' jaar';
 $('[data-payback-note]').textContent=r.gridUncertain?'Niet betrouwbaar te bepalen: de jaarbalans onderschat mogelijk je echte netafname. Vraag een profielberekening aan.':!r.roofKnown?'Het dakeffect ontbreekt. Daarom tonen we geen terugverdientijd voor het volledige plan.':r.investment===null?'Vul hierboven je totale budget in, of open Kosten per onderdeel. Zonder investering is er geen terugverdientijd.':r.saving<=0?'Bij deze invoer is er geen positieve jaarlijkse besparing. Er is dus geen eenvoudige terugverdientijd.':'Investering gedeeld door jaarlijkse variabele besparing. Dit houdt geen rekening met levensduur of toekomstige kosten.';
 $('[data-prod-method]').textContent=!r.selected.pv?'Geen zonnepanelen gekozen.':r.values.production!==null?`Eigen opbrengstinvoer ${number(r.generation)} kWh/jaar vervangt de grove opbrengstfactor. ${r.capacity===null?'Piekvermogen onbekend.':`Ingevuld piekvermogen ${precise(r.capacity)} kWp.`}`:`${number(r.values.panelCount)} panelen × ${number(r.values.panelPower)} Wp = ${precise(r.capacity)} kWp. Met ${number(r.values.specificYield)} kWh/kWp per jaar: ${number(r.generation)} kWh grove opbrengst. Dakrichting en schaduw zijn hierin niet persoonlijk berekend.`;
 $('[data-result-equation]').textContent=`Stroom: ${money(r.baseline)} vóór → ${money(r.future)} ná, inclusief ${money(r.injection*(r.selected.pv?r.values.exportRate:0))} injectievergoeding. Dakbijdrage: ${r.selected.roof&&!r.roofKnown?'nog onbekend':money(r.roofSaving)}.`;
 $('[data-print-inputs]').textContent=summary(r);
 if(announce)$('[data-calc-status]').textContent=r.gridUncertain?`Vergelijking bijgewerkt. Theoretische jaarbalans nul; werkelijk netverbruik en terugverdientijd onbekend. De geldwaarde is geen betrouwbare voorspelling.`:`Vergelijking bijgewerkt. ${r.complete?'':'Gedeeltelijke berekening. '}${money(Math.abs(r.saving))} ${r.saving<0?'hogere':'lagere'} variabele kosten per jaar.`;
}
form.addEventListener('input',e=>{estimates.delete(e.target.name);render();});
form.addEventListener('change',e=>{if(e.target.name==='pv'&&!e.target.checked)form.elements.battery.checked=false;if(e.target.name==='battery'&&e.target.checked)form.elements.pv.checked=true;if(e.target.name==='boiler'&&e.target.checked)$('.technical-details').open=true;render(true);});
form.addEventListener('submit',e=>{e.preventDefault();submitted=true;render(true);if(!current){const invalid=form.querySelector('[aria-invalid="true"]');if(invalid){let parent=invalid.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}invalid.focus();}return;}$('#jouw-vergelijking').focus();if(matchMedia('(max-width:900px)').matches)$('#jouw-vergelijking').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});});
$$('[data-profile]').forEach(button=>button.addEventListener('click',()=>{const load=Number(button.dataset.profile);if(!PROFILE_LOADS.includes(load))return;form.elements.load.value=load;estimates.add('load');fillStart();render(true);}));
$('[data-start-values]').addEventListener('click',()=>{fillStart();render(true);});
$('[data-boiler-example]').addEventListener('click',()=>{form.elements.boilerUse.value=2000;estimates.add('boilerUse');submitted=true;render(true);});
$('[data-boiler-reference]').addEventListener('click',()=>{form.elements.boilerCost.value='3500';render(true);});
form.addEventListener('reset',()=>{estimates.clear();submitted=false;form.querySelectorAll('details').forEach(el=>el.open=false);setTimeout(()=>render(),0);});
$('.sources-shortcut').addEventListener('click',()=>{$('#rekenbronnen').open=true;});
$('[data-budget-link]').addEventListener('click',e=>{e.preventDefault();form.elements.totalCost.focus();form.elements.totalCost.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'center'});});
$('[data-print]').addEventListener('click',()=>{if(current){const source=$('#rekenbronnen'),wasOpen=source.open;source.open=true;window.addEventListener('afterprint',()=>{source.open=wasOpen;},{once:true});window.print();}});
$('[data-discuss]').addEventListener('click',()=>{if(!current)return;try{sessionStorage.setItem('nest-calculator-plan',JSON.stringify({version:MODEL_VERSION,created:Date.now(),text:summary(current)}));location.href='/contact/?onderwerp=NEST-verkenner';}catch{$('[data-calc-status]').textContent='Je browser kan het plan niet tijdelijk bewaren. Bewaar het als pdf en neem het mee naar je adviesgesprek.';}});
render();
