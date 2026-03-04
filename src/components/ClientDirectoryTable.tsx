import React, { useState, useMemo } from 'react';
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
import { 
  Plus, 
  Trash2, 
  Pencil, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  User, 
  Search,
  CheckCircle2,
  Users
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { type ClientProfile, departments, indianStates, stateCities, countries, usaStates, japanPrefectures } from '../data/mockData';

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
    country: 'India',
    status: 'Active'
  });

  const clientStats = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'Active').length;
    const inactiveClients = clients.filter(c => c.status === 'Inactive').length;

    const institutionCounts: Record<string, number> = {};
    clients.forEach(c => {
        institutionCounts[c.university] = (institutionCounts[c.university] || 0) + 1;
    });
    const topInstitutions = Object.entries(institutionCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    const stateCounts: Record<string, number> = {};
    clients.forEach(c => {
        stateCounts[c.state] = (stateCounts[c.state] || 0) + 1;
    });
    const topStates = Object.entries(stateCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    const statusData = [
        { name: 'Active', value: activeClients },
        { name: 'Inactive', value: inactiveClients }
    ].filter(d => d.value > 0);

    return { totalClients, activeClients, inactiveClients, topInstitutions, topStates, statusData };
  }, [clients]);

  const handleOpenDialog = (client?: ClientProfile) => {
    if (client) {
      setFormData({
        ...client,
        country: client.country || 'India'
      });
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
        country: 'India',
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
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
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

        {/* Statistics Section */}
        <Grid container spacing={3}>
            {/* KPI Cards */}
            <Grid size={{ xs: 12, md: 3 }}>
                <Stack spacing={2} height="100%">
                    <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2, height: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <Box sx={{ p: 1.5, bgcolor: '#eff6ff', borderRadius: 2, color: '#3b82f6' }}><Users size={24} /></Box>
                        <Box>
                            <Typography variant="h4" fontWeight={800} color="#0f172a">{clientStats.totalClients}</Typography>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">TOTAL CLIENTS</Typography>
                        </Box>
                    </Paper>
                    <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2, height: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <Box sx={{ p: 1.5, bgcolor: '#ecfdf5', borderRadius: 2, color: '#10b981' }}><CheckCircle2 size={24} /></Box>
                        <Box>
                            <Typography variant="h4" fontWeight={800} color="#0f172a">{clientStats.activeClients}</Typography>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">ACTIVE PARTNERS</Typography>
                        </Box>
                    </Paper>
                </Stack>
            </Grid>

            {/* Status Distribution */}
            <Grid size={{ xs: 12, md: 3 }}>
                <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: '#475569' }}>Status Distribution</Typography>
                    <Box sx={{ height: 160 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={clientStats.statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {clientStats.statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Active' ? '#10b981' : '#94a3b8'} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Top Institutions */}
            <Grid size={{ xs: 12, md: 3 }}>
                 <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: '#475569' }}>Top Institutions</Typography>
                    <Box sx={{ height: 160 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={clientStats.topInstitutions} layout="vertical" margin={{ left: 0, right: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
                                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8 }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Top States */}
            <Grid size={{ xs: 12, md: 3 }}>
                 <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: '#475569' }}>Regional Spread</Typography>
                    <Box sx={{ height: 160 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={clientStats.topStates} layout="vertical" margin={{ left: 0, right: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
                                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8 }} />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
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
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>{client.city}, {client.state}{client.country ? `, ${client.country}` : ''}</Typography>
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
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                label="Country"
                fullWidth
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value, state: '', city: '' })}
              >
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                label="State"
                fullWidth
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })}
                disabled={!formData.country}
              >
                {formData.country === 'India' && indianStates.map((state) => (
                  <MenuItem key={state} value={state}>{state}</MenuItem>
                ))}
                {formData.country === 'United States' && usaStates.map((state) => (
                  <MenuItem key={state} value={state}>{state}</MenuItem>
                ))}
                {formData.country === 'Japan' && japanPrefectures.map((state) => (
                  <MenuItem key={state} value={state}>{state}</MenuItem>
                ))}
                {formData.country !== 'India' && formData.country !== 'United States' && formData.country !== 'Japan' && (
                  <MenuItem value="">N/A</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                label="City"
                fullWidth
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={!formData.state}
              >
                {(formData.state && stateCities[formData.state] ? [...stateCities[formData.state]].sort() : []).map((city) => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
                {(!formData.state || (formData.state && (!stateCities[formData.state] || stateCities[formData.state].length === 0))) && (
                   <MenuItem value="">{formData.state ? "No cities available" : "Select State First"}</MenuItem>
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