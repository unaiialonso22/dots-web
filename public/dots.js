/* ═══════════════  DOTS · comportamiento común de las páginas interiores  ═══════════════
   Tema claro/oscuro, barra sólida al bajar, entradas al hacer scroll, preguntas
   desplegables y el año del pie. La landing lleva su propia versión junto al motor. */
(function(){
"use strict";
var root=document.documentElement;
var clamp=function(v,lo,hi){return v<lo?lo:(v>hi?hi:v)};

/* ── tema ── */
var mqDark=matchMedia('(prefers-color-scheme: dark)');
function stored(){try{return localStorage.getItem('dots-theme')}catch(e){return null}}
function currentTheme(){var s=stored();return s||(mqDark.matches?'dark':'light')}
function applyTheme(t,save){
  root.classList.toggle('dark',t==='dark');
  if(save){try{localStorage.setItem('dots-theme',t)}catch(e){}}
}
applyTheme(currentTheme(),false);
mqDark.addEventListener('change',function(){ if(!stored()) applyTheme(currentTheme(),false) });
var tog=document.getElementById('tog');
if(tog) tog.addEventListener('click',function(){ applyTheme(root.classList.contains('dark')?'light':'dark',true) });

/* ── barra ── */
var navEl=document.getElementById('nav'),navSolid=false;
function onNav(){
  var s=window.scrollY>24;
  if(s!==navSolid){navSolid=s;navEl.classList.toggle('solid',s)}
}
window.addEventListener('scroll',onNav,{passive:true});onNav();

/* ── entradas ── */
var revealSel='.rv,.stg,.divider,.level';
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      e.target.classList.add('in');
      if(e.target.classList.contains('stg')) setTimeout(function(){e.target.classList.add('done')},1400);
      io.unobserve(e.target);
    });
  },{threshold:.16,rootMargin:'0px 0px -8% 0px'});
  [].slice.call(document.querySelectorAll(revealSel)).forEach(function(el){io.observe(el)});
}else{
  [].slice.call(document.querySelectorAll(revealSel)).forEach(function(el){el.classList.add('in')});
  [].slice.call(document.querySelectorAll('.stg')).forEach(function(el){el.classList.add('done')});
}

/* ── preguntas ── */
[].slice.call(document.querySelectorAll('.qa')).forEach(function(qa,qi){
  var btn=qa.querySelector('button'),ans=qa.querySelector('.ans');
  if(!btn||!ans) return;
  ans.id=ans.id||'ans-'+(qi+1); btn.setAttribute('aria-controls',ans.id); ans.setAttribute('aria-hidden','true');
  btn.addEventListener('click',function(){
    if(qa.hasAttribute('open')){
      ans.style.height=ans.scrollHeight+'px';
      requestAnimationFrame(function(){ans.style.height='0px'});
      qa.removeAttribute('open');btn.setAttribute('aria-expanded','false');ans.setAttribute('aria-hidden','true');
    }else{
      qa.setAttribute('open','');btn.setAttribute('aria-expanded','true');ans.removeAttribute('aria-hidden');
      ans.style.height=ans.scrollHeight+'px';
      setTimeout(function(){if(qa.hasAttribute('open')) ans.style.height='auto'},520);
    }
  });
});

/* ── pie ── */
var yy=document.getElementById('yy'); if(yy) yy.textContent=new Date().getFullYear();

window.DOTS={clamp:clamp,applyTheme:applyTheme};
})();
