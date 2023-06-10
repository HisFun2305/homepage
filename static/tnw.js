const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
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
        return ["No Rain", 1];
    }
    if (precip < 40 && precip >= 10) {
        return ["Low Rain", 2];
    }
    if (precip < 70 && precip >= 40) {
        return ["Mid Rain", 3];
    }
    if (precip <= 100 && precip >= 70) {
        return ["High Rain", 4];
    }
}

function updateTemp(loc, numLoc, txtLoc, temp) {
    let out = document.getElementById(loc);
    let outTxt = document.getElementById(txtLoc);
    let outNum = document.getElementById(numLoc);
    let col = tempColMix(temp);
    let txt = tempStat(temp)[0];
    out.style.backgroundColor = `rgba(${col.r},${col.g},${col.b},1.0)`;
    outNum.innerHTML = `${temp}&deg;C`;
    outTxt.innerText = txt;
}

function updatePrecip(loc, numLoc, txtLoc, precip) {
    let out = document.getElementById(loc);
    let outTxt = document.getElementById(txtLoc);
    let outNum = document.getElementById(numLoc);
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

function updateClim(imgLoc, txtLoc, clim){
    let outTxt = document.getElementById(txtLoc);
    let outImg = document.getElementById(imgLoc);
    outTxt.innerText = clim;
    outTxt.style.color = "black";
    clim = clim.replace(/\s+/g, '-').toLowerCase();
    outImg.src = `assets/weather-icons/${clim}.svg`;
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

function getTemp(out, numLoc, txtLoc) {
    // to be implemented later
    updateTemp(out, numLoc, txtLoc, placeholder.value);
}

function getPrecip(out, numLoc, txtLoc) {
    // to be implemented later
    updatePrecip(out, numLoc, txtLoc, placeholder.value);
}

function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
}

document.addEventListener("DOMContentLoaded", function(event) {
    updateTime("flex-time1", 1);
    updateTime("flex-time2", 2);
    updatePrecip("precip-1", "precip-out-1", "precip-out-1txt", 25);
    updatePrecip("precip-2", "precip-out-2", "precip-out-2txt", 60);
    updateTemp("temp-1", "temp-out-1", "temp-out-1txt", 25);
    updateTemp("temp-2", "temp-out-2", "temp-out-2txt", 18);
    updateClim("clim-out-1", "clim-out-1txt", "Clear day");
    updateClim("clim-out-2", "clim-out-2txt", "Thunderstorms rain");
});