/* Ivory life layer - thread, ripples, hour tint, dial count-up, bell comet, page glide. */
(function(){
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!RM){var th=document.createElement('div');th.id='thread';document.body.appendChild(th);}
document.addEventListener('pointerdown',function(e){if(RM)return;var r=document.createElement('span');r.className='rip';r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';document.body.appendChild(r);setTimeout(function(){if(r.parentNode)r.parentNode.removeChild(r);},520);},true);
function tint(){var d=new Date();var u=d.getTime()+d.getTimezoneOffset()*60000;var h=new Date(u+19800000).getHours();
var c=h<4?'m-night':h<8?'m-dawn':h<12?'m-morn':h<17?'m-day':h<21?'m-eve':'m-night';
document.body.classList.remove('m-night','m-dawn','m-morn','m-day','m-eve');document.body.classList.add(c);}
tint();setInterval(tint,60000);
var ct=document.querySelector('#bellring text');
if(ct&&'IntersectionObserver'in window&&!RM){var io=new IntersectionObserver(function(en){if(en[0].isIntersecting){io.disconnect();
var t0=performance.now();function step(t){var k=Math.min(1,(t-t0)/900);var e2=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;ct.textContent=Math.round(202*e2)+' DAYS';if(k<1)requestAnimationFrame(step);}requestAnimationFrame(step);}},{threshold:.4});io.observe(ct);}
window.addEventListener('ivory:bell',function(){var s=document.querySelector('#bellring circle[aria-hidden="true"]');if(!s||RM)return;
s.classList.remove('comet');void s.getBoundingClientRect();s.classList.add('comet');setTimeout(function(){s.classList.remove('comet');},2100);
var svg=s.ownerSVGElement,cx=+s.getAttribute('cx'),cy=+s.getAttribute('cy'),C=110,ang=Math.atan2(cy-C,cx-C),dir=1;
for(var k=1;k<=5;k++){var a=ang-dir*k*.075,d=document.createElementNS('http://www.w3.org/2000/svg','circle');
d.setAttribute('cx',C+Math.cos(a)*95);d.setAttribute('cy',C+Math.sin(a)*95);d.setAttribute('r',Math.max(1,3.6-k*.55));
d.setAttribute('fill','#FF9A1F');d.setAttribute('class','trail');d.setAttribute('aria-hidden','true');svg.appendChild(d);
(function(el){setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},950);})(d);}});
if(!RM&&document.startViewTransition){document.addEventListener('click',function(e){var a=e.target.closest?e.target.closest('a[href]'):null;if(!a)return;
var h=a.getAttribute('href');if(h==='/'||/\.html$/.test(h)){if(a.target||e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();document.startViewTransition(function(){location.href=h;});}});}
})();
/* END OF FILE - life.js */
