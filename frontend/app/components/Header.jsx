import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { parseCookies } from 'nookies';

// Horarios de atención
const hours = {
  Lunes: '09:00 AM - 06:00 PM',
  Martes: '09:00 AM - 06:00 PM',
  Miércoles: '09:00 AM - 06:00 PM',
  Jueves: '09:00 AM - 06:00 PM',
  Viernes: '09:00 AM - 06:00 PM',
  Sábado: '09:00 AM - 06:00 PM',
  Domingo: 'Cerrado',
};

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoursAnchorEl, setHoursAnchorEl] = useState(null); // Para el menú de horarios
  const router = useRouter();

  const dayOfWeek = new Date().toLocaleDateString('es-CL', { weekday: 'long' });
  const currentHours = hours[dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHoursMenuOpen = (event) => {
    setHoursAnchorEl(event.currentTarget);
  };

  const handleHoursMenuClose = () => {
    setHoursAnchorEl(null);
  };

  const handleMenuItemClick = (link) => {
    if (link === '/dashboardClienteNuevo') {
      const cookies = parseCookies();
      const token = cookies.token;
      
      if (!token) {
        router.push('/loginCliente');
      } else {
        router.push(link);
      }
    } else {
      router.push(link);
    }
    handleMenuClose();
  };

  const menuItems = [
    { label: 'Inicio', link: '/' },
    { label: 'Servicios', link: '/servicios' },
    { label: 'Quienes somos', link: '/datos' },
    { label: 'Mi Cuenta', link: '/dashboardClienteNuevo' },
    { label: 'Registro', link: '/register' },
  ];

  return (
    <div>
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              cursor: 'pointer',
            }}
          >
            <img
              onClick={() => router.push('/')}
              src="https://i.ibb.co/7CYX4zX/logo-full-wash.jpg"
              alt="Logo"
              style={{
                width: '60px',
                height: '60px',
                marginRight: '15px',
                borderRadius: '50%',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#1a237e',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}
            >
              FULL WASH CONCE
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              ml: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              padding: '8px 16px'
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#1a237e',
                fontWeight: 500,
                mr: 1 
              }}
            >
              Horario:
            </Typography>
            <Button 
              onClick={handleHoursMenuOpen} 
              sx={{ 
                color: '#1a237e',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(26, 35, 126, 0.08)'
                }
              }}
            >
              {dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}: {currentHours || 'Horario no disponible'}
            </Button>
          </Box>

          <Menu
            anchorEl={hoursAnchorEl}
            open={Boolean(hoursAnchorEl)}
            onClose={handleHoursMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px'
              }
            }}
          >
            {Object.entries(hours).map(([day, hour], index) => (
              <MenuItem 
                key={index} 
                onClick={handleHoursMenuClose}
                sx={{
                  py: 1.5,
                  px: 3,
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <Typography sx={{ fontWeight: 500, color: '#1a237e' }}>{day}:</Typography>
                <Typography sx={{ ml: 1, color: '#546e7a' }}>{hour}</Typography>
              </MenuItem>
            ))}
          </Menu>

          {isMobile ? (
            <>
              <IconButton
                edge="start"
                sx={{ 
                  color: '#1a237e',
                  ml: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(26, 35, 126, 0.08)'
                  }
                }}
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px'
                  }
                }}
              >
                {menuItems.map((item, index) => (
                  <MenuItem 
                    key={index} 
                    onClick={() => handleMenuItemClick(item.link)}
                    sx={{
                      py: 1.5,
                      px: 3,
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    <Typography sx={{ fontWeight: 500, color: '#1a237e' }}>
                      {item.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => handleMenuItemClick(item.link)}
                  sx={{
                    color: '#1a237e',
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: '8px',
                    px: 2,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(26, 35, 126, 0.08)'
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: 0,
                      height: '2px',
                      backgroundColor: '#1a237e',
                      transition: 'all 0.3s ease',
                    },
                    '&:hover::after': {
                      width: '80%',
                      left: '10%'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
