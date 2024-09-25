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
  const [hoursAnchorEl, setHoursAnchorEl] = useState(null); // Para el menú de horarios
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

  const handleHoursMenuOpen = (event) => {
    setHoursAnchorEl(event.currentTarget);
  };

  const handleHoursMenuClose = () => {
    setHoursAnchorEl(null);
  };

  const menuItems = [
    { label: 'Inicio', link: '/' },
    { label: 'Servicios', link: '/servicios' },
    { label: 'Quienes somos', link: '/datos' },
    { label: 'Login', link: '/loginCliente' },
    { label: 'Registro', link: '/register' }
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
            {/* Agregar logo a la izquierda */}
            <img 
              src="https://scontent.fccp1-1.fna.fbcdn.net/v/t39.30808-6/294385342_529412922312599_4218408641183798629_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=poSagWhRbwgQ7kNvgH1QiFS&_nc_ht=scontent.fccp1-1.fna&_nc_gid=AqjiheXzLlD06UWanMWrsrb&oh=00_AYAthGaDC3F1sROPmCtiJrPurR9Uc0T5DxCyiegRET_KmQ&oe=66FA056D"
              alt="Logo"
              style={{ width: '50px', height: '50px', marginRight: '10px', borderRadius: '50%' }}
            />
            <Typography variant="h6">
              Full Wash Conce
            </Typography>
            <Button onClick={handleHoursMenuOpen} sx={{ ml: 2, color: 'white' }}>
              {dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}: {currentHours || 'Horario no disponible'}
            </Button>
            <Menu
              anchorEl={hoursAnchorEl}
              open={Boolean(hoursAnchorEl)}
              onClose={handleHoursMenuClose}
            >
              {Object.entries(hours).map(([day, hour], index) => (
                <MenuItem key={index} onClick={handleHoursMenuClose}>
                  {day}: {hour}
                </MenuItem>
              ))}
            </Menu>
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


