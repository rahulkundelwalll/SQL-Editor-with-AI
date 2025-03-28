import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  FormControlLabel,
  Tooltip,
  Badge,
  Divider,
  Box,
  TextField,
  DialogContentText,
  Tab,
  Tabs,
  Stack,
} from "@mui/material";
import {
  Code,
  GitHub,
  Settings,
  DarkMode,
  Storage,
  PowerSettingsNew,
  CloudDone,
  Info,
  Download,
  KeyOutlined,
  Upload,
} from "@mui/icons-material";

const ComponentA = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [dbDialogOpen, setDbDialogOpen] = useState(false);
  const [connectionTab, setConnectionTab] = useState(0);
  const [connectionForm, setConnectionForm] = useState({
    host: '',
    port: '3306',
    username: '',
    password: '',
    database: '',
    pemFile: null,
  });

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const handleOpenSettings = () => {
    handleSettingsClose();
    setSettingsOpen(true);
  };

  const handleConnectDB = () => {
    handleSettingsClose();
    setDbDialogOpen(true);
  };

  const handlePemFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setConnectionForm(prev => ({ ...prev, pemFile: file }));
    }
  };

  const handleConnect = () => {
    // Implement your database connection logic here
    console.log('Connecting with:', connectionForm);
    setIsConnected(true);
    setDbDialogOpen(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#1a1a1a" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Code sx={{ mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold", mr: 2 }}>
              SQL Workspace
            </Typography>
            <Tooltip title={isConnected ? "Database Connected" : "Database Disconnected"}>
              <Badge
                color={isConnected ? "success" : "error"}
                variant="dot"
                sx={{ mr: 2 }}
              >
                <Storage />
              </Badge>
            </Tooltip>
          </Box>

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Download Results">
              <IconButton color="inherit" size="large">
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="View on GitHub">
              <IconButton
                color="inherit"
                size="large"
                onClick={() => window.open("https://github.com/yourusername/sql-workspace", "_blank")}
              >
                <GitHub />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton color="inherit" size="large" onClick={handleSettingsClick}>
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Settings Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleSettingsClose}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white',
            border: '1px solid #30363d',
          }
        }}
      >
        <MenuItem onClick={handleOpenSettings}>
          <Settings sx={{ mr: 1 }} /> Preferences
        </MenuItem>
        <MenuItem onClick={() => setIsDarkMode(!isDarkMode)}>
          <DarkMode sx={{ mr: 1 }} /> Dark Mode
        </MenuItem>
        <Divider sx={{ bgcolor: '#30363d' }} />
        <MenuItem onClick={() => setIsConnected(!isConnected)}>
          <PowerSettingsNew sx={{ mr: 1 }} />
          {isConnected ? "Disconnect Database" : "Connect Database"}
        </MenuItem>
      </Menu>

      {/* Database Connection Dialog */}
      <Dialog
        open={dbDialogOpen}
        onClose={() => setDbDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white',
            minWidth: '500px',
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #30363d' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Storage />
            Database Connection
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Tabs
            value={connectionTab}
            onChange={(e, v) => setConnectionTab(v)}
            sx={{
              mb: 2,
              borderBottom: '1px solid #30363d',
              '& .MuiTab-root': { color: '#8b949e' },
              '& .Mui-selected': { color: '#58a6ff' }
            }}
          >
            <Tab label="Standard" />
            <Tab label="SSH / PEM" />
          </Tabs>

          <Stack spacing={2}>
            <TextField
              label="Host"
              value={connectionForm.host}
              onChange={(e) => setConnectionForm(prev => ({ ...prev, host: e.target.value }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#c9d1d9',
                  '& fieldset': { borderColor: '#30363d' },
                },
                '& .MuiInputLabel-root': { color: '#8b949e' }
              }}
            />
            <TextField
              label="Port"
              value={connectionForm.port}
              onChange={(e) => setConnectionForm(prev => ({ ...prev, port: e.target.value }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#c9d1d9',
                  '& fieldset': { borderColor: '#30363d' },
                },
                '& .MuiInputLabel-root': { color: '#8b949e' }
              }}
            />
            <TextField
              label="Database"
              value={connectionForm.database}
              onChange={(e) => setConnectionForm(prev => ({ ...prev, database: e.target.value }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#c9d1d9',
                  '& fieldset': { borderColor: '#30363d' },
                },
                '& .MuiInputLabel-root': { color: '#8b949e' }
              }}
            />
            <TextField
              label="Username"
              value={connectionForm.username}
              onChange={(e) => setConnectionForm(prev => ({ ...prev, username: e.target.value }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#c9d1d9',
                  '& fieldset': { borderColor: '#30363d' },
                },
                '& .MuiInputLabel-root': { color: '#8b949e' }
              }}
            />
            {connectionTab === 0 ? (
              <TextField
                type="password"
                label="Password"
                value={connectionForm.password}
                onChange={(e) => setConnectionForm(prev => ({ ...prev, password: e.target.value }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#c9d1d9',
                    '& fieldset': { borderColor: '#30363d' },
                  },
                  '& .MuiInputLabel-root': { color: '#8b949e' }
                }}
              />
            ) : (
              <Box sx={{
                border: '1px dashed #30363d',
                p: 2,
                borderRadius: 1,
                textAlign: 'center'
              }}>
                <input
                  type="file"
                  accept=".pem"
                  onChange={handlePemFileUpload}
                  style={{ display: 'none' }}
                  id="pem-file-input"
                />
                <label htmlFor="pem-file-input">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<KeyOutlined />}
                    sx={{
                      borderColor: '#30363d',
                      color: '#c9d1d9',
                      '&:hover': { borderColor: '#58a6ff' }
                    }}
                  >
                    Upload PEM Key
                  </Button>
                </label>
                {connectionForm.pemFile && (
                  <Typography variant="body2" sx={{ mt: 1, color: '#7ee787' }}>
                    {connectionForm.pemFile.name}
                  </Typography>
                )}
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #30363d', p: 2 }}>
          <Button
            onClick={() => setDbDialogOpen(false)}
            sx={{ color: '#8b949e' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConnect}
            startIcon={<Storage />}
            sx={{
              bgcolor: '#238636',
              '&:hover': { bgcolor: '#2ea043' }
            }}
          >
            Connect
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white',
            minWidth: '400px',
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #30363d' }}>
          Settings
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                color="primary"
              />
            }
            label="Dark Mode"
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Database Connection
            </Typography>
            <Typography variant="body2" color="#8b949e">
              Status: {isConnected ?
                <span style={{ color: '#7ee787' }}>Connected</span> :
                <span style={{ color: '#f85149' }}>Disconnected</span>
              }
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              About
            </Typography>
            <Typography variant="body2" color="#8b949e">
              Version: 1.0.0
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Database Connection
            </Typography>
            <Button
              variant="outlined"
              onClick={handleConnectDB}
              startIcon={<Storage />}
              sx={{
                borderColor: '#30363d',
                color: '#c9d1d9',
                '&:hover': { borderColor: '#58a6ff' }
              }}
            >
              Configure Connection
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #30363d', p: 2 }}>
          <Button onClick={() => setSettingsOpen(false)} sx={{ color: '#8b949e' }}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => setSettingsOpen(false)}
            sx={{ bgcolor: '#238636', '&:hover': { bgcolor: '#2ea043' } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ComponentA;
