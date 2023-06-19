const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
let prev = -1;
let prevmin = -1;
function Col(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}
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
    }
}
const NOLA_COORD = [29.9511, -90.0715]

async function postJSONSAD(data) {
    try {
        const response = await fetch("/", {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        });
        const result = await response.text();
        if (result != 1) {
            w = document.getElementById("SADWarningOut");
            console.log(result)
            w.innerText = result
            setTimeout(function() {
                w.innerText = null;
            }, 2000);
        }

    } catch (error) {
        console.error(error);
    }
}

function getDate(){
    let d = new Date();
    d = new Date(d.toLocaleString("en-US", {timeZone: "America/Indiana/Tell_City"}));
    return [`${d.getHours()%12}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())} ${d.getHours()<12 ? "am" : "pm"}, ${d.getDate()}/${d.getMonth()}/${d.getFullYear()}, ${d.getDate()} ${month[d.getMonth()]}, ${weekday[d.getDay()]}`,
            `${d.getHours()}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}, ${d.getDate()}/${d.getMonth()}/${d.getFullYear()}
                <br>
            ${d.getDate()} ${month[d.getMonth()]}, ${weekday[d.getDay()]}`,
            d.getHours()];
}

function setLayout(hr){
    let header = document.getElementById("greet-header");
    header.className = `flex-top g${hr}`;
    if(hr < 13){
        mornLayout();
    }
    else if(hr < 19 && hr >= 13){
        aftnLayout();
    }
    else if(hr < 24){
        niteLayout();
    }
}

function updateTime(){
    setInterval(function() {
        var time = getDate()[0];
        var altTime = getDate()[1];
        document.getElementById("time-flex").innerHTML = time;
        document.getElementById("time-flex-alt").innerHTML = altTime;
    }, 50);
}

function updateLayout(){
    let hr = getDate()[2]
    setLayout(hr);
    setInterval(function() {
        hr = getDate()[2]
        if (prev !== hr){
            prev = hr;
            setLayout(hr);
        }
    }, 2000);
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

async function updateWeather(){
    response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${NOLA_COORD[0]}&lon=${NOLA_COORD[1]}&appid=db6529b8eaef4e94ef738d98911cd8fb&units=metric`);
    let nola = await response.json();
    updatePrecip("precip", "precip-out", "precip-out-txt", nola);
    updateTemp("temp", "temp-out", "temp-out-txt", nola);
}

function mornLayout(){
    document.getElementById("header-text").innerHTML = "Good Morning!"
}


function aftnLayout(){
    document.getElementById("header-text").innerHTML = "Good Afternoon!"
    //code
}

function niteLayout(){
    document.getElementById("header-text").innerHTML = "Good Night!"
    document.getElementById("flex-SAD").style = "display: flex;"
}

function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
}

function makePlanGrid() {
    plot = document.getElementById("plan-grid");
    killChildren(plot)
    itemList.forEach(function(d, i) {
        let tTip = makeToolTip(d, i);
        plot.appendChild(tTip);
    });
}

function killChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function inputSAD(){
    input = document.getElementById("SADInput");
    postJSONSAD(input.value)
    input.value = ""
}

document.addEventListener("DOMContentLoaded", function(event) {
    var input = document.getElementById("SADInput");
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            inputSAD();
        }
    });
    updateLayout();
    updateTime();
    logJSONData();
    updateWeather();
    let d = new Date()
    let min = d.getUTCMinutes()
    setInterval(async function() {
        if (min/10 != prevmin){
            prevmin = min/10
            updateWeather();
        }
    }, 60000);
});