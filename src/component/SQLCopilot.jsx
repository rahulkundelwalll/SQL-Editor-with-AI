import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Tooltip,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Send,
  Delete,
  AutoAwesome,
  Person,
  SmartToy,
  InfoOutlined,
} from "@mui/icons-material";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSQLEditor } from '../context/SQLEditorContext';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

const SQLCopilot = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("gemini-1.5-pro");
  const maxLength = 500;
  const { setSqlCode } = useSQLEditor();

  const handleGenerateSQL = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);

    const newMessages = [...messages, { role: "user", content: query, timestamp: new Date() }];
    setMessages(newMessages);
    setQuery("");

    try {
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // Updated prompt to ensure clean SQL output
      const prompt = `Act as an SQL expert. Return ONLY the raw SQL query without any markdown, formatting, or explanation.
For example, if I ask to show databases, respond with exactly: SHOW DATABASES;
Do not include \`\`\`, sql prefixes, or any other text. Just the pure SQL query.

Query request: ${query}`;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;

      // Clean the response to get pure SQL
      const cleanSQL = response.text()
        .replace(/```sql/gi, '')
        .replace(/```/g, '')
        .replace(/^[\r\n]+|[\r\n]+$/g, '')
        .trim();

      // Update editor and chat
      setSqlCode(cleanSQL);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: cleanSQL,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: "error",
          content: "Error generating SQL. Please check API key or try again later.",
          timestamp: new Date()
        }
      ]);
      console.error("Gemini API Error:", error);
    }

    setLoading(false);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const MessageComponent = ({ message }) => (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        mb: 2,
        flexDirection: message.role === 'user' ? 'row' : 'row-reverse',
      }}
    >
      <Chip
        icon={message.role === 'user' ? <Person /> : <SmartToy />}
        label={message.role === 'user' ? 'You' : 'AI'}
        size="small"
        color={message.role === 'user' ? 'primary' : 'secondary'}
        sx={{ height: 24 }}
      />
      <Box
        sx={{
          maxWidth: '75%',
          p: 1.5,
          borderRadius: 2,
          bgcolor: message.role === 'user' ? '#1f6feb33' : '#2ea04333',
          color: '#e6edf3',
          fontFamily: "'Fira Code', monospace",
          position: 'relative',
          '& pre': {
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }
        }}
      >
        <pre>{message.content}</pre>
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: -20,
            right: 0,
            color: '#8b949e',
          }}
        >
          {message.timestamp.toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      bgcolor: "#0d1117",
    }}>
      {/* Header */}
      <Box sx={{
        p: 2,
        borderBottom: "1px solid #30363d",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoAwesome sx={{ color: "#58a6ff" }} />
          <Typography variant="h6" sx={{ color: "#58a6ff", fontWeight: "bold" }}>
            SQL Copilot (Powered by Gemini)
          </Typography>
        </Box>
        <Tooltip title="Clear chat history">
          <IconButton onClick={handleClearChat} sx={{ color: "#8b949e" }}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Messages Area */}
      <Box sx={{
        flex: 1,
        overflowY: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}>
        {messages.length === 0 && (
          <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#8b949e",
            p: 2,
            border: "1px dashed #30363d",
            borderRadius: 1,
          }}>
            <InfoOutlined />
            <Typography>
              Start by describing the SQL query you need help with...
            </Typography>
          </Box>
        )}
        {messages.map((msg, idx) => (
          <MessageComponent key={idx} message={msg} />
        ))}
      </Box>

      {/* Input Area */}
      <Box sx={{
        p: 2,
        borderTop: "1px solid #30363d",
        bgcolor: "#161b22",
      }}>
        <Select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          size="small"
          sx={{
            mb: 1,
            width: 200,
            color: "#c9d1d9",
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: "#30363d",
            },
          }}
        >
          <MenuItem value="gemini-1.5-pro">Gemini 1.5 Pro</MenuItem>
          <MenuItem value="gemini-1.0-pro">Gemini 1.0 Pro</MenuItem>
        </Select>

        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value.slice(0, maxLength))}
            placeholder="Ask your SQL question..."
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#c9d1d9',
                bgcolor: '#0d1117',
                '& fieldset': {
                  borderColor: '#30363d',
                },
                '&:hover fieldset': {
                  borderColor: '#58a6ff',
                },
              },
            }}
          />
          <Box sx={{
            position: "absolute",
            right: 8,
            bottom: 8,
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}>
            <Typography variant="caption" sx={{ color: query.length === maxLength ? '#f85149' : '#8b949e' }}>
              {query.length}/{maxLength}
            </Typography>
            <IconButton
              onClick={handleGenerateSQL}
              disabled={!query.trim() || loading}
              sx={{
                bgcolor: '#238636',
                color: '#fff',
                '&:hover': { bgcolor: '#2ea043' },
                '&.Mui-disabled': { bgcolor: '#30363d' },
              }}
              size="small"
            >
              <Send fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SQLCopilot;