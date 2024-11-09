'use client';
import React, { useState, useEffect } from 'react';
import { Box, Paper, Skeleton, Typography, Grid, Container, Button, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import Header from './components/Header';
import Footer from './components/Footer';
import { useRouter } from 'next/navigation';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      img: 'https://i.ibb.co/yX9P3x5/fullwash-imagen.png',
      alt: 'imagen 4',
    },
    {
      img: 'https://i.ibb.co/JkGr1R2/subir-1.jpg',
      alt: 'imagen 5',
    },
    {
      img: 'https://i.ibb.co/Jdzcvw3/subir-3.png',
      alt: 'imagen 7',
    },
    {
      img: 'https://i.ibb.co/7RnTjBp/subir-4.png',
      alt: 'imagen 8',
    },
    {
      img: 'https://i.ibb.co/tsDpsnn/subir5.jpg',
      alt: 'imagen 9',
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
  useEffect(() => {
    // Simula la carga con un temporizador
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Tiempo de carga de 2 segundos
    return () => clearTimeout(timer);
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

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{ margin: 0, padding: 0, width: '100%', overflow: 'hidden' }}
    >
      <Header />
      <Box flex="1" p={0} sx={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',  // En pantallas grandes, los elementos estarán en una fila
            width: '100%',
            marginBottom: '10px',
            backgroundColor: '#f5f5f5',
            padding: '10px',
            flexWrap: 'wrap',  // Permite que los elementos se acomoden en pantallas pequeñas
          }}
        >
          <div
            style={{
              flex: '1 1 100%',  // En pantallas pequeñas, cada div ocupará el 100% del espacio
              maxWidth: '100%',
              overflow: 'hidden',
              position: 'relative',
              borderRadius: '8px',
              borderBlockStyle: 'box',
              marginBottom: '10px',  // Añadido para espaciado en pantallas pequeñas
              marginLeft: '5px',     // Añadido margen a la izquierda
              marginRight: '25px',    // Añadido margen a la derecha
            }}
          >
            <Carousel
              autoPlay
              animation="fade"
              timeout={700}
              indicators={true}
              navButtonsAlwaysInvisible={true}
              indicatorContainerProps={{
                style: { marginTop: '15px' },
              }}
            >
              {items.map((item, index) => (
                <Paper
                  key={index}
                  style={{
                    height: '50vh',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                  }}
                  elevation={0}
                >
                  <img
                    src={item.img}
                    alt={item.alt}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '20px', // Ajusta el valor para más o menos curvatura
                    }}
                  />
                </Paper>
              ))}
            </Carousel>

          </div>


          <div
            style={{
              flex: '1 1 100%',  // En pantallas pequeñas, este div ocupará el 100% del espacio
              maxWidth: '100%',
              overflow: 'hidden',
              position: 'relative',
              borderRadius: '8px',
              marginBottom: '10px', // Añadido para espaciado en pantallas pequeñas
            }}
          >
            <Typography
              variant="h1"
              align="center"
              textAlign="center"
              sx={{
                my: 4,
                color: '#F05B3C',
                fontFamily: 'Baloo, sans-serif',
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '5px 8px 4px rgba(0, 0, 0, 0.4)',
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)", // Agranda el botón un 5%
                },
              }}
            >
              REGISTRATE Y AGENDA CON NOSOTROS TU SERVICIO DE CONFIANZA
            </Typography>
            <Button
              variant="contained"
              color="success"
              sx={{
                borderRadius: "20px",     // Bordes redondeados
                paddingX: 3,              // Padding horizontal
                paddingY: 1.5,            // Padding vertical
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",  // Sombra suave
                mx: "auto",
                display: "block"
              }}
              onClick={handleAddToOrder}
            >
              Solicitar Servicio
            </Button>
          </div>
        </div>



        <Container sx={{ marginY: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            align="center"
            color="black"
            gutterBottom
            sx={{
              backgroundColor: '#00ced1',
              padding: '10px',
              borderRadius: '8px',
              display: 'inline-block',
              border: '3px solid #00e5e5',
              color: '#white',
              fontFamily: 'aria-label',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)", // Agranda el botón un 5%
              },
            }}
          >
            DESCUBRE NUESTROS PROCESOS
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {[
              {
                title: 'LIMPIEZA DETALLADA',
                img: 'https://www.tuningblog.eu/wp-content/uploads/2021/05/Dampfreiniger-autowaesche-aussen-lack-innen-interieur-5-min.gif',
              },
              {
                title: 'LAVADO EXTERNO COMPLETO',
                img: 'https://i.gifer.com/D3j.gif',
              },
              {
                title: 'LIMPIEZA DE VIDRIOS Y PLÁSTICOS',
                img: 'https://media.giphy.com/media/87wlWjovL0O6Q/giphy.gif',
              },
              {
                title: 'PULIDO DE FOCOS',
                img: 'https://www.mantencionexpress.cl/wp-content/uploads/2021/04/medetailing_pul-foco-1.jpg',
              },
              {
                title: 'LAVADO DE MOTOR',
                img: 'https://www.expertoautorecambios.es/magazine/wp-content/uploads/2017/10/el-lavado-del-motor.jpg',
              },
              {
                title: 'HIDRATACIÓN DE PLÁSTICOS INTERNOS Y EXTERNOS',
                img: 'https://i.ytimg.com/vi/kpRPZUqvTtU/hqdefault.jpg',
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} sx={{
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)", // Agranda el botón un 5%
                },
              }}>
                <div style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '8px', overflow: 'hidden', transition: 'transform 0.3s', cursor: 'pointer' }}>
                  <Typography variant="h6" align="center" color="black" gutterBottom sx={{ backgroundColor: '#f5f5f5', padding: '8px', fontWeight: 'bold' }}>
                    {item.title}
                  </Typography>
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                  />
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>


        {/* Sección de Opiniones de Clientes */}
        <Container
          sx={{
            marginY: 4,
            paddingX: 3,
            paddingY: 4,
            backgroundColor: '#f5f5f5',
            borderRadius: '10px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h4" align="center" color="text.primary" gutterBottom>
            RECOMENDACIONES DE CLIENTES
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {[
              { name: 'Sal Yesenia', text: 'Excelente servicio recomendado 100% 👍👍👏👏' },
              { name: 'Jacqueline Jara', text: 'Quedamos muy conformes con el trabajo realizado en nuestra casa de cumpleaños party house. ¡Excelente servicio!' },
              { name: 'Pipo To', text: 'Excelente servicio, barato y rápido.' },
              { name: 'Braulio Francisco Coronado Olivera', text: 'Excelente servicio, muy rápido, económico y las alfombras quedan como nuevas.' },
              { name: 'Esteban Venegas Alvial', text: 'Muy buen servicio, con muy buena atención 100% recomendado.' },
              { name: 'Esteban Rodríguez García', text: 'Buena atención. Dejan los vehículos impecables.' },
            ].map((client, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                sx={{
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    padding: 3,
                    textAlign: 'center',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {client.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {client.text}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Container sx={{ marginY: 4, paddingX: 2 }}>
          <Grid container spacing={4} direction="column" alignItems="center">
            {/* Sección de Productos que Utilizamos */}
            <Grid item xs={12} sx={{ width: '100%', maxWidth: 800 }}>
              <div
                style={{
                  padding: '30px 20px',
                  textAlign: 'center',
                  color: 'white',
                  backgroundColor: '#2E86C1',
                  borderRadius: '15px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography variant="h4" sx={{ marginBottom: 1 }}>PRODUCTOS QUE UTILIZAMOS</Typography>
                <Typography variant="body1" sx={{ marginY: 2 }}>
                  Utilizamos productos de alta calidad, específicos para mantener la pintura, los interiores y los vidrios de tu vehículo en óptimas condiciones.
                </Typography>
                <div style={{ width: '100%', overflow: 'hidden', marginBottom: '10px', position: 'relative' }}>
                  <Carousel
                    autoPlay
                    animation="slide"
                    timeout={500}
                    navButtonsAlwaysVisible
                    indicatorContainerProps={{ sx: { mt: 2 } }}
                  >
                    {items2.map((item, index) => (
                      <Paper
                        key={index}
                        sx={{
                          height: { xs: '40vh', md: '50vh' },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'black',
                          backgroundColor: '#2E86C1',
                          boxShadow: 'none',
                          borderRadius: '10px',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={item.img}
                          alt={item.alt}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            borderRadius: '10px',
                          }}
                        />
                      </Paper>
                    ))}
                  </Carousel>
                </div>
              </div>
            </Grid>

            {/* Sección de Herramientas que Utilizamos */}
            <Grid item xs={12} sx={{ width: '100%', maxWidth: 800 }}>
              <div
                style={{
                  padding: '30px 20px',
                  textAlign: 'center',
                  color: 'white',
                  backgroundColor: '#58D68D',
                  borderRadius: '15px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography variant="h4" sx={{ marginBottom: 1 }}>HERRAMIENTAS QUE UTILIZAMOS</Typography>
                <Typography variant="body1" sx={{ marginY: 2 }}>
                  Contamos con herramientas de última tecnología para asegurar un lavado profundo y detallado en cada vehículo.
                </Typography>
                <div style={{ width: '100%', overflow: 'hidden', marginBottom: '10px', position: 'relative' }}>
                  <Carousel
                    autoPlay
                    animation="slide"
                    timeout={500}
                    navButtonsAlwaysVisible
                    indicatorContainerProps={{ sx: { mt: 2 } }}
                  >
                    {items1.map((item, index) => (
                      <Paper
                        key={index}
                        sx={{
                          height: { xs: '40vh', md: '50vh' },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'black',
                          backgroundColor: '#58D68D',
                          boxShadow: 'none',
                          borderRadius: '10px',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={item.img}
                          alt={item.alt}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            borderRadius: '10px',
                          }}
                        />
                      </Paper>
                    ))}
                  </Carousel>
                </div>
              </div>
            </Grid>
          </Grid>
        </Container>
        <Container
          sx={{
            marginY: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(245, 245, 245, 0.9)',
            borderRadius: '15px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '20px',
          }}
        >
          <Grid container spacing={3} sx={{ maxWidth: 800 }}>
            <Grid item xs={12}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: 'black',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '15px',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography variant="h4" sx={{ marginBottom: '16px', fontFamily: 'Arial, sans-serif' }}>
                  Visita Nuestras Redes Sociales Para Más Contenido
                </Typography>

                <Grid container spacing={2} justifyContent="center">
                  {isLoading ? (
                    Array.from(new Array(3)).map((_, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Skeleton variant="rectangular" width="100%" height={180} />
                      </Grid>
                    ))
                  ) : (
                    ['video.mp4', 'video2.mp4', 'video3.mp4', 'video4.mp4', 'video5.mp4', 'video6.mp4'].map((src, index) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={index}
                        sx={{
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)', // Sutil aumento al hacer hover
                          },
                        }}
                      >
                        <video
                          width="100%"
                          height="180"
                          controls
                          style={{
                            borderRadius: '10px',
                            overflow: 'hidden',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                            marginBottom: '16px',
                          }}
                        >
                          <source src={src} type="video/mp4" />
                          Tu navegador no soporta el elemento de video.
                        </video>
                      </Grid>
                    ))
                  )}
                </Grid>
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
    </Box>
  );


}

export default HomePage;
