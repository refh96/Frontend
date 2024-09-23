'use client';
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NoCrashIcon from '@mui/icons-material/NoCrash';
import { useRouter } from 'next/navigation';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Horarios de atención
const hours = {
  Lunes: '10:00 AM - 7:00 PM',
  Martes: '10:00 AM - 7:00 PM',
  Miércoles: '10:00 AM - 7:00 PM',
  Jueves: '10:00 AM - 7:00 PM',
  Viernes: '10:00 AM - 7:00 PM',
  Sábado: '10:00 AM - 7:00 PM',
  Domingo: '10:00 AM - 7:00 PM'
};

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  // Obtener el día de la semana actual en español
  const dayOfWeek = new Date().toLocaleDateString('es-CL', { weekday: 'long' });
  const currentHours = hours[dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: 'Inicio', link: '/' },
    { label: 'Servicios', link: '/servicios' },
    { label: 'Quienes somos', link: '/datos' },
    { label: 'Login', link: '/loginCliente' },
    { label: 'Registro', link: '/register'}
  ];

  const handleNavigation = (link) => {
    router.push(link);
    handleMenuClose(); // Cerrar el menú después de la navegación en dispositivos móviles
  };

  return (
    <div>
      {/* Cambiar color de fondo a calipso */}
      <AppBar position="relative" sx={{ backgroundColor: '#00ced1' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <NoCrashIcon sx={{ mr: 1 }} /> {/* Ícono de auto */}
            <Typography variant="h6">
              Full Wash Conce
            </Typography>
            <Typography variant="body2" sx={{ ml: 2 }}>
              {dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}: {currentHours || 'Horario no disponible'}
            </Typography>
          </Box>
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
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
              >
                {menuItems.map((item, index) => (
                  <MenuItem key={index} onClick={() => handleNavigation(item.link)}>
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <>
              {menuItems.map((item, index) => (
                <Button 
                  key={index} 
                  color="inherit" 
                  onClick={() => handleNavigation(item.link)}
                  sx={{ 
                    borderRadius: '50px',  // Bordes circulares
                    margin: '0 10px',      // Margen horizontal
                    padding: '10px 20px'   // Padding ajustado
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
