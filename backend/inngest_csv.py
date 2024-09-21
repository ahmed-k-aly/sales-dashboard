import os
import pandas as pd
from sqlalchemy import create_engine, Column, Integer, String, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database setup
DATABASE_URL = "postgresql://admin:password@localhost:5432/sales_db"

Base = declarative_base()

# Define the sales table
class Sale(Base):
    __tablename__ = 'sales'
    transaction_id = Column(Integer, primary_key=True)
    date = Column(Date)
    category = Column(String)
    product = Column(String)
    quantity = Column(Integer)
    price = Column(Float)
    total_sales = Column(Float)

# Initialize the database connection
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the sales table
def init_db():
    Base.metadata.create_all(bind=engine)

# Ingest CSV into the database
def ingest_csv(file_path):
    # Read CSV
    data = pd.read_csv(file_path)
    print("Read CSV", file_path)
    # if price or quantity is not a number, set it to -1
    data['price'] = pd.to_numeric(data['price'], errors='coerce').fillna(-1)
    data['quantity'] = pd.to_numeric(data['quantity'], errors='coerce').fillna(-1)
    
    
    # Calculate total sales
    data['total_sales'] = data['quantity'] * data['price']
    print("Calculated total sales ")

    # Convert the DataFrame into a list of dictionaries
    sales_data = data.to_dict(orient='records')

    # Insert data into the database
    session = SessionLocal()
    try:
        for sale in sales_data:
            record = Sale(
                transaction_id=sale['transaction_id'],
                date=sale['date'],
                product=sale['product'],
                category=sale['category'],
                quantity=sale['quantity'],
                price=sale['price'],
                total_sales=sale['total_sales']
            )
            session.add(record)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error inserting data: {e}")
    finally:
        print("Data inserted successfully!")
        session.close()
    print("Data inserted successfully!")

if __name__ == "__main__":
    # Initialize the database
    init_db()

    # Ingest CSV data
    csv_file_path = os.path.join(os.path.dirname(__file__), 'sales_data.csv')
    ingest_csv(csv_file_path)
    print("CSV data ingested successfully!")
