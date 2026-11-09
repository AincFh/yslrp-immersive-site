/* YSLRP Editorial Cinema v12 — presentation enhancements, non-destructive.
 * No new scroll controller, no external requests, no rewrite of site content.
 * Depends only on existing DOM/illustrations. Works with its i18n layer.
 */
(() => {
 'use strict';
 const $=(s,p=document)=>p.querySelector(s);
 const $$=(s,p=document)=>[...p.querySelectorAll(s)];
 const doc=document.documentElement;
 document.body.classList.add('v12-editorial');
 doc.dataset.artDirection='editorial-cinema-v12';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

 function mark(sel,content,cls){
  const root=$(sel);if(!root)return;
  const el=document.createElement('div');
  el.className=cls;
  el.textContent=content;
  el.setAttribute('aria-hidden','true');
  root.appendChild(el);
  return el;
 }
 const epigraph=mark('.hero-sticky','A world\nin the making.','v12-hero-epigraph');
 if(epigraph){
  epigraph.style.whiteSpace='pre-line';
  const k=document.createElement('span');k.textContent='SAINT LAURENT / 2026';epigraph.appendChild(k);
 }
 mark('.hero-sticky','EST. / SAN ANDREAS — 001','v12-film-mark');
 const margin=mark('.manifesto-sticky','THE CITY IS NOT A SCRIPT','v12-marginalia');
 margin?.setAttribute('data-tone','dark');

 // Give information-only role panels a visual narrative using photographs
 // that are already present in this site's authored image sequence.
 const photoCandidates=[
  $('.world-scene[data-scene="0"] img'),
  $('.world-scene[data-scene="1"] img'),
  $('.world-scene[data-scene="2"] img'),
  $('#manifestoImage img'),
  $('.hero-photo-fallback img'),
  $('#seamPicture img')
 ].filter(Boolean);
 const unique=[];
 for(const im of photoCandidates){
   const src=im.currentSrc||im.src||im.getAttribute('src');
   if(src&&!unique.some(x=>x.src===src))unique.push({src,alt:im.alt||''});
 }
 const panels=$$('.role-panel');
 panels.forEach((panel,i)=>{
   if($('.v12-role-image',panel)||!unique.length)return;
   const source=unique[i%unique.length];
   const visual=document.createElement('div');visual.className='v12-role-image';visual.setAttribute('aria-hidden','true');
   const img=document.createElement('img');
   img.src=source.src;img.alt='';img.decoding='async';img.loading=i===0?'eager':'lazy';
   visual.append(img);
   panel.prepend(visual);
 });

 // Turn the RP decision exercise into an illustrated journal spread,
 // without changing its buttons, choice state, or explanatory semantics.
 const scene=$('#experience .experience-left');
 if(scene && unique.length && !$('.v12-experience-photo',scene)){
   const visual=document.createElement('div');
   visual.className='v12-experience-photo';
   visual.setAttribute('aria-hidden','true');
   const image=document.createElement('img');
   image.src=unique[Math.min(2,unique.length-1)].src;
   image.alt='';image.decoding='async';image.loading='lazy';
   visual.append(image);
   scene.prepend(visual);
 }

 // One understated cinematic drift, driven by the same GSAP/ScrollTrigger
 // clock already responsible for section progress (no wheel interception).
 if(!reduced&&epigraph&&window.gsap&&window.ScrollTrigger){
   window.gsap.to(epigraph,{y:-70,autoAlpha:.14,ease:'none',scrollTrigger:{
     trigger:'#home',start:'top top',end:'bottom top',scrub:.35
   }});
 }
 // Keep an inspectable status for preview QA.
 window.__YSLRP_ART_DIRECTION={
  version:'12.0.0',
  direction:'Cinematic Editorial / City Portrait',
  photographyPanels:panels.filter(p=>!!$('.v12-role-image img',p)).length,
  sourcesReused:unique.length,
  illustratedExperience:!!$('.v12-experience-photo img'),
  get reducedMotion(){return reduced}
 };
})();