'use client';
import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  CalendarMonth,
  AssignmentTurnedIn,
  Poll,
  DirectionsCar,
  ExitToApp,
} from '@mui/icons-material';

const DashboardAyudante = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarAcceso = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;

        if (!token) {
          router.push('/loginAdmin');
          return;
        }

        const profileRes = await axios.post(
          "https://fullwash.online/profile",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (profileRes.data.user.rol !== "ayudante") {
          Swal.fire({
            title: 'Acceso Restringido',
            text: 'No tienes permiso para acceder a esta página',
            icon: 'warning',
            confirmButtonText: 'Entendido'
          }).then(() => {
            router.push('/');
          });
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error al verificar acceso:', error);
        router.push('/loginAdmin');
      }
    };

    verificarAcceso();
  }, [router]);

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/loginAdmin');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  const menuItems = [
    {
      title: 'Gestionar Reservas',
      icon: <CalendarMonth sx={{ fontSize: 40, color: 'darkorange' }} />,
      description: 'Ver y gestionar las reservas de los clientes',
      path: '/reservas'
    },
    {
      title: 'Gestionar Estados',
      icon: <AssignmentTurnedIn sx={{ fontSize: 40, color: 'darkorange' }} />,
      description: 'Actualizar estados de las reservas',
      path: '/estados'
    },
    {
      title: 'Ver Encuestas',
      icon: <Poll sx={{ fontSize: 40, color: 'darkorange' }} />,
      description: 'Consultar las encuestas de satisfacción',
      path: '/listaEncuestas'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      pt: 4,
      pb: 4
    }}>
      <Container>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              color: 'darkorange',
              fontWeight: 'bold'
            }}
          >
            Panel de Ayudante
          </Typography>
          <Button
            variant="contained"
            onClick={handleLogout}
            startIcon={<ExitToApp />}
            sx={{
              backgroundColor: 'darkorange',
              '&:hover': {
                backgroundColor: '#ff8c00',
              }
            }}
          >
            Cerrar Sesión
          </Button>
        </Box>

        <Grid container spacing={3}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 3
                  }
                }}
                onClick={() => router.push(item.path)}
              >
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center',
                  height: '100%',
                  p: 3
                }}>
                  {item.icon}
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    sx={{ 
                      mt: 2,
                      mb: 1,
                      color: 'darkorange',
                      fontWeight: 'bold'
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ flexGrow: 1 }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
    <Footer />
    </div>
  );
};

export default DashboardAyudante;
