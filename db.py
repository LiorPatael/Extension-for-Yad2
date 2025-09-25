from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Using SQLite instead of PostgreSQL
DATABASE_URL = "sqlite:///./prices.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class PriceHistory(Base):
    __tablename__ = "prices_history"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    price = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    source_user = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)