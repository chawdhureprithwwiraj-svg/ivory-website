/* Ivory house engine — ticker, clock, doorway round, quiet door, shelf, vault, dust, reveals, pulse, share.
   Every part checks that its own corner of the page exists before it runs, so one file serves every page. */
(function(){
'use strict';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(s){return document.querySelector(s)}
function $$(s){return Array.prototype.slice.call(document.querySelectorAll(s))}
function p2(n){return(n<10?'0':'')+n}
function ist(){return new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}))}

/* ---- the house instrument: thirteen voices, one synthesised hall ---- */
var SH=(function(){
var ac=null,master,conv,muted=false;
try{muted=localStorage.getItem('ivory_sound')==='off';}catch(e){}
function ctx(){if(ac)return ac;var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;ac=new AC();
master=ac.createGain();master.gain.value=.13;master.connect(ac.destination);
var len=Math.floor(ac.sampleRate*1.8),buf=ac.createBuffer(2,len,ac.sampleRate);
for(var c=0;c<2;c++){var d=buf.getChannelData(c);for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.7);}
conv=ac.createConvolver();conv.buffer=buf;var wet=ac.createGain();wet.gain.value=.42;conv.connect(wet);wet.connect(master);
return ac;}
function send(g){g.connect(master);g.connect(conv);}
function tone(f,t0,dur,type,peak){if(muted)return;var c=ctx();if(!c)return;if(c.state==='suspended')c.resume();
var o=c.createOscillator(),g=c.createGain(),t=c.currentTime+t0;
o.type=type||'sine';o.frequency.value=f;
g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak||.5,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
o.connect(g);send(g);o.start(t);o.stop(t+dur+.05);}
function noise(t0,dur,ftype,freq,peak,q){if(muted)return;var c=ctx();if(!c)return;if(c.state==='suspended')c.resume();
var len=Math.floor(c.sampleRate*dur),b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);
for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2);
var s=c.createBufferSource();s.buffer=b;var f=c.createBiquadFilter();f.type=ftype;f.frequency.value=freq;f.Q.value=q||1;
var g=c.createGain();g.gain.value=peak||.3;
s.connect(f);f.connect(g);send(g);s.start(c.currentTime+t0);}
var P=[523.25,587.33,659.25,783.99,880],li=0,mi=0;
var V={
link:function(){tone(P[li%5],0,.5,'sine',.4);tone(P[li%5]*2,0,.22,'sine',.12);li++;},
btn:function(){tone(880,0,.5,'triangle',.45);tone(1320,.05,.4,'sine',.25);},
outline:function(){tone(660,0,.45,'sine',.35);tone(990,.05,.3,'sine',.15);},
faq:function(){noise(0,.16,'bandpass',2400,.25,3);tone(987,0,.35,'sine',.2);},
ticker:function(){noise(0,.4,'lowpass',700,.3);},
coin:function(){tone(1046,0,.14,'triangle',.35);tone(1568,.09,.3,'triangle',.3);},
right:function(){tone(523.25,0,.4,'triangle',.4);tone(659.25,.09,.4,'triangle',.4);tone(783.99,.18,.6,'triangle',.45);tone(1046.5,.27,.9,'sine',.3);},
wrong:function(){tone(196,0,.9,'sine',.35);tone(247,.02,.8,'sine',.2);},
spine:function(){noise(0,.09,'bandpass',320,.5,2);tone(180,0,.2,'sine',.4);},
vault:function(){tone(110,0,2.6,'sine',.5);tone(276,0,1.8,'sine',.18);tone(412,0,1.2,'sine',.1);noise(0,.5,'lowpass',300,.2);},
mark:function(){var f=P[mi%5]*((mi/5|0)?2:1);mi=(mi+1)%10;tone(f,0,.35,'sine',.35);tone(f*2,0,.15,'sine',.12);},
share:function(){noise(0,.5,'highpass',3000,.25);tone(1568,0,.6,'sine',.25);},
emblem:function(){tone(2093,0,.12,'sine',.15);},
bellchime:function(){tone(880,0,1.2,'sine',.4);tone(1318,.06,1,'sine',.22);tone(1760,.12,.8,'sine',.12);}};
function play(n){if(!muted&&V[n])V[n]();}
function toggle(){muted=!muted;try{localStorage.setItem('ivory_sound',muted?'off':'on');}catch(e){}return muted;}
return{play:play,toggle:toggle,muted:function(){return muted}};
})();
/* one ear for the whole house: every touch finds its voice */
(function(){
var mb=document.createElement('button');mb.type='button';mb.className='sndbtn';mb.setAttribute('aria-label','Toggle house sound');
function paint(){mb.innerHTML=SH.muted()?'&#128277;':'&#128276;';}
mb.addEventListener('click',function(){SH.toggle();paint();});
document.addEventListener('DOMContentLoaded',function(){document.body.appendChild(mb);paint();});
if(document.body){document.body.appendChild(mb);paint();}
var RULES=[['#ringbtn','bellchime'],['.sharebtn','share'],['.ko .opt','coin'],['.spine','spine'],['#markbox','mark'],['.vt .door','vault'],['summary','faq'],['#tk','ticker'],['.btn-outline','outline'],['.btn','btn'],['a','link']];
document.addEventListener('pointerdown',function(e){
if(e.target.closest&&e.target.closest('.sndbtn'))return;
for(var i=0;i<RULES.length;i++){if(e.target.closest&&e.target.closest(RULES[i][0])){SH.play(RULES[i][1]);return;}}
var im=e.target.closest?e.target.closest('img'):null;
if(im&&/emblem|Ivory/i.test(im.getAttribute('alt')||''))SH.play('emblem');
},true);
})();
/* ---- 1 · the house ticker ---- */
if($('#tkt')){(function(){
var L=['The Ladder turns at four in the morning, house time.','Marks are earned, never bought.','The Vault keeps its own hours.','Every cheer freezes the ribbon for a moment.','Twelve rungs. One ladder. No shortcuts.','Private sessions are never recorded by the house.','Fifteen places a day on the Private Line, never more than forty.','The Firstlist is chosen in order, and the order is Ivory’s.','Bells ring at 0, 7, 14, 25, 39, 51, 69, 85, 111, 139, 151, 169, 185 and 201.','Gold is not a colour here. It is a manner.'];
var C=['#D4AF37','#D42450','#FF9A1F','#14B87A','#9A55E6','#FF6FA5','#E3A857','#07402C','#D4AF37','#D42450'];
var h='';for(var r=0;r<2;r++){for(var i=0;i<L.length;i++){h+='<span class="msg"><span class="med" style="background:radial-gradient(circle at 35% 30%,#FFF3C4,'+C[i]+' 72%)">'+(i+1)+'</span>'+L[i]+'</span>';}}
$('#tkt').innerHTML=h;
var tk=$('#tk');tk.addEventListener('click',function(){tk.classList.toggle('paused');SH.play('ticker')});
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
if(i===x.a){sc++;b.classList.add('right');setTimeout(function(){SH.play('right');},850);}else{b.classList.add('wrong');$$('.ko .opt')[x.a].classList.add('right');setTimeout(function(){SH.play('wrong');},850);}
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
SH.play('vault');setTimeout(function(){sheet.classList.add('up');},60);
setTimeout(function(){sheet.classList.remove('up');},7000);
return sheet;}
$$('img').forEach(function(im){var alt=(im.getAttribute('alt')||'');if(/emblem|Ivory/i.test(alt)){im.style.cursor='pointer';im.addEventListener('click',function(){var now=Date.now();if(now-t0>4000)n=0;t0=now;n++;if(n>=3){n=0;build();}});}});
})();
/* ---- 5 · the firstlist shelf ---- */
if($$('.spine').length){(function(){
var l=$('#shlock');
$$('.spine').forEach(function(s){s.addEventListener('click',function(){s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');SH.play('spine');
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
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.05});
$$('.rv').forEach(function(e){io.observe(e)});
})();}
/* ---- 8 · release pulse: reads the RELEASE box on the download page ---- */
if($('#pulse')){(function(){
var el=$('#pulse');
fetch('download.html',{cache:'no-store'}).then(function(r){return r.text();}).then(function(t){
var m=t.match(/status\s*:\s*['"](\w+)['"]/),v=t.match(/version\s*:\s*['"]([^'"]*)['"]/);
var st=m?m[1]:'pending';
if(st==='published'){el.textContent='BUILD '+(v&&v[1]?v[1]:'')+' IS LIVE ON THE RELEASE PAGE';el.classList.add('live');
var band=$('#openband');if(band){band.textContent='THE HOUSE IS OPEN \u00b7 BUILD '+(v&&v[1]?v[1]:'')+' IS LIVE ON THE RELEASE PAGE';band.hidden=false;}}
else{el.textContent='NEXT SELECTED BUILD: IN CHECKING';}
el.hidden=false;
}).catch(function(){el.hidden=true;});
})();}
/* ---- 8 · share the house ---- */
if($$('.sharebtn').length){(function(){
function toast(msg){var d=document.createElement('div');d.className='toast';d.textContent=msg;document.body.appendChild(d);setTimeout(function(){d.remove();},2600);}
$$('.sharebtn').forEach(function(b){b.addEventListener('click',function(){SH.play('share');
var data={title:'Ivory — Every story leaves a mark',text:'A private world of storytelling for adults. Stories, voice and film, inside one golden app.',url:location.href};
if(navigator.share){navigator.share(data).catch(function(){});}
else if(navigator.clipboard){navigator.clipboard.writeText(data.text+' '+data.url).then(function(){toast('Copied. Paste it anywhere you like.');},function(){toast(location.href);});}
else{toast(location.href);}
});});
})();}

/* ---- 9 · the house mood line ---- */
if($('#moodline')){(function(){
function mood(){var h=ist().getHours();
var m=h<4?'The house reads low and gold. The Vault is keeping its hours.':h<8?'The ladder has just turned. The house is stretching, bell by bell.':h<12?'Morning crosses the ribbon. Marks are being earned somewhere quiet.':h<17?'Midday: the Firstlist is open, in order, wherever members are.':h<21?'Evening: private lines are being written and held with care.':'Night: the house dims to burgundy. Tomorrow turns at four.';
$('#moodline').textContent=m;}
mood();setInterval(mood,30000);
})();}
/* ---- 10 · the bell ring, rebuilt: aligned, smooth, calm ---- */
if($('#bellring')){(function(){
var SET=[0,7,14,25,39,51,69,85,111,139,151,169,185,201],svg=$('#bellring'),NS='http://www.w3.org/2000/svg',C=110;
function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);svg.appendChild(e);return e}
var defs=document.createElementNS(NS,'defs');svg.appendChild(defs);
var g=document.createElementNS(NS,'radialGradient');g.id='bgrad';g.innerHTML='<stop offset="0%" stop-color="#FFF3C4"/><stop offset="70%" stop-color="#D4AF37"/>';defs.appendChild(g);
el('circle',{cx:C,cy:C,r:88,fill:'none',stroke:'rgba(212,175,55,.4)','stroke-width':1});
el('circle',{cx:C,cy:C,r:56,fill:'none',stroke:'rgba(212,175,55,.22)','stroke-width':1});
var ct=el('text',{x:C,y:C+4,'text-anchor':'middle',fill:'rgba(242,215,124,.85)'});ct.setAttribute('style','font:900 10px Verdana,sans-serif;letter-spacing:.14em');ct.textContent='202 DAYS';
for(var d=0;d<202;d++){var a=d/202*6.2832-1.5708,ca=Math.cos(a),sa=Math.sin(a);
if(SET.indexOf(d)>=0){el('line',{x1:C+ca*88,y1:C+sa*88,x2:C+ca*72,y2:C+sa*72,stroke:'#D4AF37','stroke-width':2.6,'stroke-linecap':'round'});
el('circle',{cx:C+ca*72,cy:C+sa*72,r:4.2,fill:'url(#bgrad)'});}
else el('line',{x1:C+ca*88,y1:C+sa*88,x2:C+ca*82,y2:C+sa*82,stroke:'rgba(250,245,233,.3)','stroke-width':1});}
var sweep=el('circle',{cx:C+95,cy:C,r:3.6,fill:'#FF9A1F'});sweep.setAttribute('aria-hidden','true');
var cap=$('#bellcap');if(cap)cap.setAttribute('aria-live','polite');
var day=3,hold=0,REST='The light walks the ring. Fourteen bells wait on 202 days.',last=0,lastBell=-1,lastSay=0;
function frame(t){if(!last)last=t;var dt=Math.min(80,t-last);last=t;day=(day+dt*0.0015)%202;
var a=day/202*6.2832-1.5708;sweep.setAttribute('cx',C+Math.cos(a)*95);sweep.setAttribute('cy',C+Math.sin(a)*95);
var b=null;for(var i=0;i<SET.length;i++){if(Math.abs(day-SET[i])<.5)b=SET[i];}
if(b!==null&&b!==lastBell){lastBell=b;sweep.setAttribute('r',6.5);setTimeout(function(){sweep.setAttribute('r',3.6);},500);
var now=Date.now();
if(now-lastSay>8000&&cap){lastSay=now;hold=4000;cap.style.opacity=0;setTimeout(function(){cap.textContent='Day '+b+': a bell falls. The house rings it once, softly, and writes it in your book.';cap.style.opacity=1;},450);}}
if(b===null)lastBell=-1;
if(hold>0){hold-=dt;if(hold<=0&&cap){cap.style.opacity=0;setTimeout(function(){cap.textContent=REST;cap.style.opacity=1;},450);}}
requestAnimationFrame(frame);}
requestAnimationFrame(frame);
var rb=$('#ringbtn');if(rb)rb.addEventListener('click',function(){SH.play('bellchime');svg.style.transition='transform .18s';svg.style.transform='rotate(3deg)';setTimeout(function(){svg.style.transform='rotate(-3deg)'},180);setTimeout(function(){svg.style.transform=''},360);});
})();}
/* ---- 11 · ten marks, one treasure ---- */
if($('#marks')){(function(){
var box=$('#marks'),n=0,done=false;for(var i=0;i<10;i++)box.appendChild(document.createElement('i'));
var cap=$('#markcap'),wrap=$('#markbox')||box;
wrap.addEventListener('click',function(){if(done)return;SH.play('mark');n=Math.min(10,n+1);
var k=box.children;for(var i=0;i<n;i++)k[i].classList.add('on');
if(n>=10){done=true;$('#treas').classList.add('open');cap.textContent='TEN MARKS, EARNED NOT BOUGHT \u00b7 THE FIRST TREASURE OPENS \u00b7 AGAIN AT 25, AND AT ALL';}
else cap.textContent='MARK '+n+' OF 10 \u00b7 EARNED, NEVER BOUGHT';});
})();}
})();
/* END OF FILE - house.js */
