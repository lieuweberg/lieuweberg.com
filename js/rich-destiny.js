// Utility functions
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

// Mobile
if (window.innerWidth < 992) {
    stopLoading(true);
    throw new Error("Not on desktop, throwing error to stop code execution");
}

// Add example images to container
let examplePresencesContainer = document.getElementById("example-presences");
let examplePresences = [["91Ap4PY.png", "cFLr2w2.png", "Jyc99T7.png?1"], ["i8EyEKU.png?1", "ed7amUK.png", "x9A0z6E.png"], ["62rv8E8.png", "yxri2S8.png", "GiQMCWL.png"]];
for (let i=0; i < examplePresences.length; i++) {
    let toAdd = "<div class=\"row justify-content-md-center\">";
    for (let i2=0; i2 < examplePresences[i].length; i2++){
        toAdd += `<div class="col-xs-auto"><img src="https://i.imgur.com/${examplePresences[i][i2]}"></div>`;
    }
    toAdd += "</div>";
    examplePresencesContainer.innerHTML += toAdd;
}

// Get direct download link of the latest exe
directDownload = get("direct-download");
axios("https://api.github.com/repos/lieuweberg/rich-destiny/releases")
    .then(res => {
        let found;
        for (release of res.data) {
            if (!release.prelease && !release.draft) {
                for (asset of release.assets) {
                    if (asset.name == "rich-destiny.exe") {
                        directDownload.innerHTML = `here (${release.name})`;
                        directDownload.href = asset.browser_download_url;
                        
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    directDownload.innerText = "<ERROR! Could not found download in latest release. Please head to the latest releases page manually.>"
                }
                break
            }
        }
    })
    .catch(err => directDownload.innerText = "<ERROR! Could not fetch releases. Please head to the latest releases page manually.>")

// Custom instance for simple fetching of localhost
const local = axios.create({
    baseURL: 'http://localhost:35893',
    timeout: 2000
})

// Function to get the current app status
function getStatus(firstTime) {
    local("/action?a=current")
        .then(res => {
            get("version").innerText = res.data.version;
            if (res.data.status == "Not logged in") {
                get("status").innerText = "NOT LOGGED IN";
                return
            } else {
                get("status").innerText = "LOGGED IN";
                get("name").innerText = res.data.name;
                get("activity").innerText = res.data.status;
                get("debug").innerText = res.data.debug;
                
                if (firstTime) {
                    get("orbit-text").value = res.data.orbitText;
                    get("auto-update").checked = res.data.autoUpdate;
                }
            }
        })
        .catch(err => get("controls").innerHTML = err + "<br/>Couldn't reach rich-destiny anymore. Try refreshing the page.")
}

// Try to see if the application exists
local("/")
    .then(res => {
        stopLoading();
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        })

        getStatus(true);
        setInterval(getStatus, 5000);
    })
    .catch(err => {
        stopLoading();
        style = get("controls").style;
        style.filter = "blur(3px)";
        style.pointerEvents = "none";
    })

let statusMessage = get("settings-save-res");

// Function to save settings from the control panel
function saveSettings() {
    local.post("/action?a=save", {
        orbitText: get("orbit-text").value,
        autoUpdate: get("auto-update").checked
    }).then(res => {
        statusMessage.classList.remove("d-none")
        if (res.status != 200) {
            statusMessage.innerHTML = `An error occured whilst trying to save the settings.<br/>${res.statusText}<br/><code>${res.data}</code>`;
        } else {
            statusMessage.innerHTML = "Settings saved successfully!";
            setTimeout(() => {
                statusMessage.classList.add("d-none")
            }, 3000)
        }
    }).catch(err => {
        statusMessage.classList.remove("d-none")
        statusMessage.innerHTML = `An error occured whilst trying to save the settings.<br/>${err}<br/><code>${err.response.data}</code>`;
    })
}

function update() {
    statusMessage.classList.remove("d-none");
    statusMessage.innerHTML = "Updating...";
    local("/action?a=update", {
        timeout: 30000
    })
    .then(res => {
        if (res.status != 200) {
            statusMessage.innerHTML = `An error occured whilst trying to update.<br/>${res.statusText}<br/><code>${res.data}</code>`;
        } else {
            statusMessage.innerHTML = res.data;
            setTimeout(() => {
                statusMessage.classList.add("d-none");
            }, 10000)
        }
    }).catch(err => {
        statusMessage.classList.remove("d-none");
        statusMessage.innerHTML = `An error occured whilst trying to update.<br/>${err}<br/><code>${err.response.data}</code>`;
    })
}

// function restart() {
//     statusMessage.classList.remove("d-none")
//     statusMessage.innerHTML = "Restarting..."
//     local("/action?a=restart", {
//         timeout: 5000
//     })
//     .then(res => {
//         if (res.status != 200) {
//             statusMessage.innerHTML = res.data.status + "<br/>An error occured whilst trying to restart.";
//         } else {
//             statusMessage.innerHTML = res.data;
//             setTimeout(() => {
//                 statusMessage.classList.add("d-none")
//             }, 10000)
//         }
//     }).catch(err => {
//         statusMessage.classList.remove("d-none")
//         statusMessage.innerHTML = err + "<br/>An error occured whilst trying to restart.";
//     })
// }