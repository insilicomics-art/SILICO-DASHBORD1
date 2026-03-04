import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  Slider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Chip,
  Autocomplete
} from '@mui/material';
import { Plus, Trash2, Pencil, Database, Clock, Cpu, FlaskConical } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { type Project, type ProjectActivity, type User } from '../data/mockData';
import { Avatar, Stack } from '@mui/material';

import { type Server } from '../services/api';

interface ProjectActivitiesDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onUpdate: (project: Project) => void;
  users: User[];
  servers: Server[];
}

const ProjectActivitiesDialog: React.FC<ProjectActivitiesDialogProps> = ({
  open,
  onClose,
  project,
  onUpdate,
  users,
  servers
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  
  const [activityForm, setActivityForm] = useState<Partial<ProjectActivity>>({
    name: '',
    assignedTo: '',
    server: '',
    duration: '',
    progress: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    totalAtoms: 0,
    status: 'Pending',
    simulationEngine: 'GROMACS',
    totalParticipants: 0,
    mode: 'Offline'
  });

  if (!project) return null;

  // Calculate Summary Stats
  const activities = project.activities || [];
  const totalAtoms = activities.reduce((sum, a) => sum + (a.totalAtoms || 0), 0);
  const avgAtoms = activities.length > 0 ? Math.round(totalAtoms / activities.length) : 0;
  
  const parseNs = (dur: string) => parseInt(dur.replace(/[^0-9]/g, '') || '0');
  const totalNs = activities.reduce((sum, a) => sum + parseNs(a.duration), 0);
  const avgNs = activities.length > 0 ? Math.round(totalNs / activities.length) : 0;

  const engines = new Set(activities.map(a => a.simulationEngine).filter(Boolean));

  const isDocking = project.projectType === 'Molecular Docking';
  const isWorkshop = project.projectType === 'Workshop';
  const isGuestTalk = project.projectType === 'Guest Talk';
  const isFDP = project.projectType === 'FDP';
  const isCourse = project.projectType === 'Course';
  const isProteinDocking = project.projectType === 'Protein Protein Docking';
  const isNGS = project.projectType === 'NGS Data Analysis';

  const hideAtomsAndDuration = isDocking || isWorkshop || isGuestTalk || isFDP || isCourse || isProteinDocking || isNGS;
  const hideSimulationEngine = isGuestTalk || isFDP || isCourse;
  const showParticipants = isWorkshop || isGuestTalk || isFDP || isCourse;

  const engineOptions = isProteinDocking 
    ? ['HADDOCK', 'ZDOCK', 'Silico Dock'] 
    : isNGS 
      ? ['Denovo', 'WGS', 'QTL', 'GWAS', 'Other']
      : ['GROMACS', 'NAMD', 'AutoDock', 'Desmond', 'Other'];

  const chartData = project.activities?.map(a => ({
    ...a,
    durationValue: parseNs(a.duration)
  })) || [];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return '#059669'; // Green
      case 'In Progress': return '#2563eb'; // Blue
      case 'Failed': return '#e11d48'; // Red
      default: return '#94a3b8'; // Gray
    }
  };

  const resetForm = () => {
    setActivityForm({
      name: '',
      assignedTo: '',
      server: '',
      duration: hideAtomsAndDuration ? '0ns' : '',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      totalAtoms: 0,
      status: 'Pending',
      simulationEngine: isDocking ? 'AutoDock' : (isProteinDocking ? 'HADDOCK' : (isNGS ? 'Denovo' : (hideSimulationEngine ? 'Other' : 'GROMACS'))),
      totalParticipants: 0,
      mode: 'Offline'
    });
    setEditingActivityId(null);
    setShowAddForm(false);
  };

  const handleSave = () => {
    if (!activityForm.name || !activityForm.server || (!hideAtomsAndDuration && !activityForm.duration)) {
      alert('Please fill in required fields');
      return;
    }

    let updatedActivities = [...(project.activities || [])];

    if (editingActivityId) {
      // Update existing activity
      updatedActivities = updatedActivities.map(act => 
        act.id === editingActivityId 
          ? { ...act, ...activityForm as ProjectActivity, id: editingActivityId }
          : act
      );
    } else {
      // Create new activity
      const newActivity: ProjectActivity = {
        id: `A${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        name: activityForm.name!,
        assignedTo: activityForm.assignedTo || 'Unassigned',
        server: activityForm.server!,
        duration: hideAtomsAndDuration ? '0ns' : activityForm.duration!,
        progress: activityForm.progress || 0,
        startDate: activityForm.startDate!,
        endDate: activityForm.endDate || '',
        totalAtoms: hideAtomsAndDuration ? 0 : (activityForm.totalAtoms || 0),
        status: activityForm.status as 'Pending' | 'In Progress' | 'Completed' | 'Failed',
        simulationEngine: hideSimulationEngine ? 'Other' : (activityForm.simulationEngine as ProjectActivity['simulationEngine']),
        totalParticipants: (showParticipants) ? (activityForm.totalParticipants || 0) : 0,
        mode: isCourse ? (activityForm.mode || 'Offline') : undefined
      };
      updatedActivities.push(newActivity);
    }

    // Automatically update project progress based on activities
    const totalProgress = updatedActivities.length > 0 
      ? Math.round(updatedActivities.reduce((acc, act) => acc + act.progress, 0) / updatedActivities.length)
      : 0;

    const updatedProject = {
      ...project,
      activities: updatedActivities,
      progress: totalProgress
    };

    onUpdate(updatedProject);
    resetForm();
  };

  const handleEditClick = (activity: ProjectActivity) => {
    setActivityForm(activity);
    setEditingActivityId(activity.id);
    setShowAddForm(true);
  };

  const handleDeleteActivity = (activityId: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      const updatedProject = {
        ...project,
        activities: (project.activities || []).filter(a => a.id !== activityId)
      };
      onUpdate(updatedProject);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Project Activities: {project.title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
              ID: {project.id}
            </Typography>
          </Box>
          {!showAddForm && (
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Add Activity
            </Button>
          )}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {/* KPI Summary Row */}
        {!showAddForm && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {!hideAtomsAndDuration && (
              <>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                      <Avatar sx={{ bgcolor: '#f0fdf4', color: '#16a34a', width: 32, height: 32, borderRadius: 1 }}>
                        <Database size={18} />
                      </Avatar>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1 }}>{avgAtoms.toLocaleString()}</Typography>
                        <Typography variant="caption" color="text.secondary">Avg. Atom Count</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                      <Avatar sx={{ bgcolor: '#fef2f2', color: '#dc2626', width: 32, height: 32, borderRadius: 1 }}>
                        <Clock size={18} />
                      </Avatar>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1 }}>{totalNs}ns</Typography>
                        <Typography variant="caption" color="text.secondary">Total Sim Time</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                      <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb', width: 32, height: 32, borderRadius: 1 }}>
                        <Cpu size={18} />
                      </Avatar>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1 }}>{avgNs}ns</Typography>
                        <Typography variant="caption" color="text.secondary">Avg. ns / Activity</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </>
            )}
            {!hideSimulationEngine && (
              <Grid size={{ xs: 12, sm: hideAtomsAndDuration ? 12 : 3 }}>
                <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                    <Avatar sx={{ bgcolor: '#f5f3ff', color: '#7c3aed', width: 32, height: 32, borderRadius: 1 }}>
                      <FlaskConical size={18} />
                    </Avatar>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1 }}>{engines.size}</Typography>
                      <Typography variant="caption" color="text.secondary">Sim Engines</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}

        {!showAddForm && chartData.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Status Distribution */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, height: 300, bgcolor: '#f8fafc', borderRadius: 2 }} variant="outlined">
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700, color: '#475569' }}>
                  Activity Status Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={Object.entries(
                        (project.activities || []).reduce((acc, curr) => {
                          acc[curr.status] = (acc[curr.status] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([name, value]) => ({ name, value }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {Object.entries(
                        (project.activities || []).reduce((acc, curr) => {
                          acc[curr.status] = (acc[curr.status] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={getStatusColor(entry[0])} 
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      formatter={(value) => <span style={{ color: '#475569', fontWeight: 600, fontSize: 12 }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Progress Analysis */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, height: 300, bgcolor: '#f8fafc', borderRadius: 2 }} variant="outlined">
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700, color: '#475569' }}>
                  Activity Progress Overview
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart 
                    data={project.activities || []} 
                    layout="vertical"
                    margin={{ left: 0, right: 20, bottom: 20, top: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 100]} unit="%" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={100} 
                      tick={{ fontSize: 11, fill: '#64748b' }} 
                      interval={0}
                    />
                    <RechartsTooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <Box sx={{ bgcolor: 'white', p: 1.5, border: '1px solid #e2e8f0', borderRadius: 1.5, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{data.name}</Typography>
                              <Typography variant="caption" display="block" color="text.secondary">Progress: <strong>{data.progress}%</strong></Typography>
                              <Typography variant="caption" display="block" color="text.secondary">Status: <strong style={{ color: getStatusColor(data.status) }}>{data.status}</strong></Typography>
                            </Box>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="progress" radius={[0, 4, 4, 0]} barSize={15}>
                      {(project.activities || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.progress === 100 ? '#10b981' : '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        )}

        {!showAddForm && !hideAtomsAndDuration && chartData.length > 0 && (
          <Paper sx={{ p: 2, mb: 3, height: 300, bgcolor: '#f8fafc', borderRadius: 2 }} variant="outlined">
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700, color: '#475569' }}>
              Activity Duration Analysis (Interactive)
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" unit="ns" stroke="#64748b" tick={{fontSize: 11}} />
                <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 11, fill: '#475569'}} />
                <RechartsTooltip 
                  cursor={{fill: '#f1f5f9'}}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <Box sx={{ bgcolor: 'white', p: 1.5, border: '1px solid #e2e8f0', borderRadius: 1.5, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{data.name}</Typography>
                          <Box sx={{ mt: 1, '& > div': { fontSize: '0.75rem', color: '#475569', mb: 0.5 } }}>
                             <div>Engine: <strong>{data.simulationEngine || 'N/A'}</strong></div>
                             <div>Server: <strong>{data.server}</strong></div>
                             <div>Duration: <strong>{data.duration}</strong></div>
                             <div>Atoms: <strong>{data.totalAtoms.toLocaleString()}</strong></div>
                             <div>Progress: <strong>{data.progress}%</strong></div>
                             <div>Status: <span style={{ color: getStatusColor(data.status), fontWeight: 700 }}>{data.status}</span></div>
                          </Box>
                        </Box>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="durationValue" radius={[0, 4, 4, 0]} barSize={20} name="Duration (ns)">
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getStatusColor(entry.status)} 
                      cursor="pointer" 
                      onClick={() => handleEditClick(entry as ProjectActivity)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        )}

        {showAddForm ? (
          <Grid container spacing={3} sx={{ mt: 1 }}>
             <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label={isCourse ? "Day / Topic" : "Activity Name"}
                fullWidth
                value={activityForm.name}
                onChange={(e) => setActivityForm({ ...activityForm, name: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Assigned To"
                fullWidth
                value={activityForm.assignedTo}
                onChange={(e) => setActivityForm({ ...activityForm, assignedTo: e.target.value })}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.name}>
                    {user.name} ({user.role})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {!hideSimulationEngine && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  freeSolo
                  options={engineOptions}
                  value={activityForm.simulationEngine}
                  onChange={(_, newValue) => setActivityForm({ ...activityForm, simulationEngine: newValue as ProjectActivity['simulationEngine'] })}
                  onInputChange={(_, newInputValue) => setActivityForm({ ...activityForm, simulationEngine: newInputValue as ProjectActivity['simulationEngine'] })}
                  renderInput={(params) => (
                    <TextField {...params} label="Simulation Engine" fullWidth />
                  )}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Server"
                fullWidth
                value={activityForm.server}
                onChange={(e) => setActivityForm({ ...activityForm, server: e.target.value })}
              >
                {servers.map((server) => (
                  <MenuItem key={server.id} value={server.name}>
                    {server.name} ({server.specs})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {!hideAtomsAndDuration && (
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  label="Duration (ns)"
                  fullWidth
                  value={activityForm.duration}
                  onChange={(e) => setActivityForm({ ...activityForm, duration: e.target.value })}
                >
                  {[50, 100, 150, 200, 250, 300, 400, 500, 750, 1000].map(val => (
                     <MenuItem key={val} value={`${val}ns`}>{val}ns</MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={activityForm.startDate}
                onChange={(e) => setActivityForm({ ...activityForm, startDate: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={activityForm.endDate}
                onChange={(e) => setActivityForm({ ...activityForm, endDate: e.target.value })}
              />
            </Grid>
            {!hideAtomsAndDuration && (
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Total Atoms"
                  type="number"
                  fullWidth
                  value={activityForm.totalAtoms}
                  onChange={(e) => setActivityForm({ ...activityForm, totalAtoms: parseInt(e.target.value) || 0 })}
                />
              </Grid>
            )}
            {showParticipants && (
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Total Participants"
                  type="number"
                  fullWidth
                  value={activityForm.totalParticipants}
                  onChange={(e) => setActivityForm({ ...activityForm, totalParticipants: parseInt(e.target.value) || 0 })}
                />
              </Grid>
            )}
            {isCourse && (
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  label="Mode"
                  fullWidth
                  value={activityForm.mode}
                  onChange={(e) => setActivityForm({ ...activityForm, mode: e.target.value as 'Online' | 'Offline' })}
                >
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Offline">Offline</MenuItem>
                </TextField>
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Status"
                fullWidth
                value={activityForm.status}
                onChange={(e) => setActivityForm({ ...activityForm, status: e.target.value as 'Pending' | 'In Progress' | 'Completed' | 'Failed' })}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
              </TextField>
            </Grid>
             <Grid size={{ xs: 12 }}>
              <Typography gutterBottom sx={{ fontWeight: 600 }}>Progress ({activityForm.progress}%)</Typography>
              <Slider
                value={activityForm.progress}
                onChange={(_, val) => setActivityForm({ ...activityForm, progress: val as number })}
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
          </Grid>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 700 }}>{isCourse ? "Day / Topic" : "Activity Name"}</TableCell>
                  {!hideSimulationEngine && <TableCell sx={{ fontWeight: 700 }}>Engine</TableCell>}
                  <TableCell sx={{ fontWeight: 700 }}>Assigned</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Server</TableCell>
                  {!hideAtomsAndDuration && <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>}
                  {!hideAtomsAndDuration && <TableCell sx={{ fontWeight: 700 }}>Atoms</TableCell>}
                  {showParticipants && <TableCell sx={{ fontWeight: 700 }}>Participants</TableCell>}
                  {isCourse && <TableCell sx={{ fontWeight: 700 }}>Mode</TableCell>}
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {project.activities && project.activities.length > 0 ? (
                  project.activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell sx={{ fontWeight: 600 }}>{activity.name}</TableCell>
                      {!hideSimulationEngine && (
                        <TableCell>
                          <Chip label={activity.simulationEngine || 'Other'} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                        </TableCell>
                      )}
                      <TableCell>{activity.assignedTo}</TableCell>
                      <TableCell>{activity.server}</TableCell>
                      {!hideAtomsAndDuration && <TableCell>{activity.duration}</TableCell>}
                      {!hideAtomsAndDuration && <TableCell>{activity.totalAtoms.toLocaleString()}</TableCell>}
                      {showParticipants && <TableCell>{activity.totalParticipants?.toLocaleString() || 0}</TableCell>}
                      {isCourse && (
                        <TableCell>
                          <Chip 
                            label={activity.mode || 'Offline'} 
                            size="small" 
                            variant="outlined" 
                            color={activity.mode === 'Online' ? 'primary' : 'secondary'}
                            sx={{ fontSize: '0.65rem', height: 20 }} 
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Chip
                          label={activity.status}
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem',
                            height: 20,
                            bgcolor: 
                              activity.status === 'Completed' ? '#ecfdf5' :
                              activity.status === 'In Progress' ? '#eff6ff' :
                              activity.status === 'Failed' ? '#fef2f2' : '#f1f5f9',
                            color: 
                              activity.status === 'Completed' ? '#10b981' :
                              activity.status === 'In Progress' ? '#3b82f6' :
                              activity.status === 'Failed' ? '#ef4444' : '#64748b',
                            fontWeight: 700
                          }}
                        />
                      </TableCell>
                      <TableCell>
                         <Box sx={{ display: 'flex' }}>
                            <IconButton size="small" onClick={() => handleEditClick(activity)} color="primary">
                              <Pencil size={14} />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteActivity(activity.id)} color="error">
                              <Trash2 size={14} />
                            </IconButton>
                         </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No activities found. Click "Add Activity" to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        {showAddForm ? (
          <>
            <Button onClick={() => setShowAddForm(false)}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" color="primary" sx={{ borderRadius: 2 }}>
              {editingActivityId ? 'Update Activity' : 'Save Activity'}
            </Button>
          </>
        ) : (
          <Button onClick={handleClose} color="primary" sx={{ fontWeight: 600 }}>Close</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProjectActivitiesDialog;
