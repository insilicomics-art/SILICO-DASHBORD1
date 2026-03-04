import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Chip, 
  Stack, 
  Card, 
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from '@mui/material';
import { 
  ChevronLeft, 
  Activity, 
  Clock, 
  Database, 
  Cpu, 
  Server as ServerIcon,
  CheckCircle2,
  PlayCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { type Server } from '../services/api';
import { type Project, type ProjectActivity } from '../data/mockData';

interface ServerAnalysisProps {
  server: Server;
  projects: Project[];
  onBack: () => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
const FUNDING_COLORS = ['#10b981', '#ef4444', '#f59e0b']; // Received, Pending

const formatCurrency = (val: number | undefined) => {
  if (val === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);
};

const ServerAnalysis: React.FC<ServerAnalysisProps> = ({ server, projects, onBack }) => {
  
  // Consolidate all activities for this server
  const serverActivities = useMemo(() => {
    const activities: (ProjectActivity & { projectTitle: string, projectId: string })[] = [];
    projects.forEach(p => {
      if (p.activities) {
        p.activities.forEach(a => {
          if (a.server && server.name && a.server.trim() === server.name.trim()) {
            activities.push({ ...a, projectTitle: p.title, projectId: p.id });
          }
        });
      }
    });
    return activities;
  }, [projects, server.name]);

  // Financial Analysis based on Projects utilizing this server
  const financialStats = useMemo(() => {
    let totalFunding = 0;
    let totalReceived = 0;
    let totalPending = 0;
    const projectIds = new Set<string>();

    serverActivities.forEach(a => {
      const project = projects.find(p => p.id === a.projectId);
      if (project) {
        projectIds.add(project.id);
        const totalProjectActivities = project.activities?.length || 1;
        
        // Calculate per-activity share with robust number parsing
        const projFunding = Number(project.totalFunding) || 0;
        const perActivityFunding = projFunding / totalProjectActivities;
        
        const received1 = Number(project.firstPaymentAmount) || 0;
        const received2 = Number(project.finalPaymentAmount) || 0;
        const totalProjReceived = received1 + received2;
        
        const perActivityReceived = totalProjReceived / totalProjectActivities;
        
        totalFunding += perActivityFunding;
        totalReceived += perActivityReceived;
        totalPending += (perActivityFunding - perActivityReceived);
      }
    });

    return { totalFunding, totalReceived, totalPending, projectCount: projectIds.size };
  }, [serverActivities, projects]);

  // KPIs
  const totalActivities = serverActivities.length;
  const activeActivities = serverActivities.filter(a => a.status === 'In Progress').length;
  const completedActivities = serverActivities.filter(a => a.status === 'Completed').length;
  
  const parseNs = (dur: string) => parseInt(dur.replace(/[^0-9]/g, '') || '0');
  const totalNs = serverActivities.reduce((sum, a) => sum + parseNs(a.duration), 0);
  
  const uniqueEngines = new Set(serverActivities.map(a => a.simulationEngine)).size;

  // Charts Data
  const statusData = [
    { name: 'Completed', value: completedActivities },
    { name: 'In Progress', value: activeActivities },
    { name: 'Pending', value: serverActivities.filter(a => a.status === 'Pending').length },
    { name: 'Failed', value: serverActivities.filter(a => a.status === 'Failed').length },
  ].filter(d => d.value > 0);

  const engineData = useMemo(() => {
    const counts: Record<string, number> = {};
    serverActivities.forEach(a => {
      const engine = a.simulationEngine || 'Unknown';
      counts[engine] = (counts[engine] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [serverActivities]);

  const fundingChartData = [
    { name: 'Received', value: financialStats.totalReceived },
    { name: 'Pending', value: financialStats.totalPending }
  ].filter(d => d.value > 0);

  const recentActivities = [...serverActivities]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5);

  return (
    <Box sx={{ p: 3 }}>
      <Button 
        startIcon={<ChevronLeft />} 
        onClick={onBack} 
        sx={{ mb: 3, fontWeight: 600, color: '#64748b' }}
      >
        Back to Inventory
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: 2, color: '#3b82f6' }}>
          <ServerIcon size={32} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>{server.name}</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body1" color="text.secondary" fontWeight={500}>{server.specs}</Typography>
            <Chip 
              label={server.status} 
              size="small" 
              color={server.status === 'Active' ? 'success' : 'default'} 
              sx={{ fontWeight: 700 }} 
            />
          </Stack>
        </Box>
      </Box>

      {/* Financial Impact Section */}
      <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
        <DollarSign size={20} color="#10b981" /> Financial Impact
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="#15803d" fontWeight={700}>TOTAL PROJECT VALUE</Typography>
              <Typography variant="h4" fontWeight={800} color="#14532d">{formatCurrency(financialStats.totalFunding)}</Typography>
              <Typography variant="caption" color="#15803d">Across {financialStats.projectCount} active projects</Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>REVENUE REALIZED</Typography>
              <Typography variant="h4" fontWeight={800} color="#10b981">{formatCurrency(financialStats.totalReceived)}</Typography>
              <Typography variant="caption" color="text.secondary">Payments Received</Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>PENDING REVENUE</Typography>
              <Typography variant="h4" fontWeight={800} color="#ef4444">{formatCurrency(financialStats.totalPending)}</Typography>
              <Typography variant="caption" color="text.secondary">Expected Payments</Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 4 }} />

      {/* Operational Stats */}
      <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Activity size={20} color="#3b82f6" /> Operational Metrics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e2e8f0', height: '100%' }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>TOTAL LOAD</Typography>
                <Database size={20} color="#3b82f6" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>{totalActivities}</Typography>
                <Typography variant="caption" color="text.secondary">Assigned Activities</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e2e8f0', height: '100%' }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>CURRENTLY RUNNING</Typography>
                <Activity size={20} color="#10b981" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>{activeActivities}</Typography>
                <Typography variant="caption" color="text.secondary">Active Simulations</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e2e8f0', height: '100%' }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>COMPUTE TIME</Typography>
                <Clock size={20} color="#f59e0b" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>{totalNs}ns</Typography>
                <Typography variant="caption" color="text.secondary">Total Simulation Time</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e2e8f0', height: '100%' }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>ENGINES</Typography>
                <Cpu size={20} color="#8b5cf6" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>{uniqueEngines}</Typography>
                <Typography variant="caption" color="text.secondary">Unique Engines Used</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Revenue Distribution</Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fundingChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {fundingChartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={FUNDING_COLORS[index % FUNDING_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number | string | undefined) => formatCurrency(Number(value || 0))} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Task Status</Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Simulation Engines</Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Recent Activity Log</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Activity Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Engine</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivities.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{row.projectTitle}</TableCell>
                        <TableCell>
                            <Chip label={row.simulationEngine} size="small" variant="outlined" sx={{ borderRadius: 1 }} />
                        </TableCell>
                        <TableCell>{row.duration}</TableCell>
                        <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {row.status === 'Completed' ? <CheckCircle2 size={16} color="#10b981" /> :
                                 row.status === 'In Progress' ? <PlayCircle size={16} color="#3b82f6" /> :
                                 <AlertCircle size={16} color="#94a3b8" />}
                                <Typography variant="body2" fontWeight={600} sx={{ 
                                    color: row.status === 'Completed' ? '#10b981' : 
                                           row.status === 'In Progress' ? '#3b82f6' : '#64748b' 
                                }}>{row.status}</Typography>
                            </Box>
                        </TableCell>
                        <TableCell>{row.startDate}</TableCell>
                      </TableRow>
                    ))}
                     {recentActivities.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                No recent activity recorded on this server.
                            </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ServerAnalysis;