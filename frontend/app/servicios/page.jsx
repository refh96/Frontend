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
        const response = await axios.get('http://127.0.0.1:3333/servicios?txtBuscar=lavados');
        if (response.status === 200) {
          setServiciosLavados(response.data);
        } else {
          console.error('Error al obtener los servicios de lavados');
        }
      } catch (error) {
        console.error('Error en la solicitud de servicios de lavados:', error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchServiciosOtros() {
      try {
        const response = await axios.get('http://127.0.0.1:3333/servicios?txtBuscar=otros');
        if (response.status === 200) {
          setServiciosOtros(response.data);
        } else {
          console.error('Error al obtener los servicios otros');
        }
      } catch (error) {
        console.error('Error en la solicitud de servicios otros:', error);
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
    router.push('/loginCliente');
    handleCloseModal();
    router.push('/loginCliente');
  };

  return (
    <div>
      <Header />
      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Nuestros Servicios
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                textAlign: 'center',
                padding: '20px',
                color: 'black',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '10px',
              }}
            >
              <Typography variant="h5">Lavados de Vehículos</Typography>
              {serviciosLavados.map((servicio) => (
                <div
                  key={servicio.id}
                  style={{
                    marginBottom: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '10px',
                  }}
                >
                  <Typography variant="h6">{servicio.nombre_servicio}</Typography>
                  <Typography variant="body1">{servicio.descripcion}</Typography>
                  <Typography variant="body2">Precio: {servicio.precio}</Typography>
                  <Button variant="contained" color="primary" onClick={() => handleOpenModal(servicio)}>
                    Solicitar Servicio
                  </Button>
                </div>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                textAlign: 'center',
                padding: '20px',
                color: 'black',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '10px',
              }}
            >
              <Typography variant="h5">Otros Servicios</Typography>
              {serviciosOtros.map((servicio) => (
                <div
                  key={servicio.id}
                  style={{
                    marginBottom: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '10px',
                  }}
                >
                  <Typography variant="h6">{servicio.nombre_servicio}</Typography>
                  <Typography variant="body1">{servicio.descripcion}</Typography>
                  <Typography variant="body2">Precio: {servicio.precio}</Typography>
                  <Button variant="contained" color="primary" onClick={() => handleOpenModal(servicio)}>
                    Solicitar Servicio
                  </Button>
                </div>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogContent>
          {selectedService && (
            <>
              <Typography variant="h6">{selectedService.nombre_servicio}</Typography>
              <Typography variant="body1">{selectedService.descripcion}</Typography>
              <Typography variant="body2">Precio: {selectedService.precio}</Typography>
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
