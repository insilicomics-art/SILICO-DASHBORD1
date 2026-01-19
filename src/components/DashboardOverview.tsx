import React, { useMemo, useState } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  LinearProgress,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Chip,
  TextField,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { 
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  LabelList
} from 'recharts';
import { 
  DollarSign, 
  PieChart as PieChartIcon, 
  Wallet, 
  Download,
  Building2,
  MoreVertical,
  ArrowUpRight,
  School,
  GraduationCap,
  CheckCircle,
  Receipt
} from 'lucide-react';
import { type Project, type Student } from '../data/mockData';

interface DashboardOverviewProps {
  projects: Project[];
  students: Student[];
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6'];

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);
};

const MetricCard = ({ title, value, icon, color, subtext, trend, compact }: { title: string, value: string | number, icon: React.ReactNode, color: string, subtext?: string, trend?: string, compact?: boolean }) => (
  <Card className="nexus-card" sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    <CardContent sx={{ p: compact ? 2 : 3, '&:last-child': { pb: compact ? 2 : 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: compact ? 1 : 2 }}>
          <Box sx={{ 
            p: compact ? 1 : 1.5, 
            borderRadius: 3, 
            bgcolor: `${color}15`, // Very light opacity background
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
          {trend && (
              <Chip 
                label={trend} 
                size="small" 
                sx={{ 
                  bgcolor: '#f0fdf4', 
                  color: '#166534', 
                  fontWeight: 700, 
                  borderRadius: 2,
                  height: 20,
                  fontSize: '0.75rem'
                }} 
                icon={<ArrowUpRight size={14} />} 
              />
          )}
      </Stack>
      <Typography variant={compact ? "h5" : "h4"} sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5, letterSpacing: '-0.02em' }}>
          {value}
      </Typography>
      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
          {title}
      </Typography>
      {subtext && (
          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5, fontWeight: 500 }}>
              {subtext}
          </Typography>
      )}
    </CardContent>
  </Card>
);

const FinancialGroupCard = ({ title, total, received, pending, icon, color }: { title: string, total: number, received: number, pending: number, icon: React.ReactNode, color: string }) => (
    <Card className="nexus-card" sx={{ height: '100%', p: 0 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 2, bgcolor: `${color}05` }}>
            <Box sx={{ color: color }}>{icon}</Box>
            <Typography variant="h6" fontWeight="700" color="text.primary">{title}</Typography>
        </Box>
        <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">Revenue</Typography>
                    <Typography variant="h6" fontWeight="800" color="text.primary">{formatCurrency(total)}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">Received</Typography>
                    <Typography variant="h6" fontWeight="800" color="success.main">{formatCurrency(received)}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">Pending</Typography>
                    <Typography variant="h6" fontWeight="800" color="warning.main">{formatCurrency(pending)}</Typography>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ projects, students }) => {
  const [selectedOffice, setSelectedOffice] = useState<string>('All');
  const [gstViewMode, setGstViewMode] = useState<'Revenue' | 'Count'>('Revenue');

  const filteredProjects = useMemo(() => {
    if (selectedOffice === 'All') return projects;
    return projects.filter(p => p.office === selectedOffice);
  }, [projects, selectedOffice]);

  const filteredStudents = useMemo(() => {
    if (selectedOffice === 'All') return students;
    return students.filter(s => s.office === selectedOffice);
  }, [students, selectedOffice]);

  const stats = useMemo(() => {
    // Financials Calculation
    const projectRevenue = filteredProjects.reduce((acc, p) => acc + p.totalFunding, 0);
    const studentRevenue = filteredStudents.reduce((acc, s) => acc + (s.totalFee || 0), 0);
    const totalRevenue = projectRevenue + studentRevenue;

    const projectReceived = filteredProjects.reduce((acc, p) => acc + (p.firstPaymentAmount || 0) + (p.finalPaymentAmount || 0), 0);
    const studentReceived = filteredStudents.reduce((acc, s) => acc + (s.firstPaymentAmount || 0) + (s.finalPaymentAmount || 0), 0);
    
    const projectPending = projectRevenue - projectReceived;
    const studentPending = studentRevenue - studentReceived;
    
    const totalReceived = projectReceived + studentReceived;
    const totalPending = totalRevenue - totalReceived;

    // Revenue Streams (Project Types)
    const typeMap = new Map<string, number>();
    filteredProjects.forEach(p => {
        const type = p.projectType || 'Other';
        typeMap.set(type, (typeMap.get(type) || 0) + p.totalFunding);
    });
    const revenueDistribution = Array.from(typeMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

    // Plot Data 1: Student Enrollment Distribution
    const enrollmentMap = new Map<string, number>();
    filteredStudents.forEach(s => {
        const type = s.enrollmentType || 'Unknown';
        enrollmentMap.set(type, (enrollmentMap.get(type) || 0) + 1);
    });
    const enrollmentDistribution = Array.from(enrollmentMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    // Plot Data 2: Top Partner Institutions by Revenue
    const partnerMap = new Map<string, number>();
    filteredProjects.forEach(p => {
        const inst = p.institution || 'Other';
        partnerMap.set(inst, (partnerMap.get(inst) || 0) + p.totalFunding);
    });
    const partnerRevenue = Array.from(partnerMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    // GST Analysis
    const projectGST = {
        with: filteredProjects.filter(p => p.gstType === 'With GST').length,
        without: filteredProjects.filter(p => !p.gstType || p.gstType === 'Without GST').length,
        amountWith: filteredProjects.filter(p => p.gstType === 'With GST').reduce((acc, p) => acc + p.totalFunding, 0),
        amountWithout: filteredProjects.filter(p => !p.gstType || p.gstType === 'Without GST').reduce((acc, p) => acc + p.totalFunding, 0)
    };

    const studentGST = {
        with: filteredStudents.filter(s => s.gstType === 'With GST').length,
        without: filteredStudents.filter(s => !s.gstType || s.gstType === 'Without GST').length,
        amountWith: filteredStudents.filter(s => s.gstType === 'With GST').reduce((acc, s) => acc + (s.totalFee || 0), 0),
        amountWithout: filteredStudents.filter(s => !s.gstType || s.gstType === 'Without GST').reduce((acc, s) => acc + (s.totalFee || 0), 0)
    };

    const gstDataProjects = [
        { name: 'With GST', value: projectGST.with, amount: projectGST.amountWith },
        { name: 'Without GST', value: projectGST.without, amount: projectGST.amountWithout }
    ];

    const gstDataStudents = [
        { name: 'With GST', value: studentGST.with, amount: studentGST.amountWith },
        { name: 'Without GST', value: studentGST.without, amount: studentGST.amountWithout }
    ];

    // Office-wise Comparison (Explicitly for Ooty & Coimbatore if All is selected)
    const officeComparison = ['Ooty', 'Coimbatore'].map(office => {
        const op = projects.filter(p => p.office === office);
        const os = students.filter(s => s.office === office);
        
        return {
            name: office,
            // Revenue
            projectWithGSTRevenue: op.filter(p => p.gstType === 'With GST').reduce((acc, p) => acc + p.totalFunding, 0),
            projectWithoutGSTRevenue: op.filter(p => !p.gstType || p.gstType === 'Without GST').reduce((acc, p) => acc + p.totalFunding, 0),
            studentWithGSTRevenue: os.filter(s => s.gstType === 'With GST').reduce((acc, s) => acc + (s.totalFee || 0), 0),
            studentWithoutGSTRevenue: os.filter(s => !s.gstType || s.gstType === 'Without GST').reduce((acc, s) => acc + (s.totalFee || 0), 0),
            
            // Counts
            projectWithGSTCount: op.filter(p => p.gstType === 'With GST').length,
            projectWithoutGSTCount: op.filter(p => !p.gstType || p.gstType === 'Without GST').length,
            studentWithGSTCount: os.filter(s => s.gstType === 'With GST').length,
            studentWithoutGSTCount: os.filter(s => !s.gstType || s.gstType === 'Without GST').length,
        };
    });

    // Strategic Office Analysis Data
    const combinedRevenueData = officeComparison.map(office => ({
      name: office.name,
      'Project GST': office.projectWithGSTRevenue,
      'Project No-GST': office.projectWithoutGSTRevenue,
      'Student GST': office.studentWithGSTRevenue,
      'Student No-GST': office.studentWithoutGSTRevenue,
      total: office.projectWithGSTRevenue + office.projectWithoutGSTRevenue + office.studentWithGSTRevenue + office.studentWithoutGSTRevenue
    }));

    const gstProfileData = [
      {
        subject: 'Project GST Rev %',
        Ooty: officeComparison.find(o => o.name === 'Ooty')?.projectWithGSTRevenue ? (officeComparison.find(o => o.name === 'Ooty')!.projectWithGSTRevenue / (officeComparison.find(o => o.name === 'Ooty')!.projectWithGSTRevenue + officeComparison.find(o => o.name === 'Ooty')!.projectWithoutGSTRevenue)) * 100 : 0,
        Coimbatore: officeComparison.find(o => o.name === 'Coimbatore')?.projectWithGSTRevenue ? (officeComparison.find(o => o.name === 'Coimbatore')!.projectWithGSTRevenue / (officeComparison.find(o => o.name === 'Coimbatore')!.projectWithGSTRevenue + officeComparison.find(o => o.name === 'Coimbatore')!.projectWithoutGSTRevenue)) * 100 : 0,
        fullMark: 100
      },
      {
        subject: 'Student GST Rev %',
        Ooty: officeComparison.find(o => o.name === 'Ooty')?.studentWithGSTRevenue ? (officeComparison.find(o => o.name === 'Ooty')!.studentWithGSTRevenue / (officeComparison.find(o => o.name === 'Ooty')!.studentWithGSTRevenue + officeComparison.find(o => o.name === 'Ooty')!.studentWithoutGSTRevenue)) * 100 : 0,
        Coimbatore: officeComparison.find(o => o.name === 'Coimbatore')?.studentWithGSTRevenue ? (officeComparison.find(o => o.name === 'Coimbatore')!.studentWithGSTRevenue / (officeComparison.find(o => o.name === 'Coimbatore')!.studentWithGSTRevenue + officeComparison.find(o => o.name === 'Coimbatore')!.studentWithoutGSTRevenue)) * 100 : 0,
        fullMark: 100
      },
      {
        subject: 'Project GST Vol %',
        Ooty: officeComparison.find(o => o.name === 'Ooty')?.projectWithGSTCount ? (officeComparison.find(o => o.name === 'Ooty')!.projectWithGSTCount / (officeComparison.find(o => o.name === 'Ooty')!.projectWithGSTCount + officeComparison.find(o => o.name === 'Ooty')!.projectWithoutGSTCount)) * 100 : 0,
        Coimbatore: officeComparison.find(o => o.name === 'Coimbatore')?.projectWithGSTCount ? (officeComparison.find(o => o.name === 'Coimbatore')!.projectWithGSTCount / (officeComparison.find(o => o.name === 'Coimbatore')!.projectWithGSTCount + officeComparison.find(o => o.name === 'Coimbatore')!.projectWithoutGSTCount)) * 100 : 0,
        fullMark: 100
      },
      {
        subject: 'Student GST Vol %',
        Ooty: officeComparison.find(o => o.name === 'Ooty')?.studentWithGSTCount ? (officeComparison.find(o => o.name === 'Ooty')!.studentWithGSTCount / (officeComparison.find(o => o.name === 'Ooty')!.studentWithGSTCount + officeComparison.find(o => o.name === 'Ooty')!.studentWithoutGSTCount)) * 100 : 0,
        Coimbatore: officeComparison.find(o => o.name === 'Coimbatore')?.studentWithGSTCount ? (officeComparison.find(o => o.name === 'Coimbatore')!.studentWithGSTCount / (officeComparison.find(o => o.name === 'Coimbatore')!.studentWithGSTCount + officeComparison.find(o => o.name === 'Coimbatore')!.studentWithoutGSTCount)) * 100 : 0,
        fullMark: 100
      }
    ];

    return { 
        totalRevenue,
        totalReceived,
        totalPending,
        projectRevenue,
        projectReceived,
        projectPending,
        studentRevenue,
        studentReceived,
        studentPending,
        revenueDistribution,
        enrollmentDistribution,
        partnerRevenue,
        gstDataProjects,
        gstDataStudents,
        officeComparison,
        combinedRevenueData,
        gstProfileData
    };
  }, [filteredProjects, filteredStudents]);

  return (
    <Box className="nexus-bg" sx={{ flexGrow: 1, p: 4, minHeight: '100vh' }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 3, color: '#4f46e5' }}>
              SILICO ANALYTICS
            </Typography>
            <Typography variant="h3" className="text-gradient-nexus" sx={{ fontWeight: 800, letterSpacing: '-0.03em', mb: 1 }}>
              Silico Dashboard 2K26
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
                select
                label="Select Office"
                value={selectedOffice}
                onChange={(e) => setSelectedOffice(e.target.value)}
                size="small"
                sx={{ minWidth: 150, bgcolor: 'white' }}
            >
                <MenuItem value="All">All Offices</MenuItem>
                <MenuItem value="Ooty">Ooty</MenuItem>
                <MenuItem value="Coimbatore">Coimbatore</MenuItem>
            </TextField>
            <Button 
                variant="contained" 
                startIcon={<Download size={18} />}
                onClick={() => window.print()}
                className="no-print"
                disableElevation
                sx={{ 
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    bgcolor: '#1e293b',
                    color: '#ffffff',
                    padding: '10px 24px',
                    '&:hover': { bgcolor: '#0f172a' }
                }}
                >
                Export Report
            </Button>
          </Box>
        </Box>
  
        {/* Section 1: Financial Overview (Global) */}
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>Financial Overview</Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <MetricCard 
              title="Total Revenue" 
              value={formatCurrency(stats.totalRevenue)} 
              icon={<DollarSign size={20} />} 
              color="#10b981" // Emerald
              subtext="Projects + Students"
              compact
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <MetricCard 
              title="Total Received" 
              value={formatCurrency(stats.totalReceived)} 
              icon={<CheckCircle size={20} />} 
              color="#3b82f6" // Blue
              subtext="Successfully collected"
              compact
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <MetricCard 
              title="Total Receivables" 
              value={formatCurrency(stats.totalPending)} 
              icon={<Wallet size={20} />} 
              color="#f59e0b" // Amber
              subtext="Outstanding amount"
              compact
            />
          </Grid>
        </Grid>

        {/* Section 2 & 3: Combined Research & Student Financials */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid size={{ xs: 12, md: 6 }}>
                <FinancialGroupCard 
                    title="Research Projects Financials"
                    total={stats.projectRevenue}
                    received={stats.projectReceived}
                    pending={stats.projectPending}
                    icon={<PieChartIcon size={24} />}
                    color="#06b6d4"
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <FinancialGroupCard 
                    title="Student Training Financials"
                    total={stats.studentRevenue}
                    received={stats.studentReceived}
                    pending={stats.studentPending}
                    icon={<GraduationCap size={24} />}
                    color="#8b5cf6"
                />
            </Grid>
        </Grid>
  
        {/* Section 3: Strategic Distributions */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>Market & Program Insights</Typography>
          <Grid container spacing={2} className="print-row">
              {/* Revenue Allocation Radar */}
              <Grid size={{ xs: 12, md: 6 }} className="print-col">
                  <Paper className="nexus-card" sx={{ p: 2, height: { xs: 450, print: 300 }, display: 'flex', flexDirection: 'column' }}>
                       <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Box>
                              <Typography variant="subtitle1" fontWeight="800" color="#1e293b">Revenue Allocation</Typography>
                          </Box>
                          <IconButton size="small" className="no-print"><MoreVertical size={20} color="#94a3b8" /></IconButton>
                      </Stack>
                      <Box sx={{ flexGrow: 1, minHeight: { xs: 280, print: 220 } }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.revenueDistribution}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar name="Revenue" dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} />
                                <Tooltip formatter={(val: any) => [formatCurrency(val), 'Revenue']} />
                            </RadarChart>
                        </ResponsiveContainer>
                      </Box>
                  </Paper>
              </Grid>
  
              {/* Student Program Donut */}
              <Grid size={{ xs: 12, md: 6 }} className="print-col">
                  <Paper className="nexus-card" sx={{ p: 2, height: { xs: 450, print: 300 }, display: 'flex', flexDirection: 'column' }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                          <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#fff7ed', color: '#f59e0b' }}><School size={20} /></Box>
                          <Typography variant="subtitle1" fontWeight="800" color="#1e293b">Student Programs</Typography>
                      </Stack>
                      <Box sx={{ flexGrow: 1, minHeight: { xs: 280, print: 220 } }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.enrollmentDistribution}
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {stats.enrollmentDistribution.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={30} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                      </Box>
                  </Paper>
              </Grid>
          </Grid>
        </Box>  

  

        {/* Section 3: Performance & Partners */}

        <Box sx={{ mb: 5 }}>

          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>Institutional Performance</Typography>

          <Grid container spacing={2} className="print-row">              {/* Top Institutional Partners Bar Chart */}
              <Grid size={{ xs: 12, md: 8 }} className="print-col" sx={{ '@media print': { flex: '2 1 0px !important' } }}>
                  <Paper className="nexus-card" sx={{ p: 3, height: { xs: 500, print: 350 }, display: 'flex', flexDirection: 'column' }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                          <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f0fdf4', color: '#10b981' }}><Building2 size={20} /></Box>
                          <Typography variant="subtitle1" fontWeight="800" color="#1e293b">Top Partners</Typography>
                      </Stack>
                      <Box sx={{ flexGrow: 1, minHeight: { xs: 320, print: 250 } }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={stats.partnerRevenue} margin={{ top: 5, right: 30, left: 40, bottom: 5 }} barSize={24}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category"
                                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} 
                                    width={100}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip formatter={(val: any) => [formatCurrency(val), 'Revenue']} />
                                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                      </Box>
                  </Paper>
              </Grid>
  
              {/* Revenue Breakdowns */}
              <Grid size={{ xs: 12, md: 4 }} className="print-col">
                  <Stack spacing={2} sx={{ height: '100%' }}>
                      {/* Student Revenue Card */}
                      <Paper className="nexus-card" sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                              <Stack direction="row" alignItems="center" spacing={1.5}>
                                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f0f9ff', color: '#0284c7' }}><Building2 size={18} /></Box>
                                  <Box>
                                      <Typography variant="caption" color="#64748b" fontWeight="700" textTransform="uppercase">Training</Typography>
                                      <Typography variant="subtitle1" fontWeight="800" color="#1e293b" sx={{ lineHeight: 1.1 }}>{formatCurrency(stats.studentRevenue)}</Typography>
                                  </Box>
                              </Stack>
                          </Stack>
                          <Box>
                              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                  <Typography variant="caption" fontWeight="600" color="#94a3b8">Goal</Typography>
                                  <Typography variant="caption" fontWeight="700" color="#0284c7">75%</Typography>
                              </Stack>
                              <LinearProgress variant="determinate" value={75} sx={{ height: 6, borderRadius: 3 }} />
                          </Box>
                      </Paper>
  
                      {/* Project Revenue Card */}
                      <Paper className="nexus-card" sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                              <Stack direction="row" alignItems="center" spacing={1.5}>
                                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f5f3ff', color: '#7c3aed' }}><Wallet size={18} /></Box>
                                  <Box>
                                      <Typography variant="caption" color="#64748b" fontWeight="700" textTransform="uppercase">Research</Typography>
                                      <Typography variant="subtitle1" fontWeight="800" color="#1e293b" sx={{ lineHeight: 1.1 }}>{formatCurrency(stats.projectRevenue)}</Typography>
                                  </Box>
                              </Stack>
                          </Stack>
                          <Box>
                              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                  <Typography variant="caption" fontWeight="600" color="#94a3b8">Goal</Typography>
                                  <Typography variant="caption" fontWeight="700" color="#7c3aed">60%</Typography>
                              </Stack>
                              <LinearProgress variant="determinate" value={60} sx={{ height: 6, borderRadius: 3 }} />
                          </Box>
                      </Paper>
                  </Stack>
              </Grid>
          </Grid>
        </Box>
  
        {/* Section 4: GST Analysis */}
        <Box sx={{ mb: 5 }}>
             <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>GST Analysis</Typography>
             <Grid container spacing={3}>
                {/* Project GST Stats */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper className="nexus-card" sx={{ p: 3 }}>
                         <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                              <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#ec489915', color: '#ec4899' }}><Receipt size={20} /></Box>
                              <Typography variant="subtitle1" fontWeight="800" color="#1e293b">Project GST Distribution</Typography>
                          </Stack>
                          <Grid container spacing={2}>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                   <Box sx={{ height: 200 }}>
                                      <ResponsiveContainer width="100%" height="100%">
                                          <PieChart>
                                              <Pie
                                                  data={stats.gstDataProjects}
                                                  innerRadius={40}
                                                  outerRadius={70}
                                                  paddingAngle={5}
                                                  dataKey="value"
                                                  label={({ name, value }) => `${name}: ${value}`}
                                              >
                                                  {stats.gstDataProjects.map((entry, index) => (
                                                      <Cell key={`cell-${index}`} fill={entry.name === 'With GST' ? '#10b981' : '#94a3b8'} />
                                                  ))}
                                              </Pie>
                                              <Tooltip />
                                              <Legend verticalAlign="bottom" height={36}/>
                                          </PieChart>
                                      </ResponsiveContainer>
                                      <Typography variant="caption" align="center" display="block" color="text.secondary" fontWeight={600}>By Count</Typography>
                                   </Box>
                              </Grid>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                  <Box sx={{ height: 200 }}>
                                      <ResponsiveContainer width="100%" height="100%">
                                          <BarChart data={stats.gstDataProjects} margin={{ top: 25, right: 30, left: 20, bottom: 5 }}>
                                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                              <YAxis hide />
                                              <Tooltip formatter={(val: any) => formatCurrency(val)} />
                                              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                                {stats.gstDataProjects.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.name === 'With GST' ? '#10b981' : '#94a3b8'} />
                                                ))}
                                                <LabelList 
                                                    dataKey="amount" 
                                                    position="top" 
                                                    formatter={(val: any) => typeof val === 'number' ? `₹${(val/1000).toFixed(1)}k` : val}
                                                    style={{ fontSize: '10px', fontWeight: 700, fill: '#475569' }}
                                                />
                                              </Bar>
                                          </BarChart>
                                      </ResponsiveContainer>
                                      <Typography variant="caption" align="center" display="block" color="text.secondary" fontWeight={600}>By Revenue</Typography>
                                  </Box>
                              </Grid>
                          </Grid>
                    </Paper>
                </Grid>

                {/* Student GST Stats */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper className="nexus-card" sx={{ p: 3 }}>
                         <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                              <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#8b5cf615', color: '#8b5cf6' }}><Receipt size={20} /></Box>
                              <Typography variant="subtitle1" fontWeight="800" color="#1e293b">Student GST Distribution</Typography>
                          </Stack>
                          <Grid container spacing={2}>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                   <Box sx={{ height: 200 }}>
                                      <ResponsiveContainer width="100%" height="100%">
                                          <PieChart>
                                              <Pie
                                                  data={stats.gstDataStudents}
                                                  innerRadius={40}
                                                  outerRadius={70}
                                                  paddingAngle={5}
                                                  dataKey="value"
                                                  label={({ name, value }) => `${name}: ${value}`}
                                              >
                                                  {stats.gstDataStudents.map((entry, index) => (
                                                      <Cell key={`cell-${index}`} fill={entry.name === 'With GST' ? '#8b5cf6' : '#94a3b8'} />
                                                  ))}
                                              </Pie>
                                              <Tooltip />
                                              <Legend verticalAlign="bottom" height={36}/>
                                          </PieChart>
                                      </ResponsiveContainer>
                                      <Typography variant="caption" align="center" display="block" color="text.secondary" fontWeight={600}>By Count</Typography>
                                   </Box>
                              </Grid>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                  <Box sx={{ height: 200 }}>
                                      <ResponsiveContainer width="100%" height="100%">
                                          <BarChart data={stats.gstDataStudents} margin={{ top: 25, right: 30, left: 20, bottom: 5 }}>
                                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                              <YAxis hide />
                                              <Tooltip formatter={(val: any) => formatCurrency(val)} />
                                              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                                {stats.gstDataStudents.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.name === 'With GST' ? '#8b5cf6' : '#94a3b8'} />
                                                ))}
                                                <LabelList 
                                                    dataKey="amount" 
                                                    position="top" 
                                                    formatter={(val: any) => typeof val === 'number' ? `₹${(val/1000).toFixed(1)}k` : val}
                                                    style={{ fontSize: '10px', fontWeight: 700, fill: '#475569' }}
                                                />
                                              </Bar>
                                          </BarChart>
                                      </ResponsiveContainer>
                                      <Typography variant="caption" align="center" display="block" color="text.secondary" fontWeight={600}>By Revenue</Typography>
                                  </Box>
                              </Grid>
                          </Grid>
                    </Paper>
                </Grid>
             </Grid>
        </Box>
                
        {/* Office Comparison (Only visible if 'All' is selected) */}
        {selectedOffice === 'All' && (
             <Box sx={{ mb: 5 }}>
                {/* Strategic Office Analysis */}
                <Box sx={{ mb: 5 }}>
                   <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>Strategic Office Analysis</Typography>
                   <Grid container spacing={3}>
                        {/* Combined Revenue Stack */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper className="nexus-card" sx={{ p: 3, height: 480 }}>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#3b82f615', color: '#3b82f6' }}><DollarSign size={20} /></Box>
                                    <Typography variant="subtitle1" fontWeight="800" color="#1e293b">Combined Revenue Mix</Typography>
                                </Stack>
                                <Box sx={{ height: 380, width: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.combinedRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                            <YAxis tickFormatter={(val) => `₹${val/1000}k`} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <Tooltip formatter={(val: any) => formatCurrency(val)} cursor={{ fill: '#f8fafc' }} />
                                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                            <Bar dataKey="Project GST" stackId="a" fill="#10b981" />
                                            <Bar dataKey="Project No-GST" stackId="a" fill="#86efac" />
                                            <Bar dataKey="Student GST" stackId="a" fill="#8b5cf6" />
                                            <Bar dataKey="Student No-GST" stackId="a" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* GST Compliance Radar */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper className="nexus-card" sx={{ p: 3, height: 480 }}>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f43f5e15', color: '#f43f5e' }}><Receipt size={20} /></Box>
                                    <Typography variant="subtitle1" fontWeight="800" color="#1e293b">GST Compliance Profile</Typography>
                                </Stack>
                                <Box sx={{ height: 380, width: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.gstProfileData}>
                                            <PolarGrid stroke="#e2e8f0" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name="Ooty" dataKey="Ooty" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                                            <Radar name="Coimbatore" dataKey="Coimbatore" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                            <Tooltip formatter={(val: any) => `${val.toFixed(1)}%`} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>
                   </Grid>
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                         <Paper className="nexus-card" sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f59e0b15', color: '#f59e0b' }}><Building2 size={20} /></Box>
                                    <Typography variant="subtitle1" fontWeight="800" color="#1e293b">Office-wise GST Comparison</Typography>
                                </Stack>
                                <ToggleButtonGroup
                                    value={gstViewMode}
                                    exclusive
                                    onChange={(_, newVal) => { if (newVal) setGstViewMode(newVal); }}
                                    size="small"
                                    sx={{ height: 32 }}
                                >
                                    <ToggleButton value="Revenue" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}>Revenue</ToggleButton>
                                    <ToggleButton value="Count" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}>Count</ToggleButton>
                                </ToggleButtonGroup>
                            </Stack>
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 3, width: '100%', height: '100%' }}>
                                        <Typography variant="subtitle2" fontWeight="800" color="text.secondary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, letterSpacing: 0.5 }}>
                                            <Box sx={{ width: 8, height: 24, borderRadius: 1, bgcolor: '#10b981' }} />
                                            PROJECTS BREAKDOWN
                                        </Typography>
                                        <Box sx={{ height: 300, width: '100%' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart layout="vertical" data={stats.officeComparison} margin={{ top: 5, right: 80, left: 40, bottom: 5 }} barGap={12}>
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#e2e8f0" />
                                                    <XAxis type="number" hide />
                                                    <YAxis 
                                                        dataKey="name" 
                                                        type="category" 
                                                        tick={{ fontSize: 14, fontWeight: 700, fill: '#475569' }} 
                                                        axisLine={false} 
                                                        tickLine={false} 
                                                        width={100}
                                                    />
                                                    <Tooltip 
                                                        cursor={{ fill: '#f1f5f9' }}
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                                        formatter={(val: any) => gstViewMode === 'Revenue' ? formatCurrency(val) : val} 
                                                    />
                                                    <Legend verticalAlign="top" align="right" height={40} iconType="circle" />
                                                    <Bar name="With GST" dataKey={gstViewMode === 'Revenue' ? 'projectWithGSTRevenue' : 'projectWithGSTCount'} fill="#10b981" radius={[0, 4, 4, 0]} barSize={32}>
                                                        <LabelList 
                                                            dataKey={gstViewMode === 'Revenue' ? 'projectWithGSTRevenue' : 'projectWithGSTCount'} 
                                                            position="right" 
                                                            formatter={(val: any) => gstViewMode === 'Revenue' ? (typeof val === 'number' && val > 0 ? `₹${(val/1000).toFixed(1)}k` : '') : (val > 0 ? val : '')} 
                                                            style={{ fontSize: '12px', fontWeight: 800, fill: '#059669' }} 
                                                        />
                                                    </Bar>
                                                    <Bar name="Without GST" dataKey={gstViewMode === 'Revenue' ? 'projectWithoutGSTRevenue' : 'projectWithoutGSTCount'} fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={32}>
                                                        <LabelList 
                                                            dataKey={gstViewMode === 'Revenue' ? 'projectWithoutGSTRevenue' : 'projectWithoutGSTCount'} 
                                                            position="right" 
                                                            formatter={(val: any) => gstViewMode === 'Revenue' ? (typeof val === 'number' && val > 0 ? `₹${(val/1000).toFixed(1)}k` : '') : (val > 0 ? val : '')} 
                                                            style={{ fontSize: '12px', fontWeight: 800, fill: '#64748b' }} 
                                                        />
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 3, width: '100%', height: '100%' }}>
                                        <Typography variant="subtitle2" fontWeight="800" color="text.secondary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, letterSpacing: 0.5 }}>
                                            <Box sx={{ width: 8, height: 24, borderRadius: 1, bgcolor: '#8b5cf6' }} />
                                            STUDENTS BREAKDOWN
                                        </Typography>
                                        <Box sx={{ height: 300, width: '100%' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart layout="vertical" data={stats.officeComparison} margin={{ top: 5, right: 80, left: 40, bottom: 5 }} barGap={12}>
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#e2e8f0" />
                                                    <XAxis type="number" hide />
                                                    <YAxis 
                                                        dataKey="name" 
                                                        type="category" 
                                                        tick={{ fontSize: 14, fontWeight: 700, fill: '#475569' }} 
                                                        axisLine={false} 
                                                        tickLine={false} 
                                                        width={100}
                                                    />
                                                    <Tooltip 
                                                        cursor={{ fill: '#f1f5f9' }}
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                                        formatter={(val: any) => gstViewMode === 'Revenue' ? formatCurrency(val) : val} 
                                                    />
                                                    <Legend verticalAlign="top" align="right" height={40} iconType="circle" />
                                                    <Bar name="With GST" dataKey={gstViewMode === 'Revenue' ? 'studentWithGSTRevenue' : 'studentWithGSTCount'} fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={32}>
                                                        <LabelList 
                                                            dataKey={gstViewMode === 'Revenue' ? 'studentWithGSTRevenue' : 'studentWithGSTCount'} 
                                                            position="right" 
                                                            formatter={(val: any) => gstViewMode === 'Revenue' ? (typeof val === 'number' && val > 0 ? `₹${(val/1000).toFixed(1)}k` : '') : (val > 0 ? val : '')} 
                                                            style={{ fontSize: '12px', fontWeight: 800, fill: '#7c3aed' }} 
                                                        />
                                                    </Bar>
                                                    <Bar name="Without GST" dataKey={gstViewMode === 'Revenue' ? 'studentWithoutGSTRevenue' : 'studentWithoutGSTCount'} fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={32}>
                                                        <LabelList 
                                                            dataKey={gstViewMode === 'Revenue' ? 'studentWithoutGSTRevenue' : 'studentWithoutGSTCount'} 
                                                            position="right" 
                                                            formatter={(val: any) => gstViewMode === 'Revenue' ? (typeof val === 'number' && val > 0 ? `₹${(val/1000).toFixed(1)}k` : '') : (val > 0 ? val : '')} 
                                                            style={{ fontSize: '12px', fontWeight: 800, fill: '#64748b' }} 
                                                        />
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                         </Paper>
                    </Grid>
                </Grid>
             </Box>
        )}

        {/* Footer */}
        <Box sx={{ mt: 8, mb: 2, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ letterSpacing: 1.5, color: '#94a3b8', fontWeight: 500 }}>
              SILICO-DASH FINANCIAL ANALYTICS • CONFIDENTIAL
          </Typography>
        </Box>
      </Box>
    );
  };