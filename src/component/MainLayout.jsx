import React from "react";
import { Box } from "@mui/material";
import ComponentA from "./ComponentA";
import ComponentB from "./ComponentB";
import ComponentC from "./ComponentC";
import ComponentE from "./ComponentE";
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
          <ComponentA />
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
            <ComponentB />
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
            <ComponentC />
          </Box>

          {/* Right Sidebar - Fixed width, scrollable */}
          <Box
            sx={{
              width: 320,
              borderLeft: "1px solid #30363d",
              overflow: "auto",
            }}
          >
            <ComponentE />
          </Box>
        </Box>
      </Box>
    </SQLEditorProvider>
  );
};

export default MainLayout;
