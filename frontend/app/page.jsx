'use client';
import React, { useState, useEffect } from 'react';
import { Box, Paper, Skeleton, Typography, Grid, Container, Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Avatar, Rating } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import Header from './components/Header';
import Footer from './components/Footer';
import { useRouter } from 'next/navigation';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import NextImage  from 'next/image';
import axios from 'axios'; // Importa axios

function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recomendaciones, setRecomendaciones] = useState([]); // Agrega el estado para recomendaciones
  const router = useRouter();
  const items = [
    {
      img: 'https://i.ibb.co/LNydfT4/349359557-636255998051932-7868626956502682837-n.jpg',
      alt: 'imagen 1',
    },
    {
      img: 'https://i.ibb.co/zVmHmMh/350146187-936849570953786-3203082689587698559-n.jpg',
      alt: 'imagen 2',
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
    {
      img: 'https://i.ibb.co/6H7HXYP/pulidoras.png',
      alt: 'imagen 4',
    },
    {
      img: 'https://i.ibb.co/FWPHQVp/koch-1.jpg',
      alt: 'imagen 5',
    },
    {
      img: 'https://i.ibb.co/SsttkPZ/kock-2.png',
      alt: 'imagen 6',
    },
    {
      img: 'https://i.ibb.co/Z8c09yS/meguiars.jpg',
      alt: 'imagen 7',
    },
    {
      img: 'https://i.ibb.co/7CXzwDP/meguiars-2.jpg',
      alt: 'imagen 8',
    },
  ];
  const items2 = [
    {
      img: 'https://i.ibb.co/fp1504L/1.jpg',
      alt: 'imagen 1',
    },
    {
      img: 'https://i.ibb.co/zxWX2C3/2.jpg',
      alt: 'imagen 2',
    },
    {
      img: 'https://i.ibb.co/ZzjK13M/3.jpg',
      alt: 'imagen 3',
    },
    {
      img: 'https://i.ibb.co/1M5ZP45/4.jpg',
      alt: 'imagen 4',
    },
    {
      img: 'https://i.ibb.co/zGz0XCZ/5.jpg',
      alt: 'imagen 5',
    },
    {
      img: 'https://i.ibb.co/LhbG2XH/6.jpg',
      alt: 'imagen 6',
    },
    {
      img: 'https://i.ibb.co/VSVR3X9/7.jpg',
      alt: 'imagen 7',
    },
    {
      img: 'https://i.ibb.co/bPKSpRF/8.jpg',
      alt: 'imagen 8',
    },
  ];
  useEffect(() => {
    // Simula la carga con un temporizador
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Tiempo de carga de 2 segundos
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    items.forEach((item) => {
      const img = new window.Image();
      img.src = item.img;
    });
  }, []);
  useEffect(() => {
    const fetchRecomendaciones = async () => {
      try {
        const response = await axios.get('https://fullwash.site/encuestas');
        if (response.data.success) {
          // Filtramos solo las encuestas que están publicadas y tienen dataSharing en "si"
          const encuestasPublicadas = response.data.encuestas.filter(
            encuesta => encuesta.publicado && encuesta.dataSharing === "si"
          );
          setRecomendaciones(encuestasPublicadas);
        }
      } catch (error) {
        console.error('Error obteniendo recomendaciones:', error);
      }
    };

    fetchRecomendaciones();
  }, []); // Agrega el efecto para obtener recomendaciones

  const handleOpenModal = (servicio) => {
    setSelectedService(servicio);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedService(null);
  };
  const handleAddToOrder = () => {
    router.push('/dashboardClienteNuevo');
    handleCloseModal();
  };
  const processItems = [
    {
      title: 'LIMPIEZA DETALLADA',
      img: 'https://www.tuningblog.eu/wp-content/uploads/2021/05/Dampfreiniger-autowaesche-aussen-lack-innen-interieur-5-min.gif',
      description: 'Este servicio ofrece una limpieza exhaustiva y minuciosa para cada rincón del vehículo. Utilizamos herramientas especializadas que eliminan eficazmente el polvo, la suciedad y las impurezas, incluso en los espacios más difíciles de alcanzar. Ideal para restaurar el interior y exterior del vehículo, dejando cada superficie impecable y revitalizada',
    },
    {
      title: 'LAVADO EXTERNO COMPLETO',
      img: 'https://i.gifer.com/D3j.gif',
      description: 'Este servicio garantiza una limpieza integral del exterior de tu vehículo. Cubrimos cada detalle, desde el techo hasta las áreas más difíciles, como las rendijas y paneles exteriores. Utilizamos técnicas avanzadas y productos de calidad para eliminar suciedad, polvo y residuos, devolviendo a tu vehículo su brillo y aspecto impecable',
    },
    {
      title: 'LIMPIEZA DE VIDRIOS Y PLÁSTICOS',
      img: 'https://media.giphy.com/media/87wlWjovL0O6Q/giphy.gif',
      description: 'Este servicio ofrece una limpieza detallada y profesional de todas las superficies de vidrio y plástico del vehículo. Eliminamos manchas, polvo y residuos, asegurando una apariencia impecable. Ideal para mejorar la visibilidad y mantener el interior y exterior del vehículo en óptimas condiciones',
    },
    {
      title: 'PULIDO DE FOCOS',
      img: 'https://www.mantencionexpress.cl/wp-content/uploads/2021/04/medetailing_pul-foco-1.jpg',
      description: 'Este servicio utiliza herramientas especializadas y técnicas profesionales para restaurar el estado original de los focos de tu vehículo. Eliminamos rayones, opacidad y manchas, devolviendo la claridad y el brillo necesarios para mejorar la estética y la seguridad al conducir. Ideal para mantener una iluminación eficiente y un aspecto renovado',
    },
    {
      title: 'LAVADO DE MOTOR',
      img: 'https://www.expertoautorecambios.es/magazine/wp-content/uploads/2017/10/el-lavado-del-motor.jpg',
      description: 'Este servicio especializado elimina completamente la suciedad acumulada en el motor de tu vehículo, utilizando técnicas seguras y efectivas que garantizan una limpieza profunda sin comprometer los componentes eléctricos o mecánicos. Ideal para mejorar el rendimiento del motor, prolongar su vida útil y mantenerlo en condiciones óptimas',
    },
    {
      title: 'HIDRATACIÓN DE PLÁSTICOS\n INTERNOS Y EXTERNOS',
      img: 'https://i.ytimg.com/vi/kpRPZUqvTtU/hqdefault.jpg',
      description: 'Este servicio utiliza productos de alta gama para restaurar y proteger las superficies plásticas internas y externas de tu vehículo. Proporcionamos una hidratación profunda que renueva su apariencia, devolviéndoles un brillo natural y ayudando a prevenir el desgaste, las grietas y la decoloración causados por el tiempo y la exposición al sol',
    },
    // Agrega los demás elementos de proceso con descripciones
  ];
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
        <Grid container spacing={2} alignItems="center">
  {/* Carrusel */}
  <Grid item xs={11.5} sm={6}>
    <div
      style={{
        width: '100%',  // Hace que el carrusel ocupe todo el ancho de la pantalla
        height: '100%', // Hace que el carrusel ocupe todo el alto de la pantalla
        overflow: 'hidden',  // Asegura que no sobresalga nada del borde curvado
        position: 'relative',
        borderRadius: '20px',  // Aplica el borderRadius al contenedor
        marginBottom: '10px',
        marginRight: '20px', // Añade margen a la derecha
      }}
    >
      <Carousel
        autoPlay
        animation="fade"
        timeout={700}
        indicators={true}
        navButtonsAlwaysInvisible={true}
        indicatorContainerProps={{
          style: { marginTop: '5px' },
        }}
      >
        {items.map((item, index) => (
          <Paper
            key={index}
            style={{
              height: '500px',
  width: '100%',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  borderRadius: '20px',
  overflow: 'hidden' // Aplica el borderRadius al Paper
            }}
            elevation={0}
          >
            <NextImage
              width={'1000'}
              height={'1000'}
              src={item.img}
              alt={item.alt}
              layout="intrinsic"
              style={{
                width: '66%',
                height: '70%',
                objectFit: 'cover',  // Asegura que la imagen cubra todo el espacio del contenedor
                objectPosition: 'center center', // Posiciona la imagen en el centro
                borderRadius: '20px',  // Aplica el borderRadius a la imagen
              }}
            />
          </Paper>
        ))}
      </Carousel>
    </div>
  </Grid>

  {/* Párrafo de texto descriptivo */}
  <Grid item xs={12} sm={6}>
    <Box
      sx={{
        padding: '2rem',
        borderRadius: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 3,
        position: 'relative',
        overflow: 'hidden',
        mr: { xs: 2, sm: 3, md: 4 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: 'linear-gradient(90deg, #1a237e, #F05B3C)',
        }
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: '#1a237e',
          fontWeight: 700,
          textAlign: 'center',
          fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
          position: 'relative',
          mb: 2,
          fontFamily: 'Baloo, sans-serif',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        Bienvenido a Full Wash
      </Typography>

      <Typography
        variant="h5"
        sx={{
          color: '#F05B3C',
          textAlign: 'center',
          fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem' },
          fontStyle: 'italic',
          mb: 3,
          fontWeight: 500,
          letterSpacing: '0.5px'
        }}
      >
        El mejor cuidado para tu vehículo
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        '& p': {
          color: '#37474f',
          fontSize: { xs: '0.95rem', md: '1rem' },
          lineHeight: 1.8,
          textAlign: 'justify',
          '& strong': {
            color: '#1a237e',
            fontWeight: 600
          }
        }
      }}>
        <Typography>
          En <strong>Full Wash</strong>, nos especializamos en ofrecer un servicio de lavado de vehículos de alta calidad, 
          garantizando que tu automóvil reciba el tratamiento que se merece. Nuestro equipo de expertos utiliza 
          <strong> productos de alta gama</strong> y <strong>técnicas de limpieza avanzadas</strong> para asegurar que tu 
          vehículo quede impecable.
        </Typography>

        <Typography>
          Ya sea que necesites un lavado rápido, detallado o un tratamiento especializado para tu coche, estamos aquí 
          para satisfacer todas tus necesidades. Además, nuestra <strong>comodidad y atención al cliente</strong> son 
          nuestra prioridad.
        </Typography>

        <Typography>
          Confía en <strong>Full Wash</strong> para mantener tu vehículo en su mejor estado. ¡Visítanos hoy y descubre 
          por qué somos la opción preferida para el cuidado de tu coche!
        </Typography>
      </Box>
    </Box>
  </Grid>
</Grid>

          <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <Container maxWidth="lg">
                <Grid 
                  container 
                  direction="column" 
                  alignItems="center" 
                  justifyContent="center"
                  sx={{ minHeight: '50vh' }}
                >
                  <Grid item xs={12} md={8} sx={{ width: '100%' }}>
                    <Container 
                      maxWidth="lg" 
                      sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '50vh',
                        py: 4
                      }}
                    >
                      <Stack
                        direction="column"
                        alignItems="center"
                        spacing={4}
                        sx={{
                          width: '100%',
                          maxWidth: '800px',
                          margin: '0 auto',
                          py: 6
                        }}
                      >
                        <Typography
                          variant="h1"
                          align="center"
                          sx={{
                            color: '#F05B3C',
                            fontFamily: 'Baloo, sans-serif',
                            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                            textShadow: '5px 8px 4px rgba(0, 0, 0, 0.4)',
                            fontWeight: 'bold',
                            transition: "all 0.3s ease-in-out",
                            position: 'relative',
                            '&:hover': {
                              transform: "scale(1.05)",
                            },
                            animation: 'bounce 1.5s ease-in-out infinite',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              bottom: -15,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: '100px',
                              height: '4px',
                              background: 'linear-gradient(90deg, #1a237e, #F05B3C)',
                              borderRadius: '2px'
                            }
                          }}
                        >
                          REGISTRATE Y RESERVA TU SERVICIO
                        </Typography>
                        
                        <Typography
                          variant="h2"
                          align="center"
                          sx={{
                            color: '#1a237e',
                            fontFamily: 'Baloo, sans-serif',
                            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                            fontWeight: 'bold',
                            textShadow: '3px 4px 3px rgba(0, 0, 0, 0.2)',
                            letterSpacing: '1px'
                          }}
                        >
                          CALIDAD GARANTIZADA
                        </Typography>

                        <Button
                          variant="contained"
                          sx={{
                            borderRadius: "25px",
                            paddingX: 4,
                            paddingY: 2,
                            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                            fontSize: "1.2rem",
                            textTransform: "none",
                            backgroundColor: '#1a237e',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#F05B3C',
                              transform: 'translateY(-2px)',
                              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.25)",
                            }
                          }}
                          onClick={handleAddToOrder}
                        >
                          Agendar Servicio
                        </Button>
                      </Stack>
                    </Container>
                  </Grid>
                </Grid>
              </Container>
            </Grid>
          </Grid>
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
              fontFamily: 'arial',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            DESCUBRE NUESTROS PROCESOS
          </Typography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{
              flexDirection: { xs: 'row', sm: 'row', md: 'row', lg: 'row' },
              overflowX: { xs: 'auto', sm: 'visible' },
              display: 'flex',
              flexWrap: { xs: 'wrap', sm: 'wrap' },
              paddingX: { xs: 1 },
            }}
          >
            {processItems.map((item, index) => (
              <Grid
                item
                xs={6}
                sm={6}
                md={4}
                key={index}
                sx={{
                  transition: "transform 0.3s ease-in-out",
                  minWidth: { xs: '45%' },
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => handleOpenModal(item)} // Agrega el evento onClick
              >
                <div
                  style={{
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    cursor: 'pointer',
                  }}
                >
                  <Typography
                    variant="h6"
                    align="center"
                    color="black"
                    gutterBottom
                    sx={{
                      backgroundColor: '#f5f5f5',
                      padding: '8px',
                      fontWeight: 'bold',
                      height: '60px',
                      overflow: 'hidden',
                      whiteSpace: 'normal', // Permite que el texto se divida
                      wordWrap: 'break-word', // Asegura que el texto largo se divida
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' },
                    }}
                  >
                    {item.title}
                  </Typography>
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
        {/* Sección de Opiniones de Clientes */}
        <Container
          maxWidth="lg"
          sx={{ my: 6 }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 4,
              color: '#1a237e',
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2rem' },
              textTransform: 'uppercase',
              letterSpacing: 1,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '50px',
                height: '3px',
                background: '#F05B3C',
                borderRadius: '2px'
              }
            }}
          >
            Recomendaciones de Clientes
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {recomendaciones.map((client, index) => {
              // Convertir el nivel de satisfacción a número
              const satisfactionMap = {
                'muy-satisfecho': 5,
                'satisfecho': 4,
                'neutral': 3,
                'insatisfecho': 2,
                'muy-insatisfecho': 1
              };
              const ratingValue = satisfactionMap[client.satisfaction] || 5;

              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2.5,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      borderRadius: '12px',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-6px)'
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: '#1a237e',
                        fontSize: '1.5rem',
                        mb: 1.5
                      }}
                    >
                      {client.user?.username?.charAt(0) || 'A'}
                    </Avatar>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        color: '#1a237e',
                        fontSize: '1.1rem'
                      }}
                    >
                      {client.user?.username || 'Usuario Anónimo'}
                    </Typography>

                    <Rating
                      value={ratingValue}
                      readOnly
                      size="small"
                      precision={1}
                      sx={{
                        mb: 2,
                        '& .MuiRating-iconFilled': {
                          color: '#F05B3C'
                        }
                      }}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        color: '#37474f',
                        textAlign: 'center',
                        fontStyle: 'italic',
                        lineHeight: 1.6,
                        fontSize: '0.9rem'
                      }}
                    >
                      "{client.comments}"
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: '#78909c',
                        mt: 'auto',
                        pt: 1.5,
                        borderTop: '1px solid #e0e0e0',
                        width: '100%',
                        textAlign: 'right',
                        fontSize: '0.75rem'
                      }}
                    >
                      {new Date(client.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>
        <Box 
          sx={{ 
            bgcolor: '#f5f5f5',
            py: 6,
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant="h4" 
              align="center" 
              gutterBottom
              sx={{ 
                color:'#F05B3C',
                fontWeight: 600,
                mb: 4,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 4,
                  backgroundColor: '#1a237e'
                }
              }}
            >
              Nuestros Trabajos
            </Typography>
            
            <Grid container spacing={3}>
              {isLoading ? (
                Array.from(new Array(6)).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        height: '100%',
                        bgcolor: 'background.paper',
                        borderRadius: 2
                      }}
                    >
                      <Skeleton 
                        variant="rectangular" 
                        width="100%" 
                        height={200}
                        sx={{ borderRadius: 1 }}
                      />
                    </Paper>
                  </Grid>
                ))
              ) : (
                ['video.mp4', 'video2.mp4', 'video3.mp4', 'video4.mp4', 'video5.mp4', 'video6.mp4'].map((src, index) => {
                  const titles = [
                    'Lavados de vehículo',
                    'Pulido de focos',
                    'Cambio de aceite',
                    'Mantención general de vehículo',
                    'Desmontaje y lavado de alfombras',
                    'Limpieza de vehículos'
                  ];
                  return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 2,
                        height: '100%',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6,
                          '& .video-title': {
                            color: '#F05B3C'
                          }
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', mb: 2 }}>
                        <video
                          width="100%"
                          height="200"
                          controls
                          style={{
                            borderRadius: '8px',
                            backgroundColor: '#000'
                          }}
                        >
                          <source src={src} type="video/mp4" />
                          Tu navegador no soporta el elemento de video.
                        </video>
                      </Box>
                      <Typography 
                        className="video-title"
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 500,
                          transition: 'color 0.3s ease',
                          textAlign: 'center'
                        }}
                      >
                        {titles[index]}
                      </Typography>
                    </Paper>
                  </Grid>
                )})
              )}
            </Grid>

            <Box 
              sx={{ 
                mt: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Typography color={'black'} variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                ¡Síguenos para ver más contenido!
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  href="https://www.instagram.com/fullwashconce/"
                  target="_blank"
                  sx={{
                    bgcolor: '#1a237e',
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      bgcolor: '#0d47a1'
                    }
                  }}
                >
                  Instagram
                </Button>
                <Button
                  variant="outlined"
                  href="https://www.tiktok.com/@fullwashconce"
                  target="_blank"
                  sx={{
                    borderColor: '#1a237e',
                    color: '#1a237e',
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      borderColor: '#0d47a1',
                      bgcolor: 'rgba(26, 35, 126, 0.04)'
                    }
                  }}
                >
                  TikTok
                </Button>
              </Stack>
            </Box>
          </Container>
        </Box>
        <Container sx={{ marginY: 4, paddingX: 2 }}>
          <Grid container spacing={4} direction="column" alignItems="center">
            {/* Sección de Guía de Lavado */}
            <Grid item xs={12} sx={{ width: '100%', maxWidth: 1000 }}>
              <Paper
                elevation={3}
                sx={{
                  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: '#F05B3C'
                  }
                }}
              >
                <Box sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography 
                    variant="h3" 
                    align="center" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 'bold',
                      mb: 2,
                      textTransform: 'uppercase',
                      letterSpacing: 1.5,
                      fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
                    }}
                  >
                    Guía de Lavado de tu Vehículo
                  </Typography>
                  <Typography 
                    variant="h6" 
                    align="center" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      mb: 3,
                      maxWidth: '800px',
                      mx: 'auto'
                    }}
                  >
                    Como lavar el vehículo de forma correcta
                  </Typography>
                  
                  <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
                    <Carousel
                      autoPlay
                      animation="fade"
                      duration={800}
                      interval={6000}
                      swipe
                      navButtonsAlwaysVisible
                      cycleNavigation
                      sx={{
                        '& .MuiIconButton-root': {
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            backgroundColor: 'rgba(255,255,255,0.4)'
                          }
                        }
                      }}
                      indicatorContainerProps={{
                        style: {
                          marginTop: '20px',
                          marginBottom: '10px',
                          gap: '8px'
                        }
                      }}
                      navButtonsProps={{
                        style: {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          borderRadius: '50%',
                          padding: '12px',
                          margin: '0 20px',
                          transition: 'all 0.3s ease'
                        }
                      }}
                      navButtonsWrapperProps={{
                        style: {
                          padding: '0 20px'
                        }
                      }}
                      indicatorIconButtonProps={{
                        style: {
                          color: 'rgba(255,255,255,0.4)',
                          padding: '5px',
                          transition: 'all 0.3s ease'
                        }
                      }}
                      activeIndicatorIconButtonProps={{
                        style: {
                          color: '#F05B3C',
                          transform: 'scale(1.2)'
                        }
                      }}
                    >
                      {items2.map((item, index) => (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            height: { xs: '40vh', sm: '50vh', md: '60vh' },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'transparent',
                            position: 'relative',
                            mx: 2,
                            overflow: 'hidden',
                            '& img': {
                              transition: 'all 0.5s ease-in-out',
                              filter: 'brightness(0.95)',
                            },
                            '&:hover img': {
                              transform: 'scale(1.03)',
                              filter: 'brightness(1)'
                            }
                          }}
                        >
                          <img
                            src={item.img}
                            alt={item.alt}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                          />
                        </Paper>
                      ))}
                    </Carousel>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Sección de Productos y Herramientas */}
            <Grid item xs={12} sx={{ width: '100%', maxWidth: 1000, mt: 4 }}>
              <Paper
                elevation={3}
                sx={{
                  background: 'linear-gradient(135deg, #F05B3C 0%, #ff8a65 100%)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: '#1a237e'
                  }
                }}
              >
                <Box sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography 
                    variant="h3" 
                    align="center" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 'bold',
                      mb: 2,
                      textTransform: 'uppercase',
                      letterSpacing: 1.5,
                      fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
                    }}
                  >
                    Productos y Herramientas Profesionales
                  </Typography>
                  <Typography 
                    variant="h6" 
                    align="center" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      mb: 3,
                      maxWidth: '800px',
                      mx: 'auto'
                    }}
                  >
                    Utilizamos productos de alta calidad y herramientas especializadas
                  </Typography>

                  <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
                    <Carousel
                      autoPlay
                      animation="fade"
                      duration={800}
                      interval={6000}
                      swipe
                      navButtonsAlwaysVisible
                      cycleNavigation
                      sx={{
                        '& .MuiIconButton-root': {
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            backgroundColor: 'rgba(255,255,255,0.4)'
                          }
                        }
                      }}
                      indicatorContainerProps={{
                        style: {
                          marginTop: '20px',
                          marginBottom: '10px',
                          gap: '8px'
                        }
                      }}
                      navButtonsProps={{
                        style: {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          borderRadius: '50%',
                          padding: '12px',
                          margin: '0 20px',
                          transition: 'all 0.3s ease'
                        }
                      }}
                      navButtonsWrapperProps={{
                        style: {
                          padding: '0 20px'
                        }
                      }}
                      indicatorIconButtonProps={{
                        style: {
                          color: 'rgba(255,255,255,0.4)',
                          padding: '5px',
                          transition: 'all 0.3s ease'
                        }
                      }}
                      activeIndicatorIconButtonProps={{
                        style: {
                          color: '#1a237e',
                          transform: 'scale(1.2)'
                        }
                      }}
                    >
                      {items1.map((item, index) => (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            height: { xs: '40vh', sm: '50vh', md: '60vh' },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'transparent',
                            position: 'relative',
                            mx: 2,
                            overflow: 'hidden',
                            '& img': {
                              transition: 'all 0.5s ease-in-out',
                              filter: 'brightness(0.95)',
                            },
                            '&:hover img': {
                              transform: 'scale(1.03)',
                              filter: 'brightness(1)'
                            }
                          }}
                        >
                          <img
                            src={item.img}
                            alt={item.alt}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                          />
                        </Paper>
                      ))}
                    </Carousel>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogContent>
            {selectedService && (
              <>
                <Typography textAlign={'center'} variant="h6" gutterBottom>
                  {selectedService.title}
                </Typography>
                <Typography textAlign={'center'} variant="body1" paragraph>
                  {selectedService.description}
                </Typography>
                <img
                  src={selectedService.img}
                  alt={selectedService.title}
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cerrar
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
          <WhatsAppIcon style={{ fontSize: 50 }} /> {/* Ajusta el tamaño aquí */}
        </IconButton>
      </Box>
    </Box>
  );
}
export default HomePage;
