var toDo = [];
var focus = [];
var done = [];
const reEmpty = /\S/

async function logJSONData() {
    const response = await fetch("/to-do/data");
    const jsonData = await response.json();
    toDo = [];
    focus = [];
    done = [];
    console.log(jsonData)
    for (var i of jsonData){
        if (i.flag == 0){
            toDo.push(i)
        }
        else if (i.flag == 1){
            focus.push(i)
        }
        else if (i.flag == 2){
            done.push(i)
        }
    }
    updateLists()
}

async function postJSON(data, flag) {
    data = [data, flag]
    try {
        const response = await fetch("/to-do", {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        });

    } catch (error) {
        console.error(error);
    }
    if (flag == 0){
        logJSONData();
    }
}

function makeForm(list, loc) {
    var form = document.getElementById(loc);
    for (const item of list) {
        var li = document.createElement("li")
        li.setAttribute("class", "list-group-item list-group-item-action list-group-item-primary");
        li.appendChild(document.createTextNode(item.txt));
        if (item.flag == 0){
            li.addEventListener("click", function() {
                moveItem(item)
                updateLists();
            });
        }
        form.appendChild(li);
    }
}

function makeFormFocus(list, loc) {
    var form = document.getElementById(loc);
    for (const item of list) {
        var li = document.createElement("li")
        li.setAttribute("class", "list-group-item list-group-item-action list-group-item-primary");
        var btn1 = document.createElement("button");
        btn1.className = "btn btn-outline-success";
        btn1.addEventListener("click", function(event){
            event.stopPropagation()
            completeItem(item)
        })
        // setAttribute("onclick", `completeItem("${item}")`);
        btn1.innerText = "Finish";
        var btn2 = document.createElement("button");
        btn2.className = "btn btn-outline-danger";
        btn2.addEventListener("click", function(event){
            event.stopPropagation()
            returnItem(item)
        })
        // btn2.setAttribute("onclick" ,`returnItem("${item}")`);
        btn2.innerText = "Unfocus";
        li.append(document.createTextNode(item.txt), btn1, btn2);
        form.appendChild(li);
    }
}

function killChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function updateLists() {
    killChildren(document.getElementById("focusList"));
    killChildren(document.getElementById("toDoList"));
    killChildren(document.getElementById("doneList"));
    makeFormFocus(focus, "focusList");
    makeForm(toDo, "toDoList");
    makeForm(done, "doneList");
}

function returnItem(item) {
    focus.splice(focus.indexOf(item), 1);
    toDo.unshift(item);
    updateLists();
    postJSON(item, 3)
}

function moveItem(item) {
    toDo.splice(toDo.indexOf(item), 1);
    focus.unshift(item);
    postJSON(item, 1)
}

function completeItem(item) {
    focus.splice(focus.indexOf(item), 1);
    done.unshift(item);
    updateLists();
    postJSON(item, 2)
}

function addTask(event) {
    event.preventDefault();
    let input = document.getElementById("taskInput");
    if (reEmpty.test(input.value)) {
        toDo.unshift(input.value)
        postJSON(input.value, 0)
        input.value = "";
    } else {
        warning();
    }
}

function warning() {
    var out = document.getElementById("warningOut");
    out.innerText = "Please input text before submitting or pressing enter. Try again!"
    setTimeout(function() {
        out.innerText = "";
    }, 3000);
}

document.addEventListener("DOMContentLoaded", function(event) {
    // initLists(dataFile);
    var input = document.getElementById("taskInput");
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            addTask(event);
        }
    });
    logJSONData();
});