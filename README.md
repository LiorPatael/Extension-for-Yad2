Yad2 Price Tracker Chrome Extension

A Chrome extension that tracks price changes on Yad2 listings, stores the history locally, and optionally syncs with a FastAPI server. Users can view the full price history via a popup interface.

Features

Automatic Price Tracking: Monitors all ads on a Yad2 page and detects changes in prices.

Local Storage: Saves a complete history of price changes in localStorage.

Optional Backend Sync: Sends price updates to a FastAPI server via /update_price/.

Price Change Indicators: Displays arrows (↑ ↓ →) next to prices to indicate increase, decrease, or no change.

Popup History View: Clicking the arrows opens a popup showing the full price history of each listing.

Architecture Overview
             ┌───────────────────────────┐
             │   Yad2 Listings Page      │
             └─────────────┬────────────┘
                           │
                           ▼
                 ┌─────────────────────┐
                 │  content.js (Script)│
                 └─────────┬──────────┘
                           │
          ┌────────────────┴─────────────────┐
          │                                  │
          ▼                                  ▼
┌─────────────────────┐           ┌─────────────────────┐
│  localStorage        │           │  FastAPI Server     │
│  Stores price history│           │  /update_price/     │
└─────────┬───────────┘           └─────────┬───────────┘
          │                                  │
          ▼                                  │
┌─────────────────────┐                      │
│  DOM - Price Arrows │                      │
│  (↑ ↓ →)            │                      │
└─────────┬───────────┘                      │
          │                                  │
          ▼                                  │
┌─────────────────────┐                      │
│  Click Arrow         │                      │
│  Opens Popup         │                      │
│  with Price History  │<────────────────────┘
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  popup.html + popup.js│
│  Displays all listings │
│  and price histories   │
└─────────────────────┘

Installation

Clone this repository.

git clone <repo_url>


Open Chrome and navigate to chrome://extensions/.

Enable Developer mode.

Click Load unpacked and select the extension folder.

Open any Yad2 listings page to start tracking prices.

Usage

Navigate to a Yad2 listings page.

The extension automatically tracks the prices of all visible ads.

Arrows next to each price indicate changes:

↑ Price increased

↓ Price decreased

→ Price unchanged

Click on an arrow to open a popup showing the full price history for that ad.

Optional: If a FastAPI server is running, all price updates are sent to /update_price/.

Files

content.js – Injected into Yad2 pages; tracks prices, updates localStorage, and communicates with the server.

popup.html – Popup interface for viewing price history.

popup.js – Logic for rendering price history in the popup.

manifest.json – Chrome extension configuration.

Backend (Optional)

FastAPI Endpoint: /update_price/

Receives price updates from the extension.

Stores or processes price history for further analysis.
