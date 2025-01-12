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
      <AppBar position="relative" sx={{ backgroundColor: '#3CB3DE' }}>
        <Toolbar>
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
                width: '50px',
                height: '50px',
                marginRight: '10px',
                borderRadius: '50%',
              }}
            />
            <Typography variant="h6">FULL WASH CONCE</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Typography variant="body1" sx={{ color: 'white', mr: 1 }}>
              Horario:
            </Typography>
            <Button onClick={handleHoursMenuOpen} sx={{ color: 'white' }}>
              {dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}: {currentHours || 'Horario no disponible'}
            </Button>
          </Box>

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
                  <MenuItem key={index} onClick={() => handleMenuItemClick(item.link)}>
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            menuItems.map((item, index) => (
              <Button
                key={index}
                color="inherit"
                onClick={() => handleMenuItemClick(item.link)}
                sx={{
                  borderRadius: '50px',
                  margin: '0 10px',
                  padding: '10px 20px',
                }}
              >
                {item.label}
              </Button>
            ))
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
