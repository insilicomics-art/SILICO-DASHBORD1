import React, { useMemo } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Button, 
  Stack,
  Paper,
  Avatar
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  Legend,
  AreaChart, Area,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar
} from 'recharts';
import { institutionColors, institutionCountries } from '../data/mockData';
import type { Project, ClientProfile, Student, Payment } from '../data/mockData';
import {
  Download,
  TrendingUp,
  BarChart3,
  Clock,
  Zap,
  Activity,
  CreditCard
} from 'lucide-react';

interface AnalyticsProps {
  projects: Project[];
  clientProfiles: ClientProfile[];
  students: Student[];
  payments: Payment[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  servers: any[];
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatTooltipValue = (value: any) => formatCurrency(Number(value));

interface CustomPayload {
    value: number | string;
    name: string;
    color: string;
    fill: string;
    payload: unknown;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: CustomPayload[]; label?: string }) => {
  if (active && payload && payload.length) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = payload[0].payload as any;
    return (
      <Paper sx={{ p: 1.5, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', borderRadius: 0.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {label || data.name || data.title}
        </Typography>
        {payload.map((entry: CustomPayload, index: number) => {
          const value = entry.value;
          let name = entry.name;

          if (name === 'uv') name = 'Progress';
          if (name === 'x') name = 'Funding';
          if (name === 'y') name = 'Progress';
          if (name === 'pending') name = 'Pending Amount';
          if (name === 'received') name = 'Received Amount';
          
          const displayValue = typeof value === 'number' && (name.includes('Funding') || name.includes('Amount') || name.includes('Research') || name.includes('Fee')) 
            ? formatCurrency(value) 
            : typeof value === 'number' && name.includes('Progress') ? `${value.toFixed(1)}%` : value;

          return (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: 0, bgcolor: entry.color || entry.fill }} />
              <Typography variant="body2" color="text.secondary">
                {name}: <span style={{ fontWeight: 600, color: '#0f172a' }}>{displayValue}</span>
              </Typography>
            </Box>
          );
        })}
        {data.institution && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, borderTop: '1px solid #f1f5f9', pt: 0.5 }}>
            Institution: {data.institution}
          </Typography>
        )}
      </Paper>
    );
  }
  return null;
};

const Analytics: React.FC<AnalyticsProps> = ({ projects, students, payments, clientProfiles }) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });


  const kpis = useMemo(() => {
    const totalProjects = projects.length;
    const projectFunding = projects.reduce((sum, p) => sum + p.totalFunding, 0);
    const projectReceived = projects.reduce((sum, p) => sum + (p.firstPaymentAmount || 0) + (p.finalPaymentAmount || 0), 0);
    const studentFunding = students.reduce((sum, s) => sum + (s.totalFee || 0), 0);
    const studentReceived = students.reduce((sum, s) => sum + (s.firstPaymentAmount || 0) + (s.finalPaymentAmount || 0), 0);
    
    const commonReceived = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const totalFunding = projectFunding + studentFunding;
    const totalReceived = projectReceived + studentReceived + commonReceived;
    const totalPending = Math.max(0, totalFunding - totalReceived);
    
    const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / (totalProjects || 1);
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const successRate = (completedProjects / (totalProjects || 1)) * 100;

    return [
      { label: 'Total Projects', value: totalProjects, icon: <Activity />, color: '#0ea5e9' },
      { label: 'Total Funding', value: formatCurrency(totalFunding), icon: <BarChart3 />, color: '#10b981' },
      { label: 'Pending Amount', value: formatCurrency(totalPending), icon: <Clock />, color: '#ef4444' },
      { label: 'Avg. Progress', value: `${avgProgress.toFixed(1)}%`, icon: <TrendingUp />, color: '#f59e0b' },
      { label: 'Success Rate', value: `${successRate.toFixed(1)}%`, icon: <Zap />, color: '#ec4899' }
    ];
  }, [projects, students, payments]);
  const projectStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [projects]);

  const revenueByTypeData = useMemo(() => {
    const revenue: Record<string, number> = {};
    projects.forEach(p => {
      revenue[p.projectType] = (revenue[p.projectType] || 0) + p.totalFunding;
    });
          return Object.entries(revenue)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8);
      }, [projects]);
    
      const topInstitutionsData = useMemo(() => {    const revenue: Record<string, number> = {};
    projects.forEach(p => {
      revenue[p.institution] = (revenue[p.institution] || 0) + p.totalFunding;
    });
    return Object.entries(revenue)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [projects]);

  const topLeadsData = useMemo(() => {
    const funding: Record<string, number> = {};
    projects.forEach(p => {
      funding[p.lead] = (funding[p.lead] || 0) + p.totalFunding;
    });
    return Object.entries(funding)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [projects]);

  const activitiesByUserData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach(p => {
      p.activities?.forEach(a => {
        const user = a.assignedTo || 'Unassigned';
        counts[user] = (counts[user] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [projects]);

  const serverEngineRadarData = useMemo(() => {
      const engineMap: Record<string, { subject: string; [key: string]: number | string }> = {};
      const serverSet = new Set<string>();

      projects.forEach(p => {
          p.activities?.forEach(a => {
              if (a.server && a.simulationEngine) {
                  if (!engineMap[a.simulationEngine]) engineMap[a.simulationEngine] = { subject: a.simulationEngine };
                  engineMap[a.simulationEngine][a.server] = ((engineMap[a.simulationEngine][a.server] as number) || 0) + 1;
                  serverSet.add(a.server);
              }
          });
      });
      
      const servers = Array.from(serverSet);
      Object.values(engineMap).forEach(entry => {
          servers.forEach(srv => {
              if (!entry[srv]) entry[srv] = 0;
          });
      });

      return { data: Object.values(engineMap), servers };
  }, [projects]);

  const studentTrendData = useMemo(() => {
      const trends: Record<string, number> = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentYear = new Date().getFullYear();
      months.forEach(m => trends[`${m} ${currentYear}`] = 0);

      students.forEach(s => {
          if (s.enrollmentDate) {
              const date = new Date(s.enrollmentDate);
              const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
              if (trends[key] !== undefined) trends[key]++;
          }
      });
      return Object.entries(trends).map(([name, value]) => ({ name, value }));
  }, [students]);

  const officeMonthlyRevenue = useMemo(() => {
    const data: Record<string, { 
        name: string; 
        Ooty_WithGST: number; 
        Ooty_WithoutGST: number; 
        Coimbatore_WithGST: number; 
        Coimbatore_WithoutGST: number; 
        dateObj: Date 
    }> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const process = (dateStr: string | undefined, amount: number | undefined, office: string, gstType: string | undefined) => {
        if (!dateStr || !amount || !office) return;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return;

        const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
        if (!data[key]) {
            data[key] = { 
                name: key, 
                Ooty_WithGST: 0, 
                Ooty_WithoutGST: 0, 
                Coimbatore_WithGST: 0, 
                Coimbatore_WithoutGST: 0, 
                dateObj: date 
            };
        }
        
        const isGST = gstType === 'With GST';
        
        if (office === 'Ooty') {
            if (isGST) data[key].Ooty_WithGST += amount;
            else data[key].Ooty_WithoutGST += amount;
        } else if (office === 'Coimbatore') {
            if (isGST) data[key].Coimbatore_WithGST += amount;
            else data[key].Coimbatore_WithoutGST += amount;
        }
    };

    projects.forEach(p => {
        process(p.firstPaymentDate, p.firstPaymentAmount, p.office, p.gstType);
        process(p.finalPaymentDate, p.finalPaymentAmount, p.office, p.gstType);
    });

    students.forEach(s => {
        process(s.firstPaymentDate, s.firstPaymentAmount, s.office, s.gstType);
        process(s.finalPaymentDate, s.finalPaymentAmount, s.office, s.gstType);
    });

    return Object.values(data).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  }, [projects, students]);

  const gstDistributionData = useMemo(() => {
      const data: Record<string, number> = { 'With GST': 0, 'Without GST': 0 };
      const process = (amount: number | undefined, gst: string | undefined) => {
          if (!amount) return;
          const type = gst === 'With GST' ? 'With GST' : 'Without GST';
          data[type] += amount;
      };
      
      projects.forEach(p => {
          process(p.firstPaymentAmount, p.gstType);
          process(p.finalPaymentAmount, p.gstType);
      });
      students.forEach(s => {
          process(s.firstPaymentAmount, s.gstType);
          process(s.finalPaymentAmount, s.gstType);
      });

      return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [projects, students]);


  const studentEnrollmentData = useMemo(() => {
      const counts: Record<string, number> = {};
      students.forEach(s => {
          const type = s.enrollmentType || 'Other';
          counts[type] = (counts[type] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [students]);

  const studentModeData = useMemo(() => {
      const counts: Record<string, number> = {};
      students.forEach(s => {
          const mode = s.mode || 'Offline';
          counts[mode] = (counts[mode] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [students]);

  const studentsByInstitution = useMemo(() => {
      const counts: Record<string, number> = {};
      students.forEach(s => {
          const inst = s.university || 'Unknown';
          counts[inst] = (counts[inst] || 0) + 1;
      });
      return Object.keys(counts).map(inst => ({
          name: inst,
          students: counts[inst],
          fill: institutionColors[inst] || '#8884d8'
      })).sort((a, b) => b.students - a.students).slice(0, 10);
  }, [students]);

  const studentsByCity = useMemo(() => {
      const counts: Record<string, number> = {};
      students.forEach(s => {
          const city = s.city || 'Unknown';
          counts[city] = (counts[city] || 0) + 1;
      });
      return Object.entries(counts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
  }, [students]);

  const paymentModeData = useMemo(() => {
    const counts: Record<string, number> = {};
    const addCount = (mode: string | undefined) => {
      if (mode) {
        counts[mode] = (counts[mode] || 0) + 1;
      }
    };
    projects.forEach(p => addCount(p.paymentMode));
    students.forEach(s => addCount(s.paymentMode));
    
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [projects, students]);

  const bankUsageData = useMemo(() => {
    const counts: Record<string, number> = {};
    const addCount = (bank: string | undefined) => {
        if (bank) {
            counts[bank] = (counts[bank] || 0) + 1;
        }
    };
    projects.forEach(p => addCount(p.bankDetails));
    students.forEach(s => addCount(s.bankDetails));

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [projects, students]);

  const countryRevenueData = useMemo(() => {
    const revenue: Record<string, number> = {};
    
    // Process Projects
    projects.forEach(p => {
      let country = institutionCountries[p.institution];
      if (!country) {
          // Try to find client profile
          const client = clientProfiles.find(c => c.name === p.clientName);
          country = client?.country || 'India';
      }
      revenue[country] = (revenue[country] || 0) + p.totalFunding;
    });

    // Process Students
    students.forEach(s => {
      const country = s.country || 'India';
      revenue[country] = (revenue[country] || 0) + s.totalFee;
    });

    return Object.entries(revenue)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [projects, students, clientProfiles]);

  const studentColors = ['#f59e0b', '#ec4899', '#8b5cf6', '#0ea5e9', '#10b981', '#6366f1'];

  return (
    <Box sx={{ 
      p: 2, 
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
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 600, height: 600, borderRadius: 3, bgcolor: '#2563eb', opacity: 0.03 }} />
        <Box sx={{ position: 'absolute', bottom: -150, left: -150, width: 500, height: 500, borderRadius: 3, border: '40px solid rgba(37, 99, 235, 0.05)' }} />
        
        <Box sx={{ height: '45%', bgcolor: '#0f172a', color: '#fff', p: 10, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 10, bgcolor: '#2563eb' }} />
            
            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 8 }}>
                <Box sx={{ bgcolor: '#2563eb', p: 1.5, borderRadius: 1.5 }}>
                    <Zap size={48} color="#fff" strokeWidth={1.5} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 1000, letterSpacing: 8, textTransform: 'uppercase', lineHeight: 1 }}>SILICO</Typography>
                  <Typography variant="caption" sx={{ letterSpacing: 4, fontWeight: 700, color: '#2563eb' }}>ANALYTICS & INTELLIGENCE</Typography>
                </Box>
            </Stack>

            <Typography variant="overline" sx={{ color: '#2563eb', fontWeight: 900, fontSize: '1.2rem', letterSpacing: 10, mb: 3, display: 'block', opacity: 0.9 }}>
                GLOBAL PERFORMANCE AUDIT
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: 950, fontSize: '5.5rem', color: '#fff', letterSpacing: '-0.05em', lineHeight: 0.85, mb: 6 }}>
                Business <br />
                Intelligence <br />
                Report 2026.
            </Typography>
        </Box>

        <Box sx={{ px: 10, py: 12 }}>
            <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 800, letterSpacing: 4, mb: 2, display: 'block' }}>R E P O R T   S C O P E</Typography>
            <Typography variant="h2" sx={{ fontWeight: 950, color: '#0f172a', mb: 1, letterSpacing: '-0.02em', textTransform: 'uppercase', fontSize: '3rem' }}>
                Full Ecosystem
            </Typography>
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>Cross-Institutional Analysis • Financials • Infrastructure</Typography>
            
            <Box sx={{ p: 5, borderLeft: '6px solid #2563eb', bgcolor: '#f8fafc', borderRadius: 1.5, mt: 6, mb: 10 }}>
                <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8, fontSize: '1.2rem', fontWeight: 500 }}>
                    "This aggregate audit synthesizes performance data across the entire Insilicomics research ecosystem. 
                    It provides a high-fidelity overview of project distributions, revenue realization, and strategic infrastructure utilization."
                </Typography>
            </Box>

            <Grid container spacing={6}>
                <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 900, letterSpacing: 2, display: 'block', mb: 1.5 }}>AUDIT CYCLE</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>ANNUAL 2025-26</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 900, letterSpacing: 2, display: 'block', mb: 1.5 }}>GENERATED ON</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>{today}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 900, letterSpacing: 2, display: 'block', mb: 1.5 }}>CLASSIFICATION</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#2563eb' }}>PROPRIETARY BI</Typography>
                </Grid>
            </Grid>
        </Box>
      </Box>

      {/* --- PAGE 2+: ANALYTICS CONTENT --- */}
      <Box sx={{ 
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }} className="no-print">
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Interactive Analytics</Typography>
            <Typography variant="body2" color="text.secondary">Institutional performance and funding trends.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Download size={18} />} onClick={() => window.print()} sx={{ borderRadius: 0.5, textTransform: 'none', fontWeight: 600, px: 3 }}>Export Report</Button>
      </Box>

      <Grid container spacing={2} className="print-row">
        {kpis.map((kpi, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={index} className="print-col">
            <Paper sx={{ 
              p: 2.5, 
              border: '1.5px solid #e2e8f0', 
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)', 
              borderRadius: 2.5, 
              bgcolor: '#fff',
              transition: 'all 0.2s ease',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderColor: '#cbd5e1' }
            }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: `${kpi.color}15`, color: kpi.color, borderRadius: 1.5, width: 40, height: 40 }}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {React.cloneElement(kpi.icon as React.ReactElement<any>, { size: 20, strokeWidth: 2.5 })}
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 1000, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.65rem' }}>{kpi.label}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 1000, color: '#0f172a', lineHeight: 1.1 }}>{kpi.value}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} className="print-row" sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, md: 4 }} className="print-col">
            <Paper sx={{ p: 3, borderRadius: 2.5, border: '1.5px solid #e2e8f0', height: 400, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 1000, textTransform: 'uppercase', letterSpacing: 1.5, color: '#0f172a' }}>Project Pipeline</Typography>
                <Box sx={{ flexGrow: 1, minHeight: 250 }}>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={projectStatusData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" strokeWidth={0}>
                                {projectStatusData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 0.5, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} formatter={formatTooltipValue} />
                            <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700, paddingTop: '20px' }} />
                        </PieChart>                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }} className="print-col">
            <Paper sx={{ p: 3, borderRadius: 2.5, border: '1.5px solid #e2e8f0', height: 400, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 1000, textTransform: 'uppercase', letterSpacing: 1.5, color: '#0f172a' }}>Revenue by Domain</Typography>
                <Box sx={{ flexGrow: 1, minHeight: 250 }}>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={revenueByTypeData} layout="vertical" margin={{ left: 40, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#1e293b', fontSize: 10, fontWeight: 800 }} width={100} />
                            <Tooltip contentStyle={{ borderRadius: 0.5, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} formatter={formatTooltipValue} />
                            <Bar dataKey="value" fill="#8b5cf6" radius={[0, 1, 1, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Grid>
      </Grid>

      <Typography variant="caption" sx={{ fontWeight: 900, color: '#000', mb: 1, mt: 4, textTransform: 'uppercase', display: 'block' }}>Leadership & Strategy</Typography>
      <Grid container spacing={3} className="print-row">
          <Grid size={{ xs: 12, md: 6 }} className="print-col">
              <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #cbd5e1', height: 400, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" fontWeight="900" sx={{ mb: 1, textTransform: 'uppercase' }}>Top Research Leads (Total Funding)</Typography>
                  <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                      <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                              <Pie 
                                data={topLeadsData} 
                                cx="50%"
                                cy="45%"
                                innerRadius={60} 
                                outerRadius={90} 
                                paddingAngle={5} 
                                dataKey="value" 
                                stroke="none"
                                label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                              >
                                  {topLeadsData.map((_, index) => (
                                      <Cell key={`cell-${index}`} fill={['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                                  ))}
                              </Pie>
                              <Tooltip formatter={formatTooltipValue} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                              <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                          </PieChart>
                      </ResponsiveContainer>
                  </Box>
              </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} className="print-col">
              <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #cbd5e1', height: 400, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" fontWeight="900" sx={{ mb: 1, textTransform: 'uppercase' }}>Activities Assigned To</Typography>
                  <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                      <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={activitiesByUserData} layout="vertical" margin={{ left: 40, right: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                              <XAxis type="number" hide />
                              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#000', fontSize: 10, fontWeight: 700 }} width={100} />
                              <Tooltip />
                              <Bar dataKey="value" fill="#ec4899" radius={[0, 1, 1, 0]} barSize={20} />
                          </BarChart>
                      </ResponsiveContainer>
                  </Box>
              </Paper>
          </Grid>
      </Grid>

      <Typography variant="caption" sx={{ fontWeight: 900, color: '#000', mb: 1, mt: 4, textTransform: 'uppercase', display: 'block' }}>Financial Operations</Typography>
      <Grid container spacing={3} className="print-row">
          <Grid size={{ xs: 12, md: 6 }} className="print-col">
              <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #cbd5e1', height: 400, display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <CreditCard size={16} />
                      <Typography variant="caption" fontWeight="900" sx={{ textTransform: 'uppercase' }}>Payment Mode Distribution</Typography>
                  </Stack>
                  <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                      <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                              <Pie 
                                  data={paymentModeData} 
                                  innerRadius={60} 
                                  outerRadius={100} 
                                  paddingAngle={5} 
                                  dataKey="value" 
                                  stroke="none"
                                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                              >
                                  {paymentModeData.map((_, index) => (
                                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                                  ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                              <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                          </PieChart>
                      </ResponsiveContainer>
                  </Box>
              </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} className="print-col">
              <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #cbd5e1', height: 400, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" fontWeight="900" sx={{ mb: 1, textTransform: 'uppercase' }}>Bank Account Usage</Typography>
                  <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                      <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={bankUsageData} layout="vertical" margin={{ left: 40, right: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                              <XAxis type="number" hide />
                              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#000', fontSize: 10, fontWeight: 700 }} width={120} />
                              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                              <Bar dataKey="value" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                      </ResponsiveContainer>
                  </Box>
              </Paper>
          </Grid>
      </Grid>

      <Grid container spacing={3} className="print-row" sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, md: 8 }} className="print-col">
            <Paper sx={{ p: 3, borderRadius: 2.5, border: '1.5px solid #e2e8f0', height: 'auto', minHeight: 600, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 1000, textTransform: 'uppercase', letterSpacing: 1.5, color: '#0f172a' }}>Office-wise Monthly Revenue Trends</Typography>
                
                <Grid container spacing={3} sx={{ flexGrow: 1 }}>
                    {/* Ooty (GST) */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, height: 250 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#7c3aed', mb: 1, display: 'block' }}>OOTY (GST)</Typography>
                            <ResponsiveContainer width="100%" height="90%">
                                <BarChart data={officeMonthlyRevenue} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }} formatter={(val: any) => [formatCurrency(Number(val)), 'Revenue']} labelStyle={{ fontWeight: 800, color: '#1e293b' }} />
                                    <Bar dataKey="Ooty_WithGST" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={25} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Grid>

                    {/* Ooty (No GST) */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, height: 250 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#c4b5fd', mb: 1, display: 'block' }}>OOTY (NO GST)</Typography>
                            <ResponsiveContainer width="100%" height="90%">
                                <BarChart data={officeMonthlyRevenue} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }} formatter={(val: any) => [formatCurrency(Number(val)), 'Revenue']} labelStyle={{ fontWeight: 800, color: '#1e293b' }} />
                                    <Bar dataKey="Ooty_WithoutGST" fill="#c4b5fd" radius={[4, 4, 0, 0]} barSize={25} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Grid>

                    {/* Coimbatore (GST) */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, height: 250 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669', mb: 1, display: 'block' }}>COIMBATORE (GST)</Typography>
                            <ResponsiveContainer width="100%" height="90%">
                                <BarChart data={officeMonthlyRevenue} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }} formatter={(val: any) => [formatCurrency(Number(val)), 'Revenue']} labelStyle={{ fontWeight: 800, color: '#1e293b' }} />
                                    <Bar dataKey="Coimbatore_WithGST" fill="#059669" radius={[4, 4, 0, 0]} barSize={25} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Grid>

                    {/* Coimbatore (No GST) */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, height: 250 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#6ee7b7', mb: 1, display: 'block' }}>COIMBATORE (NO GST)</Typography>
                            <ResponsiveContainer width="100%" height="90%">
                                <BarChart data={officeMonthlyRevenue} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }} formatter={(val: any) => [formatCurrency(Number(val)), 'Revenue']} labelStyle={{ fontWeight: 800, color: '#1e293b' }} />
                                    <Bar dataKey="Coimbatore_WithoutGST" fill="#6ee7b7" radius={[4, 4, 0, 0]} barSize={25} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} className="print-col">
            <Paper sx={{ p: 3, borderRadius: 2.5, border: '1.5px solid #e2e8f0', height: 400, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 1000, textTransform: 'uppercase', letterSpacing: 1.5, color: '#0f172a' }}>GST Revenue Distribution</Typography>
                <Box sx={{ flexGrow: 1, minHeight: 250 }}>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={gstDistributionData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                <Cell fill="#3b82f6" />
                                <Cell fill="#f59e0b" />
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700, paddingTop: '20px' }} />
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                                <tspan x="50%" dy="-1em" fontSize="24" fontWeight="bold" fill="#0f172a">{formatCurrency(gstDistributionData.reduce((sum, item) => sum + item.value, 0))}</tspan>
                                <tspan x="50%" dy="1.5em" fontSize="12" fill="#64748b" fontWeight="600">Total Revenue</tspan>
                            </text>
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Grid>
      </Grid>

      <Typography variant="caption" sx={{ fontWeight: 900, color: '#000', mb: 1, mt: 4, textTransform: 'uppercase', display: 'block' }}>Student Analytics</Typography>
      <Grid container spacing={3} className="print-row">
        <Grid size={{ xs: 12, md: 4 }} className="print-col">
            <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #cbd5e1', height: 450, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" fontWeight="900" sx={{ mb: 1, textTransform: 'uppercase' }}>Enrollment Types</Typography>
                <Box sx={{ flexGrow: 1, minHeight: 350 }}>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie 
                                data={studentEnrollmentData} 
                                innerRadius={60} 
                                outerRadius={90} 
                                paddingAngle={5} 
                                dataKey="value" 
                                stroke="none"
                                label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                            >
                                {studentEnrollmentData.map((_, index) => (<Cell key={`cell-${index}`} fill={studentColors[index % studentColors.length]} />))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Grid>

         <Grid size={{ xs: 12, md: 4 }} className="print-col">
            <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #cbd5e1', height: 450, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" fontWeight="900" sx={{ mb: 1, textTransform: 'uppercase' }}>Enrollment Mode</Typography>
                <Box sx={{ flexGrow: 1, minHeight: 350 }}>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie 
                                data={studentModeData} 
                                innerRadius={0} 
                                outerRadius={90} 
                                dataKey="value" 
                                stroke="none"
                                label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                            >
                                {studentModeData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={['#0ea5e9', '#6366f1', '#10b981'][index % 3]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Grid>

         <Grid size={{ xs: 12, md: 4 }} className="print-col">
            <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #cbd5e1', height: 450, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" fontWeight="900" sx={{ mb: 1, textTransform: 'uppercase' }}>By Institution</Typography>
                <Box sx={{ flexGrow: 1, minHeight: 350 }}>
                    <ResponsiveContainer width="100%" height={350}>
                         <BarChart data={studentsByInstitution} layout="vertical" margin={{ left: 10, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#000', fontSize: 9, fontWeight: 700 }} width={80} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="students" fill="#8884d8" radius={[0, 1, 1, 0]} barSize={15}>
                                {studentsByInstitution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Grid>
         <Grid size={{ xs: 12, md: 12 }} className="print-col">
            <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #cbd5e1', height: 450, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" fontWeight="900" sx={{ mb: 1, textTransform: 'uppercase' }}>Student Enrollment Trend</Typography>
                <Box sx={{ flexGrow: 1, minHeight: 350 }}>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={studentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="studentColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#studentColor)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Grid>
         <Grid size={{ xs: 12, md: 12 }} className="print-col">
            <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #cbd5e1', height: 450, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" fontWeight="900" sx={{ mb: 1, textTransform: 'uppercase' }}>Student Distribution by City</Typography>
                <Box sx={{ flexGrow: 1, minHeight: 350 }}>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={studentsByCity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30}>
                                {studentsByCity.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Grid>
      </Grid>

      <Typography variant="caption" sx={{ fontWeight: 900, color: '#000', mb: 1, mt: 4, textTransform: 'uppercase', display: 'block' }}>Global Operations</Typography>
      <Grid container spacing={3} className="print-row">
          <Grid size={{ xs: 12, md: 12 }} className="print-col">
              <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #cbd5e1', height: 500, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" fontWeight="900" sx={{ mb: 1, textTransform: 'uppercase' }}>Top Countries by Revenue</Typography>
                  <Box sx={{ flexGrow: 1, minHeight: 400 }}>
                      <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={countryRevenueData} layout="vertical" margin={{ left: 40, right: 40, top: 20, bottom: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                              <XAxis type="number" hide />
                              <YAxis 
                                type="category" 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#0f172a', fontSize: 11, fontWeight: 700 }} 
                                width={100} 
                              />
                              <Tooltip 
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                formatter={formatTooltipValue}
                              />
                              <Bar 
                                dataKey="value" 
                                fill="#3b82f6" 
                                radius={[0, 4, 4, 0]} 
                                barSize={32}
                              >
                                {countryRevenueData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#f59e0b', '#f97316', '#ef4444', '#ec4899', '#8b5cf6'][index % 10]} />
                                ))}
                              </Bar>
                          </BarChart>
                      </ResponsiveContainer>
                  </Box>
              </Paper>
          </Grid>
      </Grid>

      <Typography variant="caption" sx={{ fontWeight: 900, color: '#000', mb: 1, mt: 4, textTransform: 'uppercase', display: 'block' }}>Infrastructure & Key Accounts</Typography>
      <Grid container spacing={3} className="print-row">
          <Grid size={{ xs: 12, md: 12 }} className="print-col">
              <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #cbd5e1', height: 600, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" fontWeight="900" sx={{ mb: 1, textTransform: 'uppercase' }}>Server Engine Profile</Typography>
                  <Box sx={{ flexGrow: 1, minHeight: 500 }}>
                      <ResponsiveContainer width="100%" height={500}>
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={serverEngineRadarData.data}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                              <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                              {serverEngineRadarData.servers.map((server, index) => (
                                  <Radar
                                      key={server}
                                      name={server}
                                      dataKey={server}
                                      stroke={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]}
                                      fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]}
                                      fillOpacity={0.2}
                                  />
                              ))}
                              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                          </RadarChart>
                      </ResponsiveContainer>
                  </Box>
              </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} className="print-col">
              <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #cbd5e1', height: 400, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" fontWeight="900" sx={{ mb: 1, textTransform: 'uppercase' }}>Top Institutions (Radial Revenue)</Typography>
                  <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                      <ResponsiveContainer width="100%" height={300}>
                          <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={20} data={topInstitutionsData.map((d, i) => ({ ...d, fill: ['#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][i % 5] }))}>
                              <RadialBar
                                  label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 700 }}
                                  background
                                  dataKey="value"
                              />
                              <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ fontSize: '10px', fontWeight: 600 }} align="right" />
                              <Tooltip formatter={formatTooltipValue} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                          </RadialBarChart>
                      </ResponsiveContainer>
                  </Box>
              </Paper>
          </Grid>
      </Grid>

      <Box className="print-only" sx={{ display: 'none', mt: 'auto', pt: 5, borderTop: '3px solid #0f172a', pageBreakBefore: 'avoid' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box sx={{ maxWidth: 500 }}>
                <Typography variant="h6" sx={{ fontWeight: 1000, color: '#0f172a', letterSpacing: '-0.01em', mb: 1.5 }}>Audit Certification</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.6, display: 'block', mb: 3 }}>
                    This Silico Analytics Report is electronically generated and verified. 
                    Proprietary data is governed by the Insilicomics research protection standards.
                </Typography>
                <Stack direction="row" spacing={4} alignItems="center">
                    <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ border: '1.5px solid #e2e8f0', p: 1, borderRadius: 0.5, mb: 1, bgcolor: '#fff' }}>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=VERIFIED-ANALYTICS-AUDIT" alt="QR Code" style={{ width: 60, height: 60 }} />
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 1000, color: '#2563eb', letterSpacing: 1, fontSize: '0.65rem' }}>VERIFY AUDIT</Typography>
                    </Box>
                    <Box sx={{ pt: 1 }}>
                        <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 900, display: 'block', mb: 1, letterSpacing: 2 }}>RELEASED BY</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 1000, fontStyle: 'italic', color: '#0f172a', display: 'block', lineHeight: 1 }}>Business Intelligence Unit</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 1000, color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Insilicomics Research Private Limited</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 1000, color: '#0f172a', fontSize: '0.65rem', mt: 1, display: 'block' }}>ELECTRONICALLY SIGNED SRB-CERT-99021-INS</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#2563eb', fontSize: '0.65rem', display: 'block', textTransform: 'uppercase' }}>INSILICOMICS SYSTEMS AUDIT BOARD</Typography>
                    </Box>
                </Stack>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h4" sx={{ fontWeight: 1000, color: '#0f172a', letterSpacing: 2 }}>INSILICOMICS</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 950, color: '#2563eb', letterSpacing: 4, display: 'block', mb: 1 }}>ANALYTICS ENGINE</Typography>
                <Typography variant="caption" sx={{ fontWeight: 1000, color: '#94a3b8', display: 'block', mb: 2, letterSpacing: 1 }}>© 2026 INSILICOMICS SYSTEMS • ALL RIGHTS RESERVED</Typography>
                <Box sx={{ display: 'inline-flex', bgcolor: '#f8fafc', p: 1.5, borderRadius: 0.5, border: '1px solid #e2e8f0' }}>
                  <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 900, fontSize: '0.65rem' }}>SYSTEMS RELEASE V2.8 • 2026</Typography>
                </Box>
            </Box>
        </Stack>
      </Box>
    </Box>
    </Box>
  );
};

export default Analytics;
