(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const header=$('#header'),progress=$('#progress'),menu=$('#mobileNav'),btn=$('#menuButton');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastY=0,ticking=false;
function onScroll(){const y=scrollY,limit=Math.max(1,document.documentElement.scrollHeight-innerHeight);progress.style.width=`${Math.max(0,Math.min(100,y/limit*100))}%`;header.classList.toggle('is-solid',y>55);lastY=y;let active='home';for(const s of $$('main section[id]'))if(s.getBoundingClientRect().top<innerHeight*.48)active=s.id;$$('.chapter a').forEach(a=>a.classList.toggle('active',a.dataset.section===active));$$('.nav a').forEach(a=>a.classList.toggle('current',a.getAttribute('href')==='#'+active));ticking=false;}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});addEventListener('resize',()=>requestAnimationFrame(onScroll),{passive:true});
function setMenu(open){menu.classList.toggle('open',open);menu.inert=!open;btn.setAttribute('aria-expanded',String(open));document.body.style.overflow=open?'hidden':'';if(open)$('#closeMenu').focus();else btn.focus();}
btn.addEventListener('click',()=>setMenu(true));$('#closeMenu').addEventListener('click',()=>setMenu(false));$$('#mobileNav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open'))setMenu(false)});
const scenes=[{heading:'初到洛圣都',text:'你刚进入城市。陌生的街道、路过的玩家，以及一个等待被创造的新身份。'},{heading:'故事来自相遇',text:'你在街角遇到另一名玩家。通过中文语音交流、相互协作与各自的角色动机，你们把一段普通对话变成故事。'},{heading:'让角色拥有方向',text:'熟悉城市之后，你可以选择日常工作、商业活动或公共服务等角色路线。新的关系与责任，让故事继续发展。'}];
const steps=$$('[data-step]');function selectScene(i){const s=scenes[i];if(!s)return;$('#sceneNumber').textContent=String(i+1).padStart(2,'0');$('#sceneHeading').textContent=s.heading;$('#sceneText').textContent=s.text;steps.forEach((b,n)=>b.setAttribute('aria-pressed',String(i===n)));$$('.scene-progress span').forEach((el,n)=>el.classList.toggle('active',n===i));}
steps.forEach(b=>b.addEventListener('click',()=>selectScene(Number(b.dataset.step))));
const careers=[{kicker:'LIFE / BUSINESS',title:'从一次普通的相遇开始。',desc:'认识朋友、探索街区、体验生活与工作。在玩家之间的自然互动中，形成自己的关系与长期故事。',tone:'#3f5a5d'},{kicker:'LAW / ROADS',title:'在城市一线，回应真实的互动。',desc:'通过警务和道路执法等虚构身份，体验团队协作、沟通与现场处理。所有行动均依照服务器游戏规则进行。',tone:'#3b4f65'},{kicker:'FIRE / MEDICAL',title:'在紧急时刻，与城市同行。',desc:'以消防、医护和公共救援等游戏角色参与剧情，协作应对紧张现场，也保留普通日常的节奏。',tone:'#536252'},{kicker:'JUSTICE / PUBLIC SERVICE',title:'用制度与选择，延续一段故事。',desc:'了解虚构司法、政府及公共服务角色在城市世界观中的作用；并非现实法律、政府或公共服务。',tone:'#62534b'}];
const careerButtons=$$('[data-career]');function selectCareer(i,focus=false){const c=careers[i];if(!c)return;careerButtons.forEach((b,n)=>{const yes=n===i;b.setAttribute('aria-selected',String(yes));b.tabIndex=yes?0:-1;});$('#careerPanel').setAttribute('aria-labelledby',`career-tab-${i}`);$('#careerKicker').textContent=`LIFE PATH / ${String(i+1).padStart(2,'0')} — ${c.kicker}`;$('#careerMark').textContent=String(i+1).padStart(2,'0');$('#careerTitle').textContent=c.title;$('#careerDescription').textContent=c.desc;$('#careerPanel').style.background=`radial-gradient(circle at 80% 80%,${c.tone}bb,transparent 45%),linear-gradient(130deg,#314351,#111b27)`;if(focus)careerButtons[i].focus();}
careerButtons.forEach((b,i)=>{b.addEventListener('click',()=>selectCareer(i));b.addEventListener('keydown',e=>{if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const ni=e.key==='Home'?0:e.key==='End'?careerButtons.length-1:(i+(e.key==='ArrowRight'||e.key==='ArrowDown'?1:careerButtons.length-1))%careerButtons.length;selectCareer(ni,true)}})});
$('#copyCommand').addEventListener('click',async()=>{const text='connect pga8dp7',status=$('#copyStatus');try{if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);else{const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();if(!ok)throw new Error('copy blocked');}status.textContent='已复制';}catch(err){status.textContent='请手动选中指令复制';}});
// Animations are additive only; no information depends on their execution.
if(!reduced&&'IntersectionObserver'in window){document.documentElement.classList.add('js-motion');const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target)}}),{rootMargin:'0px 0px -25px 0px',threshold:.025});$$('.reveal').forEach(e=>obs.observe(e));}

// Scroll-driven original motion scene. This interaction does not control navigation or access to content.
const storyItems=[
 {label:'ACT I · ARRIVAL',heading:'一座城市，<br>等待你的到来。',text:'第一次来到城里，从认识一条街、一位玩家、一次简单的语音交流开始。你的身份不由预设的剧情决定。'},
 {label:'ACT II · CONNECTION',heading:'一个选择，<br>让故事发生。',text:'轻量 RP 的精彩来自人与人的互动。善意、误会、合作与冲突，都需要合理的角色动机和彼此尊重。'},
 {label:'ACT III · BELONGING',heading:'下一段生活，<br>由你亲自书写。',text:'在城市中寻找自己的方向：普通市民、商业、公共服务或其他职业路线。真实玩家，让这座虚构的城市持续生长。'}
];
let sceneAct=-1;const storyRail=$('#storyRail');
function cinematicScroll(){if(!storyRail)return;const rect=storyRail.getBoundingClientRect(), travel=storyRail.offsetHeight-innerHeight;if(travel<=1)return;const t=Math.max(0,Math.min(1,-rect.top/travel)),act=Math.min(2,Math.floor(t*3));if(act!==sceneAct){sceneAct=act;const s=storyItems[act];$('#storyLabel').textContent=s.label;$('#storyHeading').innerHTML=s.heading;$('#storyText').textContent=s.text;$('#storyCounter').textContent=String(act+1).padStart(2,'0')+' — 03';$('#storyArt').dataset.act=String(act);$$('.story-steps i').forEach((n,i)=>n.classList.toggle('active',i===act));}
 if(!reduced){$('#storyArt').style.transform=`translate3d(${(t-.5)*-3}%,${(t-.5)*-6}%,0) scale(${1.06+t*.16}) rotate(${t*7-3}deg)`;}
}
addEventListener('scroll',()=>requestAnimationFrame(cinematicScroll),{passive:true});addEventListener('resize',cinematicScroll,{passive:true});cinematicScroll();
// Gentle hero environmental response. Pointer input is enhancement, not a requirement.
const mapFrame=$('.hero-map-frame');if(mapFrame&&!reduced&&matchMedia('(pointer:fine)').matches){mapFrame.addEventListener('pointermove',e=>{const r=mapFrame.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;mapFrame.style.transform=`perspective(1100px) rotateY(${x*9-7}deg) rotateX(${y*-7+3}deg) scale(1.015)`});mapFrame.addEventListener('pointerleave',()=>mapFrame.style.transform='');}

onScroll();
})();
