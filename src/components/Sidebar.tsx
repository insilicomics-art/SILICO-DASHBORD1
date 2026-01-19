import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography, 
  Divider,
  Box,
  Avatar
} from '@mui/material';
import { 
  LayoutDashboard, 
  FolderKanban, 
  PieChart, 
  Settings,
  Activity,
  Building2,
  Server,
  Dna,
  Cpu,
  Users,
  Briefcase,
  FileCode,
  LogOut,
  TrendingUp
} from 'lucide-react';

const drawerWidth = 260;

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  username: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout, username }) => {
  const sidebarBg = '#0f172a'; // Slate 900
  const sidebarText = '#f1f5f9'; // Slate 100
  const activeBg = 'rgba(56, 189, 248, 0.15)'; // Sky 400 with opacity
  const activeIcon = '#38bdf8'; // Sky 400
  const inactiveIcon = '#64748b'; // Slate 500
  const hoverBg = 'rgba(255, 255, 255, 0.05)';
  const dividerColor = 'rgba(255, 255, 255, 0.1)';

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          bgcolor: sidebarBg,
          color: sidebarText,
          borderRight: '1px solid #1e293b' // Slate 800
        },
      }}
    >
      <Toolbar sx={{ display: 'flex', alignItems: 'center', px: 3, py: 1 }}>
        <Activity size={32} color={activeIcon} style={{ marginRight: 12 }} />
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: '#f8fafc', letterSpacing: 0.5 }}>
          Silico-Dash
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: dividerColor }} />
      
      <Box sx={{ overflow: 'auto', flexGrow: 1, py: 2 }}>
        <List>
          <ListItem disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton 
              selected={currentView === 'dashboard'}
              onClick={() => onViewChange('dashboard')}
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { bgcolor: activeBg, '&:hover': { bgcolor: activeBg } },
                '&:hover': { bgcolor: hoverBg }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LayoutDashboard color={currentView === 'dashboard' ? activeIcon : inactiveIcon} size={20} />
              </ListItemIcon>
              <ListItemText primary="Overview" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton 
              selected={currentView === 'projects'}
              onClick={() => onViewChange('projects')}
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { bgcolor: activeBg, '&:hover': { bgcolor: activeBg } },
                '&:hover': { bgcolor: hoverBg }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <FolderKanban color={currentView === 'projects' ? activeIcon : inactiveIcon} size={20} />
              </ListItemIcon>
              <ListItemText primary="Projects" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton 
              selected={currentView === 'analytics'}
              onClick={() => onViewChange('analytics')}
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { bgcolor: activeBg, '&:hover': { bgcolor: activeBg } },
                '&:hover': { bgcolor: hoverBg }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PieChart color={currentView === 'analytics' ? activeIcon : inactiveIcon} size={20} />
              </ListItemIcon>
              <ListItemText primary="Analytics" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton 
              selected={currentView === 'servers'}
              onClick={() => onViewChange('servers')}
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { bgcolor: activeBg, '&:hover': { bgcolor: activeBg } },
                '&:hover': { bgcolor: hoverBg }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Server color={currentView === 'servers' ? activeIcon : inactiveIcon} size={20} />
              </ListItemIcon>
              <ListItemText primary="Servers" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton 
              selected={currentView === 'users'}
              onClick={() => onViewChange('users')}
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { bgcolor: activeBg, '&:hover': { bgcolor: activeBg } },
                '&:hover': { bgcolor: hoverBg }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Users color={currentView === 'users' ? activeIcon : inactiveIcon} size={20} />
              </ListItemIcon>
              <ListItemText primary="Users" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton 
              selected={currentView === 'students'}
              onClick={() => onViewChange('students')}
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { bgcolor: activeBg, '&:hover': { bgcolor: activeBg } },
                '&:hover': { bgcolor: hoverBg }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Briefcase color={currentView === 'students' ? activeIcon : inactiveIcon} size={20} />
              </ListItemIcon>
              <ListItemText primary="Students" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton 
              selected={currentView === 'client-directory'}
              onClick={() => onViewChange('client-directory')}
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { bgcolor: activeBg, '&:hover': { bgcolor: activeBg } },
                '&:hover': { bgcolor: hoverBg }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Users color={currentView === 'client-directory' ? activeIcon : inactiveIcon} size={20} />
              </ListItemIcon>
              <ListItemText primary="Client Directory" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>

           <ListItem disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton 
              selected={currentView === 'clients'}
              onClick={() => onViewChange('clients')}
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { bgcolor: activeBg, '&:hover': { bgcolor: activeBg } },
                '&:hover': { bgcolor: hoverBg }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Briefcase color={currentView === 'clients' ? activeIcon : inactiveIcon} size={20} />
              </ListItemIcon>
              <ListItemText primary="Institutions" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton 
              selected={currentView === 'project-types'}
              onClick={() => onViewChange('project-types')}
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { bgcolor: activeBg, '&:hover': { bgcolor: activeBg } },
                '&:hover': { bgcolor: hoverBg }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <FileCode color={currentView === 'project-types' ? activeIcon : inactiveIcon} size={20} />
              </ListItemIcon>
              <ListItemText primary="Project Types" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        </List>
        
        <Box sx={{ px: 3, mt: 2, mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>
                Institutions
            </Typography>
        </Box>

        <List>
          <ListItem disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton 
              selected={currentView === 'institutions-analysis'}
              onClick={() => onViewChange('institutions-analysis')}
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { bgcolor: activeBg, '&:hover': { bgcolor: activeBg } },
                '&:hover': { bgcolor: hoverBg }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <TrendingUp color={currentView === 'institutions-analysis' ? activeIcon : inactiveIcon} size={20} />
              </ListItemIcon>
              <ListItemText primary="Comparative Analysis" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 600, color: currentView === 'institutions-analysis' ? activeIcon : '#94a3b8' }} />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton 
              selected={currentView === 'vit'}
              onClick={() => onViewChange('vit')}
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { bgcolor: activeBg, '&:hover': { bgcolor: activeBg } },
                '&:hover': { bgcolor: hoverBg }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Building2 color={currentView === 'vit' ? activeIcon : inactiveIcon} size={20} />
              </ListItemIcon>
              <ListItemText primary="VIT Vellore" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton 
              selected={currentView === 'bionome'}
              onClick={() => onViewChange('bionome')}
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { bgcolor: activeBg, '&:hover': { bgcolor: activeBg } },
                '&:hover': { bgcolor: hoverBg }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Dna color={currentView === 'bionome' ? activeIcon : inactiveIcon} size={20} />
              </ListItemIcon>
              <ListItemText primary="Bionome" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton 
              selected={currentView === 'kle'}
              onClick={() => onViewChange('kle')}
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { bgcolor: activeBg, '&:hover': { bgcolor: activeBg } },
                '&:hover': { bgcolor: hoverBg }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Cpu color={currentView === 'kle' ? activeIcon : inactiveIcon} size={20} />
              </ListItemIcon>
              <ListItemText primary="KLE Tech" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Divider sx={{ borderColor: dividerColor }} />
      
      <List>
          <ListItem disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton 
              selected={currentView === 'settings'}
              onClick={() => onViewChange('settings')}
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { bgcolor: activeBg, '&:hover': { bgcolor: activeBg } },
                '&:hover': { bgcolor: hoverBg }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Settings color={currentView === 'settings' ? activeIcon : inactiveIcon} size={20} />
              </ListItemIcon>
              <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton 
              onClick={onLogout}
              sx={{ 
                borderRadius: 2,
                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
                '&:hover .MuiListItemIcon-root': { color: '#ef4444' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LogOut size={20} color={inactiveIcon} />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
      </List>

      <Box sx={{ p: 2, bgcolor: 'rgba(15, 23, 42, 0.5)', borderTop: `1px solid ${dividerColor}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: activeIcon, color: '#0f172a', fontWeight: 'bold' }}>
            {username.substring(0, 2).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ color: sidebarText, fontWeight: 'bold' }}>{username}</Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                {username === 'admin' ? 'Administrator' : 'Researcher'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
