import React, { useState, useMemo } from 'react';
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
  InputAdornment,
  Stack,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import { 
  Plus, 
  Trash2, 
  Building2, 
  School, 
  GraduationCap, 
  Search, 
  Briefcase, 
  Users, 
  DollarSign, 
  ArrowRight,
  TrendingUp,
  Globe
} from 'lucide-react';
import { institutionColors } from '../data/mockData';

import { type Project, type Student } from '../data/mockData';

interface ClientTableProps {
  clients: string[];
  projects: Project[];
  students: Student[];
  onAddClient: (client: string) => void;
  onDeleteClient: (client: string) => void;
  onSelectClient: (client: string) => void;
}

const getInstitutionIcon = (name: string) => {
    if (name.toLowerCase().includes('vit') || name.toLowerCase().includes('university')) return <School size={48} />;
    if (name.toLowerCase().includes('tech') || name.toLowerCase().includes('institute')) return <GraduationCap size={48} />;
    return <Building2 size={48} />;
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumSignificantDigits: 3 
  }).format(val);
};

const SummaryCard = ({ title, value, icon, color, subtitle }: any) => (
  <Card sx={{ height: '100%', borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${color}15`, color: color }}>
          {icon}
        </Box>
        <Chip 
          label={subtitle} 
          size="small" 
          sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#64748b' }} 
        />
      </Stack>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-0.02em' }}>{value}</Typography>
      <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>{title}</Typography>
    </CardContent>
  </Card>
);

const ClientTable: React.FC<ClientTableProps> = ({ clients, projects, students, onAddClient, onDeleteClient, onSelectClient }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    return clients.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [clients, searchQuery]);

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalStudents = students.length;
    const totalFunding = projects.reduce((acc, p) => acc + p.totalFunding, 0);
    return { totalProjects, totalStudents, totalFunding };
  }, [projects, students]);

  const handleAddClick = () => {
    if (!newClient) return;
    onAddClient(newClient);
    setNewClient('');
    setIsDialogOpen(false);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100%' }}>
      {/* Hero Section */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h3" sx={{ fontWeight: 950, color: '#0f172a', letterSpacing: '-0.03em', mb: 1.5 }}>
                Partner Institutions
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.5, mb: 4, maxWidth: 600 }}>
                Manage and analyze research collaborations with global academic and corporate partners. 
                Track institutional performance and research capital.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="contained" 
                startIcon={<Plus size={20} />} 
                onClick={() => setIsDialogOpen(true)} 
                sx={{ borderRadius: 2.5, px: 4, py: 1.5, fontSize: '0.95rem', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)' }}
              >
                Register Institution
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ 
                position: 'absolute', 
                top: -20, 
                right: -20, 
                width: 200, 
                height: 200, 
                bgcolor: 'primary.main', 
                opacity: 0.05, 
                borderRadius: '50%',
                zIndex: 0
              }} />
              <Grid container spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                <Grid size={{ xs: 6 }}>
                  <SummaryCard 
                    title="Total Partners" 
                    value={clients.length} 
                    icon={<Globe size={24} />} 
                    color="#3b82f6"
                    subtitle="Active"
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <SummaryCard 
                    title="Total Research" 
                    value={formatCurrency(stats.totalFunding)} 
                    icon={<TrendingUp size={24} />} 
                    color="#10b981"
                    subtitle="Capital"
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search institutions..."
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ 
            bgcolor: '#fff', 
            borderRadius: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '& fieldset': { borderColor: '#e2e8f0' },
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#94a3b8" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredClients.map((client) => {
            const color = institutionColors[client] || '#64748b';
            const instProjects = projects.filter(p => p.institution === client);
            const instStudents = students.filter(s => s.university === client);
            const totalFunding = instProjects.reduce((acc, p) => acc + p.totalFunding, 0);
            return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={client}>
                    <Paper 
                        onClick={() => onSelectClient(client)}
                        sx={{ 
                            p: 3, 
                            position: 'relative',
                            borderRadius: 2.5,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: '#ffffff',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            '&:hover': {
                                borderColor: color,
                                transform: 'translateY(-12px)',
                                boxShadow: `0 30px 60px -12px ${color}15, 0 18px 36px -18px ${color}20`,
                                '& .icon-wrapper': {
                                    transform: 'scale(1.1) rotate(5deg)',
                                    bgcolor: `${color}15`
                                },
                                '& .arrow-icon': {
                                  transform: 'translateX(4px)',
                                  opacity: 1
                                }
                            }
                        }}
                    >
                        {/* Status Chip */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                          <Box 
                              className="icon-wrapper"
                              sx={{ 
                                  color: color,
                                  display: 'flex',
                                  p: 1.5,
                                  borderRadius: '16px',
                                  bgcolor: `${color}10`,
                                  transition: 'all 0.4s ease'
                              }}
                          >
                              {getInstitutionIcon(client)}
                          </Box>
                          <Chip 
                            label="PRO" 
                            size="small" 
                            sx={{ fontWeight: 900, bgcolor: `${color}10`, color: color, borderRadius: 1.5, fontSize: '0.65rem' }} 
                          />
                        </Box>
                        
                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.1rem', mb: 1, lineHeight: 1.2, height: '2.4em', overflow: 'hidden' }}>
                            {client}
                        </Typography>

                        <Stack spacing={1.5} sx={{ mt: 'auto' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Briefcase size={14} color="#64748b" />
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Projects</Typography>
                              </Stack>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a' }}>{instProjects.length}</Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Users size={14} color="#64748b" />
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Students</Typography>
                              </Stack>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a' }}>{instStudents.length}</Typography>
                            </Box>

                            <Divider sx={{ borderStyle: 'dashed' }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <DollarSign size={14} color={color} />
                                <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 800 }}>Valuation</Typography>
                              </Stack>
                              <Typography variant="caption" sx={{ fontWeight: 900, color: color }}>
                                {formatCurrency(totalFunding)}
                              </Typography>
                            </Box>
                        </Stack>

                        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: color, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            View Silico Audit <ArrowRight size={14} className="arrow-icon" style={{ transition: 'all 0.3s ease', opacity: 0.5 }} />
                          </Typography>
                          
                          <Tooltip title="De-register Institution">
                              <IconButton 
                                  size="small" 
                                  color="error" 
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteClient(client);
                                  }}
                                  sx={{ 
                                      opacity: 0.2, 
                                      '&:hover': { opacity: 1, bgcolor: '#fee2e2' } 
                                  }}
                              >
                                  <Trash2 size={14} />
                              </IconButton>
                          </Tooltip>
                        </Box>
                    </Paper>
                </Grid>
            );
        })}
        {filteredClients.length === 0 && (
            <Grid size={{ xs: 12 }} >
                <Paper sx={{ p: 8, textAlign: 'center', bgcolor: '#fff', border: '2px dashed #e2e8f0', borderRadius: 2.5 }}>
                    <Box sx={{ color: '#94a3b8', mb: 2 }}>
                      <Search size={48} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#475569' }}>No institutions match your search</Typography>
                    <Typography color="textSecondary">Try adjusting your keywords or register a new partner.</Typography>
                </Paper>
            </Grid>
        )}
      </Grid>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2.5 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Register New Partner</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Register a new academic or corporate partner to begin tracking research initiatives and student engagements.
            </Typography>
            <TextField 
              label="Institution Name" 
              fullWidth 
              autoFocus
              value={newClient} 
              onChange={(e) => setNewClient(e.target.value)} 
              placeholder="e.g. Stanford University or Pfizer"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsDialogOpen(false)} sx={{ fontWeight: 700 }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddClick} sx={{ fontWeight: 800, borderRadius: 2, px: 4 }}>Confirm Registration</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientTable;
