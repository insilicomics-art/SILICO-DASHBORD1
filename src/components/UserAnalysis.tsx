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
  Avatar,
  Divider
} from '@mui/material';
import { 
  ChevronLeft, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  User as UserIcon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { type User, type Project, type ProjectActivity } from '../data/mockData';

interface UserAnalysisProps {
  user: User;
  projects: Project[];
  onBack: () => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);
};

const UserAnalysis: React.FC<UserAnalysisProps> = ({ user, projects, onBack }) => {
  
  // 1. Projects Led by User
  const ledProjects = useMemo(() => {
    return projects.filter(p => p.lead === user.name);
  }, [projects, user.name]);

  // 2. Activities Assigned to User
  const assignedActivities = useMemo(() => {
    const acts: (ProjectActivity & { projectTitle: string })[] = [];
    projects.forEach(p => {
      if (p.activities) {
        p.activities.forEach(a => {
          if (a.assignedTo === user.name) {
            acts.push({ ...a, projectTitle: p.title });
          }
        });
      }
    });
    return acts;
  }, [projects, user.name]);

  // 3. Financial Contribution (Proportional Activity Value)
  const economicContribution = useMemo(() => {
    let totalValue = 0;
    let revenueRealized = 0;
    let pendingRevenue = 0;

    assignedActivities.forEach(a => {
      // Find parent project for each activity
      const parentProject = projects.find(p => p.activities?.some(act => act.id === a.id));
      
      if (parentProject && parentProject.activities && parentProject.activities.length > 0) {
        const activityShare = 1 / parentProject.activities.length;
        
        const activityValue = parentProject.totalFunding * activityShare;
        const projectReceived = (parentProject.firstPaymentAmount || 0) + (parentProject.finalPaymentAmount || 0);
        const activityReceived = projectReceived * activityShare;
        
        totalValue += activityValue;
        revenueRealized += activityReceived;
        pendingRevenue += (activityValue - activityReceived);
      }
    });

    return { totalValue, revenueRealized, pendingRevenue };
  }, [assignedActivities, projects]);

  // KPIs
  const totalProjectsLed = ledProjects.length;
  const totalFundingManaged = ledProjects.reduce((sum, p) => sum + p.totalFunding, 0);
  
  const totalActivities = assignedActivities.length;
  const completedActivities = assignedActivities.filter(a => a.status === 'Completed').length;
  const inProgressActivities = assignedActivities.filter(a => a.status === 'In Progress').length;
  
  const completionRate = totalActivities > 0 
    ? Math.round((completedActivities / totalActivities) * 100) 
    : 0;

  // Charts Data
  
  // Activity Status Distribution
  const statusData = [
    { name: 'Completed', value: completedActivities },
    { name: 'In Progress', value: inProgressActivities },
    { name: 'Pending', value: assignedActivities.filter(a => a.status === 'Pending').length },
    { name: 'Failed', value: assignedActivities.filter(a => a.status === 'Failed').length },
  ].filter(d => d.value > 0);

  // Project Type Distribution (for Led Projects)
  const projectTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    ledProjects.forEach(p => {
      counts[p.projectType] = (counts[p.projectType] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [ledProjects]);

  // Monthly Activity (based on Start Date)
  const timelineData = useMemo(() => {
    const counts: Record<string, number> = {};
    assignedActivities.forEach(a => {
      const month = new Date(a.startDate).toLocaleString('default', { month: 'short' });
      counts[month] = (counts[month] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [assignedActivities]);

  return (
    <Box sx={{ p: 3 }}>
      <Button 
        startIcon={<ChevronLeft />} 
        onClick={onBack} 
        sx={{ mb: 3, fontWeight: 600, color: '#64748b' }}
      >
        Back to Users
      </Button>

      {/* Header Profile */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
        <Avatar 
          sx={{ width: 80, height: 80, bgcolor: '#3b82f6', fontSize: '2rem', fontWeight: 700 }}
        >
          {user.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>{user.name}</Typography>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
            <Chip label={user.role} color="primary" variant="outlined" size="small" sx={{ fontWeight: 600 }} />
            <Typography variant="body2" color="text.secondary">ID: {user.id}</Typography>
          </Stack>
        </Box>
      </Box>

      {/* Economic Contribution Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748b', mb: 2, letterSpacing: 1 }}>ECONOMIC CONTRIBUTION (ACTIVITY BASED)</Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" color="#15803d" fontWeight={700}>VALUE DELIVERED</Typography>
                <Typography variant="h4" fontWeight={800} color="#14532d">{formatCurrency(economicContribution.totalValue)}</Typography>
                <Typography variant="caption" color="#15803d">Total value of assigned tasks</Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>REVENUE REALIZED</Typography>
                <Typography variant="h4" fontWeight={800} color="#10b981">{formatCurrency(economicContribution.revenueRealized)}</Typography>
                <Typography variant="caption" color="text.secondary">Proportional realized revenue</Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>PENDING REVENUE</Typography>
                <Typography variant="h4" fontWeight={800} color="#ef4444">{formatCurrency(economicContribution.pendingRevenue)}</Typography>
                <Typography variant="caption" color="text.secondary">Outstanding activity value</Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>PROJECTS LED</Typography>
                <Briefcase size={20} color="#3b82f6" />
              </Box>
              <Typography variant="h4" fontWeight={800}>{totalProjectsLed}</Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>TOTAL FUNDING</Typography>
                <DollarSign size={20} color="#10b981" />
              </Box>
              <Typography variant="h4" fontWeight={800} sx={{ color: '#10b981' }}>
                {formatCurrency(totalFundingManaged)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>ACTIVITIES</Typography>
                <UserIcon size={20} color="#f59e0b" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>{totalActivities}</Typography>
                <Typography variant="caption" color="text.secondary">Assigned Tasks</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>COMPLETION RATE</Typography>
                <TrendingUp size={20} color="#8b5cf6" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>{completionRate}%</Typography>
                <Typography variant="caption" color="text.secondary">Success Rate</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Activity Status Chart */}
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

        {/* Project Expertise Radar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Project Expertise</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={projectTypeData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                    <Radar name="Projects" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Timeline */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Activity Timeline</Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities List */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Recent Activities</Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                {assignedActivities.slice(0, 5).map((activity) => (
                  <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 2, bgcolor: '#f8fafc' }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>{activity.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{activity.projectTitle}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip 
                        label={activity.status} 
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          bgcolor: activity.status === 'Completed' ? '#d1fae5' : 
                                   activity.status === 'In Progress' ? '#dbeafe' : '#f1f5f9',
                          color: activity.status === 'Completed' ? '#059669' : 
                                 activity.status === 'In Progress' ? '#2563eb' : '#64748b'
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary">{activity.startDate}</Typography>
                    </Box>
                  </Box>
                ))}
                {assignedActivities.length === 0 && (
                  <Typography color="text.secondary" align="center" sx={{ py: 2 }}>No activities assigned.</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserAnalysis;
