function makeVisible(id) {
    document.getElementById(id).classList.remove("d-none");
}

function makeInvisible(id) {
    document.getElementById(id).classList.add("d-none");
}

function stopLoading(mobile) {
    if (mobile) {
        makeInvisible("example-presences")
        makeInvisible("download")
        makeVisible("not-installed")
        makeVisible("mobile-notice")
    }
    makeInvisible("loader")
    makeVisible("title")
    makeVisible("footer")
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

if (window.innerWidth < 1200) {
    stopLoading(true)
    throw new Error("Not on desktop, throwing error to stop code execution")
}

const local = axios.create({
    baseURL: 'http://localhost:35893',
    timeout: 2000
})

local("/")
    .then(res => {
        stopLoading()
        makeVisible("controls")
    })
    .catch(err => {
        stopLoading()
        makeVisible("not-installed")
    })