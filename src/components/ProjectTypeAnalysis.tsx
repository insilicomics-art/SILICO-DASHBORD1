import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Activity, 
  Clock, 
  Database, 
  Cpu, 
  TrendingUp, 
  FileText,
  FlaskConical,
  Layers,
  Binary,
  Dna,
  Search,
  Puzzle,
  GraduationCap,
  Presentation,
  Calculator,
  Network,
  MoreHorizontal,
  ArrowLeft,
  Magnet,
  Award,
  BookOpen
} from 'lucide-react';
import { type Project } from '../data/mockData';
import { Button } from '@mui/material';

interface ProjectTypeAnalysisProps {
  projectType: string;
  projects: Project[];
  onBack: () => void;
}

const typeIconMap: Record<string, React.ReactNode> = {
  'Molecular Dynamics': <Activity />,
  'Molecular Docking': <Magnet />,
  'Protein Protein Docking': <Puzzle />,
  'Homology Modelling': <Layers />,
  'NGS Data Analysis': <Binary />,
  'Genomic Sequencing': <Dna />,
  'Bioinformatics': <Cpu />,
  'Drug Discovery': <FlaskConical />,
  'Student Training': <GraduationCap />,
  'Workshop': <Presentation />,
  'VAP': <Award />,
  'Course': <BookOpen />,
  'QSAR': <Calculator />,
  'Network Pharmacology': <Network />,
  'etc...': <MoreHorizontal />,
  'Unspecified': <Search />
};

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);
};

const ProjectTypeAnalysis: React.FC<ProjectTypeAnalysisProps> = ({ projectType, projects, onBack }) => {
  const typeProjects = useMemo(() => 
    projects.filter(p => p.projectType === projectType),
    [projects, projectType]
  );

  const stats = useMemo(() => {
    const total = typeProjects.length;
    const completed = typeProjects.filter(p => p.status === 'Completed').length;
    const ongoing = typeProjects.filter(p => p.status === 'Ongoing').length;
    const totalFunding = typeProjects.reduce((acc, p) => acc + p.totalFunding, 0);
    const avgProgress = total > 0 ? typeProjects.reduce((acc, p) => acc + p.progress, 0) / total : 0;
    
    return { total, completed, ongoing, totalFunding, avgProgress };
  }, [typeProjects]);

  const institutionData = useMemo(() => {
    const counts: Record<string, number> = {};
    typeProjects.forEach(p => {
      counts[p.institution] = (counts[p.institution] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [typeProjects]);

  const timelineData = useMemo(() => {
    const months: Record<string, number> = {};
    typeProjects.forEach(p => {
      const date = new Date(p.startDate);
      const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      months[key] = (months[key] || 0) + 1;
    });
    return Object.entries(months).map(([name, value]) => ({ name, value }));
  }, [typeProjects]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    typeProjects.forEach(p => {
        counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [typeProjects]);

  const officeData = useMemo(() => {
      const counts: Record<string, number> = {};
      typeProjects.forEach(p => {
          counts[p.office] = (counts[p.office] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [typeProjects]);

  const leadData = useMemo(() => {
      const counts: Record<string, number> = {};
      typeProjects.forEach(p => {
          counts[p.lead] = (counts[p.lead] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5); // Top 5
  }, [typeProjects]);

  // Specific metrics for Molecular Dynamics
  const mdMetrics = useMemo(() => {
    if (projectType !== 'Molecular Dynamics') return null;
    
    const engines: Record<string, number> = {};
    let totalAtomsAccumulator = 0;
    let totalTimeAccumulator = 0;
    let projectsCounted = 0;

    typeProjects.forEach(p => {
      let projectTime = 0;
      let projectAtoms = 0;
      let projectEngine = '';

      if (p.activities && p.activities.length > 0) {
        // Aggregate from activities
        p.activities.forEach(act => {
          projectTime += parseInt(act.duration.replace(/[^0-9]/g, '') || '0');
          // Use the largest atom count reported in activities as the project system size
          if (act.totalAtoms > projectAtoms) projectAtoms = act.totalAtoms;
          if (!projectEngine) projectEngine = act.simulationEngine || '';
          
          const engine = act.simulationEngine || 'Other';
          engines[engine] = (engines[engine] || 0) + 1;
        });
      } else if (p.scientificDetails) {
        // Fallback to project-level scientific details
        projectTime = p.scientificDetails.simulationTimeNs || 0;
        projectAtoms = p.scientificDetails.atomsCount || 0;
        projectEngine = p.scientificDetails.simulationEngine || 'Other';
        
        const engine = p.scientificDetails.simulationEngine || 'Other';
        engines[engine] = (engines[engine] || 0) + 1;
      }

      if (projectAtoms > 0 || projectTime > 0) {
        totalAtomsAccumulator += projectAtoms;
        totalTimeAccumulator += projectTime;
        projectsCounted++;
      }
    });

    return {
      engines: Object.entries(engines).map(([name, value]) => ({ name, value })),
      avgAtoms: projectsCounted > 0 ? Math.round(totalAtomsAccumulator / projectsCounted) : 0,
      totalNs: totalTimeAccumulator,
      avgNs: projectsCounted > 0 ? Math.round(totalTimeAccumulator / projectsCounted) : 0
    };
  }, [typeProjects, projectType]);

  // Specific metrics for Molecular Docking
  const dockingMetrics = useMemo(() => {
    if (projectType !== 'Molecular Docking') return null;

    const engines: Record<string, number> = {};
    let totalLigands = 0;
    let totalScore = 0;
    let projectsWithDetails = 0;

    typeProjects.forEach(p => {
      if (p.activities && p.activities.length > 0) {
        p.activities.forEach(act => {
          const engine = act.simulationEngine || 'Other';
          engines[engine] = (engines[engine] || 0) + 1;
        });
      }

      if (p.scientificDetails) {
        const engine = p.scientificDetails.simulationEngine || 'Other';
        if (!p.activities || p.activities.length === 0) {
          engines[engine] = (engines[engine] || 0) + 1;
        }
        if (p.scientificDetails.ligandCount) totalLigands += p.scientificDetails.ligandCount;
        if (p.scientificDetails.dockingScore) totalScore += p.scientificDetails.dockingScore;
        projectsWithDetails++;
      }
    });

    return {
      engines: Object.entries(engines).map(([name, value]) => ({ name, value })),
      totalLigands,
      avgScore: projectsWithDetails > 0 ? (totalScore / projectsWithDetails).toFixed(2) : 0
    };
  }, [typeProjects, projectType]);

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100%' }}>
      <Button 
        startIcon={<ArrowLeft size={18} />} 
        onClick={onBack}
        sx={{ mb: 3, color: '#64748b', fontWeight: 600 }}
      >
        Back to Project Types
      </Button>

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6', width: 56, height: 56 }}>
          {typeIconMap[projectType] || <Activity />}
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            {projectType} Analysis
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Deep dive into activity-specific performance and scientific metrics.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6', borderRadius: 2 }}>
                  <FileText />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                    Total Projects
                  </Typography>
                  <Typography variant="h5" fontWeight="800">{stats.total}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: '#ecfdf5', color: '#10b981', borderRadius: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                    Avg. Progress
                  </Typography>
                  <Typography variant="h5" fontWeight="800">{Math.round(stats.avgProgress)}%</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: '#fff7ed', color: '#f59e0b', borderRadius: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                    Total Funding
                  </Typography>
                  <Typography variant="h5" fontWeight="800">{formatCurrency(stats.totalFunding)}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: '#fdf2f8', color: '#ec4899', borderRadius: 2 }}>
                  <Activity />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                    Success Rate
                  </Typography>
                  <Typography variant="h5" fontWeight="800">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%', borderRadius: 3, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Status Breakdown</Typography>
                    <Box sx={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%', borderRadius: 3, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Office Distribution</Typography>
                     <Box sx={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={officeData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {officeData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>
        </Grid>

         <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%', borderRadius: 3, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Top Lead Scientists</Typography>
                     <Box sx={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={leadData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
      </Grid>

      {(mdMetrics || dockingMetrics) && (
        <Grid container spacing={3} sx={{ mb: 4 }} className="print-row">
          <Grid size={{ xs: 12, md: 4 }} className="print-col">
            <Card sx={{ height: '100%', borderRadius: 3, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Simulation Engines</Typography>
                <Box sx={{ height: 250, minHeight: 250 }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <PieChart>
                      <Pie
                        data={mdMetrics?.engines || dockingMetrics?.engines}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {(mdMetrics?.engines || dockingMetrics?.engines || []).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }} className="print-col" sx={{ flex: '2 1 0px !important' }}>
            <Grid container spacing={3} className="print-row">
              {mdMetrics && (
                <>
                  <Grid size={{ xs: 12, sm: 4 }} className="print-col">
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, bgcolor: '#ffffff' }}>
                      <Avatar sx={{ bgcolor: '#f0fdf4', color: '#16a34a', mx: 'auto', mb: 2 }}>
                        <Database />
                      </Avatar>
                      <Typography variant="h4" fontWeight="800">{mdMetrics.avgAtoms.toLocaleString()}</Typography>
                      <Typography variant="body2" color="text.secondary">Avg. Atom Count</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }} className="print-col">
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, bgcolor: '#ffffff' }}>
                      <Avatar sx={{ bgcolor: '#fef2f2', color: '#dc2626', mx: 'auto', mb: 2 }}>
                        <Clock />
                      </Avatar>
                      <Typography variant="h4" fontWeight="800">{mdMetrics.totalNs.toLocaleString()}ns</Typography>
                      <Typography variant="body2" color="text.secondary">Total Simulation Time</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }} className="print-col">
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, bgcolor: '#ffffff' }}>
                      <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb', mx: 'auto', mb: 2 }}>
                        <Cpu />
                      </Avatar>
                      <Typography variant="h4" fontWeight="800">{mdMetrics.avgNs.toLocaleString()}ns</Typography>
                      <Typography variant="body2" color="text.secondary">Avg. ns per Project</Typography>
                    </Paper>
                  </Grid>
                </>
              )}
              {dockingMetrics && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }} className="print-col">
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, bgcolor: '#ffffff' }}>
                      <Avatar sx={{ bgcolor: '#f0fdf4', color: '#16a34a', mx: 'auto', mb: 2 }}>
                        <FlaskConical />
                      </Avatar>
                      <Typography variant="h4" fontWeight="800">{dockingMetrics.totalLigands.toLocaleString()}</Typography>
                      <Typography variant="body2" color="text.secondary">Total Ligands Screened</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} className="print-col">
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, bgcolor: '#ffffff' }}>
                      <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb', mx: 'auto', mb: 2 }}>
                        <TrendingUp />
                      </Avatar>
                      <Typography variant="h4" fontWeight="800">{dockingMetrics.avgScore}</Typography>
                      <Typography variant="body2" color="text.secondary">Avg. Docking Score</Typography>
                    </Paper>
                  </Grid>
                </>
              )}
            </Grid>
            <Paper sx={{ mt: 3, p: 3, borderRadius: 3, bgcolor: '#ffffff' }}>
               <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Activity Timeline</Typography>
               <Box sx={{ height: 180, minHeight: 180 }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" name="New Projects" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
               </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3} className="print-row">
        <Grid size={{ xs: 12, md: 4 }} className="print-col">
          <Paper sx={{ p: 3, borderRadius: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Institutional Distribution</Typography>
            <Box sx={{ flexGrow: 1, minHeight: 300 }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <BarChart data={institutionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }} className="print-col">
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Project Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Institution</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">Progress</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Funding</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {typeProjects.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{p.title}</TableCell>
                    <TableCell>{p.institution}</TableCell>
                    <TableCell>
                      <Chip 
                        label={p.status} 
                        size="small"
                        sx={{ 
                          bgcolor: p.status === 'Completed' ? '#ecfdf5' : '#eff6ff',
                          color: p.status === 'Completed' ? '#10b981' : '#3b82f6',
                          fontWeight: 700,
                          borderRadius: 1
                        }} 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={700}>{p.progress}%</Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrency(p.totalFunding)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectTypeAnalysis;
