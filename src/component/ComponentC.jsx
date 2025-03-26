import React, { useState, useRef } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Editor from "@monaco-editor/react";
import { format } from "sql-formatter";
import { useSQLEditor } from '../context/SQLEditorContext';

const ComponentC = () => {
  const { sqlCode, setSqlCode } = useSQLEditor();
  const [output, setOutput] = useState("");
  const fileInputRef = useRef(null);
  const [queryResults, setQueryResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Predefined queries and their mock results
  const predefinedQueries = {
    "SELECT * FROM orders LIMIT 10;": {
      columns: ["orderID", "customerID", "orderDate", "shipCountry"],
      rows: [
        { orderID: 10248, customerID: "VINET", orderDate: "1996-07-04", shipCountry: "France" },
        { orderID: 10249, customerID: "TOMSP", orderDate: "1996-07-05", shipCountry: "Germany" },
        { orderID: 10250, customerID: "HANAR", orderDate: "1996-07-08", shipCountry: "Brazil" },
        // Add more rows as needed
      ]
    },
    "SELECT COUNT(*) as total_orders, shipCountry FROM orders GROUP BY shipCountry ORDER BY total_orders DESC LIMIT 5;": {
      columns: ["shipCountry", "total_orders"],
      rows: [
        { shipCountry: "USA", total_orders: 122 },
        { shipCountry: "Germany", total_orders: 89 },
        { shipCountry: "France", total_orders: 77 },
        { shipCountry: "Brazil", total_orders: 62 },
        { shipCountry: "UK", total_orders: 56 },
      ]
    },
    "SELECT customerID, COUNT(*) as order_count FROM orders GROUP BY customerID ORDER BY order_count DESC LIMIT 5;": {
      columns: ["customerID", "order_count"],
      rows: [
        { customerID: "SAVEA", order_count: 31 },
        { customerID: "ERNSH", order_count: 30 },
        { customerID: "QUICK", order_count: 28 },
        { customerID: "HUNGO", order_count: 19 },
        { customerID: "FOLKO", order_count: 19 },
      ]
    },
    "SELECT YEAR(orderDate) as year, COUNT(*) as orders FROM orders GROUP BY year ORDER BY year;": {
      columns: ["year", "orders"],
      rows: [
        { year: 1996, orders: 152 },
        { year: 1997, orders: 408 },
        { year: 1998, orders: 270 }
      ]
    },
    "SELECT shipCity, COUNT(*) as orders FROM orders WHERE shipCountry = 'USA' GROUP BY shipCity ORDER BY orders DESC LIMIT 5;": {
      columns: ["shipCity", "orders"],
      rows: [
        { shipCity: "Boise", orders: 12 },
        { shipCity: "Seattle", orders: 10 },
        { shipCity: "Albuquerque", orders: 8 },
        { shipCity: "Portland", orders: 7 },
        { shipCity: "Eugene", orders: 6 }
      ]
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".sql")) {
      const reader = new FileReader();
      reader.onload = (e) => setSqlCode(e.target.result.trim());
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .sql file");
    }
  };

  // Handle file save
  const handleSaveFile = () => {
    const blob = new Blob([sqlCode], { type: "text/sql" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "query.sql";
    link.click();
  };

  // Handle query execution
  const handleExecuteQuery = () => {
    setLoading(true);
    const normalizedQuery = sqlCode.trim().replace(/\s+/g, ' ');

    setTimeout(() => {
      if (predefinedQueries[normalizedQuery]) {
        setQueryResults(predefinedQueries[normalizedQuery]);
        setOutput("✅ Query executed successfully!");
      } else {
        setOutput("⚠️ Please use one of the predefined queries.");
        setQueryResults(null);
      }
      setLoading(false);
    }, 500);
  };

  // Format SQL Query
  const handleFormatQuery = () => {
    try {
      setSqlCode(format(sqlCode)); // Correct way to use sql-formatter
    } catch (error) {
      alert("Error formatting SQL query");
    }
  };

  return (
    <Box sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      bgcolor: "#1e1e1e",
      overflow: "hidden"
    }}>
      {/* SQL Editor */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <Editor
          height="100%"
          language="sql"
          theme="vs-dark"
          value={sqlCode}
          onChange={(newValue) => setSqlCode(newValue)}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 10 },
            lineNumbers: "on",
            roundedSelection: false,
            contextmenu: true,
            fontFamily: "'Fira Code', monospace",
            fontLigatures: true,
          }}
        />
      </Box>

      {/* Controls - Fixed height */}
      <Box sx={{
        display: "flex",
        gap: 1,
        padding: "10px",
        borderTop: "1px solid #30363d",
        bgcolor: "#161b22",
        flexShrink: 0
      }}>
        <input
          type="file"
          accept=".sql"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        <Button
          variant="contained"
          onClick={() => fileInputRef.current.click()}
          sx={{ bgcolor: '#238636', '&:hover': { bgcolor: '#2ea043' } }}
          size="small"
        >
          Upload SQL
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveFile}
          sx={{ bgcolor: '#1f6feb', '&:hover': { bgcolor: '#388bfd' } }}
          size="small"
        >
          Save
        </Button>
        <Button
          variant="contained"
          onClick={handleExecuteQuery}
          sx={{ bgcolor: '#238636', '&:hover': { bgcolor: '#2ea043' } }}
          size="small"
        >
          Execute
        </Button>
        <Button
          variant="contained"
          onClick={handleFormatQuery}
          sx={{ bgcolor: '#6e7681', '&:hover': { bgcolor: '#8b949e' } }}
          size="small"
        >
          Format
        </Button>
      </Box>

      {/* Results Section */}
      <Box sx={{
        flex: 1,
        overflow: "auto",
        bgcolor: "#0d1117",
        borderTop: "1px solid #30363d"
      }}>
        {loading ? (
          <Box sx={{ p: 2, color: "#c9d1d9" }}>Executing query...</Box>
        ) : queryResults ? (
          <TableContainer component={Paper} sx={{ bgcolor: "#0d1117" }}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow sx={{ '& th': { bgcolor: "#161b22", color: "#58a6ff" } }}>
                  {queryResults.columns.map((column, index) => (
                    <TableCell key={index} sx={{ color: "#58a6ff", fontWeight: "bold" }}>
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {queryResults.rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex} sx={{
                    '& td': { color: "#c9d1d9", borderColor: "#30363d" },
                    '&:nth-of-type(odd)': { bgcolor: "#161b22" },
                    '&:hover': { bgcolor: "#1f6feb33" }
                  }}>
                    {queryResults.columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        {row[column]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 2, color: "#8b949e" }}>
            {output || "Execute a query to see results..."}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ComponentC;
