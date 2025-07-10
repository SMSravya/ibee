# ibee_technical_assignment

## Data Upload and Query API

A backend system built with FastAPI that allows users to upload CSV files, validates the data, stores it in an SQLite database, and exposes REST API endpoints to query the stored data. All API activity is logged to a file.

---

## Features
- **CSV File Upload:** Upload CSV files to dynamically named tables in an SQLite database.
- **Data Validation:** Basic validation for missing values and incorrect row lengths during CSV upload. Empty cells are stored as NULL.
- **SQLite Database:** Uses a file-based SQLite database (`data.db`) for data storage.
- **REST API Endpoints:**
  - `POST /upload_csv/{table_name}`: Upload a CSV file and store its data in a new or existing table.
  - `GET /tables`: List all tables created from CSV uploads.
  - `GET /data/{table_name}`: Retrieve all data from a specified table.
  - `GET /data/{table_name}/query`: Filter, limit, and offset data from a specified table using query parameters.
- **API Activity Logging:** Logs all API requests (method, path, client IP) and response statuses to `api_activity.log` and the console.
- **Automatic API Documentation:** Interactive API documentation is available at `/docs`.
- **First-Time User Registration:** The first user can register their own username and password via the frontend. All API endpoints require authentication after registration.

---

## Technologies Used
- **Backend Framework:** FastAPI (Python)
- **Web Server:** Uvicorn
- **Database:** SQLite
- **File Handling:** python-multipart
- **Data Processing:** Standard Python csv module

---

## Setup and Installation

### 1. Clone or Download the Project
If you have the `main.py` file, simply save it to a directory of your choice (e.g., `my_api_project`).

### 2. Create a Virtual Environment (Recommended)
It's good practice to use a virtual environment to manage project dependencies.

```sh
python -m venv venv
```

### 3. Activate the Virtual Environment
**Windows:**
```sh
.\venv\Scripts\activate
```

### 4. Install Dependencies
Navigate to your project directory (where `main.py` is located) in your terminal and install the required packages:

```sh
pip install fastapi uvicorn python-multipart
```

If `pip` doesn't work, try `pip3`.

### 5. Start the FastAPI Server
**IMPORTANT:** On Windows, use the following command:
```sh
python -m uvicorn main:app --reload
```
- `main`: Refers to the `main.py` file.
- `app`: Refers to the FastAPI() instance named `app` inside `main.py`.
- `--reload`: Automatically restarts the server when you make changes to your code (useful for development).

---

## First-Time User Registration & Authentication

- When you open the frontend (`index.html`), if no user is registered, you will see a registration form.
- Enter your desired username and password and click **Register**.
- After registration, you can log in with those credentials.
- All API endpoints require HTTP Basic Auth (handled automatically by the frontend after login).
- If a user is already registered, only that user can log in. No one else can register or sign up.
- **If you want to reset the user:** Delete the `users.json` file in your project directory to allow a new registration.

**Note:**
- If you see a browser popup asking for username and password, cancel it and use the custom form in your frontend instead.
- All authentication is handled via the custom frontend form, not the browser popup.

---

## Access the API Documentation
Once the server starts, open your web browser and go to:

http://127.0.0.1:8000/docs

This will display the interactive Swagger UI, where you can explore and test all the API endpoints. You will need to use the username and password you registered.

---

## API Endpoints and Usage

### 1. Upload CSV File
- **Endpoint:** `POST /upload_csv/{table_name}`
- **Description:** Uploads a CSV file and stores its data in a new or existing SQLite table. The table name is derived from the path parameter.
- **Parameters:**
  - `table_name` (Path): The desired name for the database table (e.g., users, products, orders). It will be sanitized to be a valid SQL name.
  - `file` (File Upload): The CSV file to upload.
- **Example (using Swagger UI):**
  1. Go to http://127.0.0.1:8000/docs.
  2. Expand the POST /upload_csv/{table_name} endpoint.
  3. Click "Try it out".
  4. In the table_name field, enter a name like `my_data`.
  5. Click "Choose File" and select your CSV file.
  6. Click "Execute".
- **Sample my_data.csv content:**
  ```csv
name,age,city
Dk,40,Banglore
Vk,37,Chennai
Sd,42,Delhi
  ```

### 2. List All Tables
- **Endpoint:** `GET /tables`
- **Description:** Retrieves a list of all user-defined tables currently stored in the database.
- **Example (using Swagger UI):**
  1. Go to http://127.0.0.1:8000/docs.
  2. Expand the GET /tables endpoint.
  3. Click "Try it out".
  4. Click "Execute".
- **Expected Response:** `{ "tables": ["my_data"] }` (if you uploaded my_data.csv)

### 3. Retrieve All Data from a Table
- **Endpoint:** `GET /data/{table_name}`
- **Description:** Retrieves all data from the specified table.
- **Parameters:**
  - `table_name` (Path): The name of the table to retrieve data from (e.g., my_data).
- **Example (using Swagger UI):**
  1. Go to http://127.0.0.1:8000/docs.
  2. Expand the GET /data/{table_name} endpoint.
  3. Click "Try it out".
  4. In the table_name field, enter `my_data`.
  5. Click "Execute".
- **Expected Response (JSON):** All rows from your my_data table.

### 4. Query Data from a Table with Filters
- **Endpoint:** `GET /data/{table_name}/query`
- **Description:** Queries data from the specified table with optional filters, limit, and offset. Filters are applied as key=value pairs.
- **Parameters:**
  - `table_name` (Path): The name of the table to query (e.g., my_data).
  - `limit` (Query, Optional): Maximum number of rows to return (default: 100).
  - `offset` (Query, Optional): Number of rows to skip (default: 0) for pagination.
  - `filters` (Query, Optional): A comma-separated string of key=value pairs for filtering (e.g., city=New York,age=30).
- **Example (using Swagger UI):**
  1. Go to http://127.0.0.1:8000/docs.
  2. Expand the GET /data/{table_name}/query endpoint.
  3. Click "Try it out".
  4. In the table_name field, enter `my_data`.
  5. In the filters input field, enter your desired filters as key=value pairs separated by commas.
     - To filter by city: `city=Delhi`
     - To filter by age: `age=42`
     - To combine filters: `city=Delhi,age=42`
  6. Optionally, adjust limit and offset.
  7. Click "Execute".
- **Example (Direct URL in browser):**
  You can also construct the URL directly in your browser's address bar for more direct testing of dynamic filters:
  ```
http://127.0.0.1:8000/data/my_data/query?city=New%20York&age=30&limit=1
  ```

---

## Troubleshooting & Common Issues

- **Uvicorn not recognized:**
  - Use `python -m uvicorn main:app --reload` instead of `uvicorn main:app --reload` on Windows.
- **Browser popup for authentication:**
  - Cancel the popup and use the custom login/registration form in the frontend.
- **Can't register a new user:**
  - Delete `users.json` in your project directory to allow a new registration.
- **Forgot your password?**
  - Delete `users.json` and register a new user (this will reset all authentication).
- **API requests fail with 401:**
  - Make sure you are logged in via the frontend form and your credentials are correct.

---
##  Author
    built by S M Sravya
