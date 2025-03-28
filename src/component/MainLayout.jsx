import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import DatabaseExplorer from "./DatabaseExplorer";
import SQLEditor from "./SQLEditor";
import SQLCopilot from "./SQLCopilot";
import { SQLEditorProvider } from '../context/SQLEditorContext';

const MainLayout = () => {
  return (
    <SQLEditorProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          bgcolor: "#0d1117",
        }}
      >
        {/* Header - Fixed height */}
        <Box sx={{ flexShrink: 0 }}>
          <Header />
        </Box>

        {/* Main Content Area - Fills remaining space */}
        <Box
          sx={{
            display: "flex",
            flex: 1,
            overflow: "hidden", // Prevents double scrollbars
          }}
        >
          {/* Left Sidebar - Fixed width, scrollable */}
          <Box
            sx={{
              width: 280,
              borderRight: "1px solid #30363d",
              overflow: "auto",
            }}
          >
            <DatabaseExplorer />
          </Box>

          {/* Middle Section - Fills remaining width */}
          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SQLEditor />
          </Box>

          {/* Right Sidebar - Fixed width, scrollable */}
          <Box
            sx={{
              width: 320,
              borderLeft: "1px solid #30363d",
              overflow: "auto",
            }}
          >
            <SQLCopilot />
          </Box>
        </Box>
      </Box>
    </SQLEditorProvider>
  );
};

export default MainLayout;
