(function(){
"use strict";

/* CTA hrefs come from the brand routing injector (a.button-main). */

var $=function(id){return document.getElementById(id);};
var pad=function(n){return n<10?"0"+n:""+n;};

/* ═══ 2. Countdown — 15 min, persists across scroll/reload within the session ═══ */
var LEN=15*60*1000, KEY="hx_deadline";
var deadline=+(sessionStorage.getItem(KEY)||0);
if(!deadline||deadline-Date.now()>LEN){deadline=Date.now()+LEN;sessionStorage.setItem(KEY,deadline);}

function tick(){
  var left=deadline-Date.now();
  if(left<=0){deadline=Date.now()+LEN;sessionStorage.setItem(KEY,deadline);left=LEN;}
  var m=Math.floor(left/60000), s=Math.floor(left%60000/1000);
  $("t-m").textContent=pad(m); $("t-s").textContent=pad(s);
  $("s-time").textContent=pad(m)+":"+pad(s);
}
tick(); setInterval(tick,1000);

/* ═══ 3. Stock counter — drifts down toward a floor, never to zero ═══ */
var stock=43, FLOOR=11;
function paintStock(){
  $("stock").textContent=stock;
  $("stock2").textContent=stock;
  $("s-stock").textContent=stock;
  $("fill").style.width=Math.max(6,Math.round(stock/140*100))+"%";
}
paintStock();
(function drop(){
  setTimeout(function(){
    if(stock>FLOOR){stock-=1;paintStock();}
    drop();
  }, 42000+Math.random()*58000);
})();

/* live viewer count jitter */
var viewers=68;
setInterval(function(){
  viewers=Math.max(41,Math.min(96,viewers+Math.round((Math.random()-.5)*7)));
  $("viewers").textContent=viewers+" people viewing";
},7000);

/* ═══ 4. Recent-purchase toasts ═══ */
var BUY=[
  ["Jennifer M.","Columbus, OH"],   ["Sandra K.","Tucson, AZ"],
  ["Melissa R.","Raleigh, NC"],     ["Dawn P.","Spokane, WA"],
  ["Karen L.","Fort Wayne, IN"],    ["Angela T.","Chattanooga, TN"],
  ["Tricia B.","Boise, ID"],        ["Nicole S.","Reno, NV"],
  ["Deborah W.","Springfield, MO"], ["Alison H.","Erie, PA"],
  ["Patrice N.","Mobile, AL"],      ["Kimberly F.","Sioux Falls, SD"],
  ["Renee D.","Bakersfield, CA"],   ["Heather V.","Rochester, NY"]
];
var PACK=["1 pouch — 30 servings","3-pouch bundle","2 pouches — 60 servings"];
var toastBox=$("toasts"), bi=Math.floor(Math.random()*BUY.length);

function showToast(){
  var b=BUY[bi%BUY.length]; bi++;
  var el=document.createElement("div");
  el.className="toast";
  el.innerHTML='<img src="/lp/harmonia_v1/assets/comparison-harmonia.webp" alt="">'+
    '<div><div class="t1"><b>'+b[0]+'</b> in '+b[1]+' just ordered</div>'+
    '<div class="t2"><span class="vd"></span>'+PACK[Math.floor(Math.random()*PACK.length)]+
    ' · '+(2+Math.floor(Math.random()*26))+' min ago</div></div>';
  toastBox.appendChild(el);
  requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add("in");});});
  setTimeout(function(){
    el.classList.remove("in");
    setTimeout(function(){el.remove();},600);
  },5600);
}
setTimeout(function loop(){
  showToast();
  setTimeout(loop, 11000+Math.random()*15000);
}, 6500);

/* ═══ 5. Sticky bar — appears once the reader reaches the product half ═══ */
var sticky=$("sticky"), trigger=document.getElementById("product");
function onScroll(){
  var past=trigger.getBoundingClientRect().top < window.innerHeight*.5;
  var atCta=document.getElementById("claim").getBoundingClientRect().top < window.innerHeight
         && document.getElementById("claim").getBoundingClientRect().bottom > 0;
  sticky.classList.toggle("show", past && !atCta);
}
window.addEventListener("scroll",onScroll,{passive:true});
window.addEventListener("resize",onScroll); onScroll();

/* ═══ 6. Facebook-style comments ═══
   Each entry:
     n   name
     av  avatar image — assets/avatars/<file>. Overwrite the file to swap
         the photo; any aspect ratio works, it's cropped to a circle.
     t   timestamp label      l   reaction count
     x   comment text
     ph  OPTIONAL array of photos posted below the text:
         [{src:"…", alt:"…"}, …]. One to four render as a Facebook-style
         grid; a fifth and beyond collapse into a "+N" tile.
     r   OPTIONAL array of replies (same shape, nesting one level)
     own marks a follow-up by the original commenter (blue bubble)
     author marks an official brand reply                                */

var COMMENTS=[
 {n:"Debbie Halloran",av:"RileyTaylor.jpg",t:"7 h",l:214,x:"Ok the 3am thing. I have described that exact feeling to two different doctors and both looked at me like I was making it up. Heart pounding BEFORE I even think of anything. I genuinely didn't know that was a hormone thing and not just me being crazy.",r:[
   {n:"Marguerite Ely",av:"IsabelleMartel.jpg",t:"6 h",l:63,x:"Debbie you just described my last four years. 2:50am on the dot every night."},
   {n:"Debbie Halloran",av:"RileyTaylor.jpg",t:"5 h",l:28,x:"Marguerite it's the ON THE DOT part that gets me 😭 like my body has an alarm set"}
 ]},

 {n:"Coleen Whitaker",av:"w12.jpg",t:"11 h",l:307,x:"I'm 47 and gained 14 lbs in two years eating LESS than I did at 35. Everyone keeps saying \"it's menopause, that's just how it is now\" and I refuse to accept that's the whole answer. Ordered. Will report back in 6 weeks, I promise I'll come back either way.",r:[
   {n:"Coleen Whitaker",av:"w12.jpg",t:"1 h",l:141,own:true,x:"Update for anyone who asked me to follow up — I'm on day 19. Weight has not moved AT ALL. But I have slept through the night 11 nights straight and I cannot tell you what that's done for me. Staying on it."}
 ]},

 {n:"Rosalind Pike",av:"w13.jpg",t:"9 h",l:88,x:"The bit about the scale being the LAST thing to change is the part nobody says out loud. I quit two other things at three weeks because I was standing on a scale every morning like an idiot.",r:[]},

 {n:"Trish Vandermeer",av:"VictoriaWright.jpg",t:"14 h",l:412,x:"Going to be the skeptic here — my mother in law fell for a similar ad last year and it was a nightmare to cancel, so I read the whole label before buying. Credit where it's due: this one lists actual named extracts (KSM-66, SunPS) not \"proprietary blend\" mystery dust, and the cancel took me under two minutes through the account page. So. Fine. I'm eating my words.",
  ph:[{src:"/lp/harmonia_v1/assets/product-details-slide-1.png",alt:"Photo of the supplement facts panel"}],
  r:[
   {n:"Yvonne Castellanos",av:"w15.jpg",t:"12 h",l:97,x:"Thank you for actually checking instead of just yelling scam. This is the most useful comment here."},
   {n:"Trish Vandermeer",av:"VictoriaWright.jpg",t:"11 h",l:44,x:"Yvonne I still reserve the right to be annoyed if it doesn't work 😄"}
 ]},

 {n:"Marianne Deschamps",av:"w17.jpg",t:"1 d",l:176,x:"Week 9. Down 6 lbs and I have not counted a calorie, which after 20 years of counting calories feels genuinely bizarre. The craving at 3pm is what stopped first for me — it didn't get easier to resist, it just stopped happening.",
  ph:[{src:"/lp/harmonia_v1/assets/review1.jpg",alt:"The pouch that arrived"}],
  r:[]},

 {n:"Bev Trentham",av:"w16.jpg",t:"1 d",l:52,x:"Does anyone know if this is ok with levothyroxine? Don't want to guess with thyroid meds.",r:[
   {n:"Harmonia",av:"harmonia.jpg",t:"22 h",l:71,author:true,x:"Hi Bev — please check with your prescribing doctor before starting, especially with thyroid medication. We'd rather you ask than guess. 🧡"}
 ]},

 {n:"Lucia Barrentine",av:"w19.jpg",t:"2 d",l:129,x:"The taste is honestly fine which I was not expecting. Very light orange, not sweet, no chalky settling at the bottom of the glass. My daughter asked if it was Tang.",
  ph:[{src:"/lp/harmonia_v1/assets/32.jpg",alt:"Mixing it into a glass of water"}],
  r:[]},

 {n:"Gaynor Feltz",av:"ScarlettMiller.jpg",t:"2 d",l:39,x:"Anyone else find they're just less… snippy? My husband noticed before I did which was mildly insulting but also fair.",r:[
   {n:"Roseanne Kilbride",av:"w22.jpg",t:"2 d",l:24,x:"YES. My 6pm personality has improved dramatically and nobody in this house will let me forget they noticed 🙃"}
 ]}
];

var AVATAR_DIR="/lp/harmonia_v1/assets/avatars/";
var AVATAR_FALLBACK="/lp/harmonia_v1/assets/avatars/harmonia.jpg";

function esc(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")
                  .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

/* photo grid below the comment text — 1 to 4 tiles, then a +N overlay */
function photoGrid(list){
  if(!list||!list.length) return "";
  var shown=list.slice(0,4), extra=list.length-shown.length;
  var cls="cmt-photos n"+Math.min(shown.length,4);
  return '<div class="'+cls+'">'+shown.map(function(p,i){
    var more=(extra>0&&i===shown.length-1)?' data-more="'+extra+'"':"";
    return '<a class="ph" href="'+esc(p.src)+'" target="_blank" rel="noopener"'+more+'>'+
             '<img src="'+esc(p.src)+'" alt="'+esc(p.alt||"")+'" loading="lazy">'+
           '</a>';
  }).join("")+'</div>';
}

function renderComment(c){
  var d=document.createElement("div");
  d.className="cmt"+(c.own?" owner":"");
  var reacts=c.l>0?'<span class="reacts"><span class="i" style="background:#1877F2">👍</span>'+
    (c.l>140?'<span class="i" style="background:#F7B928;margin-left:-5px">❤</span>':'')+
    c.l.toLocaleString()+'</span>':'';
  d.innerHTML=
   '<div class="av">'+
     '<img src="'+AVATAR_DIR+esc(c.av)+'" alt="'+esc(c.n)+'" width="38" height="38" '+
       'loading="lazy" onerror="this.onerror=null;this.src=\''+AVATAR_FALLBACK+'\'">'+
   '</div>'+
   '<div style="min-width:0;flex:1">'+
     '<div class="bub"><div class="nm">'+esc(c.n)+
       (c.author?' <span class="badge-author">Author</span>':'')+'</div>'+
       '<p>'+c.x+'</p></div>'+
     photoGrid(c.ph)+
     '<div class="meta"><a class="lk" href="#" onclick="return false">Like</a>'+
       '<a href="#" onclick="return false">Reply</a><span>'+esc(c.t)+'</span>'+reacts+'</div>'+
   '</div>';
  return d;
}

var box=$("cmts"), VISIBLE=4;
COMMENTS.forEach(function(c,i){
  var node=renderComment(c);
  if(i>=VISIBLE) node.classList.add("hidden","more");
  box.appendChild(node);
  if(c.r&&c.r.length){
    var rw=document.createElement("div");
    rw.className="replies"+(i>=VISIBLE?" hidden more":"");
    c.r.forEach(function(r){rw.appendChild(renderComment(r));});
    box.appendChild(rw);
  }
});

$("morebtn").addEventListener("click",function(){
  var hid=box.querySelectorAll(".more");
  if(hid.length){
    Array.prototype.forEach.call(hid,function(n){n.classList.remove("hidden");});
    this.textContent="View 1,253 more comments";
  }
});
})();
