import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Divider,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid
} from '@mui/material';
import {
  ChevronLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  TrendingUp,
  Printer,
  ShieldCheck,
  Fingerprint,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { type ClientProfile, type Project } from '../data/mockData';

interface ClientAnalysisProps {
  client: ClientProfile;
  projects: Project[];
  onBack: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const ClientAnalysis: React.FC<ClientAnalysisProps> = ({ client, projects, onBack }) => {
  const clientProjects = useMemo(() => 
    projects.filter(p => p.clientName === client.name),
    [client, projects]
  );

  const stats = useMemo(() => {
    const totalFunding = clientProjects.reduce((acc, p) => acc + p.totalFunding, 0);
    const activeProjects = clientProjects.filter(p => p.status === 'Ongoing').length;
    const completedProjects = clientProjects.filter(p => p.status === 'Completed').length;
    
    const statusDistribution = [
      { name: 'Ongoing', value: activeProjects },
      { name: 'Completed', value: completedProjects },
      { name: 'Planned', value: clientProjects.filter(p => p.status === 'Planned').length },
      { name: 'Stopped', value: clientProjects.filter(p => p.status === 'Stopped').length },
    ].filter(d => d.value > 0);

    const fundingOverTime = clientProjects
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .map(p => ({
        date: p.startDate,
        funding: p.totalFunding,
        title: p.title
      }));

    const typeDistribution = clientProjects.reduce((acc: any[], p) => {
      const existing = acc.find(item => item.name === p.projectType);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: p.projectType, value: 1 });
      }
      return acc;
    }, []);

    return {
      totalProjects: clientProjects.length,
      totalFunding,
      activeProjects,
      completedProjects,
      statusDistribution,
      fundingOverTime,
      typeDistribution
    };
  }, [clientProjects]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handlePrint = () => window.print();

  return (
    <Box sx={{ 
      flexGrow: 1, 
      bgcolor: '#f8fafc', 
      minHeight: '100%',
      '@media print': { 
        p: 0, 
        bgcolor: '#fff',
        '& .no-print': { display: 'none !important' },
        '& .print-only': { display: 'block !important' }
      }
    }}>
      {/* --- PAGE 1: PREMIUM COVER PAGE --- */}
      <Box className="print-only" sx={{ 
        display: 'none', 
        height: '296mm', 
        width: '100%', 
        position: 'relative', 
        bgcolor: '#ffffff', 
        color: '#0f172a', 
        p: 0, 
        boxSizing: 'border-box', 
        overflow: 'hidden',
        pageBreakAfter: 'always'
      }}>
        {/* Background Geometric Elements */}
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 600, height: 600, borderRadius: 3, bgcolor: '#0ea5e9', opacity: 0.03 }} />
        <Box sx={{ position: 'absolute', bottom: -150, left: -150, width: 500, height: 500, borderRadius: 3, border: '40px solid rgba(14, 165, 233, 0.05)' }} />
        
        <Box sx={{ height: '45%', bgcolor: '#0f172a', color: '#fff', p: 10, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 10, bgcolor: '#0ea5e9' }} />
            
            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 8 }}>
                <Box sx={{ bgcolor: '#0ea5e9', p: 1.5, borderRadius: 0.5 }}>
                    <Fingerprint size={48} color="#fff" strokeWidth={1.5} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 1000, letterSpacing: 8, textTransform: 'uppercase', lineHeight: 1 }}>SILICO</Typography>
                  <Typography variant="caption" sx={{ letterSpacing: 4, fontWeight: 700, color: '#0ea5e9' }}>RESEARCH SYSTEMS</Typography>
                </Box>
            </Stack>

            <Typography variant="overline" sx={{ color: '#0ea5e9', fontWeight: 900, fontSize: '1.2rem', letterSpacing: 10, mb: 3, display: 'block', opacity: 0.9 }}>
                CLIENT PERFORMANCE AUDIT
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: 950, fontSize: '5.5rem', color: '#fff', letterSpacing: '-0.05em', lineHeight: 0.85, mb: 6 }}>
                Intelligence <br />
                Dossier <br />
                Report 2026.
            </Typography>
            
            <Stack direction="row" spacing={4}>
              <Box sx={{ width: 80, height: 4, bgcolor: '#0ea5e9', borderRadius: 0.5 }} />
              <Box sx={{ width: 40, height: 4, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 0.5 }} />
            </Stack>
        </Box>

        <Box sx={{ px: 10, py: 12 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 8 }}>
              <Box>
                  <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 800, letterSpacing: 4, mb: 2, display: 'block' }}>P R E P A R E D   F O R</Typography>
                  <Typography variant="h2" sx={{ fontWeight: 950, color: '#0f172a', mb: 1, letterSpacing: '-0.02em', textTransform: 'uppercase', fontSize: '3rem' }}>
                      {client.name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>{client.university} • {client.department}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.5 }}>CL-{client.id}-AX</Typography>
                  <Typography variant="caption" sx={{ color: '#0ea5e9', fontWeight: 900, letterSpacing: 2 }}>LEVEL 4 CONFIDENTIAL</Typography>
              </Box>
            </Stack>

            <Box sx={{ p: 5, borderLeft: '6px solid #0ea5e9', bgcolor: '#f8fafc', borderRadius: '0 12px 12px 0', mb: 10 }}>
                <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8, fontSize: '1.2rem', fontWeight: 500 }}>
                    "A certified research audit and performance summary for <strong>{client.name}</strong>, encompassing all managed project initiatives, scientific domain impact, and financial metrics for the active research cycle."
                </Typography>
            </Box>

            <Grid container spacing={6}>
                <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 900, letterSpacing: 2, display: 'block', mb: 1.5 }}>AUDIT STATUS</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ShieldCheck size={20} color="#10b981" />
                      <Typography variant="h6" sx={{ fontWeight: 900, color: '#10b981' }}>VERIFIED</Typography>
                    </Stack>
                </Grid>
                <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 900, letterSpacing: 2, display: 'block', mb: 1.5 }}>RELEASE DATE</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 900, letterSpacing: 2, display: 'block', mb: 1.5 }}>ID CODE</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>SRB-CL-{client.id}</Typography>
                </Grid>
            </Grid>
        </Box>
      </Box>

      {/* --- PAGE 2: TABLE OF CONTENTS --- */}
      <Box className="print-only" sx={{ 
        display: 'none', 
        height: '296mm', 
        width: '100%', 
        p: 10, 
        boxSizing: 'border-box', 
        bgcolor: '#ffffff',
        pageBreakAfter: 'always'
      }}>
        <Typography variant="h3" sx={{ fontWeight: 950, color: '#0f172a', mb: 8, letterSpacing: '-0.02em' }}>Report Index</Typography>
        
        <Box sx={{ borderLeft: '3px solid #f1f5f9', ml: 3, pl: 8 }}>
            {[
                { id: '01', title: 'Executive Summary', desc: 'Primary engagement metrics and current portfolio status.', page: '03' },
                { id: '02', title: 'Financial & Domain Analysis', desc: 'Detailed breakdown of funding allocation and research distribution.', page: '04' },
                { id: '03', title: 'Managed Project Portfolio', desc: 'Certified inventory of all research initiatives and timelines.', page: '05' },
                { id: '04', title: 'Compliance & Audit Notice', desc: 'Formal document validation and proprietary security standards.', page: '06' }
            ].map((item) => (
                <Box key={item.id} sx={{ mb: 6, position: 'relative' }}>
                    <Box sx={{ 
                        position: 'absolute', 
                        left: -67, 
                        top: 4, 
                        width: 18, 
                        height: 18, 
                        bgcolor: '#0ea5e9', 
                        borderRadius: 1,
                        border: '4px solid #fff',
                        boxShadow: '0 0 0 2px #f1f5f9'
                    }} />
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 1000, color: '#0f172a', mb: 0.5 }}>{item.title}</Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, maxWidth: 500, lineHeight: 1.5 }}>{item.desc}</Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 1000, color: '#0ea5e9' }}>P.{item.page}</Typography>
                    </Stack>
                </Box>
            ))}
        </Box>

        <Box sx={{ mt: 'auto', p: 4, bgcolor: '#f8fafc', borderRadius: 2.5, display: 'flex', alignItems: 'center', gap: 3, border: '1.5px solid #e2e8f0' }}>
          <ShieldCheck size={28} color="#0ea5e9" />
          <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600, lineHeight: 1.6 }}>
              This dossier is certified authentic and governed by the proprietary information security standards of Insilicomics Research Systems. 
              Data contained herein is protected by Level 4 Confidentiality protocols.
          </Typography>
        </Box>
      </Box>

      {/* --- PAGE 3+: CONTENT --- */}
      <Box sx={{ 
        p: { xs: 2, md: 3 }, 
        '@media print': { 
          p: 8, 
          bgcolor: '#fff', 
          pageBreakBefore: 'always',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '282mm',
          boxSizing: 'border-box'
        } 
      }}>
        {/* Watermark for Print */}
        <Box className="print-only" sx={{ 
          display: 'none', 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%) rotate(-45deg)', 
          zIndex: -1,
          opacity: 0.03,
          pointerEvents: 'none'
        }}>
          <Typography sx={{ fontSize: '15rem', fontWeight: 950, color: '#0f172a', whiteSpace: 'nowrap' }}>
            CONFIDENTIAL
          </Typography>
        </Box>

        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="no-print">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton size="small" onClick={onBack} sx={{ border: '1.5px solid #e2e8f0', bgcolor: '#fff', '&:hover': { bgcolor: '#f1f5f9' }, borderRadius: 1.5 }}>
              <ChevronLeft size={16} />
            </IconButton>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1rem' }}>
                Client Analysis
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mt: -0.5 }}>
                {client.name} Portfolio
              </Typography>
            </Box>
          </Stack>
          <Button variant="contained" size="small" startIcon={<Printer size={14} />} onClick={handlePrint} sx={{ bgcolor: '#0f172a', px: 2.5, py: 0.5, borderRadius: 1.5, fontWeight: 800, fontSize: '0.75rem' }}>
            Generate Report
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, gap: 3 }}>
          {/* Left Column: Client Profile */}
          <Box className="no-break">
            <Card sx={{ borderRadius: 2.5, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: { md: 'sticky' }, top: 24, border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mx: 'auto', 
                      mb: 1.5, 
                      bgcolor: '#ecfeff', 
                      color: '#0891b2',
                      fontSize: '2rem',
                      fontWeight: 800,
                      borderRadius: 1.5
                    }}
                  >
                    {client.name.charAt(0)}
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.2 }}>{client.name}</Typography>
                  <Chip 
                    label={client.status} 
                    sx={{ 
                      fontWeight: 800, 
                      px: 1,
                      bgcolor: client.status === 'Active' ? '#ecfdf5' : '#f1f5f9',
                      color: client.status === 'Active' ? '#10b981' : '#64748b',
                      height: 20,
                      fontSize: '0.6rem',
                      borderRadius: 0.5
                    }} 
                  />
                </Box>

                <Stack spacing={2.5}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                      <Building2 size={16} color="#0891b2" />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Institution</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 700, ml: 3.5 }}>{client.university}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', ml: 3.5, fontWeight: 500, display: 'block' }}>{client.department}</Typography>
                  </Box>

                  <Divider sx={{ borderStyle: 'dashed' }} />

                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                      <Mail size={16} color="#0891b2" />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Email</Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ fontWeight: 600, ml: 3.5, color: '#475569', display: 'block' }}>{client.email}</Typography>
                  </Box>

                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                      <Phone size={16} color="#0891b2" />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Phone</Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ fontWeight: 600, ml: 3.5, color: '#475569', display: 'block' }}>{client.phone}</Typography>
                  </Box>

                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                      <MapPin size={16} color="#0891b2" />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Location</Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: '#475569', ml: 3.5, lineHeight: 1.4, fontWeight: 500, display: 'block' }}>
                      {client.address}<br />
                      {client.city}, {client.state}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Right Column: Analysis & Plots */}
          <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
              {[
                { label: 'Total Portfolio', value: stats.totalProjects, icon: <FileText size={24} />, color: '#3b82f6' },
                { label: 'Managed Capital', value: formatCurrency(stats.totalFunding), icon: <DollarSign size={24} />, color: '#10b981' },
                { label: 'Active Cycles', value: stats.activeProjects, icon: <TrendingUp size={24} />, color: '#0ea5e9' },
                { label: 'Verified Success', value: stats.completedProjects, icon: <CheckCircle2 size={24} />, color: '#8b5cf6' },
              ].map((stat, idx) => (
                <Paper key={idx} sx={{ 
                  p: 3, 
                  borderRadius: 2.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3, 
                  border: '1.5px solid #e2e8f0', 
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                  breakInside: 'avoid',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', borderColor: '#cbd5e1' }
                }}>
                  <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: `${stat.color}10`, color: stat.color, display: 'flex' }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 1000, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 1000, color: '#0f172a', lineHeight: 1 }}>{stat.value}</Typography>
                  </Box>
                </Paper>
              ))}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.5fr 1fr' }, gap: 3, mb: 4 }}>
              <Paper sx={{ p: 3, borderRadius: 2.5, height: 350, border: '1.5px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', breakInside: 'avoid' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 1000, mb: 3, display: 'block', textTransform: 'uppercase', letterSpacing: 1.5, color: '#0f172a' }}>Research Capital Growth</Typography>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={stats.fundingOverTime} margin={{ right: 40, top: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                      tickFormatter={(val) => `₹${val/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: 1.5, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                      formatter={(val: any) => [formatCurrency(val), 'Capital']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="funding" 
                      stroke="#0ea5e9" 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 2.5, height: 350, border: '1.5px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', breakInside: 'avoid' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 1000, mb: 3, display: 'block', textTransform: 'uppercase', letterSpacing: 1.5, color: '#0f172a' }}>Domain Specialization</Typography>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={stats.typeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {stats.typeDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: 1.5, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700, paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Box>

            <Paper className="page-break" sx={{ p: 0, borderRadius: 0.5, border: '1.5px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', mt: { '@media print': 4 }, overflow: 'hidden' }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 1000, display: 'block', textTransform: 'uppercase', letterSpacing: 2, color: '#0f172a' }}>Certified Research Inventory</Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#fff' }}>
                      <TableCell sx={{ fontWeight: 900, fontSize: '0.75rem', color: '#64748b' }}>PROJECT IDENTITY</TableCell>
                      <TableCell sx={{ fontWeight: 900, fontSize: '0.75rem', color: '#64748b' }}>SCIENTIFIC DOMAIN</TableCell>
                      <TableCell sx={{ fontWeight: 900, fontSize: '0.75rem', color: '#64748b' }}>TIMELINE</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 900, fontSize: '0.75rem', color: '#64748b' }}>CAPITAL (INR)</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.75rem', color: '#64748b' }}>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clientProjects.map((p, idx) => (
                      <TableRow key={p.id} hover sx={{ bgcolor: idx % 2 === 0 ? 'transparent' : 'rgba(248, 250, 252, 0.4)' }}>
                        <TableCell sx={{ py: 2.5 }}>
                          <Typography sx={{ fontWeight: 950, color: '#0f172a', fontSize: '0.85rem', mb: 0.5 }}>{p.title}</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.7rem', bgcolor: '#f1f5f9', px: 1, py: 0.2, borderRadius: 0.5 }}>ID: {p.id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={p.projectType} size="small" sx={{ fontWeight: 900, fontSize: '0.65rem', height: 20, bgcolor: '#f1f5f9', color: '#475569', borderRadius: 0.5 }} />
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Typography variant="caption" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.7rem' }}>
                              <Box sx={{ width: 6, height: 6, borderRadius: 0, bgcolor: '#10b981' }} /> {p.startDate}
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.7rem' }}>
                              <Box sx={{ width: 6, height: 6, borderRadius: 0, bgcolor: '#94a3b8' }} /> {p.completionDate || 'Ongoing'}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontWeight: 1000, color: '#0f172a', fontSize: '0.9rem' }}>{formatCurrency(p.totalFunding)}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={p.status} 
                            size="small" 
                            sx={{ 
                              bgcolor: p.status === 'Ongoing' ? '#eff6ff' : '#ecfdf5',
                              color: p.status === 'Ongoing' ? '#3b82f6' : '#10b981',
                              fontWeight: 1000,
                              fontSize: '0.65rem',
                              height: 20,
                              borderRadius: 0.5,
                              px: 1
                            }} 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {clientProjects.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                          <Typography color="textSecondary" sx={{ fontWeight: 800, fontSize: '0.9rem' }}>No active research projects found.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Print Footer */}
            <Box className="print-only" sx={{ display: 'none', mt: 'auto', pt: 6, borderTop: '3px solid #0f172a', justifyContent: 'space-between', alignItems: 'flex-start', pageBreakBefore: 'avoid' }}>
                <Box sx={{ maxWidth: 500 }}>
                    <Typography variant="h6" sx={{ fontWeight: 1000, color: '#0f172a', letterSpacing: '-0.01em', mb: 1.5 }}>Verification & Compliance</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.6, display: 'block', mb: 3 }}>
                        This Silico Audit is a certified document of Insilicomics Research Systems. 
                        Data contained herein is protected by proprietary confidentiality agreements and serves as an official research record.
                    </Typography>
                    <Stack direction="row" spacing={4} alignItems="center">
                        <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ border: '1.5px solid #e2e8f0', p: 1, borderRadius: 0.5, mb: 1, bgcolor: '#fff' }}>
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=VERIFIED-CLIENT-AUDIT" alt="QR Code" style={{ width: 70, height: 70 }} />
                            </Box>
                            <Typography variant="caption" sx={{ fontWeight: 1000, color: '#0ea5e9', letterSpacing: 1, fontSize: '0.65rem' }}>VERIFY AUDIT</Typography>
                        </Box>
                        <Box sx={{ pt: 1 }}>
                            <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 900, display: 'block', mb: 1, letterSpacing: 2 }}>CERTIFIED BY</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 1000, fontStyle: 'italic', color: '#0f172a', display: 'block', lineHeight: 1 }}>Scientific Review Board</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 1000, color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Insilicomics Research Private Limited</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 1000, color: '#0f172a', fontSize: '0.65rem', mt: 1, display: 'block' }}>ELECTRONICALLY SIGNED SRB-CERT-99021-INS</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 900, color: '#0ea5e9', fontSize: '0.65rem', display: 'block', textTransform: 'uppercase' }}>INSILICOMICS SYSTEMS AUDIT BOARD</Typography>
                        </Box>
                    </Stack>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h4" sx={{ fontWeight: 1000, color: '#0f172a', letterSpacing: 2 }}>INSILICOMICS</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 950, color: '#0ea5e9', letterSpacing: 4, display: 'block', mb: 1 }}>RESEARCH SYSTEMS</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 1000, color: '#94a3b8', display: 'block', mb: 2, letterSpacing: 1 }}>© 2026 INSILICOMICS SYSTEMS • ALL RIGHTS RESERVED</Typography>
                    <Box sx={{ display: 'inline-flex', bgcolor: '#f8fafc', p: 1.5, borderRadius: 0.5, border: '1px solid #e2e8f0' }}>
                      <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 900, fontSize: '0.65rem' }}>RELEASE V2.5 • JAN 2026</Typography>
                    </Box>
                </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientAnalysis;
