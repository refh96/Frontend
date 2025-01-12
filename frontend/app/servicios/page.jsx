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
      <Container sx={{ marginTop: 4, flexGrow: 1 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            my: 4,
            color: 'darkorange',
            fontFamily: 'Helvetica',
            fontSize: '3rem',
            fontWeight: 'bold',
          }}
        >
          Nuestros Servicios
        </Typography>
        <Typography
          variant="h5"
          align="center"
          sx={{
            my: 4,
            color: 'gray',
            fontFamily: 'Helvetica',
            fontSize: '1.5rem',
          }}
        >
          El costo de los servicios varía dependiendo del tamaño o tipo de vehículo
        </Typography>
  
        {/* Mostrar los tipos de vehículos */}
        <Grid container spacing={4} justifyContent="center">
          {vehicleTypes.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  padding: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  height: '100%',
                  maxHeight: '350px',
                }}
              >
                <Box sx={{ fontSize: '2.5rem', color: 'darkblue' }}>
                  {vehicle.icon}
                </Box>
                <Typography color={'black'} variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {vehicle.nombre}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
  
        {/* Mostrar servicios */}
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
          {[{ title: 'Lavados de Vehículos', servicios: serviciosLavados }, { title: 'Otros Servicios', servicios: serviciosOtros }].map((categoria, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium', color: 'darkblue' }}>
                  {categoria.title}
                </Typography>
                {Array.isArray(categoria.servicios) && categoria.servicios.map((servicio) => (
                  <Box
                    key={servicio.id}
                    sx={{
                      mb: 3,
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '16px',
                      backgroundColor: '#fafafa',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
                      {servicio.nombre_servicio}
                    </Typography>
  
                    {/* Tiempo estimado */}
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'darkgray', mb: 1 }}>
                      Tiempo estimado de servicio: {servicio.tiempo_estimado ? formatTime(servicio.tiempo_estimado) : 'No especificado'}
                    </Typography>
  
                    {/* Detalles incluidos */}
                    <Typography variant="body1" sx={{ color: 'gray', mb: 1 }}>
                      El servicio incluye:
                    </Typography>
                    <Box component="ul" sx={{ paddingLeft: 0, marginTop: 0, color: 'black', listStyle: 'none' }}>
                      {Array.isArray(servicio.detalles_incluidos)
                        ? servicio.detalles_incluidos.map((detalle, idx) => (
                            <Box component="li" key={idx} sx={{ marginBottom: '8px' }}>{detalle}</Box>
                          ))
                        : servicio.detalles_incluidos.split(',').map((detalle, idx) => (
                            <Box component="li" key={idx} sx={{ marginBottom: '8px' }}>{detalle.trim()}</Box>
                          ))}
                    </Box>
  
                    {/* Precio */}
                    <Typography variant="h6" sx={{ color: 'black', mt: 2 }}>
                      Desde los: ${servicio.precio}
                    </Typography>
  
                    {/* Botón */}
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => handleOpenModal(servicio)}
                    >
                      Solicitar Servicio
                    </Button>
                  </Box>
                ))}
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
