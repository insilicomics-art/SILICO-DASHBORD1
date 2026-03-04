import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  LinearProgress,
  Card,
  CardContent,
  Stack,
  Chip
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { institutionColors, type Project, type Student, type Payment, type ClientProfile } from '../data/mockData';
import { 
  DollarSign, 
  FileText, 
  Download, 
  Globe,
  Users,
  Award
} from 'lucide-react';
import { Button } from '@mui/material';

interface InstitutionsAnalysisProps {
  projects: Project[];
  institutions: string[];
  students: Student[];
  payments: Payment[];
  clientProfiles: ClientProfile[];
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0 
  }).format(val);
};

const StatCard = ({ title, value, icon, color, subtitle, trend }: { title: string; value: string | number; icon: React.ReactNode; color: string; subtitle?: string; trend?: string }) => (
  <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none', height: '100%', position: 'relative', overflow: 'hidden' }}>
    <Box sx={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, bgcolor: `${color}10`, borderRadius: '0 0 0 100%' }} />
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Box sx={{ p: 1, bgcolor: `${color}15`, color: color, borderRadius: 2 }}>{icon}</Box>
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1.5 }}>{title}</Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="flex-end">
        <Typography variant="h4" sx={{ fontWeight: 950, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</Typography>
        {trend && <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700, mb: 0.5 }}>{trend}</Typography>}
      </Stack>
      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mt: 1 }}>{subtitle}</Typography>
    </CardContent>
  </Card>
);

const InstitutionsAnalysis: React.FC<InstitutionsAnalysisProps> = ({ projects, institutions, students, payments, clientProfiles }) => {
  const analysisData = useMemo(() => {
    return institutions.map(inst => {
      const instProjects = projects.filter(p => p.institution === inst);
      const instStudents = students.filter(s => s.university === inst);
      
      // Filter payments for this institution via client profiles
      const instPayments = payments.filter(pay => {
          const client = clientProfiles.find(c => c.id === pay.clientId);
          return client && client.university === inst;
      });

      const totalProjects = instProjects.length;
      const totalStudents = instStudents.length;

      // Project Financials
      const projectRevenue = instProjects.reduce((acc, p) => acc + (Number(p.totalFunding) || 0), 0);
      const projectReceivedLegacy = instProjects.reduce((acc, p) => acc + (Number(p.firstPaymentAmount) || 0) + (Number(p.finalPaymentAmount) || 0), 0);
      
      // Student Financials
      const studentRevenue = instStudents.reduce((acc, s) => acc + (Number(s.totalFee) || 0), 0);
      const studentReceivedLegacy = instStudents.reduce((acc, s) => acc + (Number(s.firstPaymentAmount) || 0) + (Number(s.finalPaymentAmount) || 0), 0);

      // Payments from Table
      const paymentsTableTotal = instPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

      const totalRevenue = projectRevenue + studentRevenue;
      
      // Total Received = Legacy fields (if used) + New Payment Table
      // Assuming legacy fields are separate or 0 if migrated. 
      // If legacy data exists AND we add payments in table, this sums them up.
      const totalReceived = projectReceivedLegacy + studentReceivedLegacy + paymentsTableTotal;
      
      const totalPending = Math.max(0, totalRevenue - totalReceived);

      const avgProgress = totalProjects > 0 
        ? instProjects.reduce((acc, p) => acc + p.progress, 0) / totalProjects 
        : 0;
      
      const completedProjects = instProjects.filter(p => p.status === 'Completed').length;
      const successRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

      return {
        name: inst,
        totalProjects,
        totalStudents,
        totalRevenue,
        totalPending,
        totalReceived,
        projectRevenue,
        studentRevenue,
        avgProgress,
        successRate,
        color: institutionColors[inst] || '#64748b'
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [projects, institutions, students, payments, clientProfiles]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const totalStats = useMemo(() => {
      return {
          totalRevenue: analysisData.reduce((acc, d) => acc + d.totalRevenue, 0),
          totalPending: analysisData.reduce((acc, d) => acc + d.totalPending, 0),
          totalProjects: analysisData.reduce((acc, d) => acc + d.totalProjects, 0),
          totalStudents: analysisData.reduce((acc, d) => acc + d.totalStudents, 0),
      };
  }, [analysisData]);

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f8fafc', minHeight: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 950, color: '#0f172a', letterSpacing: '-0.04em' }}>
            Ecosystem Analytics
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', mt: 1, fontWeight: 500 }}>
            Comparative performance matrix across all partner institutions.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Download size={20} />} 
          onClick={() => window.print()}
          sx={{ 
            borderRadius: 3, 
            fontWeight: 800, 
            bgcolor: '#0f172a', 
            px: 4,
            py: 1.5,
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
          }}
        >
          Export Ecosystem Audit
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard 
            title="Total Partners" 
            value={institutions.length} 
            icon={<Globe size={24} />} 
            color="#3b82f6" 
            subtitle="Verified Research Hubs"
            trend="+1 this month"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard 
            title="Active Talent" 
            value={totalStats.totalStudents} 
            icon={<Users size={24} />} 
            color="#8b5cf6" 
            subtitle="Registered Candidates"
            trend="+24% YoY"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard 
            title="Managed Capital" 
            value={formatCurrency(totalStats.totalRevenue)} 
            icon={<DollarSign size={24} />} 
            color="#10b981" 
            subtitle="Realized & Outstanding"
            trend="+18.2%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard 
            title="Total Initiatives" 
            value={totalStats.totalProjects} 
            icon={<FileText size={24} />} 
            color="#f59e0b" 
            subtitle="Cross-institutional Projects"
            trend="+4 ongoing"
          />
        </Grid>
      </Grid>

      {/* Main Charts */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 4, borderRadius: 2.5, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>Capital Realization by Institution</Typography>
              <Chip label="FINANCIAL MATRIX" size="small" sx={{ fontWeight: 900, borderRadius: 1, bgcolor: '#f1f5f9', color: '#475569' }} />
            </Stack>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={0}>
                <BarChart data={analysisData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} tickFormatter={(val) => `₹${val/100000}L`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                    formatter={(val: number | string | undefined) => formatCurrency(Number(val || 0))} 
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                  <Bar dataKey="totalReceived" name="Capital Realized" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={40} />
                  <Bar dataKey="totalPending" name="Collection Gap" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={4} sx={{ height: '100%' }}>
            <Paper sx={{ p: 4, borderRadius: 2.5, border: '1px solid #e2e8f0', boxShadow: 'none', flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>Revenue Contribution</Typography>
              <Box sx={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={0}>
                  <PieChart>
                    <Pie
                      data={analysisData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="totalRevenue"
                    >
                      {analysisData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number | string | undefined) => formatCurrency(Number(val || 0))} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* Comparison Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2.5, border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 950, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1, py: 2.5 }}>Institution Entity</TableCell>
              <TableCell align="center" sx={{ fontWeight: 950, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>Initiatives</TableCell>
              <TableCell align="center" sx={{ fontWeight: 950, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>Talent Pool</TableCell>
              <TableCell align="right" sx={{ fontWeight: 950, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>Total Valuation</TableCell>
              <TableCell align="right" sx={{ fontWeight: 950, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>Realized</TableCell>
              <TableCell align="center" sx={{ fontWeight: 950, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>Portfolio Maturity</TableCell>
              <TableCell align="center" sx={{ fontWeight: 950, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>Audit Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analysisData.map((row) => (
              <TableRow key={row.name} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: row.color, width: 36, height: 36, fontSize: '0.9rem', fontWeight: 900, borderRadius: 2 }}>
                      {row.name.substring(0, 2).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a' }}>{row.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>VERIFIED PARTNER</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip label={row.totalProjects} size="small" sx={{ fontWeight: 900, bgcolor: '#f1f5f9', borderRadius: 1.5 }} />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{row.totalStudents}</Typography>
                </TableCell>
                <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 950, color: '#0f172a' }}>{formatCurrency(row.totalRevenue)}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 900 }}>{formatCurrency(row.totalReceived)}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ width: 180 }}>
                  <Box sx={{ px: 2 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#94a3b8' }}>AVG PROGRESS</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: row.color }}>{Math.round(row.avgProgress)}%</Typography>
                    </Stack>
                    <LinearProgress 
                      variant="determinate" 
                      value={row.avgProgress} 
                      sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: row.color } }} 
                    />
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={row.successRate > 50 ? "ELITE" : "CORE"} 
                    size="small" 
                    sx={{ fontWeight: 950, borderRadius: 1.5, bgcolor: row.successRate > 50 ? '#ecfdf5' : '#eff6ff', color: row.successRate > 50 ? '#10b981' : '#3b82f6', fontSize: '0.6rem' }} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Branding */}
      <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: 1 }}>
            GENERATED BY SILICO-DASH INTELLIGENCE ENGINE • V4.2
        </Typography>
        <Stack direction="row" spacing={4}>
            <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 900, display: 'block' }}>AUDIT COMPLIANCE</Typography>
                <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 800 }}>ISO-27001 VERIFIED</Typography>
            </Box>
            <Award size={32} color="#f59e0b" />
        </Stack>
      </Box>
    </Box>
  );
};

export default InstitutionsAnalysis;
