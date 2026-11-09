(()=>{'use strict';const $$=(s)=>[...document.querySelectorAll(s)];
const portalText={
  zh:{eyebrow:'每一步向前，都是新篇章。',title:'故事不会<br><em>停在一张图片里。</em>',desc:'在这里，世界不会等你读完介绍才开始运转。向下滚动，让眼前的城市从宁静走向鲜活。',end:'真正的故事，始于相遇。',hint:'滚动以推动场景 / SCROLL TO DIRECT'},
  en:{eyebrow:'EVERY STEP BECOMES A NEW CHAPTER.',title:'THE STORY<br><em>WON’T STAY STILL.</em>',desc:'This city never waits for an introduction to finish. Scroll to change the scene, from quiet horizons to lives in motion.',end:'EVERY STORY BEGINS WITH A MEETING.',hint:'SCROLL TO DIRECT THE SCENE'}
 };
 function syncLocale(){const lang=document.documentElement.lang.startsWith('zh')?'zh':'en';const t=portalText[lang];$$('[data-seam-i18n]').forEach(el=>{const key=el.dataset.seamI18n;if(!t[key])return;if(key==='title')el.innerHTML=t[key];else el.textContent=t[key]});}
 new MutationObserver(syncLocale).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});syncLocale();
 
})();