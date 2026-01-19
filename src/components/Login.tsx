import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  InputAdornment, 
  IconButton,
  Alert
} from '@mui/material';
import { User, Lock, Eye, EyeOff, Activity } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple mock validation
    if (username === 'admin' && password === 'admin') {
      onLogin(username);
    } else if (username === 'user' && password === 'user') {
        onLogin(username);
    } else {
      setError('Invalid username or password. Try admin/admin or user/user.');
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ 
            bgcolor: 'primary.main', 
            p: 2, 
            borderRadius: 4, 
            mb: 2,
            boxShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.4)'
          }}>
            <Activity color="white" size={40} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: -0.5 }}>
            Silico-Dash
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Scientific Project Management Dashboard
          </Typography>
        </Box>

        <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              Login
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={20} color="#64748b" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} color="#64748b" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                sx={{ 
                  mt: 4, 
                  py: 1.5,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                }}
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          © 2026 Silico-Dash. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;
