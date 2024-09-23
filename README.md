# Sales Dashboard Application

## Overview

This project is a full-stack web application that provides a detailed sales summary for an e-commerce platform. The application consists of three distinct components, each designed to handle a specific part of the system:

1. **Backend**: A FastAPI service that serves as the API layer. It processes and serves sales data from a PostgreSQL database via RESTful endpoints.
2. **Frontend**: A React-based web application that provides a user-friendly dashboard for visualizing the sales data. It consumes the backend API and displays data in the form of tables and charts.
3. **Database**: A PostgreSQL instance that stores all sales-related data, including transactions, products, categories, and computed sales summaries.

This project is designed to be scalable and easy to deploy, leveraging Docker for containerization, making it straightforward to run both locally and in production environments.

---

## Project Structure

The project is organized into three main directories, each handling a part of the system, along with Docker-related configuration files to tie everything together:

sales-dashboard/ ├── backend/ # FastAPI backend service │ ├── app/ # The core FastAPI app and logic │ ├── Dockerfile # Dockerfile for the backend service │ └── requirements.txt # Python dependencies for the backend ├── frontend-app/ # React frontend application │ ├── src/ # React source code │ ├── Dockerfile # Dockerfile for the frontend service │ └── package.json # JavaScript dependencies for the frontend ├── docker-compose.yml # Docker Compose configuration to run the full stack └── README.md

---

## Features

- **Backend (FastAPI)**: 
  - Provides RESTful API endpoints to retrieve sales data by product and day.
  - Includes robust data validation and error handling using Pydantic.
  - Interfaces with a PostgreSQL database to persist and query sales data.
  - Automatically calculates total sales for each product and transaction.
  
- **Frontend (React)**:
  - Provides an interactive and responsive dashboard to display sales data.
  - Fetches data from the backend via Axios and renders it in tables and charts.
  - Users can filter data by product or date ranges.

- **Database (PostgreSQL)**:
  - Stores all sales transaction data, including product, category, and quantity information.
  - Provides the ability to query detailed transaction logs or summarized sales data.
  - Designed for scalability and optimization in querying large datasets.

---

## Prerequisites

To run this project locally or in a production environment, you'll need the following tools installed:

- **Docker**: To containerize and run the services.
- **Docker Compose**: To orchestrate multiple containers for the backend, frontend, and database services.

You can install Docker and Docker Compose by following the instructions on their official websites:

- [Docker Installation Guide](https://docs.docker.com/get-docker/)
- [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

---

## Installation & Running Locally

### Step 1: Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/ahmed-k-aly/sales-dashboard.git
cd sales-dashboard
```

### Step 2: Build and Start the Backend Services
Use Docker Compose to build and run all the services (backend and database) in containers:

```bash
docker-compose up --build
```
This command will:

Build the Docker images for both the backend and frontend services.
Start a PostgreSQL database container for storing sales data.
Expose the backend on port 8000
### Step 3: Start the Frontend Services
```bash
cd frontend-app
npm install
npm run dev
```
This will expose the frontend on port 5173.
### Step 3: Access the Application
Once the services are up and running, you can access the following:

Frontend (React): Visit http://localhost:5173 to see the sales dashboard.
Backend (FastAPI): Visit http://localhost:8000/docs to explore the backend API via the interactive Swagger documentation. Alternatively, you can run queries by running http://localhost:8000/sales/product or localhost:8000/sales/day
Database (PostgreSQL): The PostgreSQL database is running locally on port 5432, and you can access it using any PostgreSQL client.
## Detailed Service Breakdown
### Backend Service (FastAPI)
The backend is responsible for processing and serving sales data. It provides several key API endpoints for interacting with the sales database.

#### Endpoints:

GET /sales/product: Retrieves total sales data grouped by product, with optional filtering by product name.
GET /sales/day: Retrieves total sales data grouped by day, with optional filtering by specific dates or date ranges.

#### Database Interaction:

The backend interacts with a PostgreSQL database to store and query sales transactions. SQLAlchemy is used as the ORM (Object-Relational Mapper) to handle database operations.

#### Key Technologies:

FastAPI for serving the API.
SQLAlchemy for interacting with the PostgreSQL database.
Pydantic for data validation and serialization.

### Frontend Service (React)
The frontend is a modern React-based application that consumes the backend API and displays sales data via a dashboard.

#### Key Features:

Fetches product and daily sales data from the backend using Axios.
Renders sales data in dynamic tables and visualizes it using charts (e.g., line charts for daily sales).
Allows users to filter and explore the data interactively.

#### Key Technologies:

React for building the user interface.
Axios for making API requests to the backend.
Charting libraries for visualizing sales data.

### PostgreSQL Database
The PostgreSQL database stores all sales-related data, including product details, categories, and transaction logs.

#### Database Schema:

products: Stores product information.
categories: Stores product categories.
sales: Stores each sales transaction, linking to products and categories.

#### Data Ingestion:

The backend provides an ingestion script (ingest_csv.py) that loads sales data from a CSV file into the database. This script can be used to populate the database with initial data during development or testing.
Deployment
This project is designed to be easily deployable using Docker. 

### Docker Container Issues:

Run docker ps to see if all services (db, backend, frontend) are up and running.
Use docker logs <container_name> to check the logs of individual containers for errors.
Database Connection Issues:

Ensure that PostgreSQL is running and that the connection details (username, password, database name) are correct.
You can manually access the PostgreSQL database using psql to check if the tables and data are present.
Frontend Not Loading:

Ensure that the frontend service is running on port 5173. You can check this by visiting http://localhost:5173 in your browser.
If you encounter any issues with API requests, ensure that the backend is running and that the frontend is correctly configured to point to the backend API.
