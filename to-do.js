var toDo = ["foo", "bar", "baz", "four"];
var focus = ["yeet"];
var done = ["uno", "dos", "tres"];
const reEmpty = /\S/

function makeForm(list, loc) {
    var form = document.getElementById(loc);
    for (item of list) {
        var li = document.createElement("li")
        li.setAttribute("class", "list-group-item list-group-item-action list-group-item-primary");
        li.appendChild(document.createTextNode(item));
        form.appendChild(li);
    }
}

function makeFormFocus(list, loc) {
    var form = document.getElementById(loc);
    for (item of list) {
        var li = document.createElement("li")
        li.setAttribute("class", "list-group-item list-group-item-action list-group-item-primary");
        var btn1 = document.createElement("button");
        btn1.className = "btn btn-outline-success";
        btn1.setAttribute("onclick", `completeItem("${item}")`);
        btn1.innerText = "Finish";
        var btn2 = document.createElement("button");
        btn2.className = "btn btn-outline-danger";
        btn2.setAttribute("onclick" ,`returnItem("${item}")`);
        btn2.innerText = "Unfocus";
        li.append(document.createTextNode(item), btn1, btn2);
        form.appendChild(li);
    }
}

function killChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function initializeToDo() {
    const toDoList = document.getElementById("toDoList");
    for (const child of toDoList.children) {
        child.addEventListener("click", function(event) {
            moveItem(child.innerText)
            updateLists();
        });
    }
}

function updateLists() {
    killChildren(document.getElementById("focusList"));
    killChildren(document.getElementById("toDoList"));
    killChildren(document.getElementById("doneList"));
    makeFormFocus(focus, "focusList");
    makeForm(toDo, "toDoList");
    makeForm(done, "doneList");
    initializeToDo();
}

function returnItem(item) {
    focus.splice(focus.indexOf(item), 1);
    toDo.unshift(item);
    updateLists();
}

function moveItem(item) {
    toDo.splice(toDo.indexOf(item), 1);
    focus.unshift(item);
}

function completeItem(item) {
    focus.splice(focus.indexOf(item), 1);
    done.unshift(item);
    updateLists();
}

function addTask(event) {
    event.preventDefault();
    let input = document.getElementById("taskInput");
    if (reEmpty.test(input.value)) {
        toDo.unshift(input.value)
        input.value = "";
        updateLists();
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
    makeFormFocus(focus, "focusList");
    makeForm(toDo, "toDoList");
    makeForm(done, "doneList");
    initializeToDo();
});