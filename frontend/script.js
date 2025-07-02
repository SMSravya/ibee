const API_BASE = "http://127.0.0.1:8000";

// No authentication/session logic needed

document.addEventListener('DOMContentLoaded', function() {
    // Show app UI by default
    document.getElementById("appContainer").style.display = "block";
});

// CSV upload and table/query logic...
document.getElementById("uploadForm").onsubmit = async function(e) {
    e.preventDefault();
    const tableName = document.getElementById("tableName").value.trim();
    const fileInput = document.getElementById("csvFile");
    const uploadResult = document.getElementById("uploadResult");
    uploadResult.innerHTML = 'Uploading... <span class="spinner"></span>';
    if (!tableName || !fileInput.files.length) {
        uploadResult.textContent = "Please provide a table name and select a CSV file.";
        return;
    }
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    try {
        const res = await fetch(`${API_BASE}/upload_csv/${encodeURIComponent(tableName)}`, {
            method: "POST",
            body: formData
        });
        let data;
        try {
            data = await res.json();
        } catch (jsonErr) {
            uploadResult.textContent = `Upload failed: Invalid server response.`;
            document.getElementById("tableData").innerHTML = "";
            return;
        }
        if (res.ok) {
            let msg = data.message || "Upload successful.";
            if (data.rows_inserted !== undefined) msg += ` Rows inserted: ${data.rows_inserted}.`;
            if (data.validation_warnings && data.validation_warnings.length) {
                msg += `\nWarnings:\n` + data.validation_warnings.join("\n");
            }
            uploadResult.textContent = msg;
            document.getElementById("queryTableName").value = tableName;
            document.getElementById("filterTableName").value = tableName;
            await fetchTableData();
        } else {
            uploadResult.textContent = data.detail || "Upload failed.";
            document.getElementById("tableData").innerHTML = data.detail || "Upload failed.";
        }
        fetchTables();
    } catch (err) {
        uploadResult.textContent = `Network or server error: ${err}`;
        document.getElementById("tableData").innerHTML = "";
    }
    fileInput.value = "";
};

async function fetchTables() {
    const res = await fetch(`${API_BASE}/tables`);
    const data = await res.json();
    const list = document.getElementById("tableList");
    list.innerHTML = "";
    (data.tables || []).forEach(t => {
        const li = document.createElement("li");
        li.textContent = t;
        li.onclick = () => {
            document.getElementById("queryTableName").value = t;
            document.getElementById("filterTableName").value = t;
            fetchTableData();
        };
        list.appendChild(li);
    });
}

window.fetchTables = fetchTables;

async function fetchTableData() {
    const tableName = document.getElementById("queryTableName").value.trim();
    const tableDataDiv = document.getElementById("tableData");
    if (!tableName) {
        tableDataDiv.innerHTML = "Please enter a table name.";
        return;
    }
    tableDataDiv.innerHTML = 'Loading data... <span class="spinner"></span>';
    try {
        const res = await fetch(`${API_BASE}/data/${encodeURIComponent(tableName)}`);
        let data;
        try {
            data = await res.json();
        } catch (jsonErr) {
            tableDataDiv.innerHTML = "Failed to parse server response.";
            return;
        }
        if (res.ok && data.data && data.data.length) {
            tableDataDiv.innerHTML = renderTable(data.data);
        } else if (res.ok && (!data.data || !data.data.length)) {
            tableDataDiv.innerHTML = "No data found in this table.";
        } else {
            tableDataDiv.innerHTML = data.detail || "Failed to fetch data.";
        }
    } catch (err) {
        tableDataDiv.innerHTML = `Network or server error: ${err}`;
    }
}

window.fetchTableData = fetchTableData;

document.getElementById("queryForm").onsubmit = async function(e) {
    e.preventDefault();
    const tableName = document.getElementById("filterTableName").value.trim();
    const filters = document.getElementById("filters").value.trim();
    const limit = document.getElementById("limit").value;
    const offset = document.getElementById("offset").value;
    if (!tableName) return;
    let url = `${API_BASE}/data/${encodeURIComponent(tableName)}/query?`;
    if (filters) url += `filters=${encodeURIComponent(filters)}&`;
    if (limit) url += `limit=${encodeURIComponent(limit)}&`;
    if (offset) url += `offset=${encodeURIComponent(offset)}&`;
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById("queryResult").innerHTML = data.data ? renderTable(data.data) : (data.detail || "No data found.");
};

async function fetchLogs() {
    const res = await fetch(`${API_BASE}/logs`);
    const data = await res.json();
    document.getElementById("logContent").textContent = data.log || "No logs found.";
}

window.fetchLogs = fetchLogs;

function renderTable(rows) {
    if (!rows.length) return "No data.";
    const cols = Object.keys(rows[0]);
    let html = `<table><thead><tr>${cols.map(c=>`<th>${c}</th>`).join("")}</tr></thead><tbody>`;
    html += rows.map(r => `<tr>${cols.map(c=>`<td>${r[c]??""}</td>`).join("")}</tr>`).join("");
    html += "</tbody></table>";
    return html;
}

// Initial load
fetchTables();
