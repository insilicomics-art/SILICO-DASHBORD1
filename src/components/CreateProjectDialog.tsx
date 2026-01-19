import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  Slider,
  Typography,
  InputAdornment,
  Box
} from '@mui/material';
import { 
  Activity, 
  Zap, 
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
  BookOpen,
  Calculator,
  Network
} from 'lucide-react';
import { type Project, type Institution, type Status, type Office, type User, paymentModeOptions, bankAccountOptions } from '../data/mockData';

const typeIconMap: Record<string, React.ReactNode> = {
  'Molecular Dynamics': <Activity size={18} />,
  'Molecular Docking': <Zap size={18} />,
  'Protein Protein Docking': <Puzzle size={18} />,
  'Homology Modelling': <Layers size={18} />,
  'NGS Data Analysis': <Binary size={18} />,
  'Genomic Sequencing': <Dna size={18} />,
  'Bioinformatics': <Cpu size={18} />,
  'Drug Discovery': <FlaskConical size={18} />,
  'Student Training': <GraduationCap size={18} />,
  'Workshop': <Presentation size={18} />,
  'Course': <BookOpen size={18} />,
  'VAP': <Zap size={18} />,
  'QSAR': <Calculator size={18} />,
  'Network Pharmacology': <Network size={18} />,
  'etc...': <MoreHorizontal size={18} />,
};

const getProjectTypeIcon = (type: string) => {
  return typeIconMap[type] || <Search size={18} />;
};

interface ProjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (project: Project) => void;
  onEdit: (project: Project) => void;
  projectToEdit?: Project | null;
  availableUsers: User[];
  availableClients: string[];
  availableClientNames: string[];
  availableProjectTypes: string[];
}

const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({ 
  open, 
  onClose, 
  onCreate, 
  onEdit, 
  projectToEdit,
  availableUsers,
  availableClients,
  availableClientNames,
  availableProjectTypes
}) => {
  const [formData, setFormData] = useState<Partial<Project>>(projectToEdit || {
    id: '',
    title: '',
    projectType: '',
    office: 'Coimbatore',
    clientName: '',
    institution: 'VIT Vellore',
    description: '',
    status: 'Planned',
    lead: '',
    progress: 0,
    startDate: new Date().toISOString().split('T')[0],
    totalFunding: 0,
    gstType: 'Without GST',
    firstPaymentAmount: 0,
    firstPaymentDate: '',
    paymentMode: undefined,
    bankDetails: '',
    finalPaymentAmount: 0,
    finalPaymentDate: ''
  });

  const getBankOptions = () => {
    if (formData.gstType === 'Without GST') {
      return bankAccountOptions.withoutGST;
    }
    if (formData.gstType === 'With GST') {
      if (formData.office === 'Coimbatore') {
        return bankAccountOptions.withGST.Coimbatore;
      }
      if (formData.office === 'Ooty') {
        return bankAccountOptions.withGST.Ooty;
      }
    }
    return [];
  };

  const handleChange = (field: keyof Project, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.id || !formData.title || !formData.lead) {
      alert('Please fill in required fields (ID, Title, Lead)');
      return;
    }

    if (projectToEdit) {
        // Edit Mode
        const updatedProject: Project = {
            ...projectToEdit,
            ...formData as Project
        };
        onEdit(updatedProject);
    } else {
        // Create Mode
        const newProject: Project = {
            id: formData.id,
            title: formData.title!,
            projectType: formData.projectType || 'Unspecified',
            office: formData.office as Office,
            clientName: formData.clientName || 'Unspecified',
            institution: formData.institution as Institution,
            description: formData.description || '',
            status: formData.status as Status,
            startDate: formData.startDate!,
            completionDate: formData.completionDate,
            lead: formData.lead!,
            totalFunding: formData.totalFunding || 0,
            gstType: formData.gstType || 'Without GST',
            firstPaymentAmount: formData.firstPaymentAmount,
            firstPaymentDate: formData.firstPaymentDate,
            paymentMode: formData.paymentMode as any,
            bankDetails: formData.bankDetails,
            finalPaymentAmount: formData.finalPaymentAmount,
            finalPaymentDate: formData.finalPaymentDate,
            progress: formData.progress || 0
        };
        onCreate(newProject);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{projectToEdit ? 'Edit Project' : 'Create New Project'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Project ID"
              fullWidth
              value={formData.id}
              onChange={(e) => handleChange('id', e.target.value)}
              placeholder="e.g., P001"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Project Title"
              fullWidth
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Project Type"
              fullWidth
              value={formData.projectType}
              onChange={(e) => handleChange('projectType', e.target.value)}
            >
              {availableProjectTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', color: 'text.secondary' }}>
                      {getProjectTypeIcon(type)}
                    </Box>
                    {type}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Office"
              fullWidth
              value={formData.office}
              onChange={(e) => handleChange('office', e.target.value)}
            >
              <MenuItem value="Ooty">Ooty Office</MenuItem>
              <MenuItem value="Coimbatore">Coimbatore Office</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Client From (Institution)"
              fullWidth
              value={formData.institution}
              onChange={(e) => handleChange('institution', e.target.value)}
            >
              {availableClients.map((client) => (
                <MenuItem key={client} value={client}>{client}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Client Name"
              fullWidth
              value={formData.clientName}
              onChange={(e) => handleChange('clientName', e.target.value)}
            >
              {availableClientNames.map((name) => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </TextField>
          </Grid>

           <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Team Lead"
              fullWidth
              value={formData.lead}
              onChange={(e) => handleChange('lead', e.target.value)}
              required
            >
              {availableUsers.map((user) => (
                <MenuItem key={user.id} value={user.name}>
                  {user.name} ({user.role})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Total Funding (INR)"
              type="number"
              fullWidth
              value={formData.totalFunding}
              onChange={(e) => handleChange('totalFunding', Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="GST Type"
              fullWidth
              value={formData.gstType || 'Without GST'}
              onChange={(e) => handleChange('gstType', e.target.value)}
            >
              <MenuItem value="Without GST">Without GST</MenuItem>
              <MenuItem value="With GST">With GST</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="First Payment Amount"
              type="number"
              fullWidth
              value={formData.firstPaymentAmount}
              onChange={(e) => handleChange('firstPaymentAmount', Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="First Payment Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.firstPaymentDate}
              onChange={(e) => handleChange('firstPaymentDate', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Final Payment Amount"
              type="number"
              fullWidth
              value={formData.finalPaymentAmount}
              onChange={(e) => handleChange('finalPaymentAmount', Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Final Payment Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.finalPaymentDate}
              onChange={(e) => handleChange('finalPaymentDate', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Payment Mode"
              fullWidth
              value={formData.paymentMode || ''}
              onChange={(e) => handleChange('paymentMode', e.target.value)}
            >
              {paymentModeOptions.map((mode) => (
                <MenuItem key={mode} value={mode}>{mode}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Bank Details"
              fullWidth
              value={formData.bankDetails || ''}
              onChange={(e) => handleChange('bankDetails', e.target.value)}
              disabled={getBankOptions().length === 0}
            >
               {getBankOptions().map((account) => (
                <MenuItem key={account} value={account}>{account}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              label="Status"
              fullWidth
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <MenuItem value="Ongoing">Ongoing (Active)</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Planned">Planned</MenuItem>
              <MenuItem value="Stopped">Stopped</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.completionDate || ''}
              onChange={(e) => handleChange('completionDate', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography gutterBottom>Progress ({formData.progress}%)</Typography>
            <Slider
              value={formData.progress}
              onChange={(_, val) => handleChange('progress', val)}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {projectToEdit ? 'Update Project' : 'Create Project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectFormDialog;
