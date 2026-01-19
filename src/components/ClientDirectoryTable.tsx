import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Chip,
  Avatar,
  Stack,
  Divider,
  InputAdornment
} from '@mui/material';
import { Plus, Trash2, Pencil, Mail, Phone, MapPin, Building2, User, Search } from 'lucide-react';
import { type ClientProfile, departments, indianStates, stateCities } from '../data/mockData';

interface ClientDirectoryTableProps {
  clients: ClientProfile[];
  institutions: string[];
  onAddClient: (client: ClientProfile) => void;
  onUpdateClient: (client: ClientProfile) => void;
  onDeleteClient: (id: string) => void;
  onSelectClient: (client: ClientProfile) => void;
}

const ClientDirectoryTable: React.FC<ClientDirectoryTableProps> = ({ 
  clients, 
  institutions,
  onAddClient, 
  onUpdateClient, 
  onDeleteClient,
  onSelectClient
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<Partial<ClientProfile>>({
    name: '',
    university: '',
    department: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    status: 'Active'
  });

  const handleOpenDialog = (client?: ClientProfile) => {
    if (client) {
      setFormData(client);
      setEditingId(client.id);
    } else {
      setFormData({
        name: '',
        university: '',
        department: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        status: 'Active'
      });
      setEditingId(null);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.university) {
      alert('Name and University are required');
      return;
    }

    if (editingId) {
      onUpdateClient({ ...formData, id: editingId } as ClientProfile);
    } else {
      onAddClient({
        ...formData,
        id: `C${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`
      } as ClientProfile);
    }
    setIsDialogOpen(false);
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}>
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Client Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Detailed contact information for all research partners.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <TextField
                placeholder="Search clients..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ 
                    width: 300,
                    bgcolor: 'white',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                    }
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={18} color="#64748b" />
                            </InputAdornment>
                        ),
                    }
                }}
            />
            <Button variant="contained" startIcon={<Plus size={20} />} onClick={() => handleOpenDialog()} sx={{ borderRadius: 2, px: 3 }}>
                Add New Contact
            </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {filteredClients.map((client) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={client.id}>
                <Paper 
                    sx={{ 
                        p: 3, 
                        borderRadius: 3, 
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        position: 'relative',
                        transition: 'all 0.2s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 20px -10px rgba(0,0,0,0.1)',
                            borderColor: '#0891b2'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 4, cursor: 'pointer' }} onClick={() => onSelectClient(client)}>
                        <Avatar sx={{ bgcolor: '#ecfeff', color: '#0891b2', width: 80, height: 80, borderRadius: 2 }}>
                            <User size={48} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2, fontSize: '1.25rem', '&:hover': { color: '#0891b2' } }}>
                                {client.name}
                            </Typography>
                            <Chip 
                                label={client.status} 
                                size="small" 
                                sx={{ 
                                    height: 24, 
                                    fontSize: '0.7rem', 
                                    mt: 0.75,
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    bgcolor: client.status === 'Active' ? '#ecfdf5' : '#f1f5f9',
                                    color: client.status === 'Active' ? '#10b981' : '#64748b',
                                    border: 'none',
                                    px: 1
                                }} 
                            />
                        </Box>
                    </Box>

                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Building2 size={20} color="#0891b2" />
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>{client.university}</Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>{client.department}</Typography>
                            </Box>
                        </Box>
                        
                        <Divider sx={{ borderStyle: 'dashed' }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Mail size={20} color="#0891b2" />
                            <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>{client.email}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Phone size={20} color="#0891b2" />
                            <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>{client.phone}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <MapPin size={20} color="#0891b2" style={{ marginTop: 2 }} />
                            <Box>
                                <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500, lineHeight: 1.5 }}>{client.address}</Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>{client.city}, {client.state}</Typography>
                            </Box>
                        </Box>
                    </Stack>

                    <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 0.5 }}>
                        <IconButton size="small" onClick={() => handleOpenDialog(client)} sx={{ color: '#0891b2', '&:hover': { bgcolor: '#ecfeff' } }}>
                            <Pencil size={16} />
                        </IconButton>
                        <IconButton size="small" onClick={() => onDeleteClient(client.id)} sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}>
                            <Trash2 size={16} />
                        </IconButton>
                    </Box>
                </Paper>
            </Grid>
        ))}
        {clients.length === 0 && (
            <Grid size={{ xs: 12 }} >
                <Paper sx={{ p: 5, textAlign: 'center', bgcolor: 'transparent', border: '2px dashed #e2e8f0', borderRadius: 4 }}>
                    <Typography color="textSecondary">No client profiles found in the directory.</Typography>
                </Paper>
            </Grid>
        )}
      </Grid>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Full Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
               <TextField
                select
                label="University / Institution"
                fullWidth
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                required
              >
                {institutions.map((inst) => (
                  <MenuItem key={inst} value={inst}>{inst}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Department"
                fullWidth
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Status"
                fullWidth
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ClientProfile['status'] })}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="State"
                fullWidth
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })}
              >
                {indianStates.map((state) => (
                  <MenuItem key={state} value={state}>{state}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="City"
                fullWidth
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={!formData.state}
              >
                {(formData.state && stateCities[formData.state] || []).map((city) => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
                {!formData.state && <MenuItem value="">Select State First</MenuItem>}
                {formData.state && (!stateCities[formData.state] || stateCities[formData.state].length === 0) && (
                  <MenuItem value="">No cities available</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Address"
                fullWidth
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingId ? 'Update Contact' : 'Add Contact'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientDirectoryTable;
