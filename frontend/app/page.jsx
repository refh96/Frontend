'use client';
import React, { useState } from 'react';
import { Box, Paper, Typography, Grid, Container, Button, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import Header from './components/Header';
import Footer from './components/Footer';
import { useRouter } from 'next/navigation';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const router = useRouter();

  const items = [
    {
      img: 'https://i.ibb.co/mNLfbxZ/full-wash-propaganda.jpg',
      alt: 'imagen 1',
    },
    {
      img: 'https://i.ibb.co/kM48wnt/fullwash-servicios.jpg',
      alt: 'imagen 2',
    },
    {
      img: 'https://i.ibb.co/q5N6f7z/full-wash-direccion.jpg',
      alt: 'imagen 3',
    },
    {
      img: 'https://i.ibb.co/JkGr1R2/subir-1.jpg',
      alt: 'imagen 4',
    },
    {
      img: 'https://i.ibb.co/4VRNfc4/subir-2.jpg',
      alt: 'imagen 5',
    },
    {
      img: 'https://i.ibb.co/Jdzcvw3/subir-3.png',
      alt: 'imagen 6',
    },
    {
      img: 'https://i.ibb.co/7RnTjBp/subir-4.png',
      alt: 'imagen 7',
    },
    {
      img: 'https://i.ibb.co/tsDpsnn/subir5.jpg',
      alt: 'imagen 8',
    },
  ];
  const items1 = [
    {
      img: 'https://i.ibb.co/1ZKt4jH/hidrolavadora.jpg',
      alt: 'imagen 1',
    },
    {
      img: 'https://i.ibb.co/tXjdrYX/vaporizadora.jpg',
      alt: 'imagen 2',
    },
    {
      img: 'https://i.ibb.co/sPWQ1kD/compresor-de-aire.jpg',
      alt: 'imagen 3',
    },
  ];
  const items2 = [
    {
      img: 'https://i.ibb.co/FWPHQVp/koch-1.jpg',
      alt: 'imagen 1',
    },
    {
      img: 'https://i.ibb.co/SsttkPZ/kock-2.png',
      alt: 'imagen 2',
    },
    {
      img: 'https://i.ibb.co/Z8c09yS/meguiars.jpg',
      alt: 'imagen 3',
    },
    {
      img: 'https://i.ibb.co/7CXzwDP/meguiars-2.jpg',
      alt: 'imagen 4',
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
        backgroundSize: '10%',
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
          backgroundColor: 'rgba(255, 255, 255, 1)',
          zIndex: 1,
        }}
      />
      <Box
        component="nav"
        aria-label="My site"
        sx={{ flexGrow: 1, width: '100%', maxWidth: '1500px', position: 'relative', zIndex: 2 }}
      >
        <Header />
        <div style={{ width: '100%', overflow: 'hidden', marginBottom: '10px', position: 'relative' }}>
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
        <Container sx={{ marginY: 4, textAlign: 'center' }}>
          <Typography
            variant="h1"
            align="center"
            sx={{
              my: 4,
              color: '#64F03C',
              fontFamily: 'aria-label',
              fontSize: '3rem',
            }}
          >
            REGISTRATE Y AGENDA CON NOSOTROS TU SERVICIO DE CONFIANZA
          </Typography>
          <Typography
            variant="h4"
            align="center"
            color="black"
            gutterBottom
            sx={{
              backgroundColor: '#00ced1', // Fondo de color alrededor del texto
              padding: '10px', // Espacio entre el texto y los bordes del fondo
              borderRadius: '8px', // Bordes redondeados (opcional)
              display: 'inline-block', // Mantiene el fondo solo alrededor del texto
              border: '3px solid #00e5e5', // Borde con un color
              fontFamily: 'aria-label',
              color: '#F05B3C'
            }}
          >
            DESCUBRE NUESTRO PROCESO
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" align="center" color="black" gutterBottom>
                LIMPIEZA DETALLADA
              </Typography>
              <img
                src="https://www.tuningblog.eu/wp-content/uploads/2021/05/Dampfreiniger-autowaesche-aussen-lack-innen-interieur-5-min.gif"
                alt="Proceso 1"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" align="center" color="black" gutterBottom>
                LAVADO EXTERNO COMPLETO
              </Typography>
              <img
                src="https://i.gifer.com/D3j.gif"
                alt="Proceso 2"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" align="center" color="black" gutterBottom>
                LIMPIEZA DE VIDRIOS Y PLASTICOS
              </Typography>
              <img
                src="https://media.giphy.com/media/87wlWjovL0O6Q/giphy.gif"
                alt="Proceso 3"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" align="center" color="black" gutterBottom>
                PULIDO DE FOCOS
              </Typography>
              <img
                src="https://www.mantencionexpress.cl/wp-content/uploads/2021/04/medetailing_pul-foco-1.jpg"
                alt="Proceso 4"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" align="center" color="black" gutterBottom>
                LAVADO DE MOTOR
              </Typography>
              <img
                src="https://www.expertoautorecambios.es/magazine/wp-content/uploads/2017/10/el-lavado-del-motor.jpg"
                alt="Proceso 5"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" align="center" color="black" gutterBottom>
                HIDRATACION DE PLASTICOS INTERNOS Y EXTERNOS
              </Typography>
              <img
                src="https://i.ytimg.com/vi/kpRPZUqvTtU/hqdefault.jpg"
                alt="Proceso 6"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
          </Grid>
        </Container>

        {/* Sección de Opiniones de Clientes */}
        <Container sx={{ marginY: 4 }}>
          <Typography variant="h4" align="center" color="black" gutterBottom>
            RECOMENDACION DE CLIENTES
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
        <Container sx={{ marginY: 4 }}>
          <Grid container spacing={4} direction="column">
            {/* Sección de Productos que Utilizamos */}
            <Grid item xs={12}>
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: 'white',
                  backgroundColor: '#2E86C1', // Color de fondo para productos
                  borderRadius: '10px',
                }}
              >
                <Typography variant="h4">PRODUCTOS QUE UTILIZAMOS</Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  Utilizamos productos de alta calidad, específicos para mantener la pintura, los interiores y los vidrios de tu vehículo en óptimas condiciones.
                </Typography>
                <div style={{ width: '100%', overflow: 'hidden', marginBottom: '10px', position: 'relative' }}>
                  <Carousel
                    autoPlay={true}
                    animation="slide"
                    timeout={500}
                    navButtonsAlwaysVisible={true}
                    indicatorContainerProps={{ sx: { mt: 2 } }}
                  >
                    {items2.map((item, index) => (
                      <Paper
                        key={index}
                        style={{ height: '50vh', display: 'flex', alignItems: 'center', color: 'black', backgroundColor: '#2E86C1' }}
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
              </div>
            </Grid>

            {/* Sección de Herramientas que Utilizamos */}
            <Grid item xs={12}>
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: 'white',
                  backgroundColor: '#58D68D', // Color de fondo para herramientas
                  borderRadius: '10px',
                }}
              >
                <Typography variant="h4">HERRAMIENTAS QUE UTILIZAMOS</Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  Contamos con herramientas de última tecnología para asegurar un lavado profundo y detallado en cada vehículo.
                </Typography>
                <div style={{ width: '100%', overflow: 'hidden', marginBottom: '10px', position: 'relative' }}>
                  <Carousel
                    autoPlay={true}
                    animation="slide"
                    timeout={500}
                    navButtonsAlwaysVisible={true}
                    indicatorContainerProps={{ sx: { mt: 2 } }}
                  >
                    {items1.map((item, index) => (
                      <Paper
                        key={index}
                        style={{ height: '50vh', display: 'flex', alignItems: 'center', color: 'black', backgroundColor: '#58D68D' }}
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
              </div>
            </Grid>
          </Grid>
        </Container>
        <Container sx={{ marginY: 4 }}>
          <Grid>
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
                <Typography variant="h4">Visitanos</Typography>
                <video
                  width="50%"
                  height="315"
                  controls
                  style={{ border: 'none', overflow: 'hidden' }}
                >
                  <source src="/video.mp4" type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
                <video
                  width="50%"
                  height="315"
                  controls
                  style={{ border: 'none', overflow: 'hidden' }}
                >
                  <source src="/video2.mp4" type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
                <video
                  width="50%"
                  height="315"
                  controls
                  style={{ border: 'none', overflow: 'hidden' }}
                >
                  <source src="/video3.mp4" type="video/mp4" />
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
          onClick={() => window.open('https://wa.me/56992646017?text=¡Hola, me comunico desde su pagina web!')}
        >
          <WhatsAppIcon />
        </IconButton>
      </Box>
    </div>
  );


}

export default HomePage;
