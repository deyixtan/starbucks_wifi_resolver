let bypass_on = document.getElementById("bypass_on");
let bypass_off = document.getElementById("bypass_off");

function get_toggle(callback) {
    chrome.storage.sync.get(["bypass"], callback);
}

function set_toggle(toggle) {
    chrome.storage.sync.set({ "bypass": toggle });
    chrome.runtime.sendMessage({ "bypass": toggle });
}

// setting up toggle event listeners
bypass_on.onclick = () => {
    get_toggle(e => {
        if (!e.bypass) {
            set_toggle(true);
        }
    });
}

bypass_off.onclick = () => {
    get_toggle(e => {
        if (e.bypass) {
            set_toggle(false);
        }
    });
}

// retrieve saved toggle state
get_toggle(e => {
    if (e.bypass) {
        bypass_on.click();
    } else {
        bypass_off.click();
    }
});
