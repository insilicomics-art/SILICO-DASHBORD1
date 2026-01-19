import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Stack
} from '@mui/material';
import { 
  Plus, 
  Trash2, 
  Activity, 
  Layers, 
  Binary, 
  Dna, 
  Cpu, 
  FlaskConical, 
  Search,
  Puzzle,
  GraduationCap,
  MoreHorizontal,
  Presentation,
  Calculator,
  Network,
  Magnet,
  Award,
  BookOpen
} from 'lucide-react';
import { type Project } from '../data/mockData';

interface ProjectTypeTableProps {
  projectTypes: string[];
  projects: Project[];
  onAddProjectType: (type: string) => void;
  onDeleteProjectType: (type: string) => void;
  onSelectProjectType: (type: string) => void;
}

const typeIconMap: Record<string, React.ReactNode> = {
  'Molecular Dynamics': <Activity size={48} />,
  'Molecular Docking': <Magnet size={48} />,
  'Protein Protein Docking': <Puzzle size={48} />,
  'Homology Modelling': <Layers size={48} />,
  'NGS Data Analysis': <Binary size={48} />,
  'Genomic Sequencing': <Dna size={48} />,
  'Bioinformatics': <Cpu size={48} />,
  'Drug Discovery': <FlaskConical size={48} />,
  'Student Training': <GraduationCap size={48} />,
  'Workshop': <Presentation size={48} />,
  'VAP': <Award size={48} />,
  'Course': <BookOpen size={48} />,
  'QSAR': <Calculator size={48} />,
  'Network Pharmacology': <Network size={48} />,
  'etc...': <MoreHorizontal size={48} />,
  'Unspecified': <Search size={48} />
};

const typeColorMap: Record<string, string> = {
  'Molecular Dynamics': '#0ea5e9',
  'Molecular Docking': '#f59e0b',
  'Protein Protein Docking': '#6366f1',
  'Homology Modelling': '#8b5cf6',
  'NGS Data Analysis': '#10b981',
  'Genomic Sequencing': '#ec4899',
  'Bioinformatics': '#06b6d4',
  'Drug Discovery': '#f43f5e',
  'Student Training': '#fbbf24',
  'Workshop': '#8b5cf6',
  'VAP': '#f59e0b',
  'Course': '#14b8a6',
  'QSAR': '#3b82f6',
  'Network Pharmacology': '#10b981',
  'etc...': '#94a3b8',
  'Unspecified': '#cbd5e1'
};

const formatCurrency = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
  return `₹${val}`;
};

const ProjectTypeTable: React.FC<ProjectTypeTableProps> = ({ projectTypes, projects, onAddProjectType, onDeleteProjectType, onSelectProjectType }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newType, setNewType] = useState('');

  const handleAddClick = () => {
    if (!newType) return;
    onAddProjectType(newType);
    setNewType('');
    setIsDialogOpen(false);
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Project Types
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Manage and categorize your scientific research domains.
            </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={20} />} onClick={() => setIsDialogOpen(true)} sx={{ borderRadius: 2, px: 3 }}>
          Add New Type
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projectTypes.map((type) => {
            const typeProjects = projects.filter(p => p.projectType === type);
            const count = typeProjects.length;
            const activeCount = typeProjects.filter(p => p.status === 'Ongoing').length;
            const totalFunding = typeProjects.reduce((sum, p) => sum + p.totalFunding, 0);
            
            return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={type}>
                <Paper 
                    onClick={() => onSelectProjectType(type)}
                    sx={{ 
                        p: 4, 
                        position: 'relative',
                        borderRadius: 3,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        height: '100%',
                        minHeight: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        bgcolor: '#ffffff',
                        cursor: 'pointer',
                        '&:hover': {
                            borderColor: typeColorMap[type] || '#cbd5e1',
                            transform: 'translateY(-8px)',
                            boxShadow: `0 20px 25px -5px ${(typeColorMap[type] || '#64748b')}25`,
                            '& .icon-container': {
                                transform: 'scale(1.1)',
                                bgcolor: `${typeColorMap[type] || '#64748b'}15`
                            }
                        }
                    }}
                >
                    <Box 
                        className="icon-container"
                        sx={{ 
                            color: typeColorMap[type] || '#64748b',
                            display: 'flex',
                            p: 3,
                            borderRadius: '12px',
                            bgcolor: `${typeColorMap[type] || '#64748b'}10`,
                            transition: 'all 0.3s ease',
                            mb: 1
                        }}
                    >
                        {typeIconMap[type] || typeIconMap['Unspecified']}
                    </Box>
                    <Typography variant="h6" align="center" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.15rem', px: 1, lineHeight: 1.3 }}>
                        {type}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Tooltip title="Total Projects">
                            <Chip 
                                label={`${count} Projects`} 
                                size="small" 
                                sx={{ bgcolor: '#f1f5f9', fontWeight: 600, fontSize: '0.75rem' }} 
                            />
                        </Tooltip>
                    </Stack>
                    
                    <Stack direction="row" spacing={1}>
                         <Tooltip title="Active Projects">
                            <Chip 
                                label={`${activeCount} Active`} 
                                size="small" 
                                sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 600, fontSize: '0.75rem' }} 
                            />
                        </Tooltip>
                        <Tooltip title="Total Funding">
                            <Chip 
                                label={formatCurrency(totalFunding)} 
                                size="small" 
                                sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 600, fontSize: '0.75rem' }} 
                            />
                        </Tooltip>
                    </Stack>
                    
                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                        <Tooltip title="Delete Type">
                            <IconButton 
                                size="small" 
                                color="error" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteProjectType(type);
                                }}
                                sx={{ 
                                    opacity: 0.3, 
                                    '&:hover': { opacity: 1, bgcolor: '#fee2e2' } 
                                }}
                            >
                                <Trash2 size={16} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Paper>
            </Grid>
        );
        })}
        {projectTypes.length === 0 && (
            <Grid size={{ xs: 12 }} >
                <Paper sx={{ p: 5, textAlign: 'center', bgcolor: 'transparent', border: '2px dashed #e2e8f0', borderRadius: 4 }}>
                    <Typography color="textSecondary">No project types have been defined yet.</Typography>
                </Paper>
            </Grid>
        )}
      </Grid>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Project Type</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField 
              label="Project Type Name" 
              fullWidth 
              value={newType} 
              onChange={(e) => setNewType(e.target.value)} 
              helperText="e.g. Molecular Dynamics, NGS Analysis"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddClick}>Add Type</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectTypeTable;
