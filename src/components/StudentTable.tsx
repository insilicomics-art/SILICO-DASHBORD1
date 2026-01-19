import React, { useState, useMemo } from 'react';
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
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  MenuItem,
  Select,
  Grid,
  FormControl,
  InputLabel,
  Divider,
  Stack,
  FormHelperText,
  Alert
} from '@mui/material';
import { Search, Plus, Trash2, Edit2, User, School, CreditCard, MapPin, FileSpreadsheet, Users, GraduationCap } from 'lucide-react';
import { type Student, indianStates, stateCities, departments, paymentModeOptions, bankAccountOptions } from '../data/mockData';
import { downloadCSV } from '../utils/csvExport';

interface StudentTableProps {
  students: Student[];
  institutions: string[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

const OfficeCard = ({ title, stats, color, icon, isSelected, onClick }: { title: string, stats: any, color: string, icon: React.ReactNode, isSelected: boolean, onClick: () => void }) => (
  <Paper 
    onClick={onClick}
    sx={{ 
      p: 3, 
      borderRadius: 3, 
      position: 'relative', 
      overflow: 'hidden', 
      border: isSelected ? `2px solid ${color}` : `1px solid ${color}20`,
      bgcolor: isSelected ? 'white' : 'rgba(255, 255, 255, 0.9)',
      cursor: 'pointer',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        border: isSelected ? `2px solid ${color}` : `2px solid ${color}40`,
      }
    }}
  >
    <Box sx={{ 
      position: 'absolute', 
      top: 0, 
      right: 0, 
      width: '100px', 
      height: '100px', 
      bgcolor: `${color}10`, 
      borderRadius: '0 0 0 100%',
      zIndex: 0
    }} />
    
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ p: 1.5, bgcolor: `${color}15`, borderRadius: 2, color: color }}>
          {icon}
        </Box>
        <Typography variant="h6" fontWeight="bold" color="#1e293b">{title} Office</Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>TOTAL STUDENTS</Typography>
            <Typography variant="h5" fontWeight={800} color="#0f172a">{stats.total}</Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Box>
            <Typography variant="caption" color={color} fontWeight={600}>ACTIVE</Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Users size={16} color={color} />
              <Typography variant="h5" fontWeight={800} color={color}>{stats.active}</Typography>
            </Stack>
          </Box>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>GRADUATED</Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <GraduationCap size={16} color="#64748b" />
              <Typography variant="h5" fontWeight={800} color="#334155">{stats.graduated}</Typography>
            </Stack>
          </Box>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>REVENUE</Typography>
            <Typography variant="h6" fontWeight={800} color="#0f172a">₹{(stats.revenue / 1000).toFixed(1)}k</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  </Paper>
);

const StudentTable: React.FC<StudentTableProps> = ({ students, institutions, onAddStudent, onUpdateStudent, onDeleteStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOffice, setFilterOffice] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  
  const [studentForm, setStudentForm] = useState<Partial<Student>>({
    name: '',
    office: 'Ooty',
    university: '',
    department: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: 'India',
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    enrollmentType: 'Internship',
    mode: 'Offline',
    enrollmentNumber: '',
    totalFee: 0,
    gstType: 'Without GST',
    firstPaymentAmount: 0,
    firstPaymentDate: '',
    paymentMode: undefined,
    bankDetails: '',
    finalPaymentAmount: 0,
    finalPaymentDate: ''
  });

  const getBankOptions = () => {
    if (studentForm.gstType === 'Without GST') {
      return bankAccountOptions.withoutGST;
    }
    if (studentForm.gstType === 'With GST') {
      if (studentForm.office === 'Coimbatore') {
        return bankAccountOptions.withGST.Coimbatore;
      }
      if (studentForm.office === 'Ooty') {
        return bankAccountOptions.withGST.Ooty;
      }
    }
    return [];
  };

  // Office Stats Calculation
  const getOfficeStats = (officeName: string) => {
    const officeStudents = students.filter(s => s.office === officeName);
    return {
      total: officeStudents.length,
      active: officeStudents.filter(s => s.status === 'Active').length,
      graduated: officeStudents.filter(s => s.status === 'Graduated').length,
      revenue: officeStudents.reduce((acc, s) => acc + (s.firstPaymentAmount || 0) + (s.finalPaymentAmount || 0), 0)
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

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOffice = filterOffice === 'All' || s.office === filterOffice;
    return matchesSearch && matchesOffice;
  });

  const availableCities = useMemo(() => {
    if (studentForm.state && stateCities[studentForm.state]) {
        return stateCities[studentForm.state];
    }
    return [];
  }, [studentForm.state]);

  const handleOpenDialog = (student?: Student) => {
    setErrors({});
    if (student) {
      setEditingStudent(student);
      setStudentForm(student);
    } else {
      setEditingStudent(null);
      setStudentForm({
        name: '',
        office: 'Ooty',
        university: '',
        department: '',
        email: '',
        phone: '',
        city: '',
        state: '',
        country: 'India',
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        enrollmentType: 'Internship',
        mode: 'Offline',
        enrollmentNumber: '',
        totalFee: 0,
        gstType: 'Without GST',
        firstPaymentAmount: 0,
        firstPaymentDate: '',
        paymentMode: undefined,
        bankDetails: '',
        finalPaymentAmount: 0,
        finalPaymentDate: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const newErrors: Record<string, boolean> = {};
    if (!studentForm.name) newErrors.name = true;
    if (!studentForm.university) newErrors.university = true;
    if (!studentForm.department) newErrors.department = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingStudent) {
      onUpdateStudent({ ...editingStudent, ...studentForm } as Student);
    } else {
      onAddStudent({
        id: `S${Math.floor(Math.random() * 10000)}`,
        ...studentForm
      } as Student);
    }
    setIsDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Students Database</Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<FileSpreadsheet size={20} />} 
            onClick={() => downloadCSV(students, 'students_data.csv')}
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
          <Button variant="contained" startIcon={<Plus size={20} />} onClick={() => handleOpenDialog()}>
            Add New Student
          </Button>
        </Stack>
      </Box>

      {/* Office Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <OfficeCard 
            title="Ooty" 
            stats={ootyStats} 
            color="#10b981" 
            icon={<MapPin size={24} />} 
            isSelected={filterOffice === 'Ooty'}
            onClick={() => handleOfficeClick('Ooty')}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
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
        <TextField
          label="Search Students"
          variant="outlined"
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>University</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Enrollment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Typography variant="body1" fontWeight="500">{student.name}</Typography>
                  <Typography variant="caption" color="textSecondary">ID: {student.enrollmentNumber}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{student.university}</Typography>
                  <Typography variant="caption" color="textSecondary">{student.office}</Typography>
                </TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>
                  <Typography variant="body2" component="div">{student.email}</Typography>
                  <Typography variant="caption" color="textSecondary">{student.phone}</Typography>
                </TableCell>
                <TableCell>
                   <Typography variant="body2">{student.enrollmentType} ({student.mode})</Typography>
                   <Typography variant="caption" color="textSecondary">{student.enrollmentDate}</Typography>
                </TableCell>
                <TableCell>
                   <Chip 
                    label={student.status} 
                    size="small"
                    color={student.status === 'Active' ? 'success' : 'default'}
                    variant={student.status === 'Active' ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpenDialog(student)} color="primary">
                      <Edit2 size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => onDeleteStudent(student.id)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="lg" fullWidth scroll="paper">
        <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="h5" fontWeight="bold">
                {editingStudent ? 'Edit Student Record' : 'New Student Registration'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                Complete the form below to {editingStudent ? 'update' : 'create'} a student profile.
            </Typography>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#f8fafc', p: 3 }}>
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Please fill in all required fields (Name, Institution, Department) to save.
            </Alert>
          )}
          <Grid container spacing={3}>
            
            {/* 1. Basic Information */}
            <Grid size={{ xs: 12, md: 6 }} >
                <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <User size={20} color="#6366f1" />
                        <Typography variant="h6" fontWeight="bold" color="#1e293b">Basic Information</Typography>
                    </Stack>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }} >
                            <TextField 
                                label="Full Name" 
                                fullWidth 
                                required
                                error={!!errors.name}
                                helperText={errors.name && "Name is required"}
                                value={studentForm.name} 
                                onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} 
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} >
                            <TextField 
                                label="Email ID" 
                                fullWidth 
                                type="email"
                                value={studentForm.email} 
                                onChange={(e) => setStudentForm({...studentForm, email: e.target.value})} 
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} >
                            <TextField 
                                label="Phone Number" 
                                fullWidth 
                                value={studentForm.phone} 
                                onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})} 
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* 2. Location Details */}
            <Grid size={{ xs: 12, md: 6 }} >
                <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <MapPin size={20} color="#0ea5e9" />
                        <Typography variant="h6" fontWeight="bold" color="#1e293b">Location Details</Typography>
                    </Stack>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }} >
                            <FormControl fullWidth>
                                <InputLabel>State</InputLabel>
                                <Select
                                value={studentForm.state || ''}
                                label="State"
                                onChange={(e) => setStudentForm({...studentForm, state: e.target.value, city: ''})}
                                >
                                {indianStates.map((state) => (
                                    <MenuItem key={state} value={state}>{state}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} >
                            <FormControl fullWidth disabled={!studentForm.state}>
                                <InputLabel>City</InputLabel>
                                <Select
                                value={studentForm.city || ''}
                                label="City"
                                onChange={(e) => setStudentForm({...studentForm, city: e.target.value})}
                                >
                                {availableCities.map((city) => (
                                    <MenuItem key={city} value={city}>{city}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid>
                         <Grid size={{ xs: 12 }} >
                            <TextField 
                                label="Country" 
                                fullWidth 
                                value={studentForm.country} 
                                onChange={(e) => setStudentForm({...studentForm, country: e.target.value})} 
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* 3. Academic & Enrollment */}
            <Grid size={{ xs: 12, md: 6 }} >
                <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <School size={20} color="#f59e0b" />
                        <Typography variant="h6" fontWeight="bold" color="#1e293b">Academic & Enrollment</Typography>
                    </Stack>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }} >
                            <FormControl fullWidth required error={!!errors.university}>
                                <InputLabel>Institution</InputLabel>
                                <Select
                                value={studentForm.university || ''}
                                label="Institution"
                                onChange={(e) => setStudentForm({...studentForm, university: e.target.value})}
                                >
                                {institutions.map((inst) => (
                                    <MenuItem key={inst} value={inst}>{inst}</MenuItem>
                                ))}
                                </Select>
                                {errors.university && <FormHelperText>Institution is required</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12 }} >
                            <FormControl fullWidth error={!!errors.department}>
                                <InputLabel>Department</InputLabel>
                                <Select
                                value={studentForm.department || ''}
                                label="Department"
                                onChange={(e) => setStudentForm({...studentForm, department: e.target.value})}
                                >
                                {departments.sort().map((dept) => (
                                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                                ))}
                                </Select>
                                {errors.department && <FormHelperText>Department is required</FormHelperText>}
                            </FormControl>
                        </Grid>
                        
                        <Grid size={{ xs: 12 }} ><Divider /></Grid>

                        <Grid size={{ xs: 6 }} >
                            <FormControl fullWidth required>
                                <InputLabel>Office Location</InputLabel>
                                <Select
                                value={studentForm.office || 'Ooty'}
                                label="Office Location"
                                onChange={(e) => setStudentForm({...studentForm, office: e.target.value as any})}
                                >
                                <MenuItem value="Ooty">Ooty</MenuItem>
                                <MenuItem value="Coimbatore">Coimbatore</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 6 }} >
                            <TextField 
                                label="Enrollment Number" 
                                fullWidth 
                                value={studentForm.enrollmentNumber} 
                                onChange={(e) => setStudentForm({...studentForm, enrollmentNumber: e.target.value})} 
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }} >
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                value={studentForm.enrollmentType || 'Internship'}
                                label="Type"
                                onChange={(e) => setStudentForm({...studentForm, enrollmentType: e.target.value as any})}
                                >
                                <MenuItem value="Internship">Internship</MenuItem>
                                <MenuItem value="Workshop">Workshop</MenuItem>
                                <MenuItem value="Training">Training</MenuItem>
                                <MenuItem value="VAP">VAP</MenuItem>
                                <MenuItem value="Student Project">Student Project</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 6 }} >
                            <FormControl fullWidth>
                                <InputLabel>Mode</InputLabel>
                                <Select
                                value={studentForm.mode || 'Offline'}
                                label="Mode"
                                onChange={(e) => setStudentForm({...studentForm, mode: e.target.value as any})}
                                >
                                <MenuItem value="Offline">Offline</MenuItem>
                                <MenuItem value="Online">Online</MenuItem>
                                <MenuItem value="Hybrid">Hybrid</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                         <Grid size={{ xs: 6 }} >
                            <TextField 
                                label="Start Date" 
                                fullWidth 
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={studentForm.enrollmentDate} 
                                onChange={(e) => setStudentForm({...studentForm, enrollmentDate: e.target.value})} 
                            />
                        </Grid>
                         <Grid size={{ xs: 6 }} >
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                value={studentForm.status || 'Active'}
                                label="Status"
                                onChange={(e) => setStudentForm({...studentForm, status: e.target.value as any})}
                                >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                                <MenuItem value="Graduated">Graduated</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* 4. Financial Details */}
            <Grid size={{ xs: 12, md: 6 }} >
                 <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <CreditCard size={20} color="#10b981" />
                        <Typography variant="h6" fontWeight="bold" color="#1e293b">Financial Details</Typography>
                    </Stack>
                    <Grid container spacing={2}>
                         <Grid size={{ xs: 12, sm: 6 }} >
                            <TextField 
                                label="Total Course Fee" 
                                fullWidth 
                                type="number"
                                value={studentForm.totalFee} 
                                onChange={(e) => setStudentForm({...studentForm, totalFee: Number(e.target.value)})} 
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                }}
                            />
                        </Grid>
                        
                         <Grid size={{ xs: 12, sm: 6 }} >
                            <FormControl fullWidth>
                                <InputLabel>GST Type</InputLabel>
                                <Select
                                value={studentForm.gstType || 'Without GST'}
                                label="GST Type"
                                onChange={(e) => setStudentForm({...studentForm, gstType: e.target.value as any})}
                                >
                                <MenuItem value="Without GST">Without GST</MenuItem>
                                <MenuItem value="With GST">With GST</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 6 }} >
                            <TextField 
                                label="1st Installment Paid" 
                                fullWidth 
                                type="number"
                                value={studentForm.firstPaymentAmount} 
                                onChange={(e) => setStudentForm({...studentForm, firstPaymentAmount: Number(e.target.value)})} 
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} >
                            <TextField 
                                label="Payment Date" 
                                fullWidth 
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={studentForm.firstPaymentDate} 
                                onChange={(e) => setStudentForm({...studentForm, firstPaymentDate: e.target.value})} 
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }} >
                            <TextField 
                                label="Final Installment Paid" 
                                fullWidth 
                                type="number"
                                value={studentForm.finalPaymentAmount} 
                                onChange={(e) => setStudentForm({...studentForm, finalPaymentAmount: Number(e.target.value)})} 
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} >
                            <TextField 
                                label="Payment Date" 
                                fullWidth 
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={studentForm.finalPaymentDate} 
                                onChange={(e) => setStudentForm({...studentForm, finalPaymentDate: e.target.value})} 
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }} >
                            <FormControl fullWidth>
                                <InputLabel>Payment Mode</InputLabel>
                                <Select
                                value={studentForm.paymentMode || ''}
                                label="Payment Mode"
                                onChange={(e) => setStudentForm({...studentForm, paymentMode: e.target.value as any})}
                                >
                                {paymentModeOptions.map((mode) => (
                                    <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }} >
                            <FormControl fullWidth disabled={getBankOptions().length === 0}>
                                <InputLabel>Bank Account</InputLabel>
                                <Select
                                value={studentForm.bankDetails || ''}
                                label="Bank Account"
                                onChange={(e) => setStudentForm({...studentForm, bankDetails: e.target.value})}
                                >
                                {getBankOptions().map((account) => (
                                    <MenuItem key={account} value={account}>{account}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                             <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px dashed #16a34a' }}>
                                <Grid container>
                                    <Grid size={{ xs: 6 }} >
                                        <Typography variant="caption" color="text.secondary" display="block">Total Received</Typography>
                                        <Typography variant="h6" color="#15803d" fontWeight="bold">
                                            ₹ {(studentForm.firstPaymentAmount || 0) + (studentForm.finalPaymentAmount || 0)}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }} >
                                        <Typography variant="caption" color="text.secondary" display="block">Pending Balance</Typography>
                                        <Typography variant="h6" color="#b91c1c" fontWeight="bold">
                                            ₹ {Math.max(0, (studentForm.totalFee || 0) - ((studentForm.firstPaymentAmount || 0) + (studentForm.finalPaymentAmount || 0)))}
                                        </Typography>
                                    </Grid>
                                </Grid>
                             </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
          <Button onClick={() => setIsDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSave} disableElevation>Save Student Record</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentTable;