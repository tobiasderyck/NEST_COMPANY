// Convenience scenarios, not market averages or a site-specific production study.
export const START_VALUES = Object.freeze({importRate:.30,panelCount:10,panelPower:430,specificYield:900,exportRate:.04,charge:1400});
export const PROFILE_LOADS = Object.freeze([1200,3500,7500]);
export function missingStartValues(values) {
 return Object.fromEntries(Object.entries(START_VALUES).filter(([key])=>values[key]===null||values[key]===undefined||String(values[key]).trim()===''));
}
