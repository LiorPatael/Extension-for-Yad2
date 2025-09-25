document.addEventListener("DOMContentLoaded", () => {
    let itemsContainer = document.getElementById("items");
    let priceHistory = JSON.parse(localStorage.getItem("yad2_price_history") || "{}");

    for (let url in priceHistory) {
        let prices = priceHistory[url];
        if (prices.length === 0) continue;

        let itemDiv = document.createElement("div");
        itemDiv.className = "item";

        let link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.innerText = url.split("/item/")[1].split("?")[0]; // Ad name

        let pricesDiv = document.createElement("div");
        pricesDiv.className = "prices";

        prices.forEach((price, index) => {
            let span = document.createElement("span");
            span.innerText = price.toLocaleString();

            if (index > 0) {
                let arrow = document.createElement("span");
                arrow.className = "arrow";
                if (price > prices[index-1]) arrow.innerText = "↑", arrow.style.color = "green";
                else if (price < prices[index-1]) arrow.innerText = "↓", arrow.style.color = "red";
                else arrow.innerText = "→", arrow.style.color = "gray";
                pricesDiv.appendChild(arrow);
            }

            pricesDiv.appendChild(span);
        });

        itemDiv.appendChild(link);
        itemDiv.appendChild(pricesDiv);
        itemsContainer.appendChild(itemDiv);
    }
});