'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaCar, FaTruck, FaCarSide } from 'react-icons/fa';

const Page = () => {
  const [serviciosLavados, setServiciosLavados] = useState([]);
  const [serviciosOtros, setServiciosOtros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchServicios() {
      try {
        const responseLavados = await axios.get('https://fullwash.site/servicios?txtBuscar=lavados');
        const responseOtros = await axios.get('https://fullwash.site/servicios?txtBuscar=otros');
        setServiciosLavados(responseLavados.data.data || []);
        setServiciosOtros(responseOtros.data.data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchServicios();
  }, []);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} horas ${remainingMinutes} minutos`;
  };

  const handleOpenModal = (servicio) => {
    setSelectedService(servicio);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedService(null);
  };

  const handleAddToOrder = () => {
    router.push(`/dashboardClienteNuevo?showForm=true&servicio_id=${selectedService.id}`);
    handleCloseModal();
  };

  const vehicleTypes = [
    { id: 1, nombre: 'Sedan, Hatchback, Coupe, Cabina simple', costo: 0, icon: <FaCar /> },
    { id: 2, nombre: 'SUV (5 Asientos), Camionetas', costo: 10000, icon: <FaCarSide /> },
    { id: 3, nombre: 'SUV (7 Asientos), Camionetas XL, Furgones', costo: 20000, icon: <FaTruck /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container sx={{ marginTop: 4, flexGrow: 1, maxWidth: 'lg' }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              color: '#1a237e',
              fontFamily: 'Helvetica',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 'bold',
              mb: 2,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                backgroundColor: '#ff6f00',
                borderRadius: '2px',
              }
            }}
          >
            Nuestros Servicios
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#546e7a',
              fontFamily: 'Helvetica',
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              maxWidth: '800px',
              margin: '0 auto',
              mt: 4
            }}
          >
            El costo de los servicios varía dependiendo del tamaño o tipo de vehículo
          </Typography>
        </Box>

        {/* Tipos de vehículos */}
        <Box sx={{ mb: 8 }}>
          <Grid container spacing={4} justifyContent="center">
            {vehicleTypes.map((vehicle) => (
              <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '2rem',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    height: '100%',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
                    }
                  }}
                >
                  <Box sx={{ 
                    fontSize: '3rem', 
                    color: '#1a237e',
                    mb: 2,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    }
                  }}>
                    {vehicle.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#263238',
                      textAlign: 'center',
                      lineHeight: 1.4
                    }}
                  >
                    {vehicle.nombre}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Servicios */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {[{ title: 'Lavados de Vehículos', servicios: serviciosLavados }, { title: 'Otros Servicios', servicios: serviciosOtros }].map((categoria, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  height: '100%'
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    py: 3,
                    px: 4,
                    backgroundColor: '#1a237e',
                    color: '#ffffff',
                    fontWeight: 600,
                    textAlign: 'center',
                    borderBottom: '4px solid #ff6f00'
                  }}
                >
                  {categoria.title}
                </Typography>
                <Box sx={{ p: 4 }}>
                  {Array.isArray(categoria.servicios) && categoria.servicios.map((servicio) => (
                    <Box
                      key={servicio.id}
                      sx={{
                        mb: 4,
                        backgroundColor: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '24px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                        },
                        '&:last-child': {
                          mb: 0
                        }
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: '#1a237e',
                          mb: 2
                        }}
                      >
                        {servicio.nombre_servicio}
                      </Typography>

                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#546e7a',
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          ⏱️
                        </Box>
                        {servicio.tiempo_estimado ? formatTime(servicio.tiempo_estimado) : 'No especificado'}
                      </Typography>

                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          color: '#263238',
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        El servicio incluye:
                      </Typography>

                      <Box 
                        component="ul" 
                        sx={{ 
                          listStyle: 'none',
                          p: 0,
                          m: 0
                        }}
                      >
                        {Array.isArray(servicio.detalles_incluidos)
                          ? servicio.detalles_incluidos.map((detalle, idx) => (
                            <Box 
                              component="li" 
                              key={idx} 
                              sx={{
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                color: '#000000',
                                '&::before': {
                                  content: '"✓"',
                                  color: '#4caf50',
                                  fontWeight: 'bold'
                                }
                              }}
                            >
                              {detalle}
                            </Box>
                          ))
                          : servicio.detalles_incluidos.split(',').map((detalle, idx) => (
                            <Box 
                              component="li" 
                              key={idx} 
                              sx={{
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                color: '#000000',
                                '&::before': {
                                  content: '"✓"',
                                  color: '#4caf50',
                                  fontWeight: 'bold'
                                }
                              }}
                            >
                              {detalle.trim()}
                            </Box>
                          ))}
                      </Box>

                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 3,
                        pt: 2,
                        borderTop: '1px solid #e0e0e0'
                      }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#1a237e',
                            fontWeight: 700
                          }}
                        >
                          Desde ${servicio.precio}
                        </Typography>

                        <Button
                          variant="contained"
                          onClick={() => handleOpenModal(servicio)}
                          sx={{
                            backgroundColor: '#ff6f00',
                            color: 'white',
                            px: 3,
                            py: 1,
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              backgroundColor: '#f57c00',
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Solicitar Servicio
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogContent>
          {selectedService && (
            <>
              <Typography variant="h6">{selectedService.nombre_servicio}</Typography>
              <Typography variant="body2">Incluye:</Typography>
              <ul>
                {Array.isArray(selectedService.detalles_incluidos)
                  ? selectedService.detalles_incluidos.map((detalle, idx) => (
                      <li key={idx}>{detalle}</li>
                    ))
                  : selectedService.detalles_incluidos.split(',').map((detalle, idx) => (
                      <li key={idx}>{detalle.trim()}</li>
                    ))}
              </ul>
              <Typography variant="h6">Desde los: ${selectedService.precio}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddToOrder} color="primary">
            Solicitar
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Page;
