import os
import pandas as pd
import numpy as np
from sqlalchemy import ForeignKey, create_engine, Column, Integer, String, Float, Date, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import relationship

# Database setup
DATABASE_URL="postgresql://admin:password@db:5432/sales_db"

Base = declarative_base()

# Define the sales table
class Sale(Base):
    __tablename__ = 'sales'
    transaction_id = Column(Integer, primary_key=True)
    date = Column(Date)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)  # Foreign key to Product
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)  # Foreign key to Category
    quantity = Column(Integer, nullable=True )
    price = Column(Float, nullable=True )
    total_sales = Column(Float)

    # Relationships
    product = relationship('Product', lazy=True)
    category = relationship('Category', lazy=True)

# Product model
class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=True )
    price = Column(Float, nullable=True )

    # Relationship with sales
    sales = relationship('Sale', lazy=True)

# Category model
class Category(Base):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=True )

    # Relationship with sales
    sales = relationship('Sale', lazy=True)

# Initialize the database connection
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the sales table
def init_db():
    Base.metadata.create_all(bind=engine)

def ingest_csv(file_path):
    # Read CSV
    data = pd.read_csv(file_path)
    print("Read CSV", file_path)

    # Convert 'price' and 'quantity' to numeric, setting invalid values to NaN
    data['price'] = pd.to_numeric(data['price'], errors='coerce')
    data['quantity'] = pd.to_numeric(data['quantity'], errors='coerce')

    # Convert 'date' to datetime, handling errors by setting invalid dates to NaT
    data['date'] = pd.to_datetime(data['date'], errors='coerce')

    # Replace NaN values with None (which will be treated as NULL in SQLAlchemy)
    data['price'] = data['price'].replace({np.nan: None})
    data['quantity'] = data['quantity'].replace({np.nan: None})

    # Replace missing 'category' and 'product' with 'MISSING'
    data['category'] = data['category'].fillna('MISSING')
    data['product'] = data['product'].fillna('MISSING')

    # Set total_sales to None since it will be calculated in the database
    data['total_sales'] = None

    # Convert the DataFrame into a list of dictionaries for batch insertion
    sales_data = data.to_dict(orient='records')

    # Insert data into the database
    session = SessionLocal()
    try:
        for sale in sales_data:
            # Step 1: Insert Category if it doesn't exist
            category = session.query(Category).filter_by(name=sale['category']).first()
            if not category:
                category = Category(name=sale['category'])
                session.add(category)
                session.commit()
                session.refresh(category)

            # Step 2: Insert Product if it doesn't exist
            product = session.query(Product).filter_by(name=sale['product']).first()
            if not product:
                product = Product(name=sale['product'], price=sale['price'])
                session.add(product)
                session.commit()
                session.refresh(product)

            # Step 3: Insert Sale with None values for invalid data
            record = session.query(Sale).filter_by(transaction_id=sale['transaction_id']).first()

            if record:
                # Update existing sale record
                record.date = sale['date']
                record.product_id = product.id
                record.category_id = category.id
                record.quantity = sale['quantity']  # None is passed if broken
                record.price = sale['price']        # None is passed if broken
            else:
                # Insert new sale record
                record = Sale(
                    transaction_id=sale['transaction_id'],
                    date=sale['date'],
                    product_id=product.id,
                    category_id=category.id,
                    quantity=sale['quantity'],  # None is passed if broken
                    price=sale['price'],        # None is passed if broken
                    total_sales=None            # total_sales will be updated later
                )
                session.add(record)

        # Commit all the changes at once
        session.commit()

        # Step 4: Update total_sales in the database (calculate total_sales where it's NULL)
        session.execute(text("""
            UPDATE sales
            SET total_sales = COALESCE(price, 0) * COALESCE(quantity, 0)
            WHERE total_sales IS NULL
        """))
        session.commit()

    except Exception as e:
        session.rollback()
        print(f"Error inserting/updating data: {e}")
    finally:
        print("Data inserted/updated successfully!")
        session.close()

def ingest():
 # Initialize the database
    init_db()

    # Ingest CSV data
    csv_file_path = os.path.join(os.path.dirname(__file__), 'sales_data.csv')
    ingest_csv(csv_file_path)
    print("CSV data ingested successfully!")

if __name__ == "__main__":
    ingest()