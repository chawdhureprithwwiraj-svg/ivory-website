/* Ivory house engine — ticker, clock, doorway round, quiet door, shelf, vault, dust, reveals, pulse, share.
   Every part checks that its own corner of the page exists before it runs, so one file serves every page. */
(function(){
'use strict';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(s){return document.querySelector(s)}
function $$(s){return Array.prototype.slice.call(document.querySelectorAll(s))}
function p2(n){return(n<10?'0':'')+n}
function ist(){return new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}))}
/* ---- 1 · the house ticker ---- */
if($('#tkt')){(function(){
var L=['The Ladder turns at four in the morning, house time.','Marks are earned, never bought.','The Vault keeps its own hours.','Every cheer freezes the ribbon for a moment.','Twelve rungs. One ladder. No shortcuts.','Private sessions are never recorded by the house.','Fifteen places a day on the Private Line, never more than forty.','The Firstlist is chosen in order, and the order is Ivory’s.','Bells ring at 0, 7, 14, 25, 39, 51, 69, 85, 111, 139, 151, 169, 185 and 201.','Gold is not a colour here. It is a manner.'];
var C=['#D4AF37','#D42450','#FF9A1F','#14B87A','#9A55E6','#FF6FA5','#E3A857','#07402C','#D4AF37','#D42450'];
var h='';for(var r=0;r<2;r++){for(var i=0;i<L.length;i++){h+='<span class="msg"><span class="med" style="background:radial-gradient(circle at 35% 30%,#FFF3C4,'+C[i]+' 72%)">'+(i+1)+'</span>'+L[i]+'</span>';}}
$('#tkt').innerHTML=h;
var tk=$('#tk');tk.addEventListener('click',function(){tk.classList.toggle('paused')});
})();}
/* ---- 2 · house clock and the ladder strip ---- */
if($('#hclock')){(function(){
var rg=$('#rungs');if(rg&&!rg.children.length){for(var i=0;i<12;i++){var e=document.createElement('i');e.style.height=(18+i*3)+'px';rg.appendChild(e);}}
var li=0;
function tick(){var d=ist();$('#hclock').textContent=p2(d.getHours())+':'+p2(d.getMinutes())+':'+p2(d.getSeconds());
var t=new Date(d);t.setHours(4,0,0,0);if(t<=d)t.setDate(t.getDate()+1);var s=Math.max(0,Math.floor((t-d)/1000));
var cd=$('#hcd');if(cd)cd.textContent='THE LADDER TURNS IN '+p2(Math.floor(s/3600))+':'+p2(Math.floor(s/60)%60)+':'+p2(s%60);
if(rg){var k=rg.children;for(var i=0;i<k.length;i++)k[i].classList.toggle('lit',i<li);li=li>=12?1:li+1;}}
tick();setInterval(tick,1000);
})();}
/* ---- 3 · the doorway round of the Golden Knock-off ---- */
if($('#ko')){(function(){
var Q=[{q:'What time does the Ivory Ladder turn to a new day?',o:['Midnight','Four in the morning, house time','Six in the evening','Noon'],a:1},
{q:'How many Marks light the first treasure?',o:['10','25','50','100'],a:0},
{q:'What does the house do with a private session?',o:['Keeps it for eight years','Shares it with co-hosts','Never records it','Sells it after ninety days'],a:2}];
var el=$('#ko'),qi=0,sc=0,lock=false;
function render(){lock=false;var x=Q[qi];
el.innerHTML='<div class="qh">THE GOLDEN KNOCK-OFF &middot; DOORWAY ROUND &middot; '+(qi+1)+' / '+Q.length+'</div><div class="qcard" id="qc"><div class="qt">'+x.q+'</div>'+x.o.map(function(o,i){return '<button type="button" class="opt" data-i="'+i+'">'+o+'</button>'}).join('')+'</div>';
$$('.ko .opt').forEach(function(b){b.addEventListener('click',function(){if(lock)return;lock=true;var i=+b.getAttribute('data-i');
if(i===x.a){sc++;b.classList.add('right');}else{b.classList.add('wrong');$$('.ko .opt')[x.a].classList.add('right');}
setTimeout(function(){var c=$('#qc');if(c)c.classList.add('flip');setTimeout(function(){qi++;if(qi<Q.length){render();}else{end();}},480);},900);});});}
function end(){el.innerHTML='<div class="qh">DOORWAY ROUND &middot; COMPLETE</div><div class="score">'+sc+'/'+Q.length+'</div><p class="end">That was three questions at the door. The house plays twelve rungs deep, for Marks, on the Ivory Ladder — inside the app.</p><p><a class="btn" href="download.html">Open Ivory on Android &nbsp;&nearr;</a> <button type="button" class="btn btn-outline" id="again">Play the doorway again</button></p>';
var a=$('#again');if(a)a.addEventListener('click',function(){qi=0;sc=0;render();});}
render();
})();}
/* ---- 4 · the quiet door: three taps on any emblem ---- */
(function(){
var n=0,t0=0,sheet=null;
function build(){if(sheet)return sheet;sheet=document.createElement('div');sheet.className='qdoor';sheet.setAttribute('role','dialog');sheet.setAttribute('aria-label','A quiet note');
sheet.innerHTML='<p class="qn">Some doors are only found from inside.</p><a class="btn" href="download.html">Step inside &nbsp;&nearr;</a><div class="qj">THE QUIET DOOR &middot; IVORY</div>';
document.body.appendChild(sheet);
setTimeout(function(){sheet.classList.add('up');},60);
setTimeout(function(){sheet.classList.remove('up');},7000);
return sheet;}
$$('img').forEach(function(im){var alt=(im.getAttribute('alt')||'');if(/emblem|Ivory/i.test(alt)){im.style.cursor='pointer';im.addEventListener('click',function(){var now=Date.now();if(now-t0>4000)n=0;t0=now;n++;if(n>=3){n=0;build();}});}});
})();
/* ---- 5 · the firstlist shelf ---- */
if($$('.spine').length){(function(){
var l=$('#shlock');
$$('.spine').forEach(function(s){s.addEventListener('click',function(){s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');
if(l){l.textContent='Spine '+s.getAttribute('data-l')+' is locked. The Firstlist opens in the app.';setTimeout(function(){l.textContent='Chosen by Ivory, in order.';},2800);}});});
})();}
/* ---- 6 · the vault countdown ---- */
if($('#vcd')){(function(){
function tick(){var d=ist();var t=new Date(d);t.setHours(24,0,0,0);var s=Math.max(0,Math.floor((t-d)/1000));
$('#vcd').textContent=p2(Math.floor(s/3600))+':'+p2(Math.floor(s/60)%60)+':'+p2(s%60);}
tick();setInterval(tick,1000);
})();}
/* ---- 7 · gold dust in the hero ---- */
if($('#dust')&&!RM){(function(){
var cv=$('#dust'),host=cv.parentNode;
function size(){cv.width=host.clientWidth;cv.height=host.clientHeight;}
size();window.addEventListener('resize',size);
var cx=cv.getContext('2d'),P=[],N=40;
for(var i=0;i<N;i++)P.push({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.7+.4,v:Math.random()*.34+.1,o:Math.random()*.45+.15});
(function loop(){cx.clearRect(0,0,cv.width,cv.height);
for(var i=0;i<N;i++){var q=P[i];q.y-=q.v;if(q.y<-4){q.y=cv.height+4;q.x=Math.random()*cv.width;}
cx.beginPath();cx.arc(q.x,q.y,q.r,0,6.2832);cx.fillStyle='rgba(232,184,132,'+q.o+')';cx.fill();}
requestAnimationFrame(loop);})();
})();}
/* ---- 7 · scroll reveals ---- */
if($$('.rv').length){(function(){
if(RM||!('IntersectionObserver' in window)){$$('.rv').forEach(function(e){e.classList.add('in')});return;}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15});
$$('.rv').forEach(function(e){io.observe(e)});
})();}
/* ---- 8 · release pulse: reads the RELEASE box on the download page ---- */
if($('#pulse')){(function(){
var el=$('#pulse');
fetch('download.html',{cache:'no-store'}).then(function(r){return r.text();}).then(function(t){
var m=t.match(/status\s*:\s*['"](\w+)['"]/),v=t.match(/version\s*:\s*['"]([^'"]*)['"]/);
var st=m?m[1]:'pending';
if(st==='published'){el.textContent='BUILD '+(v&&v[1]?v[1]:'')+' IS LIVE ON THE RELEASE PAGE';el.classList.add('live');}
else{el.textContent='NEXT SELECTED BUILD: IN CHECKING';}
el.hidden=false;
}).catch(function(){el.hidden=true;});
})();}
/* ---- 8 · share the house ---- */
if($$('.sharebtn').length){(function(){
function toast(msg){var d=document.createElement('div');d.className='toast';d.textContent=msg;document.body.appendChild(d);setTimeout(function(){d.remove();},2600);}
$$('.sharebtn').forEach(function(b){b.addEventListener('click',function(){
var data={title:'Ivory — Every story leaves a mark',text:'A private world of storytelling for adults. Stories, voice and film, inside one golden app.',url:location.href};
if(navigator.share){navigator.share(data).catch(function(){});}
else if(navigator.clipboard){navigator.clipboard.writeText(data.text+' '+data.url).then(function(){toast('Copied. Paste it anywhere you like.');},function(){toast(location.href);});}
else{toast(location.href);}
});});
})();}
})();
/* END OF FILE - house.js */
  
