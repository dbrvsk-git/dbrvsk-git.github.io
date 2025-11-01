
// Timer
let timers = { A:{set:0,current:0}, B:{set:0,current:0}, C:{set:0,current:0} };
let activeTimer=null, interval=null, paused=false;

function adjustTime(n,type,val){
  if(activeTimer&&!paused&&activeTimer!==n)return;
  let t=timers[n];
  if(type==='min')t.set+=val*60;
  if(type==='sec')t.set+=val;
  if(t.set<0)t.set=0;
  if(!activeTimer||paused||activeTimer!==n)t.current=t.set;
  updateDisplay(n,t.current);
}
function updateDisplay(n,s){
  let m=Math.floor(s/60),sec=s%60;
  document.getElementById('display'+n).textContent=`${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}
function highlight(n){
  ['A','B','C'].forEach(i=>document.getElementById('timer'+i).classList.remove('active'));
  if(n)document.getElementById('timer'+n).classList.add('active');
}
function toggleStartPause(){
  const icon=document.getElementById('startPauseIcon');
  if(!activeTimer){
    if(Object.values(timers).every(t=>t.set===0))return;
    startNextTimer('A');
    icon.src="https://img.icons8.com/?size=100&id=9987&format=png"; // pause
  }else if(paused){
    paused=false;
    icon.src="https://img.icons8.com/?size=100&id=9987&format=png";
  }else{
    paused=true;
    icon.src="https://img.icons8.com/?size=100&id=59862&format=png"; // play
  }
}
function startNextTimer(n){
  if(!n)return endSequence();
  if(timers[n].set<=0){
    if(n==='A')return startNextTimer('B');
    if(n==='B')return startNextTimer('C');
    return endSequence();
  }
  startTimer(n);
}
function startTimer(n){
  let t=timers[n];
  t.current=t.set;
  activeTimer=n;
  highlight(n);
  paused=false;
  clearInterval(interval);
  interval=setInterval(()=>{
    if(paused)return;
    t.current--;
    updateDisplay(n,t.current);
    if(t.current<=0){
      clearInterval(interval);
      playSound();
      updateDisplay(n,t.set); // ← oprava: vrátí původní hodnotu
      if(n==='A')startNextTimer('B');
      else if(n==='B')startNextTimer('C');
      else endSequence();
    }
  },1000);
}
function playSound(){
  const ding=document.getElementById('ding');
  let c=0;
  let s=setInterval(()=>{ding.currentTime=0;ding.play();c++;if(c>=2)clearInterval(s);},400);
}
function stopSequence(){
  clearInterval(interval);
  activeTimer=null;paused=false;
  highlight(null);
  document.getElementById('startPauseIcon').src="https://img.icons8.com/?size=100&id=59862&format=png";
  ['A','B','C'].forEach(n=>updateDisplay(n,timers[n].set));
}
function resetTimer(n){
  if(activeTimer===n&&!paused)return;
  timers[n].set=0;timers[n].current=0;
  updateDisplay(n,0);
}
function resetAll(){
  clearInterval(interval);
  activeTimer=null;paused=false;
  highlight(null);
  document.getElementById('startPauseIcon').src="https://img.icons8.com/?size=100&id=59862&format=png";
  ['A','B','C'].forEach(n=>{timers[n].set=0;timers[n].current=0;updateDisplay(n,0);});
}
function endSequence(){
  clearInterval(interval);
  activeTimer=null;paused=false;
  highlight(null);
  document.getElementById('startPauseIcon').src="https://img.icons8.com/?size=100&id=59862&format=png";
  playSound();
}
['A','B','C'].forEach(n=>updateDisplay(n,0));

// collapsible
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function(event) {
    // zabrání, aby se kliknutí z tlačítka "propagovalo" na document a sekce se hned zavřela
    event.stopPropagation();

    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

// doplněk: kliknutí mimo zavře pouze ty otevřené
document.addEventListener("click", function(e) {
  // použij lokální proměnnou, aby se neprojevily vedlejší efekty se sdíleným `i`
  for (var j = 0; j < coll.length; j++) {
    var btn = coll[j];
    var content = btn.nextElementSibling;

    // pokud je kliknutí uvnitř tlačítka nebo uvnitř obsahu, nic nedělej pro tento prvek
    if (btn.contains(e.target) || (content && content.contains(e.target))) {
      continue;
    }

    // jinak zavři, pokud je otevřený
    if (btn.classList.contains("active")) {
      btn.classList.remove("active");
      if (content) content.style.maxHeight = null;
    }
  }
});

// Weather
    const api = "AIzaSyCCxtAuY0FN6iGhKdwG_WLoMilRrvmAlcg"; // 🔑 vlož svůj klíč


// DOM elementy
const iconImg = document.getElementById("weather-icon");
const loc = document.querySelector("#location");
const desc = document.querySelector(".desc");
const tempC = document.querySelector(".c");
const minTemp = document.querySelector(".min-temp");
const maxTemp = document.querySelector(".max-temp");
const humidityEl = document.querySelector(".humidity");
const precipEl = document.querySelector(".precip");
const uvIndexEl = document.querySelector(".uvindex");
const airPressureEl = document.querySelector(".tlak");
const windEl = document.querySelector(".wind");
const visibilityEl = document.querySelector(".visibility");

const directionMap = {
  NORTH: "sever",
  NORTH_NORTHEAST: "sever-severovýchod",
  NORTHEAST: "severovýchod",
  EAST_NORTHEAST: "východ-severovýchod",
  EAST: "východ",
  EAST_SOUTHEAST: "východ-jihovýchod",
  SOUTHEAST: "jihovýchod",
  SOUTH_SOUTHEAST: "jih-jihovýchod",
  SOUTH: "jih",
  SOUTH_SOUTHWEST: "jih-jihozápad",
  SOUTHWEST: "jihozápad",
  WEST_SOUTHWEST: "západ-jihozápad",
  WEST: "západ",
  WEST_NORTHWEST: "západ-severozápad",
  NORTHWEST: "severozápad",
  NORTH_NORTHWEST: "sever-severozápad"
};

// 🔹 Mapování anglických názvů na české
const cityMap = {
  "Prague": "Praha",  
  "Pilsen": "Plzeň"
};

// 📍 Souřadnice Prahy
//const lat = 50.0755;
//const lon = 14.4378;


window.addEventListener("load", async () => {
  try {
    // 🌍 Zjisti polohu podle IP
    const ipRes = await fetch("https://ipapi.co/json/");
    const ipData = await ipRes.json();

    const lat = ipData.latitude ?? 50.0755;
    const lon = ipData.longitude ?? 14.4378;
     const cityEN = ipData.city ?? "Praha";

      const city = cityMap[cityEN] || cityEN;

    // 🌦️ Počasí z Google API
    const url = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${api}&location.latitude=${lat}&location.longitude=${lon}&languageCode=cs`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP chyba: ${response.status}`);
    const data = await response.json();

    console.log("Weather data:", data);



    // 🔹 Načtení relevantních hodnot
    const description = data.weatherCondition.description.text;
    const iconUrl = data.weatherCondition.iconBaseUri + ".png";
     const temperature = data.temperature.degrees;
const maxTemperature = data.currentConditionsHistory?.maxTemperature?.degrees ?? "--";
    const minTemperature = data.currentConditionsHistory?.minTemperature?.degrees ?? "--";
   const wind = data.wind.speed.value;
  const windDirEng = data.wind.direction.cardinal;
const windDirCz = directionMap[windDirEng] || windDirEng;

    const humidity = data.relativeHumidity;
    const precipChance = data.precipitation?.probability?.percent ?? 0;
     const precipType = data.precipitation?.probability;
     const uvIndex = data.uvIndex;
      const airPressure = data.airPressure?.meanSeaLevelMillibars ?? "--";
      const visibility = data.visibility?.distance ?? "--";
      

    // 🖼️ Výstup do HTML
    iconImg.src = iconUrl;
    iconImg.alt = description;
     loc.textContent = `${city}, ${ipData.country_code}`;
    desc.textContent = description;
    tempC.textContent = `${temperature.toFixed(1)} °C`;
    minTemp.textContent = `Min: ${minTemperature} °C`;
    maxTemp.textContent = `Max: ${maxTemperature} °C`;
    windEl.textContent = `Vítr: ${wind} km/h, → ${windDirCz}`;
    humidityEl.textContent = `Vlhkost: ${humidity}%`;
    precipEl.textContent = `Pravděpodobnost srážek: ${precipChance}%`;
       uvIndexEl.textContent = `UV Index: ${uvIndex}`;
    airPressureEl.textContent = `Tlak: ${airPressure} hPa`;
    visibilityEl.textContent = `Viditelnost: ${visibility} km`;
  }
   catch (error) {
    console.error("Chyba při načítání počasí:", error);
    loc.textContent = "Nelze načíst data o počasí.";
  }
});

// News
  const apiKey = "946ec53909df4d63bbb1df81f137422a"; // 🔑 
    const newsContainer = document.getElementById("news-container");

    async function loadNews() {
      try {
        const response = await fetch(`https://api.worldnewsapi.com/search-news?api-key=${apiKey}&language=cs&number=10`);
        if (!response.ok) throw new Error(`Chyba HTTP: ${response.status}`);
        const data = await response.json();

        if (!data.news || data.news.length === 0) {
          newsContainer.textContent = "Žádné zprávy nejsou k dispozici.";
          return;
        }

        newsContainer.innerHTML = "";
        data.news.forEach(article => {
          const div = document.createElement("div");
          div.classList.add("news-item");
          div.innerHTML = `
            <a href="${article.url}" target="_blank" class="odkaz">${article.title}</a>`;
          newsContainer.appendChild(div);
        });
      } catch (err) {
        newsContainer.textContent = "Nepodařilo se načíst zprávy.";
        console.error("Chyba při načítání zpráv:", err);
      }
    }

    loadNews();


// News 2

 const apiKey2 = "pub_56853413b398414cbc2b61c8ff3499a5";

  async function loadNewsData(q = "") {
    try {
      const url = `https://newsdata.io/api/1/news?apikey=${apiKey2}&category=sports&language=cs&size=5&removeduplicate=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP chyba: ${res.status}`);
      const data = await res.json();
      console.log("NewsData.io data:", data);

      const container = document.getElementById("news");
      container.innerHTML = "";

      const articles = data.results || data.articles || []; 
      if (articles.length === 0) {
        container.textContent = "Žádné zprávy.";
        return;
      }

      articles.forEach(item => {
        const el = document.createElement("div");
        el.innerHTML = `
          <a href="${item.link || item.url}" target="_blank" class="odkaz">${item.title}</a>               
        `;
        container.appendChild(el);
      });
    } catch (err) {
      console.error("Chyba při načítání zpráv:", err);
      document.getElementById("news").textContent = "Nelze načíst zprávy.";
    }
  }

  loadNewsData(); 


// Svátky
async function nactiSvatek() {
  try {
    const url = `https://svatky.adresa.info/json?nocache=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" }); 
    const data = await res.json();

    if (data && data.length > 0) {
      const jmeno = data[0].name;
      document.getElementById('svatek').innerHTML = `Dnes má svátek <big>${jmeno}</big>`;
    } else {
      document.getElementById('svatek').textContent = 'Nepodařilo se zjistit svátek.';
    }
  } catch (e) {
    console.error('Chyba při načítání svátku:', e);
    document.getElementById('svatek').textContent = 'Chyba při načítání dat.';
  }
}

nactiSvatek();


// Bitcoin

async function loadBTC() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
    const data = await res.json();
    const priceUSD = data.bitcoin.usd.toLocaleString("en-US", { style: "currency", currency: "USD" });
    document.getElementById("btc").innerHTML = `Aktuální cena Bitcoinu: <big>${priceUSD}</big>`;
  } catch (err) {
    document.getElementById("btc").textContent = "Nelze načíst cenu Bitcoinu.";
  }
}
loadBTC();


// Random pics
//const imageEl = document.querySelector('.rand_pics img');
const bodyEl = document.body;
const btnEl = document.querySelector('.btn');

btnEl.addEventListener('click', () => {
 // imageEl.src = `https://picsum.photos/300/300?random=${Date.now()}`;

  const randomImage = `https://picsum.photos/1920/1080?grayscale=${Date.now()}`;
  bodyEl.style.backgroundImage = `url('${randomImage}')`;
});

//dark-mode toggle
const inputEl = document.querySelector(".input");
inputEl.checked = JSON.parse(localStorage.getItem("mode")) || false;

// aplikuj třídu při načtení
document.body.classList.toggle('dark', inputEl.checked);

inputEl.addEventListener("input", () => {
  document.body.classList.toggle('dark', inputEl.checked);
  localStorage.setItem("mode", JSON.stringify(inputEl.checked));
});


// Focus section  
// DOM Elements
const datum = document.getElementById('datum');
const time = document.getElementById('time'),
greeting = document.getElementById('greeting'),
 jmeno = document.getElementById('jmeno'),
 focus = document.getElementById('focus'); 

 // Show Date 
  let today = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  datum.innerHTML = `Je ` + today.toLocaleDateString('cs-CZ', options);   

// Show Time
function showTime() {
 let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();

    //Add Zeros 
function addZero(n){
    return (parseInt(n,10) < 10 ? '0' : '') + n;
}
    // Output Time
    time.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span><span>${addZero(sec)}</span>`;

        setTimeout(showTime, 1000);
    }

//Set Background and Greeting
function setBgGreet() {
    let today = new Date(),
    hour = today.getHours();

    if (hour < 12 && hour > 5) {
        //Morning
        //document.body.style.backgroundImage = "url('rano.jpg')";
        greeting.textContent = 'Dobré ráno,';
      }
        else if (hour < 18 && hour >= 12) {
            //Afternoon
   //document.body.style.backgroundImage = "url('odpo.jpg')";
        greeting.textContent = 'Dobré odpoledne,';
        }
        else if   (hour >= 18 && hour < 22) {
            //evening
            //  document.body.style.backgroundImage = "url('vecer.jpg')";
        greeting.textContent = 'Dobrý večer,';
        }
        else if (hour >= 22 || hour <= 5) {
            //night
       //     document.body.style.backgroundImage = "url('noc.jpg')";
        greeting.textContent = 'Dobrou noc,';
    }
}

// Get Name
function getJmeno() {
    if(localStorage.getItem('jmeno') === null) {
        jmeno.textContent = '(napište oslovení)';
    } else {
        jmeno.textContent = localStorage.getItem('jmeno');
    }}

    // set jmeno
    function setJmeno(e) {
if (e.type === 'keypress') {
  if (e.which == 13 || e.keyCode == 13) {
    localStorage.setItem('jmeno', e.target.innerText);
    jmeno.blur();
  }
} else {
  localStorage.setItem('jmeno', e.target.innerText);
}
}

    // Get Focus
    function getFocus() {
    if(localStorage.getItem('focus') === null) {
        focus.textContent = 'Napište svůj dnešní cíl';
    } else {
        focus.textContent = localStorage.getItem('focus');
    }}

    // set Focus
    function setFocus(e) {
if (e.type === 'keypress') {
  if (e.which == 13 || e.keyCode == 13) {
    localStorage.setItem('focus', e.target.innerText);
    focus.blur();
  }
} else {
  localStorage.setItem('focus', e.target.innerText);
}
}

    jmeno.addEventListener('keypress', setJmeno);
    jmeno.addEventListener('blur', setJmeno);
    focus.addEventListener('keypress', setFocus);
    focus.addEventListener('blur', setFocus);


    // Run
    showTime();
    setBgGreet();
    getJmeno();
    getFocus();




    
