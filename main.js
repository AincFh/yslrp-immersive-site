(()=>{'use strict';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile=window.matchMedia('(max-width: 600px)').matches;
const header=$('#siteHeader'),progress=$('#readProgress'),heroMedia=$('#heroMedia');
const track=$$('.side-track a'),anchors=$$('main section[id]');
let lastY=0,scrollTicking=false;
function onScroll(){
 const y=window.scrollY,max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
 progress.style.width=(y/max*100)+'%';
 header.classList.toggle('is-solid',y>32);
 if(!$('#overlayNav').classList.contains('open') && y>450 && y>lastY+10)header.classList.add('is-hidden');
 else if(y<lastY-8 || y<100)header.classList.remove('is-hidden');
 lastY=y;
 if(!reduced && !mobile && y<window.innerHeight*1.4)heroMedia.style.transform='translate3d(0,'+Math.min(y*.2,185)+'px,0)';
 let active='home';
 for(const s of anchors){if(s.getBoundingClientRect().top<window.innerHeight*.54)active=s.id;}
 track.forEach(a=>{const yes=a.dataset.section===active;a.classList.toggle('active',yes);if(yes)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
 updateJourney();
 scrollTicking=false;
}
window.addEventListener('scroll',()=>{if(!scrollTicking){scrollTicking=true;requestAnimationFrame(onScroll)}},{passive:true});
window.addEventListener('resize',()=>requestAnimationFrame(onScroll),{passive:true});
const menu=$('#overlayNav'),toggle=$('#menuToggle');
function setMenu(open){menu.classList.toggle('open',open);menu.inert=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'关闭菜单':'打开菜单');document.body.style.overflow=open?'hidden':'';header.classList.remove('is-hidden');if(open)$('#menuClose').focus();else toggle.focus();}
toggle.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
$('#menuClose').addEventListener('click',()=>setMenu(false));
$$('#overlayNav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
const city=[
 {img:'/assets/city-sunset.webp',title:'城市的第一束光。',alt:'游戏世界日落街景'},
 {img:'/assets/city-hub.webp',title:'每条路，都有故事。',alt:'游戏世界城市交通枢纽'},
 {img:'/assets/highway.webp',title:'夜色还没有结束。',alt:'游戏世界高速公路与执法车辆'}
];
const cityImage=$('#cityImage');
$$('[data-city]').forEach(btn=>btn.addEventListener('click',()=>{
 const i=+btn.dataset.city,d=city[i];if(!d)return;
 $$('[data-city]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
 cityImage.style.opacity='0.25';
 const preload=new Image();preload.onload=()=>{cityImage.src=d.img;cityImage.alt=d.alt;cityImage.style.opacity='1'};preload.src=d.img;
 $('#cityTitleChange').textContent=d.title;
}));
const stories=[
 {eyebrow:'ACT 01 / A NEW BEGINNING',number:'01',title:'第一天，<br>来到这座城。',copy:'这里没有预设好的主角。你从一段普通旅程开始，认识街区、学习规则，慢慢找到自己的生活节奏。',img:'/assets/city-sunset.webp'},
 {eyebrow:'ACT 02 / THE CITY IS ALIVE',number:'02',title:'与人相遇，<br>让故事发生。',copy:'这里不只是道路和建筑。来自不同背景的玩家，共同让街区、工作与偶然相遇变成有温度的故事。',img:'/assets/city-hub.webp'},
 {eyebrow:'ACT 03 / FIND YOUR PURPOSE',number:'03',title:'下一段路，<br>由你来决定。',copy:'投身城市生活，或选择虚构的警务、医疗与司法角色。重要的不只是你做什么，而是你如何成为这个世界的一部分。',img:'/assets/highway.webp'}
];
let journeyIndex=-1;
function updateJourney(){
 const flow=$('#journeyFlow'),rect=flow.getBoundingClientRect();
 const travel=flow.offsetHeight-window.innerHeight;
 if(travel<=0)return;
 const t=Math.min(1,Math.max(0,-rect.top/travel));
 const idx=Math.min(2,Math.floor(Math.min(.99999,t)*3));
 if(idx!==journeyIndex){
 journeyIndex=idx;const d=stories[idx];
 $('#journeyEyebrow').textContent=d.eyebrow;
 $('#journeyBigNumber').textContent=d.number;
 $('#journeyHeadline').innerHTML=d.title;
 $('#journeyCopy').textContent=d.copy;
 const img=$('#journeyImage');img.style.opacity='.55';const preload=new Image();preload.onload=()=>{if(journeyIndex===idx){img.src=d.img;img.style.opacity='1'}};preload.src=d.img;
 $$('.journey-stepper span').forEach((s,n)=>s.classList.toggle('current',n===idx));
 }
 if(!reduced){const p=$('#journeyPhoto');p.style.transform='scale('+(1.04+t*.11)+') translate3d(0,'+(t*2)+'%,0)';}
}
const roles=[
 {img:'/assets/city-hub.webp',label:'LIFE IN SAN ANDREAS / 01',title:'从平凡的一天，<br>开始你的故事。',description:'探索街区、建立关系、参与城市日常。每次相遇，可能是新故事的开端。',alt:'游戏世界城市生活场景'},
 {img:'/assets/police.webp',label:'LAW ENFORCEMENT / 02',title:'在城市一线，<br>回应每次呼叫。',description:'警务角色面对的是紧张现场、团队协作与责任；所有行为依照游戏设定和服务器规则进行。',alt:'游戏内警务执法场景'},
 {img:'/assets/medical.webp',label:'MEDICAL RESPONSE / 03',title:'在需要的时刻，<br>带来帮助。',description:'在虚构医院和救援现场与其他角色互动，共同经历紧急处置和城市日常。',alt:'游戏内医院与医疗场景'},
 {img:'/assets/justice.webp',label:'JUSTICE & LAW / 04',title:'让每一次选择，<br>都有后续。',description:'围绕虚构法律、庭审、文书和故事冲突展开法务角色扮演，不涉及现实法律服务。',alt:'游戏内司法庭审场景'}
];
const roleButtons=$$('[data-role]');
function selectRole(idx,focus=false){
 const d=roles[idx],img=$('#roleImage'),panel=$('#role-panel');if(!d)return;
 roleButtons.forEach((b,i)=>{const selected=i===idx;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});
 panel.setAttribute('aria-labelledby','role-tab-'+idx);
 img.style.opacity='.2';const pre=new Image();pre.onload=()=>{img.src=d.img;img.alt=d.alt;img.style.opacity='1'};pre.src=d.img;
 $('#roleLabel').textContent=d.label;$('#roleHeadline').innerHTML=d.title;$('#roleDescription').textContent=d.description;
 if(focus)roleButtons[idx].focus();
}
roleButtons.forEach((b,i)=>{b.addEventListener('click',()=>selectRole(i));b.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();selectRole((i+1)%roles.length,true)}else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();selectRole((i+roles.length-1)%roles.length,true)}})});
const gallery=[
 {img:'/assets/police.webp',title:'城市的另一面。',alt:'FiveM 警务主题游戏场景'},
 {img:'/assets/medical.webp',title:'每一次守护。',alt:'FiveM 医疗主题游戏场景'},
 {img:'/assets/justice.webp',title:'秩序与选择。',alt:'FiveM 司法主题游戏场景'},
 {img:'/assets/port.webp',title:'不眠的港区。',alt:'FiveM 港区工业场景'}
];
let galleryIdx=0,wasFocused=null;
function chooseGallery(i){
 const d=gallery[i];if(!d)return;galleryIdx=i;
 $$('.gallery-thumb').forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));
 const img=$('#galleryMainImage');img.style.opacity='.28';
 const pre=new Image();pre.onload=()=>{if(galleryIdx===i){img.src=d.img;img.alt=d.alt;img.style.opacity='1'}};pre.src=d.img;
 $('#galleryMainTitle').textContent=d.title;$('#galleryCounter').innerHTML=String(i+1).padStart(2,'0')+' / 04<br>IN-GAME ENVIRONMENTS';
}
$$('[data-gallery]').forEach(b=>b.addEventListener('click',()=>chooseGallery(+b.dataset.gallery)));
const lightbox=$('#lightbox');
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow='';if(wasFocused)wasFocused.focus();}
function openLightbox(){const d=gallery[galleryIdx];wasFocused=document.activeElement;$('#lightboxImg').src=d.img;$('#lightboxImg').alt=d.alt;$('#lightboxCaption').textContent=d.title+' — '+(galleryIdx+1)+' / 4';lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('#lightboxClose').focus();}
$('#galleryOpen').addEventListener('click',openLightbox);$('#lightboxClose').addEventListener('click',closeLightbox);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(lightbox.classList.contains('open'))closeLightbox();if(menu.classList.contains('open'))setMenu(false)}if(!lightbox.classList.contains('open'))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){chooseGallery((galleryIdx+(e.key==='ArrowRight'?1:3))%4);const d=gallery[galleryIdx];$('#lightboxImg').src=d.img;$('#lightboxImg').alt=d.alt;$('#lightboxCaption').textContent=d.title+' — '+(galleryIdx+1)+' / 4';}if(e.key==='Tab'){e.preventDefault();$('#lightboxClose').focus()}});
$('#year').textContent=String(new Date().getFullYear());
if(!reduced&&'IntersectionObserver'in window){document.body.classList.add('motion-ready');const obs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');obs.unobserve(entry.target)}})},{threshold:.05,rootMargin:'0px 0px -30px 0px'});$$('.reveal').forEach(n=>obs.observe(n));}
onScroll();
})();