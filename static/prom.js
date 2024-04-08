document.addEventListener("DOMContentLoaded", function(event){
    ye = document.getElementById("ye");
    ye.addEventListener("click", function(event){
        event.preventDefault();
        postJSON("ye")
        location.href='/partyyy'
    }); 
    nah = document.getElementById("nah")
    let yeoffsets = ye.getBoundingClientRect();
    nah.style.top = (yeoffsets.bottom + 60) + "px"
    nah.style.left = yeoffsets.left + "px"
    nah.addEventListener("mousemove", function(event){
        event.stopPropagation();
        let offsets = nah.getBoundingClientRect();
        let x = event.clientX;
        let y = event.clientY;
        let dir = getInfiltrationDirection(x, y, "nah")
        switch (dir){
            case "top":
                delta = Math.ceil(Math.abs(offsets.top-y)) + 1
                nah.style.top = (offsets.top + delta) + 'px'
                break
            case "bottom":
                delta = Math.ceil(Math.abs(offsets.bottom-y)) + 1
                nah.style.top = (offsets.top - delta) + 'px'
                break
            case "left":
                delta = Math.ceil(Math.abs(offsets.left-x)) + 1
                nah.style.left = (offsets.left + delta) + 'px'
                break
            case "right":
                delta = Math.ceil(Math.abs(offsets.right-x)) + 1
                nah.style.left = (offsets.left - delta) + 'px'
                break
        }

    });
})

function getInfiltrationDirection(x, y, id){
    let offsets = document.getElementById(id).getBoundingClientRect();
    dirArr = ["top", "bottom", "left", "right"]
    let dirNums = [Math.abs(offsets.top-y), Math.abs(offsets.bottom-y), Math.abs(offsets.left-x), Math.abs(offsets.right-x)]
    let min = Math.min(...dirNums)
    index = 0
    for (let i = 0; i < dirNums.length; i++){
        if (dirNums[i] == min){
            index = i
            break
        }
    }
    return dirArr[index]

}

async function postJSON(data) {
    try {
      const response = await fetch("/prom", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        
      });
      return response

    } catch (error) {
      console.error(error);
    }
  }