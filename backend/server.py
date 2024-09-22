from fastapi import FastAPI, Query
from sqlalchemy import create_engine, MetaData, Table, select, func
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

# Replace with your actual DB connection string
DATABASE_URL = "postgresql://admin:password@localhost:5432/sales_db"

# Create engine and metadata objects
engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Reflect the 'sales', 'products', and 'categories' tables
sales = Table('sales', metadata, autoload_with=engine)
products = Table('products', metadata, autoload_with=engine)
categories = Table('categories', metadata, autoload_with=engine)

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

class ProductSale(BaseModel):
    product: str
    total_sales: float

    class Config:
        orm_mode = True  # Enable ORM mode for SQLAlchemy objects to map to Pydantic models


# Define the Pydantic model for Sale
class Sale(BaseModel):
    transaction_id: int
    category: str
    quantity: Optional[int]
    price: Optional[float]
    date: str
    product: str
    total_sales: float

    class Config:
        orm_mode = True  # Enable ORM mode for SQLAlchemy objects to map to Pydantic models

@app.get("/sales/total_per_product", response_model=List[ProductSale])
def get_total_sales_per_product():
    session = SessionLocal()
    try:
        # Query to get total sales per product
        query = select(
            products.c.name.label("product"),
            func.sum(sales.c.total_sales).label("total_sales")
        ).join(products, sales.c.product_id == products.c.id)\
         .group_by(products.c.name)\
         .order_by(func.sum(sales.c.total_sales).desc())  # Order by total sales in descending order
        
        results = session.execute(query).fetchall()

        # Transform results into a list of ProductSale models
        product_sales_list = [
            ProductSale(
                product=row.product,
                total_sales=row.total_sales
            )
            for row in results
        ]

        return product_sales_list
    finally:
        session.close()
        
@app.get("/sales/product", response_model=List[Sale])
def get_product_sales():
    session = SessionLocal()
    try:
        # Query the sales table and join with the products and categories tables
        query = select(
            sales.c.transaction_id,
            sales.c.quantity,
            sales.c.price,
            sales.c.date,
            sales.c.total_sales,
            products.c.name.label("product"),
            categories.c.name.label("category")
        ).join(products, sales.c.product_id == products.c.id)\
         .join(categories, sales.c.category_id == categories.c.id)\
         .order_by(sales.c.transaction_id)
        
        results = session.execute(query).fetchall()

        # Transform results into a list of Sale models
        sales_list = [
            Sale(
                transaction_id=row.transaction_id,
                category=row.category,
                quantity=row.quantity,
                price=row.price,
                date=str(row.date),
                product=row.product,
                total_sales=row.total_sales
            )
            for row in results
        ]

        return sales_list
    finally:
        session.close()

# Define the Pydantic model for DaySale (for grouping by day)
class DaySale(BaseModel):
    date: str
    total_sales: float

    class Config:
        orm_mode = True

@app.get("/sales/day", response_model=List[DaySale])
def get_sales_by_day(
    date: str = Query(None, description="Specific date to filter by in YYYY-MM-DD format"),
    start_date: str = Query(None, description="Start date for filtering"),
    end_date: str = Query(None, description="End date for filtering")
):
    """
    Fetch total sales grouped by day, with optional date filters.
    """
    session = SessionLocal()
    
    try:
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
        
        # Return the grouped results as a list of dictionaries
        return [{"date": str(result.date), "total_sales": result.total_sales} for result in results]
    
    finally:
        session.close()
