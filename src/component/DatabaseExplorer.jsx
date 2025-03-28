import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  Chip,
  InputAdornment,
  Tooltip,
  Collapse,
  Paper,
} from '@mui/material';
import {
  Search,
  Storage,
  TableChart,
  Key,
  Link,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';

const DatabaseSchemaViewer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [schema] = useState({
    database1: {
      users: [
        { id: 'users-id', name: "id", type: "INT", primaryKey: true },
        { id: 'users-name', name: "name", type: "VARCHAR(255)", nullable: false },
        { id: 'users-email', name: "email", type: "VARCHAR(255)", unique: true },
      ],
      orders: [
        { id: 'orders-order_id', name: "order_id", type: "INT", primaryKey: true },
        { id: 'orders-user_id', name: "user_id", type: "INT", foreignKey: "users.id" },
        { id: 'orders-amount', name: "amount", type: "DECIMAL(10,2)", nullable: false },
      ],
    },
    database2: {
      products: [
        { id: 'products-product_id', name: "product_id", type: "INT", primaryKey: true },
        { id: 'products-product_name', name: "product_name", type: "VARCHAR(255)", nullable: false },
        { id: 'products-price', name: "price", type: "DECIMAL(10,2)", nullable: false },
      ],
    },
  });

  // Filter schema based on search query
  const filteredSchema = useMemo(() => {
    if (!searchQuery) return schema;

    const result = {};
    Object.entries(schema).forEach(([dbName, tables]) => {
      const filteredTables = {};
      Object.entries(tables).forEach(([tableName, columns]) => {
        const matchingColumns = columns.filter(col =>
          col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tableName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (matchingColumns.length > 0) {
          filteredTables[tableName] = matchingColumns;
        }
      });
      if (Object.keys(filteredTables).length > 0) {
        result[dbName] = filteredTables;
      }
    });
    return result;
  }, [schema, searchQuery]);

  // Calculate detailed statistics for selected item
  const selectedItemStats = useMemo(() => {
    if (!selectedItem) return null;

    const [type, dbName, tableName] = selectedItem.split('-');

    if (type === 'database') {
      const db = schema[dbName];
      return {
        type: 'Database',
        name: dbName.toUpperCase(),
        stats: [
          {
            label: 'Tables',
            value: Object.keys(db).length,
            color: '#7ee787'
          },
          {
            label: 'Total Columns',
            value: Object.values(db).reduce((acc, table) => acc + table.length, 0),
            color: '#58a6ff'
          },
          {
            label: 'Relations',
            value: Object.values(db).reduce((acc, table) =>
              acc + table.filter(col => col.foreignKey).length, 0),
            color: '#d29922'
          }
        ]
      };
    }

    if (type === 'table') {
      const table = schema[dbName][tableName];
      return {
        type: 'Table',
        name: tableName.toUpperCase(),
        stats: [
          {
            label: 'Columns',
            value: table.length,
            color: '#58a6ff'
          },
          {
            label: 'Primary Keys',
            value: table.filter(col => col.primaryKey).length,
            color: '#f85149'
          },
          {
            label: 'Foreign Keys',
            value: table.filter(col => col.foreignKey).length,
            color: '#d29922'
          }
        ]
      };
    }

    return null;
  }, [selectedItem, schema]);

  // Handle tree item selection
  const handleNodeSelect = (event, nodeId) => {
    setSelectedItem(nodeId);
  };

  const TreeItemContent = ({ type, label, details }) => (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      py: 0.5
    }}>
      {type === 'database' && <Storage sx={{ color: '#58a6ff' }} fontSize="small" />}
      {type === 'table' && <TableChart sx={{ color: '#7ee787' }} fontSize="small" />}
      {type === 'column' && (
        details.primaryKey ?
          <Key sx={{ color: '#f85149' }} fontSize="small" /> :
          details.foreignKey ?
            <Link sx={{ color: '#d29922' }} fontSize="small" /> :
            null
      )}
      <Typography
        sx={{
          color: type === 'database' ? '#58a6ff' :
            type === 'table' ? '#7ee787' : '#c9d1d9',
          fontWeight: type !== 'column' ? 600 : 400,
          fontSize: type === 'database' ? '0.95rem' : '0.9rem'
        }}
      >
        {label}
      </Typography>
      {details && (
        <Chip
          label={details.type || details}
          size="small"
          sx={{
            height: 20,
            fontSize: '0.75rem',
            bgcolor: '#21262d',
            color: '#8b949e'
          }}
        />
      )}
    </Box>
  );

  return (
    <Card sx={{
      height: '100%',
      bgcolor: '#0d1117',
      border: 'none',
      borderRadius: 0,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #30363d' }}>
        <Typography variant="h6" sx={{ color: '#58a6ff', mb: 2 }}>
          Database Schema
        </Typography>

        <TextField
          fullWidth
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tables & columns..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#8b949e' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              color: '#c9d1d9',
              bgcolor: '#21262d',
              '& fieldset': { borderColor: '#30363d' },
              '&:hover fieldset': { borderColor: '#58a6ff' },
            }
          }}
        />

        {/* Selected Item Details */}
        {selectedItemStats && (
          <Box
            sx={{
              p: 2,
              mt: 2,
              bgcolor: '#161b22',
              border: '1px solid #30363d',
              borderRadius: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: '#c9d1d9',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {selectedItemStats.type === 'Database' ?
                <Storage sx={{ color: '#58a6ff' }} /> :
                <TableChart sx={{ color: '#7ee787' }} />
              }
              {selectedItemStats.name}
            </Typography>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: 2
            }}>
              {selectedItemStats.stats.map((stat, index) => (
                <Box key={index} sx={{ textAlign: 'center', minWidth: 100 }}>
                  <Typography variant="h6" sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#8b949e' }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <SimpleTreeView
          aria-label="database schema"
          defaultExpanded={['database1']}
          onNodeSelect={handleNodeSelect}
          slotProps={{
            collapseIcon: <ExpandMoreIcon sx={{ color: '#58a6ff' }} />,
            expandIcon: <ChevronRightIcon sx={{ color: '#58a6ff' }} />,
          }}
          sx={{
            color: '#c9d1d9',
            '& .MuiTreeItem-group': {
              marginLeft: 2,
              borderLeft: '1px dashed #30363d',
              paddingLeft: 1
            },
            '& .MuiTreeItem-content': {
              padding: '2px 0',
              '&:hover': {
                bgcolor: '#21262d'
              }
            }
          }}
        >
          {Object.entries(filteredSchema).map(([dbName, tables]) => (
            <TreeItem
              key={dbName}
              itemId={`database-${dbName}`}
              label={<TreeItemContent type="database" label={dbName.toUpperCase()} />}
            >
              {Object.entries(tables).map(([tableName, columns]) => (
                <TreeItem
                  key={`${dbName}-${tableName}`}
                  itemId={`table-${dbName}-${tableName}`}
                  label={<TreeItemContent type="table" label={tableName} />}
                >
                  {columns.map((column) => (
                    <TreeItem
                      key={column.id}
                      itemId={column.id}
                      label={
                        <TreeItemContent
                          type="column"
                          label={column.name}
                          details={column}
                        />
                      }
                    />
                  ))}
                </TreeItem>
              ))}
            </TreeItem>
          ))}
        </SimpleTreeView>
      </Box>
    </Card>
  );
};

export default DatabaseSchemaViewer;
