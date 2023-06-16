const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function Col(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}
const API_KEY = "db6529b8eaef4e94ef738d98911cd8fb"
const ICON_MAP = {
    "01d": "clear-day",
    "01n": "clear-night",
    "02d": "clear-day",
    "02n": "clear-night",
    "03d": "partly-cloudy-day",
    "03n": "partly-cloudy-night",
    "04d": "overcast-day",
    "04n": "overcast-night",
    "09d": "overcast-day-rain",
    "09n": "overcast-night-rain",
    "10d": "partly-cloudy-day-rain",
    "10n": "partly-cloudy-night-rain",
    "11d": "thunderstorms-day",
    "11n": "thunderstorms-night",
    "13d": "snowflake",
    "13n": "snowflake",
    "50d": "fog-day",
    "50n": "fog-night",
}
let prev = -1
const SG_COORD = [1.3521, 103.8198]
const NOLA_COORD = [29.9511, -90.0715]

const Cols = {
    Freezing: {
        r: 51,
        g: 204,
        b: 255,
    },
    Cold: {
        r: 0,
        g: 102,
        b: 255,
    },
    Cool: {
        r: 25,
        g: 135,
        b: 84,
    },
    Warm: {
        r: 255,
        g: 153,
        b: 51,
    },
    Yikes: {
        r: 128,
        g: 0,
        b: 0,
    },
    NoPrecip: {
        r: 102,
        g: 204,
        b: 255,
    },
    LowPrecip: {
        r: 51,
        g: 153,
        b: 255,
    },
    MidPrecip: {
        r: 0,
        g: 102,
        b: 255,
    },
    HighPrecip: {
        r: 0,
        g: 0,
        b: 255,
    },
}

function tempColMix(temp) {
    if (temp < 10) {
        return new Col(Cols.Freezing.r, Cols.Freezing.g, Cols.Freezing.b);
    }
    if (temp < 20 && temp >= 10) {
        return ColMix(Cols.Cold, Cols.Freezing, (temp - 10) / (20 - 10));
    }
    if (temp < 25 && temp >= 20) {
        return ColMix(Cols.Cool, Cols.Cold, (temp - 20) / (25 - 20));
    }
    if (temp < 30 && temp >= 25) {
        return ColMix(Cols.Warm, Cols.Cool, (temp - 25) / (30 - 25));
    }
    if (temp < 35 && temp >= 30) {
        return ColMix(Cols.Yikes, Cols.Warm, (temp - 30) / (35 - 30));
    }
    if (temp >= 35) {
        return new Col(Cols.Yikes.r, Cols.Yikes.g, Cols.Yikes.b);
    }
}

function precipColMix(precip) {
    // humidity, not precipitaiton
    if (precip < 10 && precip >= 0) {
        return ColMix(Cols.LowPrecip, Cols.NoPrecip, precip / 10);
    }
    if (precip < 40 && precip >= 10) {
        return ColMix(Cols.MidPrecip, Cols.LowPrecip, (precip - 10) / 30);
    }
    if (precip < 70 && precip >= 40) {
        return ColMix(Cols.HighPrecip, Cols.MidPrecip, (precip - 40) / 30);
    }
    if (precip <= 100 && precip >= 70) {
        return new Col(Cols.HighPrecip.r, Cols.HighPrecip.g, Cols.HighPrecip.b);
    }
}

function ColMix(col1, col2, percentFirst) {
    return new Col(col1.r * percentFirst + col2.r * (1 - percentFirst), col1.g * percentFirst + col2.g * (1 - percentFirst), col1.b * percentFirst + col2.b * (1 - percentFirst))
}

function tempStat(temp) {
    if (temp < 10) {
        return ["Feezing", 1];
    }
    if (temp < 20 && temp >= 10) {
        return ["Cold", 2];
    }
    if (temp < 25 && temp >= 20) {
        return ["Cool", 3];
    }
    if (temp < 30 && temp >= 25) {
        return ["Warm", 4];
    }
    if (temp < 35 && temp >= 30) {
        return ["Hot", 5];
    }
    if (temp >= 35) {
        return ["Yikes", 6];
    }
}

function precipStat(precip) {
    if (precip < 10 && precip >= 0) {
        return ["Dry", 1];
    }
    if (precip < 40 && precip >= 10) {
        return ["Low Humid", 2];
    }
    if (precip < 70 && precip >= 40) {
        return ["Mid Humid", 3];
    }
    if (precip <= 100 && precip >= 70) {
        return ["High Humid", 4];
    }
}

function updateTemp(loc, numLoc, txtLoc, data) {
    let out = document.getElementById(loc);
    let outTxt = document.getElementById(txtLoc);
    let outNum = document.getElementById(numLoc);
    let temp = Math.round(data.main.temp)
    let col = tempColMix(temp);
    let txt = tempStat(temp)[0];
    out.style.backgroundColor = `rgba(${col.r},${col.g},${col.b},1.0)`;
    outNum.innerHTML = `${temp}&deg;C`;
    outTxt.innerText = txt;
}

function updatePrecip(loc, numLoc, txtLoc, data) {
    // humidity, not precipitaiton. Code was initially writted for precipitation, but API data does not include necccesary data
    let out = document.getElementById(loc);
    let outTxt = document.getElementById(txtLoc);
    let outNum = document.getElementById(numLoc);
    let precip = data.main.humidity
    let col = precipColMix(precip);
    let txt = precipStat(precip)[0];
    out.style.backgroundColor = `rgba(${col.r},${col.g},${col.b},1.0)`;
    outNum.innerText = `${precip}%`;
    outTxt.innerText = txt;
    if (precip < 40) {
        outNum.style.color = "black";
        outTxt.style.color = "black";
    } else {
        outNum.style.color = "white";
        outTxt.style.color = "white";
    }
}

function updateClim(imgLoc, txtLoc, data){
    let outTxt = document.getElementById(txtLoc);
    let outImg = document.getElementById(imgLoc);
    clim = data.weather[0].description
    icon = data.weather[0].icon
    outTxt.innerText = clim;
    outTxt.style.color = "black";
    icon = ICON_MAP[icon]
    outImg.src = `static/assets/weather-icons/${icon}.svg`;
}

async function updateWeather(){
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${SG_COORD[0]}&lon=${SG_COORD[1]}&appid=db6529b8eaef4e94ef738d98911cd8fb&units=metric`);
    let sg = await response.json();
    response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${NOLA_COORD[0]}&lon=${NOLA_COORD[1]}&appid=db6529b8eaef4e94ef738d98911cd8fb&units=metric`);
    let nola = await response.json();
    updatePrecip("precip-1", "precip-out-1", "precip-out-1txt", nola);
    updatePrecip("precip-2", "precip-out-2", "precip-out-2txt", sg);
    updateTemp("temp-1", "temp-out-1", "temp-out-1txt", nola);
    updateTemp("temp-2", "temp-out-2", "temp-out-2txt", sg);
    updateClim("clim-out-1", "clim-out-1txt", nola);
    updateClim("clim-out-2", "clim-out-2txt", sg);
}

function updateTime(txtLoc, zone){
    setInterval(function() {
        var time = getDate(zone);
        document.getElementById(txtLoc).innerHTML = time;
    }, 50);
}

function getDate(zone){
    let d = new Date()
    if (zone === 1){
         d = new Date(d.toLocaleString("en-US", {timeZone: "America/Indiana/Tell_City"}));
    }
    if (zone === 2){
         d = new Date(d.toLocaleString("en-US", {timeZone: "Asia/Singapore"}));
    }
    return `${d.getHours()%12}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())} ${d.getHours()<12 ? "am" : "pm"}, ${d.getDate()}/${d.getMonth()}/${d.getFullYear()}, ${d.getDate()} ${month[d.getMonth()]}, ${weekday[d.getDay()]}`;
}

function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
}

document.addEventListener("DOMContentLoaded", function(event) {
    updateTime("flex-time1", 1);
    updateTime("flex-time2", 2);
    updateWeather();
    const d = new Date();
    let min = d.getUTCMinutes();
    setInterval(async function() {
        if (min/10 != prev){
            prev = min/10
            updateWeather();
        }
    }, 60000);
});