import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate, EXAMPLE } from '../public/calculator/model.mjs';
const base={...EXAMPLE,pv:true,battery:false,boiler:false,roof:false};
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} ≠ ${b}`);
test('PV replaces imports and values exports separately',()=>{
 const r=calculate(base);assert.equal(r.ok,true);close(r.direct,1120);close(r.grid,4380);close(r.injection,2880);close(r.saving,451.2);assert.equal(r.payback,null);
});
test('PV and battery conserve electricity including storage loss',()=>{
 const r=calculate({...base,battery:true});close(r.discharge,1260);close(r.loss,140);close(r.generation,r.direct+r.charge+r.injection);close(r.demand,r.direct+r.discharge+r.grid);close(r.saving,773.2);close(r.batteryIncrement,322);
});
test('boiler reduces demand before PV/battery allocation, never twice',()=>{
 const r=calculate({...base,battery:true,boiler:true});close(r.demand,4166.666666666667);close(r.saving,1173.2);
 const pv=calculate({...base,boiler:true});close(r.saving-pv.saving,r.batteryIncrement);
});
test('zero demand prevents fictitious self-consumption and charge',()=>{
 const r=calculate({...base,load:0,battery:true});close(r.direct,0);close(r.charge,0);close(r.grid,0);close(r.injection,4000);close(r.solarCoverage,0);
});
test('battery cannot exceed remaining demand or available surplus',()=>{
 for(const load of [0,100,2000,8000])for(const production of [0,500,5000]){
  const r=calculate({...base,load,production,battery:true,charge:99999});assert.equal(r.ok,true);assert.ok(r.grid>=0&&r.injection>=0);close(production,r.direct+r.charge+r.injection);close(load,r.direct+r.discharge+r.grid);
 }
});
test('negative export tariffs and increased costs are shown',()=>{
 const r=calculate({...base,load:100,production:10000,directShare:0,exportRate:-.10,pvCost:5000});assert.ok(r.saving<0);assert.equal(r.payback,null);
});
test('missing roof advice makes total partial even with all cost inputs',()=>{
 const r=calculate({...base,roof:true,pvCost:5000,roofCost:9000});assert.equal(r.complete,false);assert.equal(r.payback,null);close(r.saving,451.2);
});
test('known roof fuel reduction added once, known investment required',()=>{
 const r=calculate({...base,roof:true,heatSaving:3000,heatRate:.08,pvCost:5000,roofCost:9000});close(r.saving,691.2);close(r.payback,14000/691.2);
});
test('zero and missing investment are different',()=>{
 assert.equal(calculate(base).investment,null);assert.equal(calculate({...base,pvCost:0}).investment,0);
});
test('invalid values and contradictory boiler baseline rejected',()=>{
 for(const bad of [{load:''},{load:NaN},{directShare:101},{importRate:-1},{battery:true,efficiency:0},{boiler:true,boilerUse:6000}])assert.equal(calculate({...base,...bad}).ok,false);
 assert.equal(calculate({...base,pv:false,battery:true}).ok,false);
});
test('panel count and Wp create capacity; site production can override generic yield',()=>{
 const generic=calculate({...base,production:null,panelCount:10,panelPower:430,specificYield:900});
 close(generic.capacity,4.3);close(generic.generation,3870);
 const site=calculate({...base,production:4200,panelCount:10,panelPower:430,specificYield:900});
 close(site.generation,4200);
 assert.equal(calculate({...base,production:null,panelCount:null,panelPower:430,specificYield:900}).ok,false);
});
test('annual zero grid is never presented as real independence or simple payback',()=>{
 const r=calculate({...base,load:1200,battery:true,production:null,panelCount:10,panelPower:430,specificYield:900,totalCost:9000});
 close(r.grid,0);assert.equal(r.gridUncertain,true);assert.equal(r.investment,9000);assert.equal(r.payback,null);
});
test('whole-plan budget works without itemised costs, conflicting entries rejected',()=>{
 const r=calculate({...base,totalCost:8000});assert.equal(r.investment,8000);close(r.payback,8000/451.2);
 const conflict=calculate({...base,totalCost:8000,pvCost:5000});assert.equal(conflict.ok,false);assert.ok(conflict.errors.totalCost);
});
