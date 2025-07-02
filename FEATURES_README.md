# Data Upload and Query App

A full-stack web application for uploading, storing, and querying CSV data with a modern frontend and FastAPI backend.

## Features

### Frontend
- **Modern UI**: Clean, responsive interface for all features.
- **CSV Upload**: Upload CSV files to create or update tables in the backend database.
- **Table List**: View all available tables in the database.
- **Table Data View**: Instantly view all data from any table.
- **Query with Filters**: Query tables with flexible filters, limit, and offset.
- **API Activity Log**: View backend API activity logs directly from the frontend.
- **No Authentication Required**: All features are public and ready to use out-of-the-box.

### Backend (FastAPI)
- **CSV File Upload**: `POST /upload_csv/{table_name}` — Upload CSV files to dynamically named tables in SQLite.
- **Data Validation**: Checks for missing values and row length consistency. Empty cells stored as NULL.
- **SQLite Database**: All data is stored in a local SQLite file (`data.db`).
- **List Tables**: `GET /tables` — List all user-created tables.
- **Get Table Data**: `GET /data/{table_name}` — Retrieve all data from a table.
- **Query Table Data**: `GET /data/{table_name}/query` — Query with filters, limit, and offset.
- **API Logging**: All API activity is logged to `api_activity.log` and viewable from the frontend.
- **CORS Enabled**: Frontend and backend work together seamlessly.

## How to Run

1. **Install Python dependencies** (in the project root):
   ```sh
   pip install -r requirements.txt
   ```
2. **Start the backend** (in the project root):
   ```sh
   python -m uvicorn main:app --reload
   ```
3. **Serve the frontend** (from the `frontend` folder):
   ```sh
   python -m http.server 8080
   ```
   Then open [http://localhost:8080/index.html](http://localhost:8080/index.html) in your browser.

## Example CSV
```
name,age,city
Dk,40,Bangalore
Vk,37,Chennai
Sd,42,Delhi
```

## Usage
- **Upload CSV**: Enter a table name, select a CSV file, and click Upload.
- **View Tables**: Click "Refresh Table List" to see all tables.
- **View Data**: Enter a table name and click "Get Data".
- **Query Data**: Use the filter form to query with filters, limit, and offset.
- **View Logs**: Click "Show Logs" to see backend activity.

## Project Structure
- `main.py` — FastAPI backend
- `frontend/` — Frontend HTML, JS, CSS
- `data.db` — SQLite database
- `api_activity.log` — API activity log
- `requirements.txt` — Python dependencies

---
**No authentication is required. All features are available to any user.**
