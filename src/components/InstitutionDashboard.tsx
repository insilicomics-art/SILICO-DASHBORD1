import React, { useMemo, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Avatar,
  IconButton,
  Divider,
  Chip,
  LinearProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  Cell
} from 'recharts';
import { institutionColors, type Project, type User, type Student } from '../data/mockData';
import ProjectActivitiesDialog from './ProjectActivitiesDialog';
import { 
  DollarSign, 
  FileText, 
  Printer, 
  ChevronLeft, 
  TrendingUp, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  Dna, 
  Fingerprint,
  FileSearch,
  PieChart as PieChartIcon, 
  Users, 
  ExternalLink,
  Zap,
  CheckCircle2,
  Lock,
  History,
  MapPin
} from 'lucide-react';

// --- Sub-components ---

const StatItem = ({ label, value, icon, color, trend }: { label: string, value: string | number, icon: React.ReactNode, color: string, trend?: string }) => (
  <Box sx={{ p: 2, flex: 1, minWidth: { xs: '100%', sm: '25%' }, borderRight: { sm: '1px solid #f1f5f9' }, '&:last-child': { borderRight: 'none' } }}>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Box sx={{ color: color, display: 'flex', bgcolor: `${color}10`, p: 0.8, borderRadius: 2.5 }}>{icon}</Box>
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>
        {label}
        </Typography>
    </Stack>
    <Stack direction="row" spacing={1} alignItems="flex-end">
      <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{value}</Typography>
      {trend && <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700, mb: 0.2 }}>{trend}</Typography>}
    </Stack>
  </Box>
);

const ChartCard = ({ title, subtitle, children, icon: Icon }: { title: string, subtitle?: string, children: React.ReactNode, icon?: any }) => (
  <Paper sx={{ 
    p: 3, 
    borderRadius: 3, 
    border: '1.5px solid #e2e8f0', 
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)', 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    bgcolor: '#fff',
    transition: 'all 0.3s ease',
    '&:hover': { 
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
      borderColor: '#cbd5e1'
    },
    '@media print': {
        border: '1px solid #e2e8f0',
        boxShadow: 'none',
        breakInside: 'avoid'
    }
  }}>
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 1000, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.01em' }}>{title}</Typography>
        {subtitle && <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>{subtitle}</Typography>}
      </Box>
      {Icon && <Box sx={{ p: 1.2, bgcolor: '#f1f5f9', borderRadius: 2, color: '#475569' }}><Icon size={20} strokeWidth={2} /></Box>}
    </Box>
    <Box sx={{ flexGrow: 1, minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </Box>
  </Paper>
);

const SectionHeader = ({ title, subtitle, color, icon: Icon }: { title: string, subtitle?: string, color: string, icon?: any }) => (
  <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2.5 }}>
    <Box sx={{ bgcolor: color, p: 1.5, borderRadius: 2.5, color: '#fff', display: 'flex', boxShadow: `0 8px 16px -4px ${color}40` }}>
        {Icon ? <Icon size={28} strokeWidth={2} /> : <Zap size={28} />}
    </Box>
    <Box>
        <Typography variant="h4" sx={{ fontWeight: 1000, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {title}
        </Typography>
        {subtitle && <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, mt: 0.5 }}>{subtitle}</Typography>}
    </Box>
  </Box>
);

// --- Main Component ---

interface InstitutionDashboardProps {
  institutionName: string;
  projects: Project[];
  students: Student[];
  users: User[];
  onUpdateProject: (project: Project) => void;
  onBack?: () => void;
  servers: any[];
}

const InstitutionDashboard: React.FC<InstitutionDashboardProps> = ({
  institutionName, 
  projects, 
  students,
  users,
  onUpdateProject,
  onBack,
  servers
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const stats = useMemo(() => {
    const instProjects = projects.filter(p => p.institution === institutionName);
    const instStudents = students.filter(s => s.university === institutionName);
    
    // Project Financials
    const totalFunding = instProjects.reduce((acc, p) => acc + p.totalFunding, 0);
    const totalReceived = instProjects.reduce((acc, p) => acc + (p.firstPaymentAmount || 0) + (p.finalPaymentAmount || 0), 0);
    const totalPending = totalFunding - totalReceived;
    const active = instProjects.filter(p => p.status === 'Ongoing').length;
    const completed = instProjects.filter(p => p.status === 'Completed').length;

    // Student Financials
    const studentTotalFee = instStudents.reduce((acc, s) => acc + (s.totalFee || 0), 0);
    const studentReceivedFee = instStudents.reduce((acc, s) => acc + (s.firstPaymentAmount || 0) + (s.finalPaymentAmount || 0), 0);
    const studentPendingFee = studentTotalFee - studentReceivedFee;

    const statusData = [
      { name: 'Ongoing', value: active, color: '#3b82f6' },
      { name: 'Completed', value: completed, color: '#10b981' },
      { name: 'Planned', value: instProjects.filter(p => p.status === 'Planned').length, color: '#94a3b8' },
    ].filter(d => d.value > 0);

    // Project Type Distribution
    const projectTypeCounts: Record<string, number> = {};
    instProjects.forEach(p => {
      projectTypeCounts[p.projectType] = (projectTypeCounts[p.projectType] || 0) + 1;
    });
    const projectTypeData = Object.entries(projectTypeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Radar Data for scientific depth
    const radarData = projectTypeData.map(d => ({
        subject: d.name,
        A: d.value * 20, // Normalized for radar
        fullMark: 100,
    })).slice(0, 6);

    // Geographic distribution
    const cityCounts: Record<string, number> = {};
    instStudents.forEach(s => {
      cityCounts[s.city] = (cityCounts[s.city] || 0) + 1;
    });
    const geoData = Object.entries(cityCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Timeline Data
    const timelineData = instProjects
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .map(p => ({
        date: p.startDate.substring(0, 7),
        funding: p.totalFunding,
        title: p.title
      }));

    return { 
      instProjects, 
      instStudents,
      totalProjects: instProjects.length, 
      totalStudents: instStudents.length,
      totalFunding, 
      totalPending, 
      totalReceived,
      studentTotalFee,
      studentReceivedFee,
      studentPendingFee,
      active, 
      completed, 
      statusData, 
      projectTypeData,
      radarData,
      geoData,
      timelineData
    };
  }, [institutionName, projects, students]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(val);
  };

  const handlePrint = () => window.print();

  const instColor = institutionColors[institutionName] || '#3b82f6';

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
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 600, height: 600, borderRadius: 3, bgcolor: instColor, opacity: 0.03 }} />
        <Box sx={{ position: 'absolute', bottom: -150, left: -150, width: 500, height: 500, borderRadius: 3, border: `40px solid ${instColor}10` }} />
        
        <Box sx={{ height: '50%', bgcolor: '#0f172a', color: '#fff', p: 10, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, bgcolor: instColor }} />
            
            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 8 }}>
                <Box sx={{ bgcolor: instColor, p: 1.5, borderRadius: 1.5 }}>
                    <Fingerprint size={48} color="#fff" strokeWidth={1.5} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 1000, letterSpacing: 8, textTransform: 'uppercase', lineHeight: 1 }}>SILICO</Typography>
                  <Typography variant="caption" sx={{ letterSpacing: 4, fontWeight: 700, color: instColor }}>RESEARCH SYSTEMS</Typography>
                </Box>
            </Stack>

            <Typography variant="overline" sx={{ color: instColor, fontWeight: 900, fontSize: '1.2rem', letterSpacing: 10, mb: 3, display: 'block', opacity: 0.9 }}>
                INSTITUTIONAL PERFORMANCE AUDIT
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: 950, fontSize: '5.5rem', color: '#fff', letterSpacing: '-0.05em', lineHeight: 0.85, mb: 6 }}>
                Executive <br />
                Performance <br />
                Report 2026.
            </Typography>
            
            <Stack direction="row" spacing={4}>
              <Box sx={{ width: 80, height: 4, bgcolor: instColor, borderRadius: 1.5 }} />
              <Box sx={{ width: 40, height: 4, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1.5 }} />
              <Box sx={{ width: 20, height: 4, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1.5 }} />
            </Stack>
        </Box>

        <Box sx={{ px: 10, py: 12 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 8 }}>
              <Box>
                  <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 800, letterSpacing: 4, mb: 2, display: 'block' }}>PREPARED EXCLUSIVELY FOR</Typography>
                  <Typography variant="h2" sx={{ fontWeight: 950, color: '#0f172a', mb: 1, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                      {institutionName}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>Research Partner Consortium</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.5 }}>SR-2026-X1</Typography>
                  <Typography variant="caption" sx={{ color: instColor, fontWeight: 900, letterSpacing: 2 }}>LEVEL 4 CONFIDENTIAL</Typography>
              </Box>
            </Stack>

            <Grid container spacing={6} sx={{ mb: 12 }}>
                <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 900, letterSpacing: 2, display: 'block', mb: 1.5 }}>AUDIT CYCLE</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>FY 2025 - 2026</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 900, letterSpacing: 2, display: 'block', mb: 1.5 }}>GENERATED ON</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 900, letterSpacing: 2, display: 'block', mb: 1.5 }}>VERIFICATION</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ShieldCheck size={20} color={instColor} />
                      <Typography variant="h6" sx={{ fontWeight: 900, color: instColor }}>VALIDATED</Typography>
                    </Stack>
                </Grid>
            </Grid>

            <Box sx={{ p: 5, borderLeft: `6px solid ${instColor}`, bgcolor: '#f8fafc', borderRadius: '0 12px 12px 0' }}>
                <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8, fontSize: '1.1rem', fontWeight: 500 }}>
                    "This comprehensive audit synthesizes data from all active and historical research collaborations between Insilicomics Research Systems and {institutionName}. 
                    It serves as a strategic instrument for high-level decision making and research capital management, providing deep insights into scientific domain expertise and talent development."
                </Typography>
            </Box>
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
        
        <Stack spacing={4}>
          {[
            { id: '01', title: 'Executive Summary', desc: 'High-level KPI overview and research capital realization metrics.', page: '03' },
            { id: '02', title: 'Strategic Performance Analysis', desc: 'Funding inflow timelines and portfolio growth trajectories.', page: '04' },
            { id: '03', title: 'Research Domain Matrix', desc: 'Scientific distribution analysis and regional talent mapping.', page: '05' },
            { id: '04', title: 'Detailed Research Portfolio', desc: 'Itemized log of all verified research initiatives and leads.', page: '06' },
            { id: '05', title: 'Talent Engagement Log', desc: 'Comprehensive list of students and research candidates.', page: '07' },
            { id: '06', title: 'Compliance & Verification', desc: 'Certification records and data proprietary notices.', page: '08' },
          ].map((item) => (
            <Box key={item.id} sx={{ pb: 4, borderBottom: '1px solid #f1f5f9' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 1000, color: instColor }}>{item.id}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>{item.title}</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, ml: 5 }}>{item.desc}</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#94a3b8' }}>{item.page}</Typography>
              </Stack>
            </Box>
          ))}
        </Stack>

        <Box sx={{ mt: 'auto', p: 4, bgcolor: '#f8fafc', borderRadius: 0.5, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Lock size={24} color={instColor} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.5 }}>Confidentiality Notice</Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, lineHeight: 1.5, display: 'block' }}>
              This document contains proprietary information belonging to Insilicomics Research Systems and {institutionName}. 
              Unauthorized reproduction or distribution is strictly prohibited under research data protection protocols.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* --- MAIN DASHBOARD CONTENT (PAGE 3+) --- */}
      <Box sx={{ 
        p: { xs: 2, md: 4 }, 
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

        {/* Header Action Bar */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="no-print">
          <Stack direction="row" spacing={2} alignItems="center">
            {onBack && (
              <IconButton onClick={onBack} sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0', borderRadius: 0.5, p: 1, '&:hover': { bgcolor: '#f1f5f9' } }}>
                <ChevronLeft size={18} />
              </IconButton>
            )}
            <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h5" sx={{ fontWeight: 950, color: '#0f172a', letterSpacing: '-0.02em' }}>
                        {institutionName}
                    </Typography>
                    <Chip label="PARTNER" size="small" sx={{ bgcolor: instColor, color: '#fff', fontWeight: 900, borderRadius: 0.5, height: 20, fontSize: '0.65rem' }} />
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Strategic Research Dashboard & Silico Audit
                </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={1.5}>
            <Button 
                variant="outlined" 
                size="small"
                startIcon={<ExternalLink size={16} />}
                sx={{ borderRadius: 0.5, fontWeight: 700, border: '1.5px solid #e2e8f0', color: '#475569' }}
            >
                Portal
            </Button>
            <Button 
                variant="contained" 
                size="small"
                startIcon={<Printer size={16} />} 
                onClick={handlePrint}
                sx={{ 
                    borderRadius: 0.5, 
                    fontWeight: 800, 
                    bgcolor: '#0f172a',
                    '&:hover': { bgcolor: '#1e293b' },
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}
            >
                Export Silico Report
            </Button>
          </Stack>
        </Box>

        {/* Global KPI Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12 }}>
                <Paper sx={{ borderRadius: 2.5, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} divider={<Divider orientation="vertical" flexItem />}>
                        <StatItem label="Total Capital" value={formatCurrency(stats.totalFunding + stats.studentTotalFee)} icon={<DollarSign size={18} />} color="#3b82f6" trend="+12.5%" />
                        <StatItem label="Total Pending" value={formatCurrency(stats.totalPending + stats.studentPendingFee)} icon={<Clock size={18} />} color="#ef4444" />
                        <StatItem label="Research Portfolio" value={stats.totalProjects} icon={<FileSearch size={18} />} color="#8b5cf6" trend="+2" />
                        <StatItem label="Talent Pool" value={stats.totalStudents} icon={<GraduationCap size={18} />} color="#10b981" trend="+15" />
                    </Stack>
                </Paper>
            </Grid>
        </Grid>

        <Grid container spacing={3}>
            {/* SECTION 1: Strategic Overview */}
            <Grid size={{ xs: 12, lg: 8 }}>
                <SectionHeader title="Strategic Overview" subtitle="Research capital & timeline analysis" color="#3b82f6" icon={TrendingUp} />
                <ChartCard title="Funding Inflow Timeline" icon={History} subtitle="Growth trajectory of research capital">
                    <ResponsiveContainer width="100%" height={300} minHeight={0}>
                        <AreaChart data={stats.timelineData}>
                            <defs>
                                <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={instColor} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={instColor} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
                            <Tooltip 
                                contentStyle={{ borderRadius: 1.5, border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }} 
                                formatter={(val: any) => [formatCurrency(val), 'Funding']}
                            />
                            <Area type="monotone" dataKey="funding" stroke={instColor} strokeWidth={4} fillOpacity={1} fill="url(#colorFunding)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
            </Grid>

            {/* Audit Summary Panel */}
            <Grid size={{ xs: 12, lg: 4 }}>
                <Box sx={{ height: '100%', pt: { lg: 9 } }}>
                    <Card sx={{ 
                        borderRadius: 3, 
                        bgcolor: '#0f172a', 
                        color: '#fff', 
                        height: 'calc(100% - 12px)', 
                        position: 'relative', 
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                    }}>
                        <Box sx={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, bgcolor: instColor, opacity: 0.15, borderRadius: 3 }} />
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="overline" sx={{ color: instColor, fontWeight: 950, letterSpacing: 3, fontSize: '0.75rem' }}>Audit Summary</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 1000, mb: 4, mt: 1, letterSpacing: '-0.02em' }}>Performance Index</Typography>
                            
                            <Stack spacing={4}>
                                <Box>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Portfolio Completion</Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 950, color: instColor }}>{Math.round((stats.completed / (stats.totalProjects || 1)) * 100)}%</Typography>
                                    </Stack>
                                    <LinearProgress variant="determinate" value={Math.round((stats.completed / (stats.totalProjects || 1)) * 100)} sx={{ height: 8, borderRadius: 0.5, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: instColor, borderRadius: 0.5 } }} />
                                </Box>

                                <Box>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Capital Realization</Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 950, color: '#10b981' }}>{Math.round((stats.totalReceived / (stats.totalFunding || 1)) * 100)}%</Typography>
                                    </Stack>
                                    <LinearProgress variant="determinate" value={Math.round((stats.totalReceived / (stats.totalFunding || 1)) * 100)} sx={{ height: 8, borderRadius: 0.5, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#10b981', borderRadius: 0.5 } }} />
                                </Box>

                                <Box>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Outstanding Debt</Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 950, color: '#ef4444' }}>{formatCurrency(stats.totalPending + stats.studentPendingFee)}</Typography>
                                    </Stack>
                                    <LinearProgress variant="determinate" value={Math.round(((stats.totalPending + stats.studentPendingFee) / (stats.totalFunding + stats.studentTotalFee || 1)) * 100)} sx={{ height: 8, borderRadius: 0.5, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#ef4444', borderRadius: 0.5 } }} />
                                </Box>

                                <Box sx={{ mt: 2, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6, fontWeight: 500 }}>
                                        Verification suggests high maturity in research initiatives with <span style={{ color: '#fff', fontWeight: 800 }}>{stats.active}</span> ongoing high-impact cycles.
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Grid>

            {/* SECTION 2: Research Domain Depth */}
            <Grid size={{ xs: 12 }}>
                <Box sx={{ mt: 4, pageBreakBefore: 'always' }}>
                  <SectionHeader title="Research Depth Analysis" subtitle="Domain expertise & scientific impact" color="#8b5cf6" icon={Dna} />
                  <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                          <ChartCard title="Scientific Distribution" icon={PieChartIcon} subtitle="Institutional Research Strengths">
                              <ResponsiveContainer width="100%" height={280} minHeight={0}>
                                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.radarData}>
                                      <PolarGrid stroke="#e2e8f0" />
                                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                      <Radar
                                          name="Research Depth"
                                          dataKey="A"
                                          stroke={instColor}
                                          fill={instColor}
                                          fillOpacity={0.5}
                                      />
                                      <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                  </RadarChart>
                              </ResponsiveContainer>
                          </ChartCard>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                          <ChartCard title="Regional Talent" icon={MapPin} subtitle="Geographic distribution of candidates">
                              <ResponsiveContainer width="100%" height={280} minHeight={0}>
                                  <BarChart data={stats.geoData} layout="vertical" margin={{ left: 20 }}>
                                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                      <XAxis type="number" hide />
                                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: '#1e293b' }} />
                                      <Tooltip cursor={{ fill: 'transparent' }} />
                                      <Bar dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={24}>
                                          {stats.geoData.map((_, index) => (
                                              <Cell key={`cell-${index}`} fillOpacity={1 - (index * 0.15)} fill={instColor} />
                                          ))}
                                      </Bar>
                                  </BarChart>
                              </ResponsiveContainer>
                          </ChartCard>
                      </Grid>
                  </Grid>
                </Box>
            </Grid>

            {/* SECTION 3: Detailed Audit Logs */}
            <Grid size={{ xs: 12 }}>
                <Box sx={{ mt: 4, pageBreakBefore: 'always' }}>
                  <SectionHeader title="Audit Verification Logs" subtitle="Verified initiatives and talent pool" color="#10b981" icon={ShieldCheck} />
                  
                  <Stack spacing={6}>
                      <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 1000, mb: 3, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <FileText size={20} color={instColor} /> Research Portfolio Log
                          </Typography>
                          <TableContainer component={Paper} sx={{ borderRadius: 0.5, border: '1.5px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
                              <Table>
                                  <TableHead>
                                      <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                          <TableCell sx={{ fontWeight: 900, color: '#64748b', fontSize: '0.75rem', py: 2 }}>PROJECT REFERENCE</TableCell>
                                          <TableCell sx={{ fontWeight: 900, color: '#64748b', fontSize: '0.75rem' }}>PRINCIPAL LEAD</TableCell>
                                          <TableCell sx={{ fontWeight: 900, color: '#64748b', fontSize: '0.75rem' }}>TARGET / DOMAIN</TableCell>
                                          <TableCell align="right" sx={{ fontWeight: 900, color: '#64748b', fontSize: '0.75rem' }}>CAPITAL (INR)</TableCell>
                                          <TableCell sx={{ fontWeight: 900, color: '#64748b', fontSize: '0.75rem' }}>PROGRESS</TableCell>
                                          <TableCell align="center" sx={{ fontWeight: 900, color: '#64748b', fontSize: '0.75rem' }}>STATUS</TableCell>
                                      </TableRow>
                                  </TableHead>
                                  <TableBody>
                                      {stats.instProjects.map((p) => (
                                          <TableRow key={p.id} hover onClick={() => setSelectedProject(p)} sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}>
                                              <TableCell sx={{ py: 2 }}>
                                                  <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: '0.85rem', mb: 0.5 }}>{p.title}</Typography>
                                                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>REF: {p.id}</Typography>
                                              </TableCell>
                                              <TableCell>
                                                  <Stack direction="row" spacing={1.5} alignItems="center">
                                                      <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: `${instColor}10`, color: instColor, fontWeight: 900, borderRadius: 0.5 }}>{p.lead.split(' ').pop()?.charAt(0)}</Avatar>
                                                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{p.lead}</Typography>
                                                  </Stack>
                                              </TableCell>
                                              <TableCell>
                                                  <Chip label={p.scientificDetails?.targetProtein || p.projectType} size="small" sx={{ fontWeight: 800, borderRadius: 0.5, bgcolor: '#f1f5f9', color: '#475569', px: 1 }} />
                                              </TableCell>
                                              <TableCell align="right">
                                                  <Typography sx={{ fontWeight: 950, color: '#0f172a', fontSize: '0.85rem' }}>{formatCurrency(p.totalFunding)}</Typography>
                                              </TableCell>
                                              <TableCell sx={{ width: 140 }}>
                                                  <Stack direction="row" spacing={1.5} alignItems="center">
                                                      <LinearProgress variant="determinate" value={p.progress} sx={{ flexGrow: 1, height: 6, borderRadius: 0.5, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: instColor, borderRadius: 0.5 } }} />
                                                      <Typography variant="caption" sx={{ fontWeight: 1000, minWidth: 28 }}>{p.progress}%</Typography>
                                                  </Stack>
                                              </TableCell>
                                              <TableCell align="center">
                                                  <Chip 
                                                      label={p.status} 
                                                      size="small" 
                                                      icon={p.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                      sx={{ 
                                                          fontWeight: 900, 
                                                          borderRadius: 0.5,
                                                          px: 1,
                                                          bgcolor: p.status === 'Completed' ? '#ecfdf5' : '#eff6ff',
                                                          color: p.status === 'Completed' ? '#10b981' : '#3b82f6'
                                                      }} 
                                                  />
                                              </TableCell>
                                          </TableRow>
                                      ))}
                                  </TableBody>
                              </Table>
                          </TableContainer>
                      </Box>

                      <Box sx={{ pageBreakBefore: 'always', pt: 4 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 1000, mb: 3, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Users size={20} color={instColor} /> Candidate Engagement Log
                          </Typography>
                          <TableContainer component={Paper} sx={{ borderRadius: 0.5, border: '1.5px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
                              <Table>
                                  <TableHead>
                                      <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                          <TableCell sx={{ fontWeight: 900, color: '#64748b', py: 2, fontSize: '0.75rem' }}>CANDIDATE NAME</TableCell>
                                          <TableCell sx={{ fontWeight: 900, color: '#64748b', fontSize: '0.75rem' }}>ENROLLMENT / ID</TableCell>
                                          <TableCell sx={{ fontWeight: 900, color: '#64748b', fontSize: '0.75rem' }}>DEPARTMENT</TableCell>
                                          <TableCell sx={{ fontWeight: 900, color: '#64748b', fontSize: '0.75rem' }}>TYPE</TableCell>
                                          <TableCell align="right" sx={{ fontWeight: 900, color: '#64748b', fontSize: '0.75rem' }}>FEE MANAGED</TableCell>
                                          <TableCell align="center" sx={{ fontWeight: 900, color: '#64748b', fontSize: '0.75rem' }}>STATUS</TableCell>
                                      </TableRow>
                                  </TableHead>
                                  <TableBody>
                                      {stats.instStudents.map((s) => (
                                          <TableRow key={s.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                              <TableCell sx={{ py: 2 }}>
                                                  <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: '0.85rem', mb: 0.5 }}>{s.name}</Typography>
                                                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>{s.email}</Typography>
                                              </TableCell>
                                              <TableCell>
                                                  <Typography variant="caption" sx={{ fontWeight: 900, bgcolor: '#f1f5f9', px: 1, py: 0.5, borderRadius: 0.5, color: '#475569' }}>{s.enrollmentNumber}</Typography>
                                              </TableCell>
                                              <TableCell><Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{s.department}</Typography></TableCell>
                                              <TableCell>
                                                  <Chip label={s.enrollmentType} size="small" variant="outlined" sx={{ fontWeight: 800, borderRadius: 0.5, height: 22 }} />
                                              </TableCell>
                                              <TableCell align="right">
                                                  <Typography sx={{ fontWeight: 1000, color: '#0f172a', fontSize: '0.85rem' }}>{formatCurrency(s.totalFee || 0)}</Typography>
                                              </TableCell>
                                              <TableCell align="center">
                                                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                                      <Box sx={{ width: 8, height: 8, borderRadius: 0, bgcolor: s.status === 'Active' ? '#10b981' : '#94a3b8' }} />
                                                      <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>{s.status}</Typography>
                                                  </Box>
                                              </TableCell>
                                          </TableRow>
                                      ))}
                                  </TableBody>
                              </Table>
                          </TableContainer>
                      </Box>
                  </Stack>
                </Box>
            </Grid>
        </Grid>

        {/* --- PAGE FOOTER / VERIFICATION AREA --- */}
        <Box sx={{ mt: 'auto', pt: 6, borderTop: '3px solid #0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pageBreakBefore: 'avoid' }}>
            <Box sx={{ maxWidth: 500 }}>
                <Typography variant="h6" sx={{ fontWeight: 1000, color: '#0f172a', letterSpacing: '-0.01em', mb: 1.5 }}>Verification & Compliance</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.6, display: 'block', mb: 3 }}>
                    This Silico Report is electronically generated and verified by Insilicomics Research Systems. 
                    Data is protected by proprietary confidentiality agreements and serves as a certified record of institutional performance.
                </Typography>
                <Stack direction="row" spacing={4} alignItems="center">
                    <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ border: '1.5px solid #e2e8f0', p: 1, borderRadius: 0.5, mb: 1, bgcolor: '#fff' }}>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=VERIFIED-SILICO-AUDIT" alt="QR Code" style={{ width: 70, height: 70 }} />
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 1000, color: instColor, letterSpacing: 1, fontSize: '0.65rem' }}>VERIFY AUDIT</Typography>
                    </Box>
                    <Box sx={{ pt: 1 }}>
                        <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 900, display: 'block', mb: 1, letterSpacing: 2 }}>CERTIFIED BY</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 1000, fontStyle: 'italic', color: '#0f172a', display: 'block', lineHeight: 1 }}>Dr. Vivek Chandramohan</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 1000, color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Chief Research Auditor • IRSL-99</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 1000, color: '#0f172a', fontSize: '0.65rem', mt: 1, display: 'block' }}>ELECTRONICALLY SIGNED SRB-CERT-99021-INS</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: instColor, fontSize: '0.65rem', display: 'block', textTransform: 'uppercase' }}>INSILICOMICS SYSTEMS AUDIT BOARD</Typography>
                    </Box>
                </Stack>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h4" sx={{ fontWeight: 1000, color: '#0f172a', letterSpacing: 2 }}>INSILICOMICS</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 950, color: instColor, letterSpacing: 4, display: 'block', mb: 1 }}>RESEARCH SYSTEMS</Typography>
                <Typography variant="caption" sx={{ fontWeight: 1000, color: '#94a3b8', display: 'block', mb: 2, letterSpacing: 1 }}>© 2026 INSILICOMICS SYSTEMS • ALL RIGHTS RESERVED</Typography>
                <Box sx={{ display: 'inline-flex', bgcolor: '#f8fafc', p: 1.5, borderRadius: 0.5, border: '1px solid #e2e8f0' }}>
                  <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 900, fontSize: '0.65rem' }}>RELEASE V2.8 • JAN 2026</Typography>
                </Box>
            </Box>
        </Box>
      </Box>

        <ProjectActivitiesDialog 
            open={!!selectedProject} 
            onClose={() => setSelectedProject(null)} 
            project={selectedProject} 
            onUpdateProject={onUpdateProject} 
            users={users}
            servers={servers}
        />
    </Box>
  );
};

export default InstitutionDashboard;