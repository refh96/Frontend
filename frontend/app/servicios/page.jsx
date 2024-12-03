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
import { FaCar, FaTruck, FaCarSide } from 'react-icons/fa'; // Importando íconos de vehículos

const Page = () => {
  const [serviciosLavados, setServiciosLavados] = useState([]);
  const [serviciosOtros, setServiciosOtros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchServiciosLavados() {
      try {
        const response = await axios.get('https://fullwash.site/servicios?txtBuscar=lavados');
        setServiciosLavados(response.data.data || []);
      } catch (error) {
        console.error('Error fetching Lavados services:', error);
        setServiciosLavados([]);
      } finally {
        setLoading(false);
      }
    }

    async function fetchServiciosOtros() {
      try {
        const response = await axios.get('https://fullwash.site/servicios?txtBuscar=otros');
        setServiciosOtros(response.data.data || []);
      } catch (error) {
        console.error('Error fetching Otros services:', error);
        setServiciosOtros([]);
      } finally {
        setLoading(false);
      }
    }

    fetchServiciosLavados();
    fetchServiciosOtros();
  }, []);

  const handleOpenModal = (servicio) => {
    setSelectedService(servicio);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedService(null);
  };

  const handleAddToOrder = () => {
    router.push('/dashboardCliente');
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

        {/* Mostrar los tipos de vehículos con sus íconos y costos */}
        <Grid container spacing={4} justifyContent="center">
          {vehicleTypes.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <Box
                sx={{
                  display: 'flex',        // Asegura que el contenido se ajuste de manera consistente
                  flexDirection: 'column',
                  textAlign: 'center',
                  padding: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  height: '100%',         // Asegura que el cuadro ocupe toda la altura disponible
                  maxHeight: '350px',     // Establece una altura máxima consistente
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
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
                      {servicio.nombre_servicio}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'gray' }}>
                      {servicio.descripcion}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'black', mt: 1 }}>
                      Desde Los: ${servicio.precio}
                    </Typography>

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
              <Typography variant="body1">{selectedService.descripcion}</Typography>
              <Typography variant="body2">Desde Los: ${selectedService.precio}</Typography>
              <Typography variant="body2">Incluye:</Typography>
              <ul>
                {selectedService.atributos.map((atributo) => (
                  <li key={atributo.id}>{atributo.nombre_atributo} - Costo: ${atributo.costo_atributo}</li>
                ))}
              </ul>
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
