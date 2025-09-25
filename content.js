function runPriceTracker() {
    // Select all the ads on the page
    let items = document.querySelectorAll(".item-layout_feedItemBox__Kvh1y");

    let priceHistory = JSON.parse(localStorage.getItem("yad2_price_history") || "{}");

    items.forEach(item => {
        let linkElem = item.querySelector("a.item-layout_itemLink__CZZ7w");
        let priceElem = item.querySelector("span.feed-item-price_price__ygoeF");
        if (!linkElem || !priceElem) return;

        let url = linkElem.href;
        let currentPrice = parseInt(priceElem.innerText.replace(/\D/g, ""));

        // Save price history to localStorage
        if (!priceHistory[url]) priceHistory[url] = [];
        if (priceHistory[url].length === 0 || priceHistory[url][priceHistory[url].length-1] !== currentPrice) {
            priceHistory[url].push(currentPrice);
        }
        localStorage.setItem("yad2_price_history", JSON.stringify(priceHistory));

        // Avoid adding duplicate arrows
        if (priceElem.parentElement.querySelector(".yad2-price-arrow")) return;

        // Create the arrow next to the price
        let arrow = document.createElement("span");
        arrow.className = "yad2-price-arrow";
        arrow.style.cursor = "pointer";
        arrow.style.marginLeft = "5px";
        arrow.style.fontWeight = "bold";

        let lastPrice = priceHistory[url].length > 1 ? priceHistory[url][priceHistory[url].length-2] : currentPrice;
        if (currentPrice > lastPrice) arrow.innerText = "↑", arrow.style.color = "green";
        else if (currentPrice < lastPrice) arrow.innerText = "↓", arrow.style.color = "red";
        else arrow.innerText = "→", arrow.style.color = "gray";

        // Clicking the arrow opens a small window with the history
        arrow.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            showPopup(priceHistory[url], e.pageX, e.pageY);
        });

        priceElem.parentElement.appendChild(arrow);

        // Sends the data to FastAPI via the background script
        chrome.runtime.sendMessage({
            action: "update_price",
            data: { url: url, prices: priceHistory[url] }
        });
    });
}

// Function to display a small popup
function showPopup(prices, x, y) {
    let existing = document.getElementById("priceHistoryPopup");
    if (existing) existing.remove();

    let popup = document.createElement("div");
    popup.id = "priceHistoryPopup";
    popup.style.position = "absolute";
    popup.style.left = x + "px";
    popup.style.top = y + "px";
    popup.style.background = "white";
    popup.style.border = "1px solid #ccc";
    popup.style.padding = "10px";
    popup.style.borderRadius = "6px";
    popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
    popup.style.zIndex = 9999;

    popup.innerHTML = "<strong>Price History:</strong><br>" + prices.map(p => p.toLocaleString()).join(" → ");

    let closeBtn = document.createElement("div");
    closeBtn.innerText = "✖";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "2px";
    closeBtn.style.right = "5px";
    closeBtn.addEventListener("click", () => popup.remove());
    popup.appendChild(closeBtn);

    document.body.appendChild(popup);
}

// ----------- NEW: handle SPA navigation ----------- //
let oldHref = document.location.href;
const observer = new MutationObserver(() => {
    if (oldHref !== document.location.href) {
        oldHref = document.location.href;
        console.log("URL changed → running price tracker");
        runPriceTracker();
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// Run on initial load
runPriceTracker();
