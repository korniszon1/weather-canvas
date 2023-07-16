const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const leftContainer = document.querySelector('.data-container');
const saved = localStorage.getItem("last");
let recent = localStorage.getItem("recent");
const savedContainer = document.getElementById('saved');
const locationSite = `${window.location.origin}${window.location.pathname}`;
let params = new URLSearchParams(document.location.search);
let cityGET = params.get("city");
let city, cityName, cityChar, timer;
let c = 0;
const weekday = ["Pon.","Wt.","Śr.","Czw.","Pt.","Sob.","Niedz."];
const celsius = (x) => {return Math.floor(x-273.15)};
const mouse = {
    x: 100,
    y:100,
}
let typeOfWeather = '';
const rainParticles = [];
const endRainParticles = [];
function twoDigitFormat(x){
  if(x<10) return "0"+x;
  return x;
}
(async function renderWeather(cityWeather="poznan") {
    if(saved != undefined && saved != "null") cityWeather = saved;
    if(cityGET != undefined && cityGET != "null") cityWeather = cityGET;
    if(recent == null) localStorage.setItem('recent', cityWeather);
        else if(saved.toUpperCase() !=cityWeather.toUpperCase()){localStorage.setItem("recent", saved); recent = saved;}
    if(saved == null) localStorage.setItem('last', cityWeather); else localStorage.setItem("last", cityWeather);
    if(recent != null && recent.toUpperCase()!=cityWeather.toUpperCase()) {savedContainer.innerHTML = `<a href="${locationSite}?city=${recent}"><li class="city-list">&#8634; ${recent} </li></a>`;}
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityWeather}&units=metric&lang=pl&appid=121874805ea22f6768296e88d8148aaf`;
    const api = await fetch(url);
    const weatherData = await api.json();
    const lat = weatherData.coord.lat, lon = weatherData.coord.lon;
    const urlFuture = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=121874805ea22f6768296e88d8148aaf`;
    const apiFuture = await fetch(urlFuture);
    const weatherDataFuture = await apiFuture.json();
    let futureHtmlWeather ="";
    const date = new Date();
    let weekDayIndex = 0;
    for(i = 1; i<=7;i++)
    {
        let weekDayIndex = ((date.getDay()-1+i)>6) ? date.getDay()-8+i : date.getDay()-1+i;
        futureHtmlWeather += `<li class="col future-weather-list"><div>${weekday[weekDayIndex]}</div><img class="img" src="img/low/${weatherDataFuture.daily[i].weather[0].icon.slice(0,2)}.png"><div> Dzień ${celsius(weatherDataFuture.daily[i].temp.day)}&#176</div> <div style="color:rgb(230,230,230);"> Noc ${celsius(weatherDataFuture.daily[i].temp.night)}&#176</div></li>`;
    }
    const currentWeather = weatherData.weather[0];
    const curentCoordLon = weatherData.coord.lon;  
    const curentCoordLat = weatherData.coord.lat;
    const sunset = new Date(weatherData.sys.sunset * 1000);
    const sunrise = new Date(weatherData.sys.sunrise * 1000);
    const iconLook = currentWeather.icon.slice(0,2);
    timer = setInterval(writing,100);
    leftContainer.classList.remove("p-5");
    
    leftContainer.innerHTML = `
    <div class='d-flex justify-content-center align-items-center flex-column'>
        <button class='city-search' type="button" data-bs-toggle="offcanvas" data-bs-target="#SearchForm" aria-controls="SearchForm">
            <h2 class='fs-1 city-place p-5 text-center text-light text-nowrap text-uppercase fw-bolder white'><img class='img-icon' src='img/mGlass.png' alt='Szukaj miasta'></h2>
        </button>
        <div class='col-12 row'>
            <div class='col-8 col-md-4'>
                <img class='img-fluid p-2' src="img/${iconLook}.png" data-aos="fade-right" alt="${currentWeather.description}">
                <h2 class='h2 d-none d-md-block text-center'>${currentWeather.description}</h2>
            </div>
            
            <div class='col-4 d-flex align-items-center flex-column'>
                <span class='temp'>${Math.round(weatherData.main.temp)}&#176</span>
                <span class='text-nowrap d-none d-md-block'>min: ${Math.round(weatherData.main.temp_min)}&#176 | max: ${Math.round(weatherData.main.temp_max)}&#176</span>
                <span class='text-nowrap d-none d-md-block'>ciśnienie: ${Math.round(weatherData.main.pressure)}hPa</span>
                <span class='text-nowrap d-none d-md-block'>wilgotność: ${Math.round(weatherData.main.humidity)}%</span>
                <span class='d-none d-md-block'>Wschód słońca ${sunrise.getHours()}:${twoDigitFormat(sunrise.getMinutes())} | Zachód słońca ${sunset.getHours()}:${twoDigitFormat(sunset.getMinutes())}</span>
              
                <span class='text-nowrap d-block d-md-none'>min: ${Math.round(weatherData.main.temp_min)}&#176 | max: ${Math.round(weatherData.main.temp_max)}&#176</span>
                <span class='text-nowrap d-block d-md-none'>Wschód słońca ${sunrise.getHours()}:${sunrise.getMinutes()}</span><span class='text-nowrap d-block d-md-none'>Zachód słońca ${sunset.getHours()}:${sunset.getMinutes()}</span>
            </div>
            <h2 class='h2 d-block d-md-none text-center'>${currentWeather.description}</h2>
            <div class='col-12 mt-2 col-md-4'><ul class="right-list"><h5 class='h5 col-12 text-center'>Pogoda długoterminowa</h5>${futureHtmlWeather}</ul>
            </div>
        </div>
        
    </div>`;
    cityName = `${weatherData.name}, ${weatherData.sys.country}`;
    cityChar = cityName.split('');
    cityPlace = document.querySelector('.city-place');
    for(let i=0;i<cityName.length;i++)
    {
        cityPlace.innerHTML += `<span class='letter'>${cityChar[i]}</span>`;
    }
    AOS.init();
    const iconType = currentWeather.icon.slice(2,3);
    typeOfWeather = currentWeather.main;
    animate();
}());
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
window.addEventListener('mousemove', function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
})
//
// -------------------------------------------- WRITING NAME ANIMATION
//
function writing() {
    const currentIndex = document.querySelectorAll('.letter')[c];
    currentIndex.classList.remove('letter');
    currentIndex.classList.add('letter-fade');
    if(document.querySelectorAll('.letter')[c]==undefined)
    {
        clearInterval(timer);
        return;
    }
}
//
// -------------------------------------------- RAIN ANIMATION
//
const last = {
    x: [],
    y: []
}
class rainDrop{
     constructor(){
         this.size = 2;
         this.posX = Math.random()*(canvas.width+300);
         this.posY = 1;
         this.fallSpeed = Math.random()*2+8;
         this.colorAlfa = Math.random()*1;
         this.end = Math.random()*50+(canvas.height-50);
     }
     update()
     {
         this.posX -= 2;
         this.posY += this.fallSpeed;
     }
     draw()
     {
         ctx.beginPath();
         ctx.strokeStyle = `rgba(180, 255, 255,${this.colorAlfa})`;
         ctx.lineWidth = 2
         ctx.moveTo(this.posX,this.posY);
         ctx.lineTo(this.posX+3,this.posY-this.fallSpeed*2)
         ctx.stroke();
     }
}
class endRain{
    constructor(x,y)
    {
        this.posX = x;
        this.posY = y;
        this.speedX = Math.random() * (1.5 - -1.5 + 1)  + -1.5;
        this.speedY = Math.random() * (0 - -1.5)  -1.5;
        this.size = Math.random()*2+1;
        this.color = `rgba(180, 255, 255,${0.2})`;
    }
    update(){
        
        this.posX += this.speedX;
        this.posY += this.speedY;
        this.size = this.size - 0.1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.posX,this.posY,this.size,0,Math.PI*2);
        ctx.fill();
    }
}
function rain(){
    mouseColisionRain();
    for(let i=0;i<10;i++)
    {
        rainParticles.push(new rainDrop());
        rainParticles[i].draw();
    }
}
function checkParticles() 
{
    for(let i=0;i<rainParticles.length;i++)
    {
        rainParticles[i].update();
        rainParticles[i].draw();
        let mouseDX = Math.abs(rainParticles[i].posX-mouse.x);
        let mouseDY = Math.abs(rainParticles[i].posY-mouse.y);
        const distance = Math.sqrt(mouseDX*mouseDX+mouseDY*mouseDY);
        if(rainParticles[i].posY>rainParticles[i].end||distance<10)
        {
            for(let j=0;j<10;j++)
            {
                endRainParticles.push(new endRain(rainParticles[i].posX,rainParticles[i].posY));
                endRainParticles[j].draw();
            }
            rainParticles.splice(i,1);
            i--;
        }
    }
    for(let i=0;i<endRainParticles.length;i++){
        endRainParticles[i].update();
        endRainParticles[i].draw();
        
        if(endRainParticles[i].size<0.5)
        {
            endRainParticles.splice(i,1);
            i--;
        }
    }
}
function mouseColisionRain() {
    
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.arc(mouse.x,mouse.y,10,0,Math.PI*2);
    for(let i=0;i<last.x.length; i++)
    {
        for(let j=0;j<rainParticles.length;j++)
        {
            let mouseDX2 = Math.abs(rainParticles[j].posX-last.x[i]);
            let mouseDY2 = Math.abs(rainParticles[j].posY-last.y[i]);
            const distance2 = Math.sqrt(mouseDX2*mouseDX2+mouseDY2*mouseDY2);
            if(distance2<10)   {
                for(let z=0;z<4;z++)
                {
                    endRainParticles.push(new endRain(rainParticles[j].posX,rainParticles[j].posY));
                    endRainParticles[z].draw();
                }
                rainParticles.splice(j,1);
                i--;
            }
        }
        if(last.x.length>10)
        {
            last.x.splice(0,1);
            last.y.splice(0,1);
        }
    }
    last.x.push(mouse.x);
    last.y.push(mouse.y);
    ctx.fill();
}
function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    typeOfWeather=='Rain' || typeOfWeather=='Drizzle' || typeOfWeather=='Thunderstorm' ? rain() :0; 
    checkParticles();
    requestAnimationFrame(animate);
}