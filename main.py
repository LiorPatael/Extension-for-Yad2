from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from db import SessionLocal, PriceHistory

app = FastAPI()

# Allow CORS for everyone (can be restricted later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use * to allow everyone (or a list of specific domains)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a new session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/update_price/")
def update_price(data: dict, db: Session = Depends(get_db)):
    url = data.get("url")
    prices = data.get("prices", [])
    source_user = data.get("user", "anonymous")

    for p in prices:
        entry = PriceHistory(url=url, price=p, source_user=source_user)
        db.add(entry)

    db.commit()
    return {"status": "ok", "message": f"Added {len(prices)} prices for {url}"}

@app.get("/get_history/")
def get_history(url: str, db: Session = Depends(get_db)):
    records = db.query(PriceHistory).filter(PriceHistory.url == url).all()
    return {
        "url": url,
        "history": [
            {"price": r.price, "timestamp": r.timestamp.isoformat()} for r in records
        ]
    }