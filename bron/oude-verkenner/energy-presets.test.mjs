import test from 'node:test';
import assert from 'node:assert/strict';
import {missingStartValues,PROFILE_LOADS} from '../public/calculator/presets.mjs';
import {calculate} from '../public/calculator/model.mjs';

test('quick start preserves custom input and zero tariffs',()=>{
 assert.deepEqual(missingStartValues({importRate:0,panelCount:12,panelPower:440,specificYield:950,exportRate:-.02,charge:''}),{charge:1400});
});
test('every consumption reference produces a valid PV/storage scenario without invented investment',()=>{
 for(const load of PROFILE_LOADS){
  const result=calculate({load,...missingStartValues({}),pv:true,battery:true,directShare:28,efficiency:90});
  assert.equal(result.ok,true);
  assert.equal(result.investment,null);
  assert.equal(result.payback,null);
  assert.ok(Math.abs(result.direct+result.discharge+result.grid-result.demand)<1e-6);
 }
});
test('quick start does not fabricate roof, boiler or quote data',()=>{
 const defaults=missingStartValues({});
 for(const key of ['load','production','boilerUse','heatSaving','heatRate','totalCost','pvCost','batteryCost','boilerCost','roofCost'])assert.equal(defaults[key],undefined);
});
