import { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, Typography } from '@mui/material';
import Sidebar from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import ProjectTable from './components/ProjectTable';
import InstitutionDashboard from './components/InstitutionDashboard';
import UserTable from './components/UserTable';
import StudentTable from './components/StudentTable';
import ClientTable from './components/ClientTable';
import ProjectTypeTable from './components/ProjectTypeTable';
import ProjectTypeAnalysis from './components/ProjectTypeAnalysis';
import Analytics from './components/Analytics';
import Login from './components/Login';
import { type Project, type User, type ClientProfile, type Student, type Payment, type Institution, projects as initialProjects, mockUsers, initialInstitutions, initialProjectTypes, initialClientProfiles, initialStudents, initialPayments, initialServers } from './data/mockData';
import ClientDirectoryTable from './components/ClientDirectoryTable';
import InstitutionsAnalysis from './components/InstitutionsAnalysis';
import ClientAnalysis from './components/ClientAnalysis';
import ServerTable from './components/ServerTable';
import * as api from './services/api';
import { type Server } from './services/api';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6', // Bright Blue 500
      light: '#60a5fa', // Blue 400
      dark: '#2563eb', // Blue 600
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0ea5e9', // Professional Sky Blue
      light: '#38bdf8',
      dark: '#0284c7',
    },
    background: {
      default: '#f8fafc', // Ultra-clean Slate 50
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // Midnight 900
      secondary: '#64748b', // Slate 500
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 700, color: '#1e293b' },
    subtitle1: { fontWeight: 500, color: '#475569' },
    subtitle2: { fontWeight: 600, fontSize: '0.875rem' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          background: '#3b82f6',
          '&:hover': {
            background: '#2563eb',
          }
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
          border: '1px solid #e2e8f0',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#f8fafc',
          color: '#475569',
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          borderBottom: '2px solid #f1f5f9',
        },
        body: {
          fontSize: '0.875rem',
          color: '#1e293b',
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 6,
        },
        outlined: {
          borderWidth: '1.5px',
        }
      }
    }
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('user'));
  const [username, setUsername] = useState(() => localStorage.getItem('user') || '');
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  
  // Initialize state
  const [projectsData, setProjectsData] = useState<Project[]>(initialProjects);
  const [usersData, setUsersData] = useState<User[]>(mockUsers);
  const [clientsData, setClientsData] = useState<Institution[]>(initialInstitutions);
  const [projectTypesData, setProjectTypesData] = useState<string[]>(initialProjectTypes);
  const [clientProfilesData, setClientProfilesData] = useState<ClientProfile[]>(initialClientProfiles);
  const [studentsData, setStudentsData] = useState<Student[]>(initialStudents);
  const [paymentsData, setPaymentsData] = useState<Payment[]>(initialPayments);
  const [serversData, setServersData] = useState<Server[]>(initialServers);

  const handleLogin = (user: string) => {
    setIsAuthenticated(true);
    setUsername(user);
    localStorage.setItem('user', user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    localStorage.removeItem('user');
  };

  // Load data from API

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const [projects, users, clients, types, profiles, students, servers, payments] = await Promise.all([
          api.getProjects(),
          api.getUsers(),
          api.getInstitutions(),
          api.getProjectTypes(),
          api.getClientProfiles(),
          api.getStudents(),
          api.getServers(),
          api.getPayments()
        ]);
        setProjectsData(projects);
        setUsersData(users);
        setClientsData(clients);
        setProjectTypesData(types);
        setClientProfilesData(profiles);
        setStudentsData(students);
        setServersData(servers);
        setPaymentsData(payments);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [isAuthenticated]);
  

  const handleAddProject = async (newProject: Project) => {
    try {
      const created = await api.createProject(newProject);
      setProjectsData((prev) => [created, ...prev]);
    } catch (error) {
      console.error("Failed to create project:", error);
      setProjectsData((prev) => [newProject, ...prev]);
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      const updated = await api.updateProject(updatedProject);
      setProjectsData((prev) => prev.map(p => p.id === updated.id ? updated : p));
    } catch (error) {
      console.error("Failed to update project:", error);
      setProjectsData((prev) => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await api.deleteProject(id);
      setProjectsData((prev) => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete project:", error);
      setProjectsData((prev) => prev.filter(p => p.id !== id));
    }
  };

  const handleAddUser = async (newUser: User) => {
    try {
      const created = await api.createUser(newUser);
      setUsersData((prev) => [...prev, created]);
    } catch (error) {
      console.error("Failed to create user:", error);
      setUsersData((prev) => [...prev, newUser]);
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const updated = await api.updateUser(updatedUser);
      setUsersData((prev) => prev.map(u => u.id === updated.id ? updated : u));
    } catch (error) {
      console.error("Failed to update user:", error);
      setUsersData((prev) => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await api.deleteUser(id);
      setUsersData((prev) => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
      setUsersData((prev) => prev.filter(u => u.id !== id));
    }
  };

  const handleAddStudent = async (newStudent: Student) => {
    try {
      const created = await api.createStudent(newStudent);
      setStudentsData((prev) => [...prev, created]);
    } catch (error) {
      console.error("Failed to create student:", error);
      setStudentsData((prev) => [...prev, newStudent]);
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      const updated = await api.updateStudent(updatedStudent);
      setStudentsData((prev) => prev.map(s => s.id === updated.id ? updated : s));
    } catch (error) {
      console.error("Failed to update student:", error);
      setStudentsData((prev) => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await api.deleteStudent(id);
      setStudentsData((prev) => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Failed to delete student:", error);
      setStudentsData((prev) => prev.filter(s => s.id !== id));
    }
  };

  const handleAddClient = async (newClient: Partial<Institution>) => {
    try {
      const created = await api.createInstitution(newClient);
      setClientsData((prev) => [...prev, created]);
    } catch (error) {
      console.error("Failed to create institution:", error);
      // Fallback for mock mode or error
      if (newClient.name) {
          const fallback: Institution = {
              id: newClient.id || newClient.name.replace(/\s+/g, '-').toLowerCase(),
              name: newClient.name,
              country: newClient.country || 'India'
          };
          setClientsData((prev) => [...prev, fallback]);
      }
    }
  };

  const handleUpdateClient = async (updatedClient: Institution) => {
    try {
      const updated = await api.updateInstitution(updatedClient);
      setClientsData((prev) => prev.map(c => c.id === updated.id ? updated : c));
    } catch (error) {
      console.error("Failed to update institution:", error);
      setClientsData((prev) => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      await api.deleteInstitution(clientId);
      setClientsData((prev) => prev.filter(c => c.id !== clientId));
    } catch (error) {
      console.error("Failed to delete institution:", error);
      setClientsData((prev) => prev.filter(c => c.id !== clientId));
    }
  };

  const handleAddProjectType = async (newType: string) => {
    try {
      const createdName = await api.createProjectType(newType);
      setProjectTypesData((prev) => [...prev, createdName]);
    } catch (error) {
      console.error("Failed to create project type:", error);
      setProjectTypesData((prev) => [...prev, newType]);
    }
  };

  const handleDeleteProjectType = async (typeToDelete: string) => {
    try {
      await api.deleteProjectType(typeToDelete);
      setProjectTypesData((prev) => prev.filter(t => t !== typeToDelete));
    } catch (error) {
      console.error("Failed to delete project type:", error);
      setProjectTypesData((prev) => prev.filter(t => t !== typeToDelete));
    }
  };

  const handleAddClientProfile = async (newProfile: ClientProfile) => {
    try {
      const created = await api.createClientProfile(newProfile);
      setClientProfilesData((prev) => [...prev, created]);
    } catch (error) {
      console.error("Failed to create client profile:", error);
      setClientProfilesData((prev) => [...prev, newProfile]);
    }
  };

  const handleUpdateClientProfile = async (updatedProfile: ClientProfile) => {
    try {
      const updated = await api.updateClientProfile(updatedProfile);
      setClientProfilesData((prev) => prev.map(p => p.id === updated.id ? updated : p));
    } catch (error) {
      console.error("Failed to update client profile:", error);
      setClientProfilesData((prev) => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    }
  };

  const handleDeleteClientProfile = async (id: string) => {
    try {
      await api.deleteClientProfile(id);
      setClientProfilesData((prev) => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete client profile:", error);
      setClientProfilesData((prev) => prev.filter(p => p.id !== id));
    }
  };

  const handleAddPayment = async (newPayment: Payment) => {
    try {
      const created = await api.createPayment(newPayment);
      setPaymentsData((prev) => [...prev, created]);
    } catch (error) {
      console.error("Failed to create payment:", error);
      setPaymentsData((prev) => [...prev, newPayment]);
    }
  };

  const handleUpdatePayment = async (updatedPayment: Payment) => {
    try {
      const updated = await api.updatePayment(updatedPayment);
      setPaymentsData((prev) => prev.map(p => p.id === updated.id ? updated : p));
    } catch (error) {
      console.error("Failed to update payment:", error);
      setPaymentsData((prev) => prev.map(p => p.id === updatedPayment.id ? updatedPayment : p));
    }
  };

  const handleDeletePayment = async (id: string) => {
    try {
      await api.deletePayment(id);
      setPaymentsData((prev) => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete payment:", error);
      setPaymentsData((prev) => prev.filter(p => p.id !== id));
    }
  };

  const handleAddServer = async (newServer: Server) => {
    try {
      const created = await api.createServer(newServer);
      setServersData((prev) => [...prev, created]);
    } catch (error) {
      console.error("Failed to create server:", error);
    }
  };

  const handleUpdateServer = async (updatedServer: Server) => {
    try {
      const updated = await api.updateServer(updatedServer);
      setServersData((prev) => prev.map(s => s.id === updated.id ? updated : s));
    } catch (error) {
      console.error("Failed to update server:", error);
    }
  };

  const handleDeleteServer = async (id: string) => {
    try {
      await api.deleteServer(id);
      setServersData((prev) => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Failed to delete server:", error);
    }
  };

  const renderContent = () => {
    switch (currentView) {
            case 'dashboard':
              return <DashboardOverview projects={projectsData} students={studentsData} payments={paymentsData} clientProfiles={clientProfilesData} />;
            case 'projects':
              return (
                <ProjectTable 
                  projects={projectsData} 
                  users={usersData}
                  clients={clientsData.map(c => c.name)}
                  clientNames={clientProfilesData.map(p => p.name)}
                  projectTypes={projectTypesData}
                  servers={serversData}
                  onAddProject={handleAddProject}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                />
              );
            case 'users':
              return (
                <UserTable 
                  users={usersData} 
                  projects={projectsData}
                  onAddUser={handleAddUser} 
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser} 
                />
              );
            case 'students':
              return (
                <StudentTable 
                  students={studentsData} 
                  institutions={clientsData.map(c => c.name)}
                  onAddStudent={handleAddStudent} 
                  onUpdateStudent={handleUpdateStudent} 
                  onDeleteStudent={handleDeleteStudent} 
                />
              );
            case 'clients':
              return (
                <ClientTable 
                  clients={clientsData} 
                  projects={projectsData} 
                  students={studentsData}
                  onAddClient={handleAddClient} 
                  onUpdateClient={handleUpdateClient}
                  onDeleteClient={handleDeleteClient}
                  onSelectClient={(inst) => {
                    setSelectedInstitution(inst.name);
                    setCurrentView('institution-detail');
                  }}
                />
              );
            case 'client-directory':
              return (
                <ClientDirectoryTable 
                  clients={clientProfilesData} 
                  institutions={clientsData.map(c => c.name)}
                  onAddClient={handleAddClientProfile} 
                  onUpdateClient={handleUpdateClientProfile} 
                  onDeleteClient={handleDeleteClientProfile} 
                  onSelectClient={(client) => {
                    setSelectedClient(client);
                    setCurrentView('client-analysis');
                  }}
                />
              );
            case 'client-analysis':
              return selectedClient ? (
                <ClientAnalysis 
                  client={selectedClient} 
                  projects={projectsData}
                  payments={paymentsData}
                  onAddPayment={handleAddPayment}
                  onUpdatePayment={handleUpdatePayment}
                  onDeletePayment={handleDeletePayment}
                  onBack={() => setCurrentView('client-directory')} 
                />
              ) : null;
            case 'project-types':
              return (
                <ProjectTypeTable 
                  projectTypes={projectTypesData} 
                  projects={projectsData}
                  onAddProjectType={handleAddProjectType} 
                  onDeleteProjectType={handleDeleteProjectType}
                  onSelectProjectType={(type) => {
                    setSelectedProjectType(type);
                    setCurrentView('project-type-detail');
                  }}
                />
              );
            case 'project-type-detail':
              return (
                <ProjectTypeAnalysis 
                  projectType={selectedProjectType} 
                  projects={projectsData} 
                  onBack={() => setCurrentView('project-types')}
                />
              );
                  case 'institution-detail':
                    return (
                      <InstitutionDashboard 
                        institutionName={selectedInstitution} 
                        projects={projectsData} 
                        students={studentsData}
                        users={usersData}
                        servers={serversData}
                        payments={paymentsData}
                        clientProfiles={clientProfilesData}
                        onUpdateProject={handleUpdateProject}
                        onAddPayment={handleAddPayment}
                        onUpdatePayment={handleUpdatePayment}
                        onDeletePayment={handleDeletePayment}
                        onBack={() => setCurrentView('clients')}
                      />
                    );
                  case 'vit':
                    return (
                      <InstitutionDashboard 
                        institutionName="VIT Vellore" 
                        projects={projectsData} 
                        students={studentsData}
                        users={usersData}
                        servers={serversData}
                        payments={paymentsData}
                        clientProfiles={clientProfilesData}
                        onUpdateProject={handleUpdateProject}
                        onAddPayment={handleAddPayment}
                        onUpdatePayment={handleUpdatePayment}
                        onDeletePayment={handleDeletePayment}
                        onBack={() => setCurrentView('dashboard')}
                      />
                    );
                  case 'bionome':
                    return (
                      <InstitutionDashboard 
                        institutionName="Bionome" 
                        projects={projectsData} 
                        students={studentsData}
                        users={usersData}
                        servers={serversData}
                        payments={paymentsData}
                        clientProfiles={clientProfilesData}
                        onUpdateProject={handleUpdateProject}
                        onAddPayment={handleAddPayment}
                        onUpdatePayment={handleUpdatePayment}
                        onDeletePayment={handleDeletePayment}
                        onBack={() => setCurrentView('dashboard')}
                      />
                    );
                  case 'kle':
                    return (
                      <InstitutionDashboard 
                        institutionName="KLE Tech" 
                        projects={projectsData} 
                        students={studentsData}
                        users={usersData}
                        servers={serversData}
                        payments={paymentsData}
                        clientProfiles={clientProfilesData}
                        onUpdateProject={handleUpdateProject}
                        onAddPayment={handleAddPayment}
                        onUpdatePayment={handleUpdatePayment}
                        onDeletePayment={handleDeletePayment}
                        onBack={() => setCurrentView('dashboard')}
                      />
                    );            case 'analytics':
              return <Analytics projects={projectsData} clientProfiles={clientProfilesData} students={studentsData} servers={serversData} payments={paymentsData} />;
            case 'servers':        return <ServerTable servers={serversData} projects={projectsData} onAddServer={handleAddServer} onUpdateServer={handleUpdateServer} onDeleteServer={handleDeleteServer} />;
      case 'institutions-analysis':
        return <InstitutionsAnalysis projects={projectsData} institutions={clientsData.map(c => c.name)} students={studentsData} payments={paymentsData} clientProfiles={clientProfilesData} />;
      case 'settings':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">Settings</Typography>
            <Typography color="textSecondary" sx={{ mt: 2 }}>
              System configuration and user preferences.
            </Typography>
          </Box>
        );
      default:
        return <DashboardOverview projects={projectsData} students={studentsData} payments={paymentsData} clientProfiles={clientProfilesData} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CssBaseline />
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          onLogout={handleLogout}
          username={username}
        />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;