const itemList = [{
    urg: 40,
    impt: 60,
    txt: "test",
    log: ["a", "b"]
},{
    urg: 70,
    impt: 20,
    txt: "test",
    log: ["a", "b"]
},{
    urg: 30,
    impt: 50,
    txt: "test",
    log: ["a", "b"]
}];
const focusList = [];

function makeToolTip(d, i) {
    var tTip = document.createElement("div");
    var h5 = document.createElement("h5");
    var p1 = document.createElement("p");
    var p2 = document.createElement("p");
    var label1 = document.createElement("label");
    var number1 = document.createElement("input");
    var label2 = document.createElement("label2");
    var number2 = document.createElement("input");
    var edit = document.createElement("button");
    var img = document.createElement("img");
    var del = document.createElement("div");
    var logShow = document.createElement("button");
    logShow.innerText = "Show log";
    logShow.addEventListener("click", function(event) {
        event.stopPropagation();
        tooltip = logShow.parentElement;
        logSwitch(logShow, tooltip, d);
    });
    logShow.id = "logToggle"
    logShow.className = "btn btn-outline-primary"
    del.innerText = "Clear item"
    del.className = "item-delete"
    del.addEventListener("click", function(event) {
        event.stopPropagation();
        itemList.splice(i, 1);
        updatePlot();
    })
    h5.innerText = d.txt;
    p1.appendChild(document.createTextNode(`Urgency: ${d.urg}`));
    p1.className = "stat";
    p2.appendChild(document.createTextNode(`Importance: ${d.impt}`));
    p2.className = "stat";
    label1.appendChild(document.createTextNode(`Urgency:`));
    label1.className = "stat";
    label1.setAttribute("for", "number1");
    label1.style = "display: none; opacity: 0;"
    number1.value = d.urg;
    number1.id = "number1";
    number1.className = "form-control";
    number1.setAttribute("type", "number");
    number1.setAttribute("min", 0);
    number1.setAttribute("max", 100);
    number1.addEventListener("input", function(event) {
        var dot = tTip.parentNode
        y = number1.value
        if (y <= 100 && y >= 0) {
            dot.style.bottom = (y * .923) + "%"
        }
    });
    number1.style = "display: none; opacity: 0;"
    label2.appendChild(document.createTextNode(`Importance:`));
    label2.className = "stat";
    label2.style = "display: none; opacity: 0;"
    number2.value = d.impt;
    number2.id = "number2";
    number2.className = "form-control";
    number2.setAttribute("type", "number");
    number2.setAttribute("min", 0);
    number2.setAttribute("max", 100);
    number2.addEventListener("input", function(event) {
        var dot = tTip.parentNode
        y = number2.value
        if (y <= 100 && y >= 0) {
            dot.style.right = (y * .923) + "%"
        }
    });
    number2.style = "display: none; opacity: 0;"
    var logInput = document.createElement("input");
    logInput.id = "logInput";
    logInput.className = "form-control me-2";
    logInput.setAttribute("type", "search");
    logInput.setAttribute("placeholder", "log item");
    logInput.setAttribute("aria-label", "log input");
    logInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            addLog(d, tTip);
        }
    });
    logInput.style = "display: none; opacity: 0;"
    var logSubmit = document.createElement("button");
    logSubmit.id = "logSubmit";
    logSubmit.className = "btn btn-outline-success"
    logSubmit.innerText = "Submit"
    logSubmit.setAttribute("type", "submit");
    logSubmit.addEventListener("click", function(event) {
        event.stopPropagation();
        addLog(d, tTip)
    });
    logSubmit.style = "display: none; opacity: 0;"
    edit.className = "btn btn-outline-warning";
    edit.innerText = "Edit"
    edit.addEventListener("click", function(event) {
        event.stopPropagation();
        editSwitch(p1, p2, label1, label2, number1, number2, logInput, logSubmit);
    });
    tTip.append(h5, p1, p2, label1, number1, label2, number2, del, logShow, edit, logInput, logSubmit);
    tTip.className = "tooltip-alt";
    tTip.addEventListener("click", function(event){
        event.stopPropagation();
        focusSwitch(tTip, d);
    });
    return tTip;
}

var editSwitch = (function() {
    var first = true;
    return function(p1, p2, label1, label2, number1, number2, logInput, logSubmit) {
        first ? showEdit(p1, p2, label1, label2, number1, number2, logInput, logSubmit) : hideEdit(p1, p2, label1, label2, number1, number2, logInput, logSubmit);
        first = !first;
    }
})();

function showEdit(p1, p2, label1, label2, number1, number2, logInput, logSubmit) {
    p1.style = "display: none; opacity: 0;"
    p2.style = "display: none; opacity: 0;"
    number1.style = "display: inherit; opacity: 1;"
    number2.style = "display: inherit; opacity: 1;"
    label1.style = "display: inherit; opacity: 1;"
    label2.style = "display: inherit; opacity: 1;"
    logInput.style = "display: inherit; opacity: 1;"
    logSubmit.style = "display: inherit; opacity: 1;"
}

function hideEdit(p1, p2, label1, label2, number1, number2, logInput, logSubmit) {
    p1.style = "display: inherit; opacity: 1;"
    p2.style = "display: inherit; opacity: 1;"
    number1.style = "display: none; opacity: 0;"
    number2.style = "display: none; opacity: 0;"
    label1.style = "display: none; opacity: 0;"
    label2.style = "display: none; opacity: 0;"
    logInput.style = "display: none; opacity: 0;"
    logSubmit.style = "display: none; opacity: 0;"
}

var logSwitch = (function() {
    var first = true;
    return function(btn, tooltip, d) {
        if (!btn && first){
            first = !first;
            return;
        }
        else if (!btn) {
            return;
        }
        first ? showLog(btn, tooltip, d) : hideLog(btn, tooltip);
        first = !first;
    }
})();

function showLog(btn, tooltip, d) {
    btn.innerText = "Hide log";
    d.log.forEach(function(item) {
        var li = document.createElement("li")
        li.className = "log-item";
        li.innerText = item;
        tooltip.append(li)
    });
}

function hideLog(btn, tooltip) {
    btn.innerText = "Show log";
    var li = tooltip.getElementsByTagName('li');

    while (li[0]) {
        li[0].parentNode.removeChild(li[0]);
    }
}

var focusSwitch = (function() {
    var first = true;
    return function(tTip, d) {
        first ? setFocus(tTip, d) : removeFocus(tTip);
        first = !first;
    }
})();

function setFocus(tTip, d) {
    tTip.style.background = "#20c997";
}

function removeFocus(tTip) {
    tTip.style.background = "white";
}

function addLog(d, tooltip) {
    var logList = d.log
    var logTxt = tooltip.querySelector("#logInput");
    if (reEmpty.test(logTxt.value)) {
        logList.unshift(logTxt.value);
    }
    logTxt.value = "";
    hideLog(tooltip.querySelector("#logToggle"), tooltip);
    showLog(tooltip.querySelector("#logToggle"), tooltip, d);
    logSwitch(false);
}