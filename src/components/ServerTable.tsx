import React, { useState, useMemo } from 'react';
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
import { 
  Plus, 
  Trash2, 
  Pencil, 
  Server as ServerIcon, 
  Cpu, 
  Activity, 
  LayoutGrid, 
  List as ListIcon, 
  BarChart3, 
  CheckCircle2
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { type Server, type ServerStatus } from '../services/api';
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

  // Calculate Server Usage & Workload Stats
  const { serverUsageStats, serverWorkload } = useMemo(() => {
    // 1. Identify Running Servers & Workload
    const runningServers = new Set<string>();
    const workloadMap = new Map<string, { activeTasks: number, activeNs: number }>();
    
    // Initialize workload map
    servers.forEach(s => workloadMap.set(s.name, { activeTasks: 0, activeNs: 0 }));

    projects.forEach(project => {
      if (project.activities) {
        project.activities.forEach(activity => {
          if (activity.status === 'In Progress' && activity.server) {
            const sName = activity.server.trim();
            // Try to find matching server
            const match = servers.find(s => s.name.trim() === sName);
            
            if (match) {
              runningServers.add(match.name);
              const current = workloadMap.get(match.name)!;
              const ns = parseInt(activity.duration.replace(/[^0-9]/g, '') || '0');
              workloadMap.set(match.name, {
                activeTasks: current.activeTasks + 1,
                activeNs: current.activeNs + ns
              });
            }
          }
        });
      }
    });

    // 2. Calculate Usage Stats
    const usageStats = {
      running: 0,
      free: 0,
      maintenance: 0,
      freeServerNames: [] as string[]
    };

    servers.forEach(server => {
      if (server.status !== 'Active') {
        usageStats.maintenance++;
      } else if (runningServers.has(server.name)) {
        usageStats.running++;
      } else {
        usageStats.free++;
        usageStats.freeServerNames.push(server.name);
      }
    });

    // 3. Format Workload Data for Chart
    const workloadData = Array.from(workloadMap.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.activeTasks - a.activeTasks);

    return { serverUsageStats: usageStats, serverWorkload: workloadData };
  }, [servers, projects]);

  const usageData = [
    { name: 'Running', value: serverUsageStats.running },
    { name: 'Free', value: serverUsageStats.free },
    { name: 'Maintenance', value: serverUsageStats.maintenance },
  ].filter(d => d.value > 0);
  
  const USAGE_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

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
          status: serverForm.status as ServerStatus
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
      {/* Real-time Utilization Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 3 }}>Real-time Cluster Status</Typography>
        <Grid container spacing={3}>
          {/* Chart Card 1: Availability Pie */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
              <CardContent>
                 <Typography variant="subtitle1" fontWeight={700} gutterBottom>Availability Overview</Typography>
                 <Box sx={{ height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={usageData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {usageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={USAGE_COLORS[usageData.findIndex(d => d.name === entry.name) % USAGE_COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                 </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Chart Card 2: Workload Bar */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
              <CardContent>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700}>Active Workload Distribution</Typography>
                    <Chip label="Real-time Tasks" size="small" icon={<Activity size={12} />} sx={{ bgcolor: '#eff6ff', color: '#3b82f6', fontWeight: 600 }} />
                 </Box>
                 <Box sx={{ height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={serverWorkload} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fill: '#64748b' }} 
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fill: '#64748b' }} 
                            allowDecimals={false}
                        />
                        <RechartsTooltip 
                            cursor={{ fill: '#f8fafc' }} 
                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} 
                        />
                        <Bar dataKey="activeTasks" name="Active Tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40}>
                           {serverWorkload.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.activeTasks > 0 ? '#3b82f6' : '#cbd5e1'} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                 </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Free Servers List Card */}
          <Grid size={{ xs: 12 }}>
             <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
               <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CheckCircle2 size={24} color="#10b981" />
                      <Typography variant="h6" fontWeight={800} color="#10b981">
                        {serverUsageStats.free} Available Servers
                      </Typography>
                    </Stack>
                    <Chip label="Ready for Jobs" size="small" sx={{ bgcolor: '#ecfdf5', color: '#10b981', fontWeight: 700 }} />
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  {serverUsageStats.freeServerNames.length > 0 ? (
                    <Grid container spacing={2}>
                      {serverUsageStats.freeServerNames.map((name) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={name}>
                          <Box sx={{ 
                            p: 2, 
                            bgcolor: '#f8fafc', 
                            borderRadius: 2, 
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: '#10b981', bgcolor: '#f0fdf4' }
                          }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 0 2px #bbf7d0' }} />
                            <Typography variant="body2" fontWeight={600} color="#334155">{name}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4, color: '#64748b' }}>
                      <Typography variant="body2">All active servers are currently running jobs.</Typography>
                    </Box>
                  )}
                  
                  {serverUsageStats.maintenance > 0 && (
                     <Box sx={{ mt: 3, p: 2, bgcolor: '#fff7ed', borderRadius: 2, border: '1px dashed #fdba74' }}>
                        <Typography variant="caption" color="#c2410c" fontWeight={600}>
                          Note: {serverUsageStats.maintenance} server(s) are currently Down or in Maintenance mode.
                        </Typography>
                     </Box>
                  )}
               </CardContent>
             </Card>
          </Grid>
        </Grid>
      </Box>

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
                onChange={(e) => setServerForm({ ...serverForm, status: e.target.value as ServerStatus })}
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