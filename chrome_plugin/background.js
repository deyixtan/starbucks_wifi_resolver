// helper logging functions
function time() {
    return new Intl.DateTimeFormat("default", {
        "hour": "numeric",
        "minute": "numeric",
        "second": "numeric"
    }).format(new Date());
}

function info(type) {
    console.log(`[${time()}] sbr: attempt to establish connection [${type}]`);
}

function error(message) {
    console.log(`[${time()}] sbr: ${message}`);
}

// bypass functions
function establish_connection(callback) {
    // http://sb.login.org/status -> used to terminate connection
    if (callback["error"] === "net::ERR_CONNECTION_CLOSED" || callback["error"] === "net::ERR_QUIC_PROTOCOL_ERROR") {
        fetch("http://sb.login.org/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: "username=dsuser&password=dspass&dst=http://www.starbucks.com.sg/"
        })
        .then(res => info(callback["error"]))
        .catch(err => error(err));
    }
}

function enable_bypass() {
    chrome.webRequest.onErrorOccurred.addListener(establish_connection, { urls: ["<all_urls>"] });
}

function disable_bypass() {
    chrome.webRequest.onErrorOccurred.removeListener(establish_connection);
}

// popup.js listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.bypass) {
        enable_bypass();
    } else {
        disable_bypass();
    }
});
