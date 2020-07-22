function removeClass(id, className) {
    document.getElementById(id).classList.remove(className);
}

function addClass(id, className) {
    document.getElementById(id).classList.add(className);
}

function get(id) {
    return document.getElementById(id);
}

function stopLoading(mobile) {
    if (mobile) {
        addClass("example-presences", "d-none");
        addClass("controls", "d-none");
        removeClass("mobile-notice", "d-none");
    }
    
    addClass("loader", "d-none");
    removeClass("controls-content", "d-none");
}

if (window.innerWidth < 992) {
    stopLoading(true);
    throw new Error("Not on desktop, throwing error to stop code execution");
}

let examplePresencesContainer = document.getElementById("example-presences");
let examplePresences = [["91Ap4PY.png", "cFLr2w2.png", "xwlkeTy.png"], ["afCuF0c.png", "ed7amUK.png", "x9A0z6E.png"], ["62rv8E8.png", "yxri2S8.png", "GiQMCWL.png"]];
for (let i=0; i < examplePresences.length; i++) {
    let toAdd = "<div class=\"row justify-content-md-center\">";
    for (let i2=0; i2 < examplePresences[i].length; i2++){
        toAdd += `<div class="col-xs-auto"><img src="https://i.imgur.com/${examplePresences[i][i2]}"></div>`;
    }
    toAdd += "</div>";
    examplePresencesContainer.innerHTML += toAdd;
}

const local = axios.create({
    baseURL: 'http://localhost:35893',
    timeout: 2000
})

function getStatus() {
    local("/action?a=current")
        .then(res => {
            get("version").innerText = res.data.version;
            if (res.data.status == "Not logged in") {
                get("status").innerText = "NOT LOGGED IN";
                return
            } else {
                get("status").innerText = "LOGGED IN";
                get("name").innerText = res.data.name;
                get("activity").innerText = res.data.status
            }
        })
        .catch(err => get("controls").innerText = err)
}

local("/")
    .then(res => {
        stopLoading();
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })

        getStatus();
        setInterval(getStatus, 5000);
    })
    .catch(err => {
        stopLoading();
        get("controls").style.filter = "blur(3px)";
    })