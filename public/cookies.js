/* ═══════════════  DOTS · aviso de cookies  ═══════════════
   Google Analytics solo se carga después de aceptar. La decisión se guarda en este
   navegador y se puede cambiar desde cualquier elemento con data-cookie-prefs. */
(function(){
"use strict";
var KEY='dots-cookies';
var tr=window.t||function(s){return s};
function get(){try{return localStorage.getItem(KEY)}catch(e){return null}}
function set(v){try{localStorage.setItem(KEY,v)}catch(e){}}
function dropAnalyticsCookies(){
  document.cookie.split(';').forEach(function(c){
    var n=c.split('=')[0].trim();
    if(!/^_ga/.test(n)) return;
    document.cookie=n+'=; Max-Age=0; path=/';
    document.cookie=n+'=; Max-Age=0; path=/; domain=.'+location.hostname.replace(/^www\./,'');
  });
}
var bar=null;
function close(){ if(bar){bar.remove();bar=null} }
function choose(v){
  set(v); close();
  if(v==='granted'){ if(window.DOTS_loadAnalytics) window.DOTS_loadAnalytics(); }
  else dropAnalyticsCookies();
}
function open(){
  if(bar) return;
  var more=(location.pathname.indexOf('/en')===0?'/en':'')+'/privacidad#cookies';
  bar=document.createElement('div');
  bar.className='cookiebar';
  bar.setAttribute('role','region');
  bar.setAttribute('aria-label',tr('Aviso de cookies'));
  bar.innerHTML='<p>'+tr('Usamos cookies analíticas para saber cuánta gente visita DOTS. Solo se activan si las aceptas.')+
    ' <a href="'+more+'">'+tr('Más información')+'</a></p>'+
    '<div class="cb-actions"><button type="button" class="btn" data-v="denied">'+tr('Rechazar')+'</button>'+
    '<button type="button" class="btn" data-v="granted">'+tr('Aceptar')+'</button></div>';
  bar.addEventListener('click',function(e){var b=e.target.closest('button[data-v]'); if(b) choose(b.getAttribute('data-v'))});
  document.body.appendChild(bar);
}
document.addEventListener('click',function(e){ if(e.target.closest('[data-cookie-prefs]')){ e.preventDefault(); open(); } });
if(!get()) open();
})();
