'use client';
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Container, Button, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import Header from './components/Header';
import Footer from './components/Footer';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function HomePage() {
  const [servicios, setServicios] = useState([]);
  const [servicios1, setServicios1] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchServicios() {
      try {
        const response = await axios.get('https://fullwash.site/servicios?txtBuscar=lavados');
        if (response.status === 200) {
          setServicios(response.data);
        } else {
          console.error('Error al obtener los servicios');
        }
      } catch (error) {
        console.error('Error en la solicitud de servicios:', error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchServicios1() {
      try {
        const response = await axios.get('https://fullwash.site/servicios?txtBuscar=otros');
        if (response.status === 200) {
          setServicios1(response.data);
        } else {
          console.error('Error al obtener los servicios');
        }
      } catch (error) {
        console.error('Error en la solicitud de servicios:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchServicios();
    fetchServicios1();
  }, []);

  const items = [
    {
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuvomF20Usic150zY1pR-oD-UlMt-3lfctqQ&s',
      alt: 'imagen 1',
    },
    {
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4gg9XL1Fl_m-d3I3oVP4-LCab8VmI61iRIw&s',
      alt: 'imagen 2',
    },
  ];

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
    <div
      style={{
        position: 'relative',
        backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGOWszXrlaZHRcLffOEuXWHfnON-8S30IxQ&s")',
        backgroundSize: '20%',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        imageRendering: 'auto',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1,
        }}
      />
      <Box
        component="nav"
        aria-label="My site"
        sx={{ flexGrow: 1, width: '100%', maxWidth: '1500px', position: 'relative', zIndex: 2 }}
      >
        <Header />
        <Typography
          variant="h1"
          align="center"
          sx={{
            my: 4,
            color: 'darkorange',
            fontFamily: 'Cursive',
            fontSize: '3rem',
          }}
        >
          Bienvenido al Full Wash Tu servicio de confianza.
        </Typography>
        <div style={{ width: '100%', overflow: 'hidden', marginBottom: '20px', position: 'relative' }}>
          <Carousel
            autoPlay={true}
            animation="slide"
            timeout={500}
            navButtonsAlwaysVisible={true}
            indicatorContainerProps={{ sx: { mt: 2 } }}
          >
            {items.map((item, index) => (
              <Paper
                key={index}
                style={{ height: '50vh', display: 'flex', alignItems: 'center', color: 'black' }}
              >
                <img
                  src={item.img}
                  alt={item.alt}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </Paper>
            ))}
          </Carousel>
        </div>
        {/* Añadir GIFs aquí */}
        <Container sx={{ marginY: 4 }}>
          <Typography variant="h4" align="center" color="blue" gutterBottom>
            Descubre Nuestro Proceso
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" align="center" color="black" gutterBottom>
                Limpieza detallada
              </Typography>
              <img
                src="https://www.tuningblog.eu/wp-content/uploads/2021/05/Dampfreiniger-autowaesche-aussen-lack-innen-interieur-5-min.gif"
                alt="Proceso 1"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
            <Typography variant="h6" align="center" color="black" gutterBottom>
                Lavado externo completo
              </Typography>
              <img
                src="https://i.gifer.com/D3j.gif"
                alt="Proceso 2"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" align="center" color="black" gutterBottom>
                Limpieza de Vidrios
              </Typography>
              <img
                src="https://media.giphy.com/media/87wlWjovL0O6Q/giphy.gif"
                alt="Proceso 3"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
          </Grid>
        </Container>
        
        {/* Sección de Opiniones de Clientes */}
        <Container sx={{ marginY: 4 }}>
          <Typography variant="h4" align="center" color="black" gutterBottom>
            Recomendación de Clientes
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Sal Yesenia
                </Typography>
                <Typography variant="body1">
                  Excelente servicio recomendado 100% 👍👍👏👏
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Jacqueline Jara
                </Typography>
                <Typography variant="body1">
                  Quedamos muy conformes con el trabajo realizado en nuestra casa de cumpleaños party house.
                  Excelente servicio!
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Pipo To
                </Typography>
                <Typography variant="body1">
                  Excelente servicio, barato y rápido.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Braulio Francisco Coronado Olivera
                </Typography>
                <Typography variant="body1">
                  Excelente servicio, muy rápido, económico y las alfombras quedan como nuevas.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '0 20px',
                  color: 'black',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '10px',
                }}
              >
                <Typography variant="h4">Lavados de vehículos</Typography>
                {servicios.map((servicio) => (
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
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '0 20px',
                  color: 'black',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '10px',
                }}
              >
                <Typography variant="h4">Otros Servicios</Typography>
                {servicios1.map((servicio) => (
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
                      Solicitar servicio
                    </Button>
                  </div>
                ))}
              </div>
            </Grid>

            <Grid item xs={12} sm={12} md={4}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: 'black',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '10px',
                }}
              >
                <Typography variant="h4">Visítanos</Typography>
                <video
                  width="100%"
                  height="315"
                  controls
                  style={{ border: 'none', overflow: 'hidden' }}
                >
                  <source src="/video.mp4" type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
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
        <IconButton
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            backgroundColor: '#25D366',
            color: 'white',
            zIndex: 1000,
          }}
          onClick={() => window.open('https://wa.me/56958994306?text=¡Hola!')}
        >
          <WhatsAppIcon />
        </IconButton>
      </Box>
    </div>
  );
}

export default HomePage;
