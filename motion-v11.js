/* YSLRP Motion Director v11.
  One scroll clock: Lenis -> GSAP ticker -> ScrollTrigger timelines.
  Self-hosted JS; all media remains local. No wheel-jacking / forced snapping.
  Licensed GSAP/Lenis remain under their own licenses.
*/
(()=>{'use strict';
const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>Array.from(p.querySelectorAll(s));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const gs=window.gsap,ST=window.ScrollTrigger;
if(!gs||!ST){console.warn('YSLRP motion library unavailable; retaining readable fallback');return;}
gs.registerPlugin(ST);ST.config({ignoreMobileResize:true,limitCallbacks:true});
const finePointer=fine&&!reduced;
let lenis=null;
if(!reduced&&typeof window.Lenis==='function'){
 lenis=new Lenis({lerp:0.13,smoothWheel:true,wheelMultiplier:0.94,syncTouch:false});
 lenis.on('scroll',ST.update);
 gs.ticker.add(t=>lenis.raf(t*1000));
 gs.ticker.lagSmoothing(0);
 window.__yslrpLenis=lenis;
}
const scrollTo=(el)=>{const target=typeof el==='string'?$(el):el;if(!target)return;if(lenis)lenis.scrollTo(target,{offset:-72,duration:1.25});else target.scrollIntoView({behavior:reduced?'auto':'smooth'});};
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(!id || id.length<2 || !document.getElementById(id.slice(1)))return;e.preventDefault();history.replaceState(null,'',id);scrollTo(id);}));
const easing='power2.inOut';
const scrollEnd=el=>'bottom bottom';
function timeline(el,scrub=.22){return gs.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:el,start:'top top',end:scrollEnd(el),scrub,invalidateOnRefresh:true}});}
function visibleState(node,show){gs.set(node,{autoAlpha:show?1:0});}
function prepareFrameCanvas(){
 const list=window.__YS_FRAME_DATA;
 const holder=$('#heroSequence'),video=$('#heroVideo');
 if(!holder||!Array.isArray(list)||list.length<2||reduced)return null;
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:false});
 if(!ctx)return null;
 canvas.setAttribute('aria-hidden','true');holder.appendChild(canvas);
 const frames=new Array(list.length);
 let loaded=0,ready=false,currentProgress=0;
 const cover=(im,w,h)=>{const iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height;if(!iw||!ih)return;const scale=Math.max(w/iw,h/ih),sw=iw*scale,sh=ih*scale;ctx.drawImage(im,(w-sw)/2,(h-sh)/2,sw,sh);};
 function resize(){
  const r=holder.getBoundingClientRect();if(!r.width||!r.height)return;
  const dpr=Math.min(1.35,window.devicePixelRatio||1);
  const cap=1600;
  const sc=Math.min(dpr,cap/Math.max(r.width,r.height));
  canvas.width=Math.round(r.width*sc);canvas.height=Math.round(r.height*sc);draw(currentProgress);
 }
 function draw(p){
  currentProgress=clamp(p);if(!ready)return;
  const v=p*(frames.length-1),i=Math.min(frames.length-2,Math.floor(v)),f=clamp(v-i);
  const a=frames[i],b=frames[i+1];
  if(!a||!b)return;
  const w=canvas.width,h=canvas.height;
  ctx.globalAlpha=1;cover(a,w,h);
  if(f>.001){ctx.globalAlpha=f;cover(b,w,h);ctx.globalAlpha=1;}
 }
 list.forEach((src,i)=>{const im=new Image();im.decoding='async';im.src=src;im.decode().catch(()=>{}).then(()=>{if(!im.naturalWidth)return;frames[i]=im;loaded++;
  if(loaded===frames.length){ready=true;resize();holder.classList.add('ready');if(video){video.pause();video.style.opacity='0';}}
 });});
 const ro=new ResizeObserver(resize);ro.observe(holder);return draw;
}
const drawFrames=prepareFrameCanvas();
if(reduced){const v=$('#heroVideo');v?.pause();return;}
const hero=$('#home'),photo=$('#heroPhoto'),content=$('#heroContent'),frame=$('#heroFrame'),hTrans=$('.hero-transition');
if(hero&&photo&&content){
 gs.set(photo,{yPercent:0,scale:1.05});gs.set(content,{y:0,autoAlpha:1});gs.set(hTrans,{yPercent:105});
 const tl=timeline(hero,.18);
 tl.to(photo,{scale:1.23,yPercent:-3,duration:1},0)
 .to(frame,{scale:.82,opacity:.2,duration:.78},.10)
 .to(content,{y:-124,autoAlpha:0,duration:.31,ease:'power2.in'},.25)
 .fromTo(hTrans,{yPercent:105},{yPercent:0,duration:.32,ease:easing},.66);
 if(drawFrames)tl.eventCallback('onUpdate',()=>drawFrames(tl.progress()));
}
const man=$('#manifesto'),head=$('#manifestoHeading'),manImage=$('#manifestoImage'),manCopy=$('#manifestoCopy');
if(man&&head&&manImage&&manCopy){
 gs.set(manImage,{xPercent:55,scale:.76,rotation:3,autoAlpha:0});
 gs.set(manCopy,{y:75,autoAlpha:0});
 const tl=timeline(man,.20);
 tl.to(head,{y:-90,scale:1.10,autoAlpha:0,duration:.30,ease:'power2.inOut'},.09)
 .to(manImage,{xPercent:0,scale:1,rotation:0,autoAlpha:1,duration:.52,ease:easing},.18)
 .to(manCopy,{y:0,autoAlpha:1,duration:.25,ease:'power2.out'},.60);
}
const identity=$('#identity'),idTitle=$('#identityTitle'),idCopy=$('.identity-content'),idGlint=$('.identity-glint');
if(identity&&idTitle&&idCopy){
 gs.set(idTitle,{xPercent:-50,yPercent:-50,x:0,y:0,scale:.60,rotation:-5,autoAlpha:.20});
 gs.set(idCopy,{y:60,autoAlpha:0});
 const tl=timeline(identity,.23);
 tl.to(idTitle,{scale:1.03,rotation:0,autoAlpha:.96,duration:.34,ease:easing},.05)
 .to(idTitle,{scale:.84,y:-63,autoAlpha:.28,duration:.34,ease:'power2.inOut'},.37)
 .to(idCopy,{y:0,autoAlpha:1,duration:.26,ease:'power2.out'},.49)
 .to(idGlint,{xPercent:200,duration:1},0);
}
const seam=$('#seam'),seamPicture=$('#seamPicture'),seamCopy=$('#seamCopy'),seamBands=$('#seamBands'),seamEnd=$('#seamEnd');
if(seam&&seamPicture&&seamCopy&&seamBands){
 gs.set(seamPicture,{scale:.63,borderRadius:35,autoAlpha:1});
 gs.set(seamCopy,{y:0,autoAlpha:1});
 gs.set(seamBands,{autoAlpha:0});
 gs.set(seamEnd,{y:55,autoAlpha:0});
 const bands=$$('.seam-band');
 bands.forEach((b,i)=>gs.set(b,{x:(i%2?-1:1)*Math.max(innerWidth*.95,440)}));
 const tl=timeline(seam,.23);
 tl.to(seamPicture,{scale:1.055,borderRadius:0,duration:.33,ease:easing},.03)
 .to(seamCopy,{y:-90,autoAlpha:0,duration:.17,ease:'power2.in'},.22)
 .to(seamBands,{autoAlpha:1,duration:.1},.27)
 .to(seamPicture,{autoAlpha:.33,duration:.28},.46);
 bands.forEach((b,i)=>tl.to(b,{x:0,duration:.40,ease:'power3.inOut'},.30+i*.027));
 tl.to(seamEnd,{y:0,autoAlpha:1,duration:.20,ease:'power2.out'},.79);
 tl.eventCallback('onUpdate',()=>{($('#seamMeter')||{textContent:''}).textContent=String(Math.round(tl.progress()*100)).padStart(3,'0')+'%'});
}
const world=$('#world'),worldCopy=$('.world-copy'),worldScenes=$$('.world-scene');
if(world&&worldCopy&&worldScenes.length===3){
 const values=window.__yslrpI18n?.dict;
 const labels=['THE STREETS','THE ROAD','THE PEOPLE'];
 const plates=[];
 worldCopy.replaceChildren();
 for(let i=0;i<3;i++){
  const node=document.createElement('div');node.className='world-text-layer';
  node.innerHTML='<span class="world-act"></span><h2 class="world-title"></h2><p class="world-description"></p>';
  node.dataset.plate=String(i);worldCopy.appendChild(node);plates.push(node);
 }
 function setWorldLang(){
  const lang=document.documentElement.lang.startsWith('zh')?'zh':'en';
  const d=values?.[lang];if(!d)return;
  plates.forEach((p,i)=>{$('.world-act',p).textContent='0'+(i+1)+' / '+labels[i];$('.world-title',p).innerHTML=d['worldTitle'+i];$('.world-description',p).textContent=d['worldDesc'+i]});
 }
 setWorldLang();new MutationObserver(setWorldLang).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 gs.set(plates[0],{autoAlpha:1,y:0});gs.set(plates.slice(1),{autoAlpha:0,y:62});
 gs.set(worldScenes[0],{autoAlpha:1});gs.set(worldScenes[1],{clipPath:'inset(0 100% 0 0)',autoAlpha:1});gs.set(worldScenes[2],{clipPath:'inset(100% 0 0 0)',autoAlpha:1});
 const tl=timeline(world,.22);
 tl.to(worldScenes[0].querySelector('img'),{scale:1.13,duration:1},0)
 .to(worldScenes[1],{clipPath:'inset(0 0% 0 0)',duration:.35,ease:easing},.18)
 .to(plates[0],{y:-70,autoAlpha:0,duration:.16,ease:'power2.in'},.18)
 .to(plates[1],{y:0,autoAlpha:1,duration:.19,ease:'power2.out'},.30)
 .to(worldScenes[2],{clipPath:'inset(0% 0 0 0)',duration:.35,ease:easing},.58)
 .to(plates[1],{y:-70,autoAlpha:0,duration:.17,ease:'power2.in'},.62)
 .to(plates[2],{y:0,autoAlpha:1,duration:.19,ease:'power2.out'},.74);
 tl.eventCallback('onUpdate',()=>{
  const p=tl.progress(),idx=p<.36?0:p<.72?1:2;
  $('#worldCount').innerHTML='0'+(idx+1)+' <span>/ 03</span>';
  $$('#worldBars i').forEach((b,i)=>b.classList.toggle('active',i===idx));
 });
}
const roles=$('#roles'),track=$('#rolesTrack'),rolesViewport=$('.roles-viewport');
if(roles&&track&&rolesViewport){
 gs.set(track,{x:0});
 const tl=gs.to(track,{x:()=>-(Math.max(0,track.scrollWidth-rolesViewport.clientWidth)),ease:'none',scrollTrigger:{
  trigger:roles,start:'top top',end:'bottom bottom',scrub:.21,invalidateOnRefresh:true
 }});
 tl.eventCallback('onUpdate',()=>{const n=Math.min(3,Math.round(tl.progress()*3));$('#rolesCount').textContent='0'+(n+1)+' — 04';});
}
const principle=$('.principles-scene'),ribbon=$('#principlesRibbon'),pSection=$('#principles');
if(principle&&ribbon&&pSection){
 const phrases={
 zh:[['01 / IC','成为角色，而不是操纵角色。','进入城市后，以虚构人物的身份交流。行为和故事应符合人物处境，尊重 IC 与 OOC 的边界。'],['02 / COMMUNITY','你不是唯一的主角。','倾听、回应、协作，让每个人的角色都有参与故事的空间。'],['03 / CONTINUITY','让选择有原因，也有后续。','长期故事来自自然的互动。遵守规则和公平原则，才能让角色与关系持续发展。']],
 en:[['01 / IC','BE YOUR CHARACTER.','Interact through a fictional identity. Keep in-character and out-of-character communication separate.'],['02 / COMMUNITY','SHARE THE STORY.','Listen, respond and collaborate. Other players deserve space to shape the narrative.'],['03 / CONTINUITY','LET CHOICES MATTER.','Long-running stories grow through everyday interactions, fair play and community rules.']]
 };
 const plates=[],ribbons=[];
 principle.replaceChildren();ribbon.replaceChildren();
 for(let i=0;i<3;i++){
  const p=document.createElement('div');p.className='principle-plate';p.innerHTML='<span class="principles-scene-id"></span><h3></h3><p></p>';principle.appendChild(p);plates.push(p);
  const r=document.createElement('span');r.className='principle-ribbon-label';r.textContent=['IC','RP','∞'][i];ribbon.appendChild(r);ribbons.push(r);
 }
 function localize(){const lang=document.documentElement.lang.startsWith('zh')?'zh':'en';plates.forEach((p,i)=>{$('.principles-scene-id',p).textContent=phrases[lang][i][0];$('h3',p).textContent=phrases[lang][i][1];$('p',p).textContent=phrases[lang][i][2]});}
 localize();new MutationObserver(localize).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 gs.set(plates[0],{autoAlpha:1,y:0});gs.set(plates.slice(1),{autoAlpha:0,y:55});gs.set(ribbons[0],{autoAlpha:1,y:0});gs.set(ribbons.slice(1),{autoAlpha:0,y:20});
 const tl=timeline(pSection,.23);
 tl.to(plates[0],{autoAlpha:0,y:-55,duration:.12},.26)
 .to(ribbons[0],{autoAlpha:0,y:-28,duration:.12},.26)
 .to(plates[1],{autoAlpha:1,y:0,duration:.15},.32)
 .to(ribbons[1],{autoAlpha:1,y:0,duration:.15},.32)
 .to(plates[1],{autoAlpha:0,y:-55,duration:.12},.60)
 .to(ribbons[1],{autoAlpha:0,y:-25,duration:.12},.60)
 .to(plates[2],{autoAlpha:1,y:0,duration:.16},.68)
 .to(ribbons[2],{autoAlpha:1,y:0,duration:.16},.68)
 .to('.p-orbit-one',{rotation:50,xPercent:9,duration:1},0)
 .to('.p-orbit-two',{rotation:-48,xPercent:-12,duration:1},0);
 tl.eventCallback('onUpdate',()=>{
  const p=tl.progress(),idx=p<.33?0:p<.69?1:2;
  $('#principlesCounter').textContent='0'+(idx+1)+' / 03';
  $$('.principles-bars i').forEach((b,i)=>b.classList.toggle('active',i===idx));
 });
}
if(finePointer){
 const cursor=$('#kineticCursor'),glow=$('#pointerGlow');
 const cx=gs.quickTo(cursor,'x',{duration:.3,ease:'power3.out'}),cy=gs.quickTo(cursor,'y',{duration:.3,ease:'power3.out'});
 const gx=gs.quickTo(glow,'left',{duration:.42,ease:'power2.out'}),gy=gs.quickTo(glow,'top',{duration:.42,ease:'power2.out'});
 document.body.classList.add('cinematic-pointer');
 document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;document.body.classList.add('pointer-active');cx(e.clientX);cy(e.clientY);gx(e.clientX);gy(e.clientY);cursor.classList.toggle('is-action',!!e.target.closest('a,button'));},{passive:true});
 document.addEventListener('pointerleave',()=>{document.body.classList.remove('pointer-active');gs.set(cursor,{x:-200,y:-200})});
 $$('.hero-ctas .pill,.header-join').forEach(el=>{
  const qx=gs.quickTo(el,'x',{duration:.34,ease:'power3.out'}),qy=gs.quickTo(el,'y',{duration:.34,ease:'power3.out'});
  el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();qx((e.clientX-r.left-r.width/2)*.09);qy((e.clientY-r.top-r.height/2)*.14)},{passive:true});
  el.addEventListener('pointerleave',()=>{qx(0);qy(0)});
 });
}
const exp=$('#experience'),join=$('#join');
if(exp)gs.fromTo('.experience-stage',{y:65,opacity:.78},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:exp,start:'top bottom',end:'top 32%',scrub:.24}});
if(join)gs.fromTo('#entryHeading',{y:75,opacity:.55},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:join,start:'top bottom',end:'top 35%',scrub:.22}});
Promise.all([document.fonts?.ready||Promise.resolve(),...$$('main img').filter(im=>im.loading!=='lazy').map(im=>im.decode().catch(()=>{}))]).then(()=>ST.refresh(true));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)ST.refresh(true)});
window.addEventListener('pageshow',()=>ST.refresh(true));
window.__YSLRP_MOTION_V11={get version(){return '11.0.0'},get timelines(){return ST.getAll().length},lenis:!!lenis};
})();
