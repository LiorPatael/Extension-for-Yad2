chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "update_price") {
        fetch("http://127.0.0.1:8000/update_price/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(msg.data)
        })
        .then(res => sendResponse({status: res.status}))
        .catch(err => sendResponse({error: err}));
        return true; // Allows for an asynchronous response
    }
});