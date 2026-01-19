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
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
  Avatar,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Chip,
  LinearProgress,
  Stack
} from '@mui/material';
import { Search, Plus, Trash2, BarChart3, LayoutGrid, List as ListIcon, Pencil, FolderKanban, CheckSquare, FileSpreadsheet, User as UserIcon, Briefcase, X } from 'lucide-react';
import { type User, type Project } from '../data/mockData';
import UserAnalysis from './UserAnalysis';
import { downloadCSV } from '../utils/csvExport';

interface UserTableProps {
  users: User[];
  projects?: Project[];
  onAddUser: (user: User) => void;
  onUpdateUser?: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, projects = [], onAddUser, onUpdateUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<Partial<User>>({ name: '', role: '' });
  const [analyzingUser, setAnalyzingUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  if (analyzingUser) {
    return (
      <UserAnalysis 
        user={analyzingUser} 
        projects={projects} 
        onBack={() => setAnalyzingUser(null)} 
      />
    );
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserStats = (userName: string) => {
    const led = projects.filter(p => p.lead === userName).length;
    const activities = projects.reduce((acc, p) => {
      return acc + (p.activities?.filter(a => a.assignedTo === userName).length || 0);
    }, 0);
    
    // Calculate a "performance score" for the graphvch effect
    // Simple heuristic: led projects * 10 + activities * 2
    const score = Math.min((led * 10) + (activities * 2), 100);
    
    return { led, activities, score };
  };

  const handleOpenDialog = (mode: 'create' | 'edit', user?: User) => {
    setDialogMode(mode);
    if (mode === 'edit' && user) {
      setFormData({ ...user });
    } else {
      setFormData({ name: '', role: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.role) return;
    
    if (dialogMode === 'create') {
      onAddUser({
        id: `U${Math.floor(Math.random() * 10000)}`,
        name: formData.name,
        role: formData.role,
        avatar: formData.avatar
      });
    } else if (dialogMode === 'edit' && onUpdateUser && formData.id) {
      onUpdateUser(formData as User);
    }
    
    setIsDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Users</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
           <Button 
            variant="outlined" 
            startIcon={<FileSpreadsheet size={18} />} 
            onClick={() => downloadCSV(users, 'users_data.csv')}
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
           <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newView) => { if (newView) setViewMode(newView); }}
              size="small"
              sx={{ bgcolor: 'white' }}
            >
              <ToggleButton value="list">
                <ListIcon size={18} />
              </ToggleButton>
              <ToggleButton value="grid">
                <LayoutGrid size={18} />
              </ToggleButton>
            </ToggleButtonGroup>
          <Button variant="contained" startIcon={<Plus size={20} />} onClick={() => handleOpenDialog('create')}>
            Add New User
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          label="Search Users"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {viewMode === 'list' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Projects Led</TableCell>
                <TableCell>Tasks</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => {
                 const stats = getUserStats(user.name);
                 return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar>{user.name.charAt(0)}</Avatar>
                        <Typography variant="body1" fontWeight="500">{user.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{stats.led}</TableCell>
                    <TableCell>{stats.activities}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton color="default" onClick={() => handleOpenDialog('edit', user)} sx={{ mr: 1 }}>
                          <Pencil size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Analyze">
                        <IconButton color="primary" onClick={() => setAnalyzingUser(user)} sx={{ mr: 1 }}>
                          <BarChart3 size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => onDeleteUser(user.id)}>
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((user) => {
            const stats = getUserStats(user.name);
            
            // Generate a consistent theme based on user name
            const CARD_THEMES = [
              { gradient: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)', primary: '#3b82f6', chipColor: '#2563eb', chipBg: 'rgba(59, 130, 246, 0.1)' }, // Blue
              { gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', primary: '#10b981', chipColor: '#059669', chipBg: 'rgba(16, 185, 129, 0.1)' }, // Emerald
              { gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', primary: '#8b5cf6', chipColor: '#7c3aed', chipBg: 'rgba(139, 92, 246, 0.1)' }, // Violet
              { gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', primary: '#f59e0b', chipColor: '#d97706', chipBg: 'rgba(245, 158, 11, 0.1)' }, // Amber
              { gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)', primary: '#ec4899', chipColor: '#db2777', chipBg: 'rgba(236, 72, 153, 0.1)' }, // Pink
              { gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)', primary: '#06b6d4', chipColor: '#0891b2', chipBg: 'rgba(6, 182, 212, 0.1)' }  // Cyan
            ];
            
            const themeIndex = user.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const theme = CARD_THEMES[themeIndex % CARD_THEMES.length];

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={user.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    borderRadius: 3, 
                    position: 'relative', 
                    overflow: 'visible',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                    border: '1px solid #e2e8f0',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    bgcolor: '#fff',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.1)',
                      borderColor: theme.primary
                    }
                  }}
                >
                  <Box sx={{ height: 6, background: theme.gradient, borderRadius: '12px 12px 0 0' }} />
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4, px: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        bgcolor: '#fff', 
                        color: theme.primary,
                        fontSize: '2rem', 
                        fontWeight: 800,
                        mb: 2,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #f1f5f9'
                      }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                    
                    <Typography variant="h6" fontWeight={800} align="center" sx={{ color: '#0f172a', lineHeight: 1.2, mb: 0.5 }}>{user.name}</Typography>
                    <Chip 
                      label={user.role} 
                      size="small" 
                      sx={{ 
                        mb: 3, 
                        fontWeight: 700, 
                        bgcolor: theme.chipBg, 
                        color: theme.chipColor,
                        borderRadius: 1.5,
                        fontSize: '0.7rem',
                        height: 24
                      }} 
                    />
                    
                    <Box sx={{ width: '100%', mb: 3 }}>
                       <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="caption" fontWeight={700} sx={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Performance</Typography>
                          <Typography variant="caption" fontWeight={800} sx={{ color: theme.primary }}>{stats.score}%</Typography>
                       </Stack>
                       <LinearProgress 
                          variant="determinate" 
                          value={stats.score} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3, 
                            bgcolor: '#f1f5f9',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              background: theme.gradient
                            }
                          }} 
                        />
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 3, width: '100%' }}>
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ 
                          p: 1.5, 
                          borderRadius: 2, 
                          bgcolor: '#f8fafc', 
                          border: '1px solid #f1f5f9',
                          textAlign: 'center'
                        }}>
                          <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1, color: '#0f172a', mb: 0.5 }}>{stats.led}</Typography>
                          <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
                             <FolderKanban size={12} color="#64748b" />
                             <Typography variant="caption" fontWeight={700} sx={{ color: '#64748b', fontSize: '0.65rem' }}>PROJECTS</Typography>
                          </Stack>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ 
                          p: 1.5, 
                          borderRadius: 2, 
                          bgcolor: '#f8fafc', 
                          border: '1px solid #f1f5f9',
                          textAlign: 'center'
                        }}>
                          <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1, color: '#0f172a', mb: 0.5 }}>{stats.activities}</Typography>
                          <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
                             <CheckSquare size={12} color="#64748b" />
                             <Typography variant="caption" fontWeight={700} sx={{ color: '#64748b', fontSize: '0.65rem' }}>TASKS</Typography>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>

                    <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                        <Tooltip title="Edit Profile">
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpenDialog('edit', user)}
                            sx={{ 
                                borderRadius: 1.5, 
                                border: '1px solid #e2e8f0',
                                color: '#64748b',
                                '&:hover': { bgcolor: '#f8fafc', color: '#0f172a' } 
                            }}
                          >
                            <Pencil size={16} />
                          </IconButton>
                        </Tooltip>
                        <Button 
                          variant="contained" 
                          size="small" 
                          startIcon={<BarChart3 size={16} />}
                          onClick={() => setAnalyzingUser(user)}
                          sx={{ 
                            flexGrow: 1, 
                            borderRadius: 1.5, 
                            boxShadow: 'none',
                            background: theme.primary,
                            color: '#fff',
                            textTransform: 'none',
                            fontWeight: 700,
                            '&:hover': { background: theme.primary, filter: 'brightness(0.9)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }
                          }}
                        >
                          Analyze
                        </Button>
                        <Tooltip title="Delete User">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => onDeleteUser(user.id)}
                            sx={{ 
                                borderRadius: 1.5, 
                                border: '1px solid #fee2e2',
                                bgcolor: '#fef2f2',
                                color: '#ef4444', 
                                '&:hover': { bgcolor: '#fee2e2' } 
                            }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
            overflow: 'hidden',
            border: '1px solid rgba(99, 102, 241, 0.1)'
          }
        }}
      >
        <Box sx={{ 
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
          p: 3, 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              p: 1.2, 
              bgcolor: 'rgba(255, 255, 255, 0.15)', 
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)'
            }}>
              {dialogMode === 'create' ? <Plus size={24} /> : <Pencil size={24} />}
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                {dialogMode === 'create' ? 'Add New User' : 'Edit User Profile'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 500 }}>
                {dialogMode === 'create' ? 'Fill in details to register a new member' : 'Update the existing user information'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setIsDialogOpen(false)} sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
            <X size={20} />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, mt: 1 }}>
            <TextField 
              label="Full Name" 
              fullWidth 
              variant="outlined"
              placeholder="e.g. John Doe"
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <UserIcon size={20} color="#8b5cf6" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: '#fcfaff',
                  '&:hover fieldset': { borderColor: '#8b5cf6' },
                  '&.Mui-focused fieldset': { borderColor: '#8b5cf6' }
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#8b5cf6' }
              }}
            />
            <TextField 
              label="Role / Designation" 
              fullWidth 
              variant="outlined"
              placeholder="e.g. Senior Researcher"
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})} 
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Briefcase size={20} color="#8b5cf6" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: '#fcfaff',
                  '&:hover fieldset': { borderColor: '#8b5cf6' },
                  '&.Mui-focused fieldset': { borderColor: '#8b5cf6' }
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#8b5cf6' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3.5, bgcolor: '#fcfaff', borderTop: '1px solid #f3f0ff' }}>
          <Button 
            onClick={() => setIsDialogOpen(false)}
            sx={{ 
              color: '#64748b', 
              fontWeight: 600,
              textTransform: 'none',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{ 
              px: 5, 
              py: 1.2,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.4)'
              }
            }}
          >
            {dialogMode === 'create' ? 'Create User' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserTable;
