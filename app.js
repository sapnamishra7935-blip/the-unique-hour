const DEFAULTS={phone:"",rate:40,address:"",map:"",pin:"2468",stations:["PS3-01"],games:[["ACTION","Grand Theft Auto","Open-world adventure"],["SHOOTER","Call of Duty","Action and team missions"],["RACING","Racing Games","Speed, skill and competition"],["SPORTS","Sports Games","Challenge your friends"],["ADVENTURE","Adventure Games","Explore new worlds"],["FIGHTING","Fighting Games","One-on-one battles"]]};
const KEY="uniqueHourProData";
let data=load();
function load(){try{return {...DEFAULTS,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch(e){return {...DEFAULTS}}}
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
function money(n){return "₹"+Math.round(n)}
function sessions(){return data.sessions||[]}
function renderPublic(){
 document.getElementById("hourRate").textContent=data.rate;
 document.getElementById("stationCount").textContent=String((data.stations||[]).length).padStart(2,"0");
 document.getElementById("gameGrid").innerHTML=(data.games||DEFAULTS.games).map(g=>`<article class="game-card"><small>${esc(g[0])}</small><h3>${esc(g[1])}</h3><p>${esc(g[2])}</p></article>`).join("");
 document.getElementById("addressText").textContent=data.address||"Add your cafe address in Admin Settings.";
 const map=document.getElementById("mapLink");map.href=data.map||"#";map.style.opacity=data.map?"1":".5";
 const box=document.getElementById("mapBox");box.innerHTML=data.map?`<iframe title="Cafe map" loading="lazy" src="https://maps.google.com/maps?q=${encodeURIComponent(data.address||"")}&output=embed"></iframe>`:`<div class="map-placeholder">📍<br><strong>YOUR GAMING DESTINATION</strong><small>Set your Google Maps link in Admin Settings.</small></div>`;
 const wa=`https://wa.me/${(data.phone||"").replace(/\D/g,"")}?text=${encodeURIComponent("Hello THE UNIQUE HOUR! I would like to ask about booking a gaming session. Preferred date/time: ")}`;
 ["bookWhatsApp","contactWhatsApp"].forEach(id=>{document.getElementById(id).href=data.phone?wa:"#";document.getElementById(id).onclick=e=>{if(!data.phone){e.preventDefault();toast("Please ask the cafe to add its WhatsApp number.");}}});
}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function open(id){document.getElementById(id).classList.add("show")}
function close(id){document.getElementById(id).classList.remove("show")}
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>close(b.dataset.close));
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("show")}));
document.getElementById("openLogin").onclick=()=>open("loginModal");
document.getElementById("adminOpen").onclick=()=>{document.getElementById("adminLogin").hidden=false;document.getElementById("adminPanel").hidden=true;open("adminModal")};
document.getElementById("loginForm").onsubmit=e=>{e.preventDefault();const user={name:document.getElementById("customerName").value.trim(),phone:document.getElementById("customerPhone").value.trim()};localStorage.setItem("uniqueHourCustomer",JSON.stringify(user));close("loginModal");toast("Welcome, "+user.name+"! This demo login is saved on this device.")};
document.getElementById("adminForm").onsubmit=e=>{e.preventDefault();if(document.getElementById("adminPin").value!==String(data.pin)){toast("Incorrect PIN.");return}document.getElementById("adminLogin").hidden=true;document.getElementById("adminPanel").hidden=false;renderAdmin();document.getElementById("adminPin").value=""};
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".tab-content").forEach(x=>x.hidden=x.id!=="tab-"+b.dataset.tab);if(b.dataset.tab==="sessions")renderHistory();if(b.dataset.tab==="settings")fillSettings()});
function renderAdmin(){
 const today=new Date().toDateString(),todayRows=sessions().filter(s=>new Date(s.started).toDateString()===today);
 document.getElementById("todaySessions").textContent=todayRows.length;
 document.getElementById("todayRevenue").textContent=money(todayRows.reduce((a,s)=>a+(s.amount||0),0));
 document.getElementById("activeSessions").textContent=sessions().filter(s=>s.status==="active").length;
 const sel=document.getElementById("stationSelect");sel.innerHTML=(data.stations||[]).map(s=>`<option>${esc(s)}</option>`).join("");
 renderActive();renderPublic();
}
document.getElementById("startSession").onsubmit=e=>{e.preventDefault();const station=document.getElementById("stationSelect").value;if(!station){toast("Add a station in settings first.");return}if(sessions().some(s=>s.status==="active"&&s.station===station)){toast("That station already has an active session.");return}const mins=Number(document.getElementById("duration").value);const s={id:Date.now(),customer:document.getElementById("sessionCustomer").value.trim(),station,minutes:mins,started:new Date().toISOString(),ends:Date.now()+mins*60000,amount:Math.ceil(data.rate*mins/60),status:"active"};data.sessions=[s,...sessions()];save();e.target.reset();renderAdmin();toast("Session started.")};
function renderActive(){const list=sessions().filter(s=>s.status==="active");document.getElementById("activeList").innerHTML="<h3>Active sessions</h3>"+(list.length?list.map(s=>`<div class="session-row"><span><b>${esc(s.customer)}</b><br>${esc(s.station)} · ${s.minutes} min</span><strong data-timer="${s.id}">--:--</strong><button data-end="${s.id}">END</button></div>`).join(""):"<p class='fine'>No active sessions right now.</p>");document.querySelectorAll("[data-end]").forEach(b=>b.onclick=()=>endSession(Number(b.dataset.end)));tickTimers()}
function endSession(id){data.sessions=data.sessions.map(s=>s.id===id?{...s,status:"completed",ended:new Date().toISOString()}:s);save();renderAdmin();toast("Session marked completed.")}
function tickTimers(){document.querySelectorAll("[data-timer]").forEach(el=>{const s=sessions().find(x=>x.id===Number(el.dataset.timer));if(!s)return;const left=Math.max(0,s.ends-Date.now());const mm=String(Math.floor(left/60000)).padStart(2,"0"),ss=String(Math.floor(left%60000/1000)).padStart(2,"0");el.textContent=left===0?"TIME UP":`${mm}:${ss}`;el.style.color=left===0?"#ff6269":"#fff"})}
setInterval(()=>{tickTimers();if(!document.getElementById("adminModal").classList.contains("show"))return;const panel=document.getElementById("adminPanel");if(!panel.hidden){document.getElementById("activeSessions").textContent=sessions().filter(s=>s.status==="active").length}},1000);
function renderHistory(){document.getElementById("historyList").innerHTML=sessions().length?sessions().map(s=>`<div class="session-row"><span><b>${esc(s.customer)}</b><br>${esc(s.station)} · ${new Date(s.started).toLocaleString()}</span><strong>${money(s.amount)}</strong><span>${s.status}</span></div>`).join(""):"<p class='fine'>No sessions recorded yet.</p>"}
function fillSettings(){["settingPhone","settingRate","settingAddress","settingMap","settingPin"].forEach((id,i)=>{const v=[data.phone,data.rate,data.address,data.map,""][i];document.getElementById(id).value=v??""});document.getElementById("settingStations").value=(data.stations||[]).join("\n")}
document.getElementById("settingsForm").onsubmit=e=>{e.preventDefault();data.phone=document.getElementById("settingPhone").value.replace(/\D/g,"");data.rate=Math.max(1,Number(document.getElementById("settingRate").value)||40);data.address=document.getElementById("settingAddress").value.trim();data.map=document.getElementById("settingMap").value.trim();const pin=document.getElementById("settingPin").value;if(pin)data.pin=pin;const stations=document.getElementById("settingStations").value.split("\n").map(x=>x.trim()).filter(Boolean);if(stations.length)data.stations=[...new Set(stations)];save();renderAdmin();toast("Settings saved on this device.")};
document.getElementById("exportData").onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="unique-hour-backup.json";a.click();URL.revokeObjectURL(a.href)};
document.getElementById("menuBtn").onclick=()=>document.getElementById("nav").classList.toggle("open");
document.querySelectorAll("#nav a").forEach(a=>a.onclick=()=>document.getElementById("nav").classList.remove("open"));
document.getElementById("year").textContent=new Date().getFullYear();
renderPublic();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
