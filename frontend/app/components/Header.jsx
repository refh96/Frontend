import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { parseCookies } from 'nookies';

// Horarios de atención
const hours = {
  Lunes: '09:30 AM - 06:00 PM',
  Martes: '09:30 AM - 06:00 PM',
  Miércoles: '09:30 AM - 06:00 PM',
  Jueves: '09:30 AM - 06:00 PM',
  Viernes: '09:30 AM - 06:00 PM',
  Sábado: '10:00 AM - 14:00 PM',
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
        <Toolbar 
          sx={{ 
            py: { xs: 0.5, sm: 1 },
            px: { xs: 1, sm: 2 },
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              flexGrow: { xs: 1, sm: 0 }
            }}
            onClick={() => router.push('/')}
          >
            <img
              src="https://i.ibb.co/7CYX4zX/logo-full-wash.jpg"
              alt="Logo"
              style={{
                width: isMobile ? '40px' : '60px',
                height: isMobile ? '40px' : '60px',
                marginRight: isMobile ? '8px' : '15px',
                borderRadius: '50%',
                transition: 'transform 0.3s ease',
              }}
            />
            <Typography 
              variant={isMobile ? "h6" : "h5"}
              sx={{ 
                color: '#1a237e',
                fontWeight: 700,
                letterSpacing: '0.5px',
                fontSize: { xs: '1rem', sm: '1.5rem' },
                display: 'block',  
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'  
              }}
            >
              FULL WASH CONCE
            </Typography>
          </Box>

          {!isMobile && (
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
          )}

          {isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={handleHoursMenuOpen}
                sx={{
                  minWidth: 'auto',
                  padding: '6px',
                  color: '#1a237e',
                  '&:hover': {
                    backgroundColor: 'rgba(26, 35, 126, 0.08)'
                  }
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    lineHeight: 1,
                    fontWeight: 500
                  }}
                >
                  Horario
                </Typography>
              </Button>
              
              <IconButton
                edge="end"
                sx={{ 
                  color: '#1a237e',
                  padding: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(26, 35, 126, 0.08)'
                  }
                }}
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            </Box>
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

          <Menu
            anchorEl={hoursAnchorEl}
            open={Boolean(hoursAnchorEl)}
            onClose={handleHoursMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                maxWidth: isMobile ? '280px' : '320px'
              }
            }}
          >
            {Object.entries(hours).map(([day, hour], index) => (
              <MenuItem 
                key={index} 
                onClick={handleHoursMenuClose}
                sx={{
                  py: 1,
                  px: 2,
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <Typography sx={{ 
                  fontWeight: 500, 
                  color: '#1a237e',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {day}:
                </Typography>
                <Typography sx={{ 
                  ml: 1, 
                  color: '#546e7a',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {hour}
                </Typography>
              </MenuItem>
            ))}
          </Menu>

          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                width: '200px'
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {menuItems.map((item, index) => (
              <MenuItem 
                key={index} 
                onClick={() => handleMenuItemClick(item.link)}
                sx={{
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <Typography sx={{ 
                  fontWeight: 500, 
                  color: '#1a237e',
                  fontSize: '0.9rem'
                }}>
                  {item.label}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
