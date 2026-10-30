(() => {
 'use strict';
 const $ = (s,r=document) => r.querySelector(s);
 const $$ = (s,r=document) => [...r.querySelectorAll(s)];
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const fine = matchMedia('(hover: hover) and (pointer: fine)');

 // One navigation surface at a time. Escape returns focus to its trigger.
 let openTrigger=null;
 function closeMenus(returnFocus=false){
  $$('[data-menu-toggle]').forEach(b=>{b.setAttribute('aria-expanded','false');const panel=document.getElementById(b.dataset.menuToggle);if(panel)panel.hidden=true;});
  $('[data-menu-close]').hidden=true;document.body.classList.remove('menu-open');
  if(returnFocus)openTrigger?.focus();openTrigger=null;
 }
 $$('[data-menu-toggle]').forEach(button=>button.addEventListener('click',()=>{
  const wasOpen=button.getAttribute('aria-expanded')==='true';closeMenus();if(wasOpen)return;
  const panel=document.getElementById(button.dataset.menuToggle);if(!panel)return;
  panel.hidden=false;button.setAttribute('aria-expanded','true');$('[data-menu-close]').hidden=false;openTrigger=button;
  if(button.dataset.menuToggle==='mobile-menu')document.body.classList.add('menu-open');
 }));
 $('[data-menu-close]')?.addEventListener('click',()=>closeMenus(true));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&openTrigger)closeMenus(true);});
 document.addEventListener('focusin',e=>{if(openTrigger&&!$('#header').contains(e.target))closeMenus();});
 $$('#mobile-menu a,#solutions-menu a').forEach(a=>a.addEventListener('click',()=>closeMenus()));
 matchMedia('(max-width:860px)').addEventListener('change',()=>closeMenus());

 // The shortlist contains service names only. Contact details are never persisted.
 const key='nest-project-v2';
 const validNames=['Dakrenovatie','Dakisolatie','Asbest verwijderen','Zonnepanelen','Thuisbatterijen','Industriële batterijen','Laadpalen','Airco & warmtepompboilers','Slim energiebeheer','On-grid, hybride & off-grid','Gevelrenovatie','Totaalrenovatie'];
 let plan=[];try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved))plan=[...new Set(saved.filter(x=>validNames.includes(x)))];}catch{}
 let toastTimer;
 function toast(message){const el=$('[data-toast]');if(!el)return;el.textContent=message;el.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('is-visible'),2700);}
 function save(){try{localStorage.setItem(key,JSON.stringify(plan));}catch{}renderPlan();}
 function renderPlan(){
  $$('[data-plan-count]').forEach(el=>el.textContent=String(plan.length));
  $$('[data-plan-add]').forEach(b=>{const chosen=plan.includes(b.dataset.planAdd);b.setAttribute('aria-pressed',String(chosen));if(b.hasAttribute('aria-label'))b.setAttribute('aria-label',`${b.dataset.planAdd} ${chosen?'verwijderen uit':'toevoegen aan'} jouw plan`);});
  const out=$('[data-plan-summary]');if(!out)return;
  out.replaceChildren();
  const context=new URLSearchParams(location.search).get('onderwerp')?.slice(0,120);
  if(context&&!plan.includes(context)){const p=document.createElement('p');p.className='plan-empty';p.textContent=`Je vraag gaat over: ${context}.`;out.append(p);}
  if(!plan.length){const p=document.createElement('p');p.className='plan-empty';p.textContent=context?'Vertel hieronder gerust wat je wil weten.':'Je hoeft nog niet precies te weten wat je nodig hebt.';out.append(p);return;}
  const chips=document.createElement('div');chips.className='plan-chips';
  plan.forEach(name=>{const chip=document.createElement('span');chip.className='plan-chip';const label=document.createElement('span');label.textContent=name;const remove=document.createElement('button');remove.type='button';remove.setAttribute('aria-label',`${name} verwijderen uit jouw plan`);remove.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>';remove.addEventListener('click',()=>{plan=plan.filter(x=>x!==name);save();toast(`${name} verwijderd`);const next=$('[data-plan-summary] button');(next||$('#name'))?.focus();});chip.append(label,remove);chips.append(chip);});out.append(chips);
 }
 $$('[data-plan-add]').forEach(b=>b.addEventListener('click',()=>{const name=b.dataset.planAdd;if(!validNames.includes(name))return;const already=plan.includes(name);plan=already?plan.filter(n=>n!==name):[...plan,name];save();toast(already?`${name} uit je plan gehaald`:`${name} bewaard in jouw plan`);}));
 renderPlan();
 window.addEventListener('storage',e=>{if(e.key===key){try{const next=JSON.parse(e.newValue||'[]');plan=Array.isArray(next)?next.filter(x=>validNames.includes(x)):[];renderPlan();}catch{}}});

 // Editorial index: the same preview is available to pointer and keyboard users.
 const preview=$('[data-service-image]');
 if(preview)$$('[data-service-preview]').forEach(group=>{
  function show(){if(preview.getAttribute('src')===group.dataset.servicePreview)return;preview.src=group.dataset.servicePreview;preview.alt=group.querySelector('.service-group-heading a')?.textContent.trim()||'NEST projectbeeld';$('[data-service-note-output]').textContent=group.dataset.serviceNote;$$('[data-service-preview]').forEach(el=>el.classList.toggle('is-active',el===group));}
  group.addEventListener('pointerenter',()=>{if(fine.matches)show();});group.addEventListener('focusin',show);
 });

 // An illustrative energy journey, deliberately without invented consumption data.
 const energy=$('[data-energy]');
 if(energy){
  const range=$('#energy-time',energy),scene=$('[data-energy-scene]',energy);let lastPeriod=-1;
  function update(){const value=Number(range.value);const period=value<45?0:value<70?1:2;const hour=10+Math.round(value*.12);scene.style.setProperty('--evening',String(Math.max(0,(value-15)/75)));energy.style.setProperty('--ambient-evening',String(Math.max(0,(value-15)/85)));scene.classList.toggle('is-evening',period===2);
   $('[data-energy-time]',energy).textContent=String(hour).padStart(2,'0')+':00';
   const angle=Math.PI*(.15+value*.007);$('[data-sun]',energy).setAttribute('transform',`translate(${25+250*value/100},${113-Math.sin(angle)*95})`);
   if(period!==lastPeriod){lastPeriod=period;const states=[['Overdag','De zon werkt voor je.','Je zonnepanelen produceren stroom. Je gebruikt die in huis en kunt een deel bewaren in een geschikte batterij.','zonnepanelen','Ontdek zonnepanelen'],['Later op de dag','Energie krijgt een bestemming.','Slimme sturing helpt je installaties afstemmen. Bijvoorbeeld door je wagen te laden wanneer er eigen zonnestroom beschikbaar is.','ems-systemen','Ontdek slim energiebeheer'],['In de avond','Je bewaart iets van de dag.','De zon is onder. Een geschikte batterij kan opgeslagen energie beschikbaar maken voor je woning. De juiste capaciteit volgt uit jouw verbruik.','thuisbatterijen','Ontdek thuisbatterijen']];const s=states[period];$('[data-energy-period]',energy).textContent=s[0];$('[data-energy-title]',energy).textContent=s[1];$('[data-energy-copy]',energy).textContent=s[2];const link=$('[data-energy-link]',energy);link.href='/energieoplossingen/'+s[3]+'/';link.firstChild.textContent=s[4]+' ';range.setAttribute('aria-valuetext',s[0]+': '+s[1]);}
   $$('[data-energy-preset]',energy).forEach(b=>{const selected=period===(Number(b.dataset.energyPreset)<50?0:2);b.classList.toggle('is-selected',selected);b.setAttribute('aria-pressed',String(selected));});
  }
  range.addEventListener('input',update);$$('[data-energy-preset]',energy).forEach(b=>b.addEventListener('click',()=>{range.value=b.dataset.energyPreset;update();}));update();
 }

 // Gentle spatial depth on the project folder, never needed to access its content.
 $$('[data-tilt]').forEach(el=>{el.addEventListener('pointermove',e=>{if(reduced.matches||!fine.matches)return;const r=el.getBoundingClientRect();el.style.setProperty('--rx',`${-(e.clientY-r.top-r.height/2)/r.height*5}deg`);el.style.setProperty('--ry',`${(e.clientX-r.left-r.width/2)/r.width*7}deg`);});el.addEventListener('pointerleave',()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg');});});

 // Honest local-prototype handoff: user reviews and sends in their own mail app.
 const form=$('#contact-form');
 if(form){let requestText='',calculatorText='';
  // A visitor explicitly carried this local scenario into contact; no auto-send.
  let calculatorPanel;
  try{const saved=JSON.parse(sessionStorage.getItem('nest-calculator-plan')||'null');
   if(saved&&saved.version==='2026-09-23.1'&&typeof saved.text==='string'&&saved.text.length<12000&&Number.isFinite(saved.created)&&Date.now()-saved.created>=0&&Date.now()-saved.created<7200000){
    calculatorText=saved.text;calculatorPanel=document.createElement('details');calculatorPanel.className='calculator-handoff';const heading=document.createElement('summary');heading.textContent='Je NEST-verkenning gaat mee';const note=document.createElement('p');note.textContent='Deze berekening wordt als context bij je aanvraag gezet. Je kunt ze hieronder nalezen of verwijderen.';const body=document.createElement('pre');body.textContent=calculatorText;const remove=document.createElement('button');remove.type='button';remove.className='text-link';remove.textContent='Berekening verwijderen';remove.addEventListener('click',()=>{calculatorText='';try{sessionStorage.removeItem('nest-calculator-plan');}catch{}calculatorPanel.remove();$('#name').focus();});calculatorPanel.append(heading,note,body,remove);form.before(calculatorPanel);
   }else if(saved)sessionStorage.removeItem('nest-calculator-plan');
  }catch{}

  form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;
   const name=$('#name').value.trim(),email=$('#email').value.trim(),message=$('#message').value.trim();
   if(!name||!message){$('[data-form-status]').textContent='Vul je naam en een korte omschrijving in.';return;}
   const context=new URLSearchParams(location.search).get('onderwerp')?.slice(0,120);
   const topics=[...new Set([...plan,...(context?[context]:[])])];
   requestText=`Dag NEST,\n\nIk wil graag een vrijblijvend adviesgesprek aanvragen.\n\nNaam: ${name}\nE-mail: ${email}\n${topics.length?'Mijn plannen: '+topics.join(', ')+'\n':''}\n${message}\n\nVriendelijke groeten,\n${name}`;
   if(calculatorText)requestText+='\n\nMijn verkenning (indicatief):\n'+calculatorText;
   const target='mailto:info@nestcompany.be?subject='+encodeURIComponent('Adviesaanvraag'+(topics.length?' — '+topics.join(', '):''))+'&body='+encodeURIComponent(requestText);
   $('[data-form-status]').textContent='Je e-mailprogramma wordt geopend. Je aanvraag is pas verstuurd wanneer je daar op verzenden klikt. Opent er niets? Kopieer de aanvraag en mail ze naar info@nestcompany.be.';
   $('[data-copy-request]').hidden=false;window.location.href=target;
  });
  $('[data-copy-request]')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(requestText);$('[data-form-status]').textContent='Aanvraag gekopieerd. Plak ze in een e-mail aan info@nestcompany.be.';}catch{$('[data-form-status]').textContent='Kopiëren lukt niet. Je kunt je ingevulde tekst zelf kopiëren en mailen naar info@nestcompany.be.';}});
 }

 // Two native video buffers, ordinary scroll, progressively fetched device assets.
 const film=$('[data-film]');
 if(film){
  const videos=[$('[data-film-a]',film),$('[data-film-b]',film)];
  const directory=matchMedia('(max-width:700px)').matches?'film-mobile':'film-desktop';
  const names=['v1_dak','v2_zon','v3_gevel','v4_nest'];
  const captions=['Een stevige basis.','Je dak gaat voor je werken.','Een vertrouwd huis. Een nieuw gezicht.','En dan wordt het jouw nest.'];
  const control=$('[data-film-control]',film),label=$('[data-film-control-label]',film),shutter=$('.film-shutter',film);
  let active=0,chapter=0,intent=false,inView=true,started=false,starting=false,changing=false,timer=null,resetTimer=null;
  const source=i=>'/assets/'+directory+'/'+names[i]+'.mp4';
  function showControl(){label.textContent=intent?'Pauzeren':'Afspelen';control.setAttribute('aria-label',intent?'Renovatiefilm pauzeren':'Renovatiefilm afspelen');$('path',control).setAttribute('d',intent?'M8 5v14M16 5v14':'m8 4 12 8-12 8Z');}
  function canPlay(video){return new Promise((resolve,reject)=>{if(video.readyState>=3){resolve();return;}let timeout;const clean=()=>{clearTimeout(timeout);video.removeEventListener('canplay',good);video.removeEventListener('error',bad);};const good=()=>{clean();resolve();};const bad=()=>{clean();reject(new Error('Media unavailable'));};video.addEventListener('canplay',good,{once:true});video.addEventListener('error',bad,{once:true});timeout=setTimeout(bad,12000);});}
  function prepare(video,i){if(video.dataset.chapter!==String(i)){video.src=source(i);video.dataset.chapter=String(i);video.preload='auto';video.load();}video.playbackRate=1.4;}
  function state(){showControl();$('[data-film-stage]',film).textContent=captions[chapter];$$('[data-film-chapter]',film).forEach(el=>el.classList.toggle('is-current',Number(el.dataset.filmChapter)===chapter));}
  async function start(){
   if(starting||changing||document.hidden||!inView||!intent)return;starting=true;
   const video=videos[active];if(!started)prepare(video,0);
   try{await canPlay(video);if(!intent||document.hidden||!inView)return;await video.play();started=true;video.classList.add('is-active');film.classList.add('has-played');state();}
   catch(error){if(video.error||error?.name==='NotAllowedError'){intent=false;showControl();$('[data-film-stage]',film).textContent='Een huis vol mogelijkheden';}else{$('[data-film-stage]',film).textContent='De film wordt geladen';}}
   finally{starting=false;}
  }
  async function advance(){
   if(changing||!intent||!inView||document.hidden)return;changing=true;
   const nextChapter=(chapter+1)%4,next=videos[1-active],old=videos[active];prepare(next,nextChapter);
   try{await canPlay(next);if(!intent||!inView||document.hidden){changing=false;return;}
    if(nextChapter===0&&!reduced.matches){shutter.classList.add('is-resetting');await new Promise(resolve=>setTimeout(resolve,550));}
    if(!intent||!inView||document.hidden){shutter.classList.remove('is-resetting');changing=false;return;}
    next.currentTime=0;await next.play();old.pause();next.classList.add('is-active');old.classList.remove('is-active');active=1-active;chapter=nextChapter;state();
    clearTimeout(resetTimer);resetTimer=setTimeout(()=>shutter.classList.remove('is-resetting'),850);
   }catch{intent=false;showControl();shutter.classList.remove('is-resetting');}
   changing=false;
  }
  function pause(){videos.forEach(v=>v.pause());clearTimeout(timer);}
  function resume(){if(!intent)return;if(videos[active].ended)advance();else start();}
  videos.forEach(video=>{
   video.addEventListener('canplay',()=>{if(video===videos[active]&&intent&&!starting&&video.paused)start();});
   video.addEventListener('ended',()=>{if(video!==videos[active])return;clearTimeout(timer);timer=setTimeout(advance,chapter===3?2600:0);});
   video.addEventListener('timeupdate',()=>{if(video!==videos[active]||!intent)return;if(video.duration-video.currentTime<2.5)prepare(videos[1-active],(chapter+1)%4);});
   video.addEventListener('error',()=>{if(video===videos[active]){intent=false;showControl();}});
  });
  control.addEventListener('click',()=>{intent=!intent;showControl();intent?resume():pause();});
  document.addEventListener('visibilitychange',()=>document.hidden?pause():resume());
  document.body.classList.add('hero-visible');
  new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;document.body.classList.toggle('hero-visible',inView);if(inView)resume();else pause();},{threshold:.05}).observe(film);
  reduced.addEventListener('change',()=>{if(reduced.matches){intent=false;pause();showControl();}});
  if(!reduced.matches&&!navigator.connection?.saveData){intent=true;showControl();start();}
 }
})();
