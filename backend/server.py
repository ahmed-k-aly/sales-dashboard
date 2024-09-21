from fastapi import FastAPI, Query
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from sqlalchemy.sql import func
from fastapi.middleware.cors import CORSMiddleware

# Replace with your actual DB connection string
DATABASE_URL = "postgresql://admin:password@localhost:5432/sales_db"

# Create engine and metadata objects
engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Reflect the 'sales' table
sales = Table('sales', metadata, autoload_with=engine)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust to restrict origins as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the Pydantic model for DaySale (for grouping by day)
class DaySale(BaseModel):
    date: str
    total_sales: float

@app.get("/sales/day", response_model=list[DaySale])
def get_sales_by_day(
    date: str = Query(None, description="Specific date to filter by in YYYY-MM-DD format"),
    start_date: str = Query(None, description="Start date for filtering"),
    end_date: str = Query(None, description="End date for filtering")
):
    session = SessionLocal()
    
    # Base query to sum total_sales and group by date
    query = session.query(
        sales.c.date,
        func.sum(sales.c.total_sales).label('total_sales')
    ).group_by(sales.c.date).order_by(sales.c.date)
    
    # Apply date filters if provided
    if date:
        query = query.filter(sales.c.date == date)
    elif start_date and end_date:
        query = query.filter(sales.c.date.between(start_date, end_date))
    elif start_date:
        query = query.filter(sales.c.date >= start_date)
    elif end_date:
        query = query.filter(sales.c.date <= end_date)

    # Execute the query and fetch the results
    results = query.all()
    
    session.close()
    
    # Return the grouped results as a list of dictionaries
    return [{"date": str(result.date), "total_sales": result.total_sales} for result in results]
