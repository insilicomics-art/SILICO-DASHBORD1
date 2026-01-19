import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  IconButton,
  Tooltip,
  Stack,
  Grid
} from '@mui/material';
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Activity, 
  Download, 
  Zap, 
  Layers, 
  Binary, 
  Dna, 
  Cpu, 
  FlaskConical,
  Puzzle,
  GraduationCap,
  MoreHorizontal,
  Presentation,
  BookOpen,
  Calculator,
  Network,
  FileSpreadsheet,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { institutionColors, type Project, type User } from '../data/mockData';
import ProjectFormDialog from './CreateProjectDialog';
import ProjectActivitiesDialog from './ProjectActivitiesDialog';
import { downloadCSV } from '../utils/csvExport';

const typeIconMap: Record<string, React.ReactNode> = {
  'Molecular Dynamics': <Activity size={16} />,
  'Molecular Docking': <Zap size={16} />,
  'Protein Protein Docking': <Puzzle size={16} />,
  'Homology Modelling': <Layers size={16} />,
  'NGS Data Analysis': <Binary size={16} />,
  'Genomic Sequencing': <Dna size={16} />,
  'Bioinformatics': <Cpu size={16} />,
  'Drug Discovery': <FlaskConical size={16} />,
  'Student Training': <GraduationCap size={16} />,
  'Workshop': <Presentation size={16} />,
  'Course': <BookOpen size={16} />,
  'VAP': <Zap size={16} />,
  'QSAR': <Calculator size={16} />,
  'Network Pharmacology': <Network size={16} />,
  'etc...': <MoreHorizontal size={16} />,
};

const getProjectTypeIcon = (type: string) => {
  return typeIconMap[type] || <Search size={16} />;
};

const statusColors: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
  'Ongoing': 'info',
  'Completed': 'success',
  'Planned': 'default',
  'Stopped': 'error'
};

interface OfficeStats {
  total: number;
  ongoing: number;
  completed: number;
  totalValue: number;
  received: number;
  pending: number;
}

const OfficeCard = ({ title, stats, color, icon, isSelected, onClick }: { title: string, stats: OfficeStats, color: string, icon: React.ReactNode, isSelected: boolean, onClick: () => void }) => {
  const statusData = [
    { name: 'Ongoing', value: stats.ongoing },
    { name: 'Completed', value: stats.completed },
  ];

  const financialData = [
    { name: 'Received', value: stats.received },
    { name: 'Pending', value: stats.pending },
  ];

  return (
    <Paper 
      elevation={isSelected ? 6 : 1}
      onClick={onClick}
      sx={{ 
        p: 2.5, 
        borderRadius: 4, 
        position: 'relative', 
        overflow: 'hidden', 
        border: isSelected ? `2px solid ${color}` : `2px solid transparent`,
        bgcolor: isSelected ? 'white' : 'rgba(255, 255, 255, 0.9)',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: isSelected ? `2px solid ${color}` : `2px solid ${color}30`,
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={2}>
          {/* Left Column: Info & Stats */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2.5}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: `${color}15`, 
                  borderRadius: 2, 
                  color: color,
                  display: 'flex'
                }}>
                  {icon}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ lineHeight: 1.1 }}>{title} Office</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>Location Overview</Typography>
                </Box>
              </Stack>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={800} display="block" sx={{ mb: 1, letterSpacing: 0.5 }}>PROJECT ECOSYSTEM</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">TOTAL</Typography>
                    <Typography variant="h6" fontWeight={800} color="#0f172a">{stats.total}</Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color={color} fontWeight={700} display="block">ONGOING</Typography>
                    <Typography variant="h6" fontWeight={800} color={color}>{stats.ongoing}</Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">DONE</Typography>
                    <Typography variant="h6" fontWeight={800} color="#64748b">{stats.completed}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={800} display="block" sx={{ mb: 1, letterSpacing: 0.5 }}>FINANCIAL SUMMARY</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">TOTAL</Typography>
                    <Typography variant="body1" fontWeight={800} color="#0f172a">₹{(stats.totalValue/1000).toFixed(0)}k</Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="success.main" fontWeight={700} display="block">RECV</Typography>
                    <Typography variant="body1" fontWeight={800} color="success.main">₹{(stats.received/1000).toFixed(0)}k</Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="error.main" fontWeight={700} display="block">PEND</Typography>
                    <Typography variant="body1" fontWeight={800} color="error.main">₹{(stats.pending/1000).toFixed(0)}k</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </Grid>

          {/* Right Column: Graphical Plots */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
              <Box sx={{ height: 100, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill={color} />
                      <Cell fill="#e2e8f0" />
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Typography variant="caption" align="center" display="block" fontWeight={700} color="text.secondary">Status Distribution</Typography>
              </Box>

              <Box sx={{ height: 100, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <RechartsTooltip formatter={(value: number | undefined) => value !== undefined ? `₹${(value/1000).toFixed(1)}k` : ''} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {financialData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Typography variant="caption" align="center" display="block" fontWeight={700} color="text.secondary">Financial Overview</Typography>
              </Box>
            </Box>
          </Grid>
          
          {isSelected && (
            <Box sx={{ position: 'absolute', right: 12, top: 12, bgcolor: color, color: 'white', borderRadius: '50%', p: 0.5, display: 'flex', boxShadow: `0 4px 10px ${color}40` }}>
                <CheckCircle size={16} />
            </Box>
          )}
        </Grid>
      </Box>
    </Paper>
  );
};
interface ProjectTableProps {
  projects: Project[];
  users: User[];
  clients: string[];
  clientNames: string[];
  projectTypes: string[];
  onAddProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  servers: any[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({ 
  projects, 
  users,
  clients,
  clientNames,
  projectTypes,
  onAddProject, 
  onUpdateProject, 
  onDeleteProject,
  servers
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInstitution, setFilterInstitution] = useState('All');
  const [filterClient, setFilterClient] = useState('All');
  const [filterProjectType, setFilterProjectType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterOffice, setFilterOffice] = useState('All');
  const [filterGST, setFilterGST] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Activities Dialog State
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const activityProject = projects.find(p => p.id === activeProjectId) || null;

  // Office Stats Calculation
  const getOfficeStats = (officeName: string) => {
    const officeProjects = projects.filter(p => p.office === officeName);
    const totalValue = officeProjects.reduce((acc, p) => acc + p.totalFunding, 0);
    const received = officeProjects.reduce((acc, p) => acc + (p.firstPaymentAmount || 0) + (p.finalPaymentAmount || 0), 0);
    
    return {
      total: officeProjects.length,
      ongoing: officeProjects.filter(p => p.status === 'Ongoing').length,
      completed: officeProjects.filter(p => p.status === 'Completed').length,
      totalValue,
      received,
      pending: totalValue - received
    };
  };

  const ootyStats = getOfficeStats('Ooty');
  const cbeStats = getOfficeStats('Coimbatore');

  const handleOfficeClick = (officeName: string) => {
    if (filterOffice === officeName) {
      setFilterOffice('All');
    } else {
      setFilterOffice(officeName);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.lead.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInst = filterInstitution === 'All' || p.institution === filterInstitution;
    const matchesClient = filterClient === 'All' || p.clientName === filterClient;
    const matchesType = filterProjectType === 'All' || p.projectType === filterProjectType;
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchesOffice = filterOffice === 'All' || p.office === filterOffice;
    const matchesGST = filterGST === 'All' || (filterGST === 'With GST' ? p.gstType === 'With GST' : (p.gstType === 'Without GST' || !p.gstType));
    
    return matchesSearch && matchesInst && matchesClient && matchesType && matchesStatus && matchesOffice && matchesGST;
  });

  const handleCreateOpen = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleEditOpen = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleActivitiesOpen = (project: Project) => {
    setActiveProjectId(project.id);
    setIsActivitiesOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    if (window.confirm(`Are you sure you want to delete project "${project.title}"?`)) {
      onDeleteProject(project.id);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Projects
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<FileSpreadsheet size={18} />}
            onClick={() => downloadCSV(projects, 'projects_data.csv')}
            className="no-print"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#10b981',
                color: '#10b981',
                bgcolor: '#f0fdf4'
              }
            }}
          >
            Export CSV
          </Button>

          <Button 
            variant="outlined" 
            startIcon={<Download size={18} />}
            onClick={() => window.print()}
            className="no-print"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#0ea5e9',
                color: '#0ea5e9',
                bgcolor: '#f0f9ff'
              }
            }}
          >
            Download Project Report
          </Button>

          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={handleCreateOpen}
          >
            Create New Project
          </Button>
        </Stack>
      </Box>

      {/* Office Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <OfficeCard 
            title="Ooty" 
            stats={ootyStats} 
            color="#10b981" 
            icon={<MapPin size={24} />} 
            isSelected={filterOffice === 'Ooty'}
            onClick={() => handleOfficeClick('Ooty')}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <OfficeCard 
            title="Coimbatore" 
            stats={cbeStats} 
            color="#3b82f6" 
            icon={<MapPin size={24} />} 
            isSelected={filterOffice === 'Coimbatore'}
            onClick={() => handleOfficeClick('Coimbatore')}
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Search Projects"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          <TextField
            select
            label="Institution"
            size="small"
            value={filterInstitution}
            onChange={(e) => setFilterInstitution(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="All">All Institutions</MenuItem>
            {clients.map((client) => (
              <MenuItem key={client} value={client}>
                {client}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Client"
            size="small"
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="All">All Clients</MenuItem>
            {clientNames.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Project Type"
            size="small"
            value={filterProjectType}
            onChange={(e) => setFilterProjectType(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="All">All Types</MenuItem>
            {projectTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="GST Type"
            size="small"
            value={filterGST}
            onChange={(e) => setFilterGST(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="All">All GST Types</MenuItem>
            <MenuItem value="With GST">With GST</MenuItem>
            <MenuItem value="Without GST">Without GST</MenuItem>
          </TextField>
          <TextField
            select
            label="Status"
            size="small"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="Ongoing">Ongoing</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Planned">Planned</MenuItem>
            <MenuItem value="Stopped">Stopped</MenuItem>
          </TextField>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Project ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Project Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Institution</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Lead Researcher</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Funding</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Pending</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Progress</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 140 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#f9f9f9' } }}
              >
                <TableCell>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontFamily: 'monospace' }}>
                    {row.id}
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Typography 
                    variant="body2" 
                    sx={{ fontWeight: 500, cursor: 'pointer', '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}
                    onClick={() => handleActivitiesOpen(row)}
                  >
                    {row.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', color: 'text.secondary' }}>
                      {getProjectTypeIcon(row.projectType)}
                    </Box>
                    <Typography variant="body2">{row.projectType}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: institutionColors[row.institution],
                        mr: 1
                      }} 
                    />
                    {row.institution}
                  </Box>
                </TableCell>
                <TableCell>{row.clientName}</TableCell>
                <TableCell>{row.lead}</TableCell>
                <TableCell>{row.startDate}</TableCell>
                <TableCell>₹{row.totalFunding.toLocaleString('en-IN')}</TableCell>
                <TableCell sx={{ color: (row.totalFunding - (row.firstPaymentAmount || 0) - (row.finalPaymentAmount || 0)) > 0 ? 'error.main' : 'success.main', fontWeight: 600 }}>
                  ₹{(row.totalFunding - (row.firstPaymentAmount || 0) - (row.finalPaymentAmount || 0)).toLocaleString('en-IN')}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    color={statusColors[row.status]} 
                    size="small" 
                    variant="outlined" 
                  />
                </TableCell>
                 <TableCell>
                    {row.progress}%
                 </TableCell>
                 <TableCell>
                   <Box sx={{ display: 'flex' }}>
                      <Tooltip title="Activities">
                        <IconButton size="small" onClick={() => handleActivitiesOpen(row)} color="info">
                          <Activity size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditOpen(row)} color="primary">
                          <Pencil size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDeleteClick(row)} color="error">
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                   </Box>
                 </TableCell>
              </TableRow>
            ))}
            {filteredProjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">No projects found matching your criteria.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ProjectFormDialog 
        key={editingProject?.id || 'new-project'}
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onCreate={onAddProject} 
        onEdit={onUpdateProject}
        projectToEdit={editingProject}
        availableUsers={users}
        availableClients={clients}
        availableClientNames={clientNames}
        availableProjectTypes={projectTypes}
      />
      
      <ProjectActivitiesDialog
        open={isActivitiesOpen}
        onClose={() => setIsActivitiesOpen(false)}
        project={activityProject}
        onUpdateProject={onUpdateProject}
        users={users}
        servers={servers}
      />

      {/* Print-only Report Footer */}
      <Box className="print-only" sx={{ mt: 8, pt: 2, borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, letterSpacing: 1 }}>
            Insilicomics Research Pvt Ltd
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectTable;