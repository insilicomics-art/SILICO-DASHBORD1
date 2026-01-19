import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardActions,
  Stack,
  MenuItem,
  Divider,
  Paper
} from '@mui/material';
import { Plus, Trash2, Pencil, Server as ServerIcon, Cpu, Activity, LayoutGrid, List as ListIcon, BarChart3 } from 'lucide-react';
import { type Server } from '../services/api';
import { type Project } from '../data/mockData';
import ServerAnalysis from './ServerAnalysis';

interface ServerTableProps {
  servers: Server[];
  projects?: Project[];
  onAddServer: (server: Server) => void;
  onUpdateServer: (server: Server) => void;
  onDeleteServer: (id: string) => void;
}

const ServerTable: React.FC<ServerTableProps> = ({ servers, projects = [], onAddServer, onUpdateServer, onDeleteServer }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [analyzingServer, setAnalyzingServer] = useState<Server | null>(null);
  const [serverForm, setServerForm] = useState<Partial<Server>>({
    name: '',
    specs: '',
    status: 'Active'
  });

  const handleOpen = (server?: Server) => {
    if (server) {
      setEditingId(server.id);
      setServerForm(server);
    } else {
      setEditingId(null);
      setServerForm({ name: '', specs: '', status: 'Active' });
    }
    setOpen(true);
  };

  const handleSave = () => {
    if (serverForm.name && serverForm.specs) {
      if (editingId) {
        onUpdateServer({ ...serverForm, id: editingId } as Server);
      } else {
        onAddServer({
          id: `srv_${Date.now()}`,
          name: serverForm.name,
          specs: serverForm.specs,
          status: serverForm.status as any
        } as Server);
      }
      setOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Maintenance': return 'warning';
      case 'Inactive': return 'default';
      default: return 'default';
    }
  };

  if (analyzingServer) {
    return (
      <ServerAnalysis 
        server={analyzingServer} 
        projects={projects} 
        onBack={() => setAnalyzingServer(null)} 
      />
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ServerIcon size={32} style={{ marginRight: 16, color: '#3b82f6' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>Server Inventory</Typography>
            <Typography variant="body2" color="text.secondary">Manage computing resources and GPU clusters.</Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={2}>
           <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, p: 0.5, display: 'flex', bgcolor: '#fff' }}>
              <IconButton 
                size="small" 
                onClick={() => setViewMode('grid')}
                sx={{ 
                  bgcolor: viewMode === 'grid' ? '#eff6ff' : 'transparent', 
                  color: viewMode === 'grid' ? '#3b82f6' : '#64748b',
                  borderRadius: 1.5 
                }}
              >
                <LayoutGrid size={18} />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => setViewMode('table')}
                sx={{ 
                  bgcolor: viewMode === 'table' ? '#eff6ff' : 'transparent', 
                  color: viewMode === 'table' ? '#3b82f6' : '#64748b',
                  borderRadius: 1.5 
                }}
              >
                <ListIcon size={18} />
              </IconButton>
           </Box>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Add Server
          </Button>
        </Stack>
      </Box>

      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {servers.map((server) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={server.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }
              }}>
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#eff6ff', color: '#3b82f6' }}>
                      <ServerIcon size={24} />
                    </Box>
                    <Chip 
                      label={server.status} 
                      size="small"
                      color={getStatusColor(server.status)}
                      sx={{ fontWeight: 700, borderRadius: 1.5 }}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight="800" gutterBottom>
                    {server.name}
                  </Typography>
                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                       <Cpu size={16} color="#64748b" />
                       <Typography variant="body2" color="text.secondary" fontWeight="500">
                         {server.specs}
                       </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                       <Activity size={16} color="#64748b" />
                       <Typography variant="body2" color="text.secondary">
                         ID: <span style={{ fontFamily: 'monospace' }}>{server.id}</span>
                       </Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <Divider />
                <CardActions sx={{ p: 2, pt: 1.5 }}>
                   <Button 
                    size="small" 
                    startIcon={<BarChart3 size={14} />} 
                    onClick={() => setAnalyzingServer(server)}
                    sx={{ color: '#3b82f6', fontWeight: 600 }}
                   >
                     Analyze
                   </Button>
                   <Button 
                    size="small" 
                    startIcon={<Pencil size={14} />} 
                    onClick={() => handleOpen(server)}
                    sx={{ color: '#64748b', fontWeight: 600 }}
                   >
                     Edit
                   </Button>
                   <Button 
                    size="small" 
                    color="error"
                    startIcon={<Trash2 size={14} />} 
                    onClick={() => {
                        if(window.confirm('Are you sure you want to remove this server?')) onDeleteServer(server.id);
                    }}
                    sx={{ ml: 'auto', fontWeight: 600 }}
                   >
                     Remove
                   </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {servers.length === 0 && (
             <Grid size={{ xs: 12 }}>
                <Box sx={{ p: 8, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 4, border: '2px dashed #e2e8f0' }}>
                   <ServerIcon size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                   <Typography variant="h6" color="text.secondary">No servers found</Typography>
                   <Button onClick={() => handleOpen()} sx={{ mt: 2 }}>Add your first server</Button>
                </Box>
             </Grid>
          )}
        </Grid>
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
             <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ padding: '16px', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Name</th>
                      <th style={{ padding: '16px', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Specs</th>
                      <th style={{ padding: '16px', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Status</th>
                      <th style={{ padding: '16px', fontSize: '0.875rem', fontWeight: 700, color: '#475569', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servers.map((server) => (
                      <tr key={server.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '16px', fontWeight: 600 }}>{server.name}</td>
                        <td style={{ padding: '16px', color: '#64748b' }}>{server.specs}</td>
                        <td style={{ padding: '16px' }}>
                           <Chip label={server.status} size="small" color={getStatusColor(server.status)} sx={{ fontWeight: 600 }} />
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                            <IconButton size="small" onClick={() => setAnalyzingServer(server)} color="primary"><BarChart3 size={16} /></IconButton>
                            <IconButton size="small" onClick={() => handleOpen(server)}><Pencil size={16} /></IconButton>
                            <IconButton size="small" color="error" onClick={() => { if(window.confirm('Are you sure?')) onDeleteServer(server.id); }}><Trash2 size={16} /></IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </Box>
        </Paper>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{editingId ? 'Edit Server' : 'Add New Server'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Server Name"
                fullWidth
                placeholder="e.g. Server 1 or HPC Cluster"
                value={serverForm.name}
                onChange={(e) => setServerForm({ ...serverForm, name: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Specifications"
                fullWidth
                placeholder="e.g. RTX 3090 Ti (24GB)"
                value={serverForm.specs}
                onChange={(e) => setServerForm({ ...serverForm, specs: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                label="Status"
                fullWidth
                value={serverForm.status}
                onChange={(e) => setServerForm({ ...serverForm, status: e.target.value as any })}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpen(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!serverForm.name} sx={{ borderRadius: 2, px: 3 }}>
            {editingId ? 'Save Changes' : 'Add Server'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServerTable;