// Annual scenario balance. Not an hourly simulation or an EPC calculation.
export const MODEL_VERSION = '2026-09-23.2';
const fields = {
 load:[0,100000], production:[0,100000], directShare:[0,100], charge:[0,100000],
 efficiency:[1,100], boilerUse:[0,100000], boilerFactor:[1,6], importRate:[0,2],
 exportRate:[-1,2], heatSaving:[0,100000], heatRate:[0,2],
 panelCount:[1,100], panelPower:[100,1000], specificYield:[100,1600],
 totalCost:[0,1000000],pvCost:[0,1000000], batteryCost:[0,1000000], boilerCost:[0,1000000], roofCost:[0,1000000]
};
export const EXAMPLE = Object.freeze({load:5500,production:4000,directShare:28,charge:1400,efficiency:90,boilerUse:2000,boilerFactor:3,importRate:.30,exportRate:.04,heatSaving:null,heatRate:null,pvCost:null,batteryCost:null,boilerCost:null,roofCost:null});
export function calculate(input){
 const selected={pv:!!input.pv,battery:!!input.battery,boiler:!!input.boiler,roof:!!input.roof};
 const errors={},values={};
 const required=new Set(['load','importRate']);
 if(selected.pv){['directShare','exportRate'].forEach(k=>required.add(k));if(input.production===null||input.production===undefined||String(input.production).trim()==='')['panelCount','panelPower','specificYield'].forEach(k=>required.add(k));}
 if(selected.battery){['charge','efficiency'].forEach(k=>required.add(k));if(!selected.pv)errors.battery='Selecteer ook zonnepanelen. Deze versie rekent geen handel of bestaande installatie door.';}
 if(selected.boiler)['boilerUse','boilerFactor'].forEach(k=>required.add(k));
 for(const [key,[min,max]] of Object.entries(fields)){
  const raw=input[key],empty=raw===null||raw===undefined||String(raw).trim()==='';
  const value=empty?null:Number(raw);
  values[key]=value;
  const relevant=required.has(key)||(selected.pv&&['production','panelCount','panelPower','specificYield'].includes(key))||(selected.roof&&['heatSaving','heatRate','roofCost'].includes(key))||key==='totalCost'||Object.entries(selected).some(([s,on])=>on&&key===s+'Cost');
  if(!relevant)continue;
  if(empty){if(required.has(key))errors[key]='Vul dit gegeven in. Gebruik waar beschikbaar een richt- of voorbeeldwaarde.';}
  else if(!Number.isFinite(value)||value<min||value>max)errors[key]=`Gebruik een getal tussen ${min} en ${max}.`;
 }
 if(selected.boiler&&values.boilerUse>values.load)errors.boilerUse='Het boilerverbruik moet al in je totale stroomverbruik zitten en kan niet hoger zijn.';
 if(values.totalCost!==null&&Object.keys(selected).some(k=>selected[k]&&values[k+'Cost']!==null))errors.totalCost='Gebruik één totaalbedrag óf bedragen per maatregel, zodat kosten niet dubbel tellen.';
 if(Object.keys(errors).length)return {ok:false,errors};
 const v=values;
 const avoidedBoiler=selected.boiler?v.boilerUse-v.boilerUse/v.boilerFactor:0;
 const demand=v.load-avoidedBoiler;
 const capacity=selected.pv&&v.panelCount!==null&&v.panelPower!==null?v.panelCount*v.panelPower/1000:null;
 const generation=selected.pv?(v.production!==null?v.production:capacity*v.specificYield):0;
 const direct=selected.pv?Math.min(demand,generation*v.directShare/100):0;
 const efficiency=selected.battery?v.efficiency/100:1;
 const charge=selected.battery?Math.min(v.charge,generation-direct,(demand-direct)/efficiency):0;
 const discharge=charge*efficiency,loss=charge-discharge;
 const grid=Math.max(0,demand-direct-discharge),injection=Math.max(0,generation-direct-charge);
 const baseline=v.load*v.importRate;
 const future=grid*v.importRate-injection*(selected.pv?v.exportRate:0);
 const electricitySaving=baseline-future;
 const roofKnown=!selected.roof||(v.heatSaving!==null&&v.heatRate!==null);
 const roofSaving=selected.roof&&roofKnown?v.heatSaving*v.heatRate:0;
 const saving=electricitySaving+roofSaving;
 const active=Object.keys(selected).filter(k=>selected[k]);
 const missingCosts=active.filter(k=>v[k+'Cost']===null);
 const knownInvestment=active.reduce((sum,k)=>sum+(v[k+'Cost']??0),0);
 const investment=v.totalCost!==null?v.totalCost:missingCosts.length?null:knownInvestment;
 const complete=roofKnown&&active.length>0;
 // Annual dispatch can hit zero while the real home still imports in dark hours.
 const gridUncertain=selected.pv&&demand>0&&grid<1e-7;
 const payback=complete&&!gridUncertain&&investment!==null&&saving>0?investment/saving:null;
 const batteryIncrement=discharge*v.importRate-charge*(selected.pv?v.exportRate:0);
 return {ok:true,values:v,selected,demand,capacity,generation,direct,charge,discharge,loss,grid,gridUncertain,injection,avoidedBoiler,baseline,future,electricitySaving,roofSaving,saving,roofKnown,complete,investment,knownInvestment,missingCosts,payback,batteryIncrement,
  gridShare:demand>0?grid/demand:0,solarCoverage:demand>0?(direct+discharge)/demand:0,
  chargeLimited:selected.battery&&charge+1e-6<v.charge,
  warning:active.length===0?'Kies minstens één ingreep om je plan te vergelijken.':null};
}
