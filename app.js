// Blush Studio — Supabase edition.
// Add your Supabase project URL and anon key in the config below.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://hchlbbapypvzrmvdwnzf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Wp9sugYSSPgN8MYEE1iX4g_eNOrrogM";
const supabaseReady = SUPABASE_URL.startsWith("https://")
  && !SUPABASE_URL.includes("YOUR_PROJECT")
  && !SUPABASE_ANON_KEY.includes("YOUR_");
const supabase = supabaseReady ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
let currentUser=null, sites=[], activeId=null, localImage="", localMusic="", questionData=[];
const $ = id => document.getElementById(id);
const defaultSite = () => ({title:"For Aariya",recipient:"Aariya",welcome:"Your best friend has prepared something special for you...",warning:"Warning: thodi bakchodi hone wali hai! 😂",questions:[{text:"Kya tum Shivam ko apna dost maanti ho?",yes:"Mujhe pata tha! ❤️",no:"Arre soch lo zara 😜"},{text:"Kya tumhe surprises pasand hain?",yes:"Yay! 🎉",no:"Chalo phir bhi surprise hai 😂"}],finalTitle:"You are amazing! 💗",finalMessage:"Thank you for being you. This little surprise was made just for you!",accent:"#ef4d9b",background:"#ffe5f1",imageUrl:"",musicUrl:""});
const journeyDefaults={letterTitle:"A little letter for you 💌",letterMessage:"You make ordinary moments feel special. This little surprise is just for you! 💗",loadingTitle:"Preparing your surprise... 💗",loadingMessage:"Thoda sa wait, kuch cute load ho raha hai ✨",loadingSeconds:4,introTitle:"Ready for a little test? 👀",introMessage:"Answer these questions, then your final surprise awaits!",musicLabel:"Our special song 🎵"};
const journeyKeys=Object.keys(journeyDefaults);
function unpackJourney(s){const meta=(s.questions||[]).find(q=>q&&q.__blushJourney===true);return {...journeyDefaults,...(meta?.settings||{})};}
function realQuestions(q){return (q||[]).filter(x=>x&&!x.__blushJourney);}
let draft=defaultSite();
function route(){const hash=location.hash; if(hash.startsWith("#site/")){showPublic(hash.slice(6));return;} $("home").classList.toggle("hidden",hash!=="#home"&&hash!=="");$("admin").classList.toggle("hidden",hash!=="#admin");$("publicPage").classList.add("hidden");}
window.addEventListener("hashchange",route); route();
function setTheme(s){document.documentElement.style.setProperty("--pink",s.accent||"#ef4d9b");document.documentElement.style.setProperty("--purple","#9c67e8");}
function readForm(){draft={...draft,title:$("siteTitle").value,recipient:$("recipient").value,welcome:$("welcome").value,warning:$("warning").value,questions:questionData,...Object.fromEntries(journeyKeys.map(k=>[k,$(k).value])),finalTitle:$("finalTitle").value,finalMessage:$("finalMessage").value,accent:$("accent").value,background:$("background").value,imageUrl:localImage||draft.imageUrl||"",musicUrl:localMusic||draft.musicUrl||""};return draft;}
function fillForm(s){draft=structuredClone(s);questionData=structuredClone(realQuestions(s.questions));const settings={...unpackJourney(s),...Object.fromEntries(journeyKeys.filter(k=>s[k]!==undefined).map(k=>[k,s[k]]))};journeyKeys.forEach(k=>$(k).value=settings[k]);$("siteTitle").value=s.title||"";$("recipient").value=s.recipient||"";$("welcome").value=s.welcome||"";$("warning").value=s.warning||"";$("finalTitle").value=s.finalTitle||"";$("finalMessage").value=s.finalMessage||"";$("accent").value=s.accent||"#ef4d9b";$("background").value=s.background||"#ffe5f1";localImage="";localMusic="";renderQuestions();renderPreview();setTheme(s);}
function renderQuestions(){$("questionsEditor").innerHTML="";questionData.forEach((q,i)=>{const box=document.createElement("div");box.className="question-box";box.innerHTML=`<div class="question-box-top"><span>QUESTION ${i+1}</span><button class="remove" data-remove="${i}">Remove ×</button></div><input data-q="${i}" placeholder="Write your question..." value="${escapeHtml(q.text)}"><input data-yes="${i}" placeholder="YES response" value="${escapeHtml(q.yes||"")}"><input data-no="${i}" placeholder="NO response" value="${escapeHtml(q.no||"")}">`;$("questionsEditor").append(box);});}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderPreview(){const s=readForm();setTheme(s);$("livePreview").style.background=s.background;$("livePreview").innerHTML=`<div style="color:${s.accent};font:italic 700 20px Georgia">${escapeHtml(s.title||"For Someone")}</div><div class="mini-envelope">💌</div><h3>Sun ${escapeHtml(s.recipient||"you")}! ❤️</h3><p>${escapeHtml(s.welcome||"A little surprise is waiting...")}</p>${s.imageUrl?`<img src="${s.imageUrl}" style="max-width:90%;max-height:90px;border-radius:10px">`:""}<p>${escapeHtml(s.questions[0]?.text||"Your first question appears here")}</p><span class="mini-btn">YES ❤️</span><span class="mini-btn" style="background:#fff;color:#987">NO 😜</span>`;}
["siteTitle","recipient","welcome","warning","finalTitle","finalMessage","accent","background",...journeyKeys].forEach(id=>$(id).addEventListener("input",renderPreview));
$("questionsEditor").addEventListener("input",e=>{const el=e.target;if(el.dataset.q!==undefined)questionData[+el.dataset.q].text=el.value;if(el.dataset.yes!==undefined)questionData[+el.dataset.yes].yes=el.value;if(el.dataset.no!==undefined)questionData[+el.dataset.no].no=el.value;renderPreview();});
$("questionsEditor").addEventListener("click",e=>{if(e.target.dataset.remove!==undefined){questionData.splice(+e.target.dataset.remove,1);renderQuestions();renderPreview();}});
$("addQuestion").onclick=()=>{questionData.push({text:"",yes:"Yay! ❤️",no:"Try again 😜"});renderQuestions();renderPreview();};
$("imageUpload").onchange=e=>{const f=e.target.files[0];if(f){localImage=URL.createObjectURL(f);renderPreview();}};
$("musicUpload").onchange=e=>{const f=e.target.files[0];if(f){localMusic=URL.createObjectURL(f);}};
$("newSiteBtn").onclick=()=>{activeId=null;fillForm(defaultSite());$("editorTitle").textContent="New surprise";};
$("previewBtn").onclick=()=>{const s=readForm();showPublic("preview",s);};
$("saveBtn").onclick=saveSite;$("publishBtn").onclick=saveSite;
async function initSupabase(){
  if(!supabaseReady){
    $("loginHint").textContent="Supabase is not configured yet. Follow SUPABASE_SETUP.md to connect your project.";
    return;
  }
  const { data:{session} } = await supabase.auth.getSession();
  await handleAuthChange(session?.user || null);
  supabase.auth.onAuthStateChange((_event, session)=>{ handleAuthChange(session?.user || null); });
}
async function handleAuthChange(user){
  currentUser=user;
  $("loginPanel").classList.toggle("hidden",!!user);
  $("studioPanel").classList.toggle("hidden",!user);
  if(user){$("accountLabel").textContent=user.email;await loadSites();}
}
$("loginBtn").onclick=async()=>{
  if(!supabaseReady){$("loginError").textContent="First connect Supabase by following SUPABASE_SETUP.md.";return;}
  try{
    const {error}=await supabase.auth.signInWithPassword({email:$("email").value,password:$("password").value});
    if(error) throw error;
    $("loginError").textContent="";
  }catch(e){$("loginError").textContent=e.message;}
};
$("logoutBtn").onclick=async()=>{if(supabase) await supabase.auth.signOut();};
async function loadSites(){
  const {data,error}=await supabase.from("sites").select("*").eq("user_id",currentUser.id).order("updated_at",{ascending:false});
  if(error) throw error;
  sites=(data||[]).map(s=>({...s,id:s.id,title:s.title,recipient:s.recipient,welcome:s.welcome,warning:s.warning,questions:realQuestions(s.questions),...unpackJourney(s),finalTitle:s.final_title,finalMessage:s.final_message,accent:s.accent,background:s.background,imageUrl:s.image_url||"",musicUrl:s.music_url||"",published:s.published}));
  renderSiteList();
  if(sites.length){activeId=sites[0].id;fillForm(sites[0]);$("editorTitle").textContent=sites[0].title;}
  else{$("newSiteBtn").click();}
}
function renderSiteList(){
  $("siteCount").textContent=sites.length;$("siteList").innerHTML="";
  sites.forEach(s=>{
    const b=document.createElement("button");b.className="site-item"+(s.id===activeId?" active":"");
    b.innerHTML=`<b>${escapeHtml(s.title||"Untitled")}</b><small>${s.published?"Published":"Draft"}</small>`;
    b.onclick=()=>{activeId=s.id;fillForm(s);$("editorTitle").textContent=s.title;renderSiteList();};
    $("siteList").append(b);
  });
}
async function uploadIfNeeded(fileUrl,kind){
  if(!fileUrl||!fileUrl.startsWith("blob:"))return fileUrl;
  const input=kind==="image"?$("imageUpload"):$("musicUpload");const file=input.files[0];if(!file)return "";
  const path=`${currentUser.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;
  const {error}=await supabase.storage.from("site-media").upload(path,file,{upsert:true});
  if(error) throw error;
  const {data}=supabase.storage.from("site-media").getPublicUrl(path);
  return data.publicUrl;
}
async function saveSite(){
  if(!currentUser){$("publishStatus").textContent="Sign in first.";return;}
  try{
    $("publishStatus").textContent="Saving...";
    let s=readForm();
    s.imageUrl=await uploadIfNeeded(s.imageUrl,"image");s.musicUrl=await uploadIfNeeded(s.musicUrl,"music");
    const row={user_id:currentUser.id,title:s.title,recipient:s.recipient,welcome:s.welcome,warning:s.warning,questions:[...realQuestions(s.questions),{__blushJourney:true,settings:Object.fromEntries(journeyKeys.map(k=>[k,s[k]]))}],final_title:s.finalTitle,final_message:s.finalMessage,accent:s.accent,background:s.background,image_url:s.imageUrl,music_url:s.musicUrl,published:true,updated_at:new Date().toISOString()};
    let result;
    if(activeId){
      result=await supabase.from("sites").update(row).eq("id",activeId).select().single();
    }else{
      result=await supabase.from("sites").insert(row).select().single();
    }
    if(result.error) throw result.error;
    activeId=result.data.id;
    $("publishStatus").textContent="Published successfully!";
    $("publicLink").innerHTML=`Share link: <a href="${location.origin+location.pathname}#site/${activeId}" target="_blank">${location.origin+location.pathname}#site/${activeId}</a>`;
    await loadSites();
  }catch(e){$("publishStatus").textContent="Error: "+e.message;}
}
async function showPublic(id,override=null){
  $("home").classList.add("hidden");$("admin").classList.add("hidden");$("publicPage").classList.remove("hidden");
  let s=override;
  if(!s){
    if(!supabaseReady){$("publicExperience").innerHTML="<p>Connect Supabase to load published websites.</p>";return;}
    try{
      const {data,error}=await supabase.from("sites").select("*").eq("id",id).eq("published",true).maybeSingle();
      if(error) throw error;
      if(!data){$("publicExperience").textContent="This surprise link was not found.";return;}
      s={...data,title:data.title,recipient:data.recipient,welcome:data.welcome,warning:data.warning,questions:realQuestions(data.questions),...unpackJourney(data),finalTitle:data.final_title,finalMessage:data.final_message,accent:data.accent,background:data.background,imageUrl:data.image_url||"",musicUrl:data.music_url||""};
    }catch(e){$("publicExperience").textContent="Could not load this surprise. Check Supabase setup.";return;}
  }
  renderExperience(s);
}
initSupabase();

function renderExperience(s){
  const root=$("publicExperience");root.replaceChildren();
  const cfg={...journeyDefaults,...unpackJourney(s),...Object.fromEntries(journeyKeys.filter(k=>s[k]!==undefined).map(k=>[k,s[k]]))};
  const questions=realQuestions(s.questions), stages=["welcome","letter","loading","intro",...questions.map((_,i)=>`question-${i}`),"final"];
  let stage=0, music=null, timer=null, alive=true;
  const card=document.createElement("section");card.className="experience-card journey-card";
  card.style.background=`linear-gradient(145deg,${/^#[0-9a-f]{6}$/i.test(s.background||"")?s.background:"#ffe5f1"},#fffafd)`;
  card.style.setProperty("--pink",/^#[0-9a-f]{6}$/i.test(s.accent||"")?s.accent:"#ef4d9b");
  root.append(card);
  const esc=escapeHtml;
  function stopTimer(){if(timer){clearInterval(timer);timer=null;}}
  function setStage(i){stopTimer();stage=i;render();}
  function hearts(){const rain=card.querySelector(".heart-rain");if(!rain)return;for(let i=0;i<14;i++){const el=document.createElement("span");el.textContent=["💗","💕","💖","✨"][i%4];el.style.left=Math.random()*95+"%";rain.append(el);setTimeout(()=>el.remove(),2400);}}
  function initMusic(){if(!s.musicUrl||music)return;music=new Audio(s.musicUrl);music.loop=true;music.play().catch(()=>{});}
  function controls(){const btn=card.querySelector(".music-toggle");if(btn)btn.onclick=()=>{if(!music)initMusic();else if(music.paused)music.play().catch(()=>{});else music.pause();btn.textContent=music&&!music.paused?"⏸":"▶";};card.querySelector(".journey-restart").onclick=()=>{if(music){music.pause();music.currentTime=0;}setStage(0);};}
  function render(){
    if(!card.isConnected)return;
    const kind=stages[stage], phase=kind==="welcome"?0:kind==="letter"?1:kind==="loading"||kind==="intro"?2:3;
    card.innerHTML=`<div class="heart-rain"></div><div class="journey-toolbar"><span>♡ ${esc(s.title||"For Someone Special")}</span><div class="journey-actions"><span class="music-label">${esc(cfg.musicLabel)}</span><button class="journey-icon music-toggle" aria-label="Play or pause music" ${!s.musicUrl?'disabled title="Upload music in Creator Studio"':''}>${music&&!music.paused?'⏸':'▶'}</button><button class="journey-icon journey-restart" aria-label="Restart surprise">↻</button></div></div><div class="journey-phases">${[1,2,3,4].map((x,i)=>`<span class="${i===phase?'active':''}">${x}</span>`).join("")}</div><div class="experience-body"></div>`;
    controls();const body=card.querySelector(".experience-body");
    if(kind==="welcome"){
      body.innerHTML=`<div class="surprise-tag">✨ A SPECIAL SURPRISE ✨</div><h2>Sun ${esc(s.recipient||"you")}! ❤️</h2><p>${esc(s.welcome||"Someone made something special for you...")}</p>${s.warning?`<div class="warning">${esc(s.warning)}</div>`:""}<div class="envelope-big">💌</div><button class="btn primary next-btn">OPEN YOUR SURPRISE 💌</button>`;
      body.querySelector("button").onclick=()=>{initMusic();setStage(stage+1);};
    }else if(kind==="letter"){
      body.innerHTML=`<div class="surprise-tag">💌 A LETTER FOR YOU</div><div class="letter-seal">💌</div><h2>${esc(cfg.letterTitle)}</h2><p class="letter-text">${esc(cfg.letterMessage)}</p><button class="btn primary next-btn">Continue ✨</button>`;
      body.querySelector("button").onclick=()=>setStage(stage+1);
    }else if(kind==="loading"){
      const seconds=Math.min(20,Math.max(1,Number(cfg.loadingSeconds)||4));const start=performance.now();
      body.innerHTML=`<div class="loading-hearts">💗 💖 💗</div><h2>${esc(cfg.loadingTitle)}</h2><p>${esc(cfg.loadingMessage)}</p><div class="loading-track"><div class="loading-fill"></div></div><div class="loading-percent" aria-live="off">0%</div>`;
      const fill=body.querySelector(".loading-fill"),pct=body.querySelector(".loading-percent");
      timer=setInterval(()=>{const v=Math.min(100,Math.round((performance.now()-start)/(seconds*1000)*100));fill.style.width=v+"%";pct.textContent=v+"%";if(v===100)setStage(stage+1);},80);
    }else if(kind==="intro"){
      body.innerHTML=`<div class="surprise-tag">👀 PHASE THREE</div><div class="loading-hearts">💘</div><h2>${esc(cfg.introTitle)}</h2><p>${esc(cfg.introMessage)}</p><button class="btn primary next-btn">Let's go! 💗</button>`;
      body.querySelector("button").onclick=()=>setStage(stage+1);
    }else if(kind.startsWith("question-")){
      const n=Number(kind.split("-")[1]),q=questions[n];
      body.innerHTML=`<div class="surprise-tag">💬 QUESTION ${n+1} OF ${questions.length}</div><h2>${esc(q.text)}</h2><p>Soch samajh kar jawab dena... 😉</p><div class="answer-row"><button class="answer yes">YES ❤️</button><button class="answer no">NO 😜</button></div><p class="feedback" aria-live="polite"></p>`;
const yes = body.querySelector(".yes");
const no = body.querySelector(".no");
const feedback = body.querySelector(".feedback");

yes.onclick = () => {
  feedback.textContent = q.yes || "Yay! ❤️";
  yes.disabled = true;
  no.disabled = true;
  hearts();

  setTimeout(() => {
    if (card.isConnected && stages[stage] === kind) {
      setStage(stage + 1);
    }
  }, 1100);
};

// NO button ko card ke andar bhagane ke liye
const area = body.querySelector(".answer-row");
area.style.position = "relative";
area.style.minHeight = "170px";

no.style.position = "absolute";
no.style.left = "55%";
no.style.top = "0px";
no.style.zIndex = "5";

function moveNo() {
  const maxX = Math.max(0, area.clientWidth - no.offsetWidth);
  const maxY = Math.max(0, area.clientHeight - no.offsetHeight);

  no.style.left = Math.random() * maxX + "px";
  no.style.top = Math.random() * maxY + "px";
}

no.addEventListener("mouseenter", moveNo);

no.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNo();
}, { passive: false });

no.addEventListener("click", (e) => {
  e.preventDefault();
  feedback.textContent = q.no || "Hehe 😜";
  moveNo();
});
    }else{
      body.innerHTML=`<div class="surprise-tag">💖 YOUR FINAL SURPRISE 💖</div><h2>${esc(s.finalTitle||"You are amazing!")}</h2>${s.imageUrl?`<img class="experience-media" alt="Surprise photo">`:""}<p class="letter-text">${esc(s.finalMessage||"You are special!")}</p><div class="loading-hearts">💝</div><button class="btn primary next-btn">RESTART ↻</button>`;
      if(s.imageUrl)body.querySelector("img").src=s.imageUrl;
      body.querySelector("button").onclick=()=>{if(music){music.pause();music.currentTime=0;}setStage(0);};hearts();
    }
  }
  render();
}
