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
let draft=defaultSite();
function route(){const hash=location.hash; if(hash.startsWith("#site/")){showPublic(hash.slice(6));return;} $("home").classList.toggle("hidden",hash!=="#home"&&hash!=="");$("admin").classList.toggle("hidden",hash!=="#admin");$("publicPage").classList.add("hidden");}
window.addEventListener("hashchange",route); route();
function setTheme(s){document.documentElement.style.setProperty("--pink",s.accent||"#ef4d9b");document.documentElement.style.setProperty("--purple","#9c67e8");}
function readForm(){draft={...draft,title:$("siteTitle").value,recipient:$("recipient").value,welcome:$("welcome").value,warning:$("warning").value,questions:questionData,finalTitle:$("finalTitle").value,finalMessage:$("finalMessage").value,accent:$("accent").value,background:$("background").value,imageUrl:localImage||draft.imageUrl||"",musicUrl:localMusic||draft.musicUrl||""};return draft;}
function fillForm(s){draft=structuredClone(s);questionData=structuredClone(s.questions||[]);$("siteTitle").value=s.title||"";$("recipient").value=s.recipient||"";$("welcome").value=s.welcome||"";$("warning").value=s.warning||"";$("finalTitle").value=s.finalTitle||"";$("finalMessage").value=s.finalMessage||"";$("accent").value=s.accent||"#ef4d9b";$("background").value=s.background||"#ffe5f1";localImage="";localMusic="";renderQuestions();renderPreview();setTheme(s);}
function renderQuestions(){$("questionsEditor").innerHTML="";questionData.forEach((q,i)=>{const box=document.createElement("div");box.className="question-box";box.innerHTML=`<div class="question-box-top"><span>QUESTION ${i+1}</span><button class="remove" data-remove="${i}">Remove ×</button></div><input data-q="${i}" placeholder="Write your question..." value="${escapeHtml(q.text)}"><input data-yes="${i}" placeholder="YES response" value="${escapeHtml(q.yes||"")}"><input data-no="${i}" placeholder="NO response" value="${escapeHtml(q.no||"")}">`;$("questionsEditor").append(box);});}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderPreview(){const s=readForm();setTheme(s);$("livePreview").style.background=s.background;$("livePreview").innerHTML=`<div style="color:${s.accent};font:italic 700 20px Georgia">${escapeHtml(s.title||"For Someone")}</div><div class="mini-envelope">💌</div><h3>Sun ${escapeHtml(s.recipient||"you")}! ❤️</h3><p>${escapeHtml(s.welcome||"A little surprise is waiting...")}</p>${s.imageUrl?`<img src="${s.imageUrl}" style="max-width:90%;max-height:90px;border-radius:10px">`:""}<p>${escapeHtml(s.questions[0]?.text||"Your first question appears here")}</p><span class="mini-btn">YES ❤️</span><span class="mini-btn" style="background:#fff;color:#987">NO 😜</span>`;}
["siteTitle","recipient","welcome","warning","finalTitle","finalMessage","accent","background"].forEach(id=>$(id).addEventListener("input",renderPreview));
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
  sites=(data||[]).map(s=>({...s,id:s.id,title:s.title,recipient:s.recipient,welcome:s.welcome,warning:s.warning,questions:s.questions,finalTitle:s.final_title,finalMessage:s.final_message,accent:s.accent,background:s.background,imageUrl:s.image_url||"",musicUrl:s.music_url||"",published:s.published}));
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
    const row={user_id:currentUser.id,title:s.title,recipient:s.recipient,welcome:s.welcome,warning:s.warning,questions:s.questions,final_title:s.finalTitle,final_message:s.finalMessage,accent:s.accent,background:s.background,image_url:s.imageUrl,music_url:s.musicUrl,published:true,updated_at:new Date().toISOString()};
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
      s={...data,title:data.title,recipient:data.recipient,welcome:data.welcome,warning:data.warning,questions:data.questions,finalTitle:data.final_title,finalMessage:data.final_message,accent:data.accent,background:data.background,imageUrl:data.image_url||"",musicUrl:data.music_url||""};
    }catch(e){$("publicExperience").textContent="Could not load this surprise. Check Supabase setup.";return;}
  }
  renderExperience(s);
}
initSupabase();

function renderExperience(s){let step=-1;let music=null;const root=$("publicExperience");root.innerHTML="";const card=document.createElement("section");card.className="experience-card";card.style.background=`linear-gradient(145deg,${s.background||"#ffe5f1"},#fffafd)`;card.style.setProperty("--pink",s.accent||"#ef4d9b");card.innerHTML=`<div class="heart-rain"></div><h1 class="experience-title">${escapeHtml(s.title||"For Someone Special")}</h1><div class="progress">${(s.questions||[]).map((_,i)=>`<span>${i+1}</span>`).join("")}</div><div class="experience-body"></div>`;root.append(card);function hearts(){const rain=card.querySelector(".heart-rain");for(let i=0;i<14;i++){const h=document.createElement("span");h.textContent=["💗","💕","💖","✨"][i%4];h.style.left=Math.random()*95+"%";h.style.animationDelay=Math.random()*.5+"s";rain.append(h);setTimeout(()=>h.remove(),2600);}}
function render(){const body=card.querySelector(".experience-body");const progress=[...card.querySelectorAll(".progress span")];progress.forEach((p,i)=>p.classList.toggle("active",i===step));if(step===-1){body.innerHTML=`<div class="surprise-tag">✨ A SPECIAL SURPRISE ✨</div><h2>Sun ${escapeHtml(s.recipient||"you")}! ❤️</h2><p>${escapeHtml(s.welcome||"Someone made something special for you...")}</p>${s.warning?`<div class="warning">${escapeHtml(s.warning)}</div>`:""}${s.imageUrl?`<img class="experience-media" src="${s.imageUrl}">`:""}<div class="envelope-big" role="button" aria-label="Open envelope">💌</div><p>Envelope par tap karo 👆</p><button class="btn primary next-btn">OPEN YOUR SURPRISE 💌</button>`;body.querySelector(".next-btn").onclick=body.querySelector(".envelope-big").onclick=()=>{if(s.musicUrl&&!music){music=new Audio(s.musicUrl);music.loop=true;music.play().catch(()=>{});}step=0;render();};}else if(step<(s.questions||[]).length){const q=s.questions[step];body.innerHTML=`<div class="surprise-tag">💌 QUESTION ${step+1} OF ${s.questions.length}</div><h2>${escapeHtml(q.text)}</h2><p>Soch samajh kar jawab dena... 😉</p><div class="answer-row"><button class="answer yes">YES ❤️</button><button class="answer no">NO 😜</button></div><p class="feedback"></p>`;const yes=body.querySelector(".yes"),no=body.querySelector(".no");yes.onclick=()=>{hearts();body.querySelector(".feedback").textContent=q.yes||"Yay! ❤️";yes.disabled=true;no.disabled=true;setTimeout(()=>{step++;render();},850);};let moves=0;no.onpointerenter=no.ontouchstart=()=>{moves++;if(moves<9){const x=(Math.random()-.5)*210,y=(Math.random()-.5)*100;no.style.transform=`translate(${x}px,${y}px)`;}else{no.textContent="Okay YES? 😂";no.onclick=()=>yes.click();}};no.onclick=()=>{no.textContent=q.no||"Hehe, try YES 😜";no.style.transform=`translate(${(Math.random()-.5)*120}px,${(Math.random()-.5)*70}px)`;};}else{body.innerHTML=`<div class="surprise-tag">💖 YOU MADE IT 💖</div><h2>${escapeHtml(s.finalTitle||"A little surprise for you!")}</h2>${s.imageUrl?`<img class="experience-media" src="${s.imageUrl}">`:""}<p>${escapeHtml(s.finalMessage||"You are special!")}</p><div class="envelope-big">💝</div><button class="btn primary next-btn">RESTART ↻</button>`;body.querySelector("button").onclick=()=>{step=-1;render();};}}render();}
initFirebase();
