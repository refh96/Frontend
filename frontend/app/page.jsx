'use client';
import React, { useState, useEffect } from 'react';
import { Box, Paper, Skeleton, Typography, Grid, Container, Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Avatar, Rating } from '@mui/material';
import Slider from 'react-slick';
import Carousel from 'react-material-ui-carousel';
import SwipeIcon from '@mui/icons-material/Swipe';
import VideoSlide from './VideoSlide';
import "./slick-carousel.css";
import Header from './components/Header';
import Footer from './components/Footer';
import { useRouter } from 'next/navigation';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShieldIcon from '@mui/icons-material/Shield';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle } from '@mui/material';
import NextImage  from 'next/image';
import axios from 'axios'; // Importa axios
import AdBlock from './components/AdBlock';

function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideo, setActiveVideo] = React.useState(null);
  const titles = [
    'Lavados de vehículo',
    'Pulido de focos',
    'Cambio de aceite',
    'Mantención general de vehículo',
    'Desmontaje y lavado de alfombras',
    'Limpieza de vehículos'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % items.length);
    }, 5000); // Cambia la imagen cada 5 segundos

    return () => clearInterval(timer); // Limpia el intervalo cuando el componente se desmonta
  }, []);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const items = [
    {
      img: 'https://i.ibb.co/YBCZJR1V/cropped-486484352-1256961306224420-7307001460088481918-n.jpg',
      alt: 'imagen 1',
    },
    {
      img: 'https://i.ibb.co/qMc7xVgV/cropped-486854138-1256943286226222-3349781135465086132-n.jpg',
      alt: 'imagen 2',
    },
    {
      img: 'https://i.ibb.co/gLk2ML6Y/cropped-486213381-1256649116255639-7081635997758175113-n.jpg',
      alt: 'imagen 3',
    },
    {
      img: 'https://i.ibb.co/vxnGYNS9/cropped-483507969-1247898850463999-4403049873569540797-n.jpg',
      alt: 'imagen 4',
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
      img: 'https://i.ibb.co/S471nksH/listing04-480x480.webp',
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
        <Box sx={{
          position: 'relative',
          height: '90vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          overflow: 'hidden', // Esconde el exceso del zoom
          backgroundColor: 'black', // Fondo de respaldo para el 'contain'
        }}>
          {/* Contenedor de la imagen de fondo animada */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${items[currentImageIndex].img})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center', // Centra la imagen perfectamente
              transition: 'background-image 1s ease-in-out',
              animation: 'kenburns 40s ease-in-out infinite alternate',
              '@keyframes kenburns': {
                '0%': {
                  transform: 'scale(1)',
                },
                '100%': {
                  transform: 'scale(1.05)', // Zoom muy sutil
                },
              },
              zIndex: 0,
            }}
          />
          {/* Overlay oscuro */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1 }} />

          {/* Contenido superpuesto */}
          <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                letterSpacing: 1.5,
              }}
            >
              El Cuidado que tu Vehículo Merece
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                mt: 2,
                mb: 4,
                maxWidth: '700px',
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.2rem' },
                textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
              }}
            >
              Servicios de limpieza premium. Calidad, confianza y un acabado impecable para tu auto.
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                mt: 2,
                mb: 4,
                maxWidth: '700px',
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.2rem' },
                textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
              }}
            >
              Encuentranos en Las heras 1430, Concepción, Chile.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleAddToOrder}
              sx={{
                bgcolor: '#F05B3C',
                color: 'white',
                fontSize: { xs: '1rem', md: '1.2rem' },
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 2 },
                borderRadius: '50px',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: '#E65100',
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                },
              }}
            >
              Reserva tu Lavado Ahora
            </Button>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, opacity: 0.9 }}>
              <ShieldIcon sx={{ fontSize: '1.2rem' }} />
              <Typography variant="body2">Calidad Garantizada</Typography>
            </Box>
          </Container>
        </Box>
        <Container sx={{ marginY: 4, textAlign: 'center' }}>
        </Container>
        <Box sx={{ py: 10, backgroundColor: '#f7f9fc' }}>
          <Container maxWidth="lg">
            <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h2" component="h2" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.2, color: '#2c3e50' }}>
                  Bienvenido a Full Wash
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 400, color: '#576574', mb: 4 }}>
                  El mejor cuidado para tu vehículo.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: '#34495e' }}>
                  En Full Wash, nos especializamos en ofrecer un servicio de lavado de vehículos de alta calidad, garantizando que tu automóvil reciba el tratamiento que se merece. Nuestro equipo de expertos utiliza productos de alta gama y técnicas de limpieza avanzadas para asegurar que tu vehículo quede impecable.
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: '#34495e' }}>
                  Confía en Full Wash para mantener tu vehículo en su mejor estado. ¡Visítanos hoy y descubre por qué somos la opción preferida para el cuidado de tu coche!
                </Typography>
                <Box sx={{ width: '100%', display: { xs: 'flex', md: 'block' }, justifyContent: { xs: 'center', md: 'flex-start' } }}>
  <Button
    variant="contained"
    size="large"
    onClick={() => setServicesModalOpen(true)}
    sx={{ bgcolor: '#F05B3C', color: 'white', px: 4, py: 1.5, borderRadius: '50px' }}
  >
    Nuestros Procesos
  </Button>
</Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ position: 'relative', height: { xs: 400, sm: 500, md: 600 }, minHeight: '400px' }}>
                  {processItems.slice(0, 3).map((item, index) => {
                    const styles = [
                      { top: '5%', left: '0%', width: '60%', height: '60%', zIndex: 2 },
                      { bottom: '5%', right: '0%', width: '55%', height: '55%', zIndex: 1 },
                      { top: '25%', right: '15%', width: '40%', height: '40%', zIndex: 3, display: { xs: 'none', sm: 'block' } },
                    ];
                    return (
                      <Paper
                        key={item.title}
                        elevation={12}
                        onClick={() => handleOpenModal(item)}
                        sx={{
                          position: 'absolute',
                          overflow: 'hidden',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            zIndex: 4,
                          },
                          ...styles[index],
                        }}
                      >
                        <Box
                          component="img"
                          src={item.img}
                          alt={item.title}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Paper>
                    );
                  })}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Espacio para Anuncio de AdSense */}
        <Container sx={{ my: 4 }}>
          <Typography variant="caption" sx={{ textAlign: 'center', display: 'block', color: 'text.secondary' }}>
            Publicidad
          </Typography>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '280px' }}>
            <AdBlock adSlot="8607537116" />
          </Paper>
        </Container>
        {/* Sección de Opiniones de Clientes */}
        <Container maxWidth="lg" sx={{ my: 6 }}>
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
                      {client.comments}
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
                <Slider
                  dots={true}
                  infinite={true}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  arrows={true}
                  adaptiveHeight={true}
                  style={{ maxWidth: 600, margin: '0 auto', marginBottom: 24, width: '100%' }}
                  afterChange={() => setActiveVideo(null)}
                >
                  {(() => {
                    // Crear array de refs solo una vez
                    if (!window._videoRefs || window._videoRefs.length !== titles.length) {
                      window._videoRefs = Array(titles.length).fill().map(() => React.createRef());
                    }
                    const videoRefs = window._videoRefs;
                    const pauseAllExcept = (currentIdx) => {
                      videoRefs.forEach((ref, idx) => {
                        if (idx !== currentIdx && ref.current) {
                          ref.current.pause();
                        }
                      });
                    };
                    return ['video.mp4', 'video2.mp4', 'video3.mp4', 'video4.mp4', 'video5.mp4', 'video6.mp4'].map((src, index) => (
                      <VideoSlide
                        key={index}
                        src={src}
                        title={titles[index]}
                        index={index}
                        activeVideo={activeVideo}
                        setActiveVideo={setActiveVideo}
                        videoRef={videoRefs[index]}
                        pauseAllExcept={pauseAllExcept}
                      />
                    ));
                  })()}

                </Slider>
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
        <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper elevation={3} sx={{ bgcolor: 'white', px: 1.5, py: 0.5, borderRadius: '8px', mb: 1, boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'black' }}>
              Contáctenos
            </Typography>
          </Paper>
          <IconButton
            sx={{
              backgroundColor: '#25D366',
              color: 'white',
              '&:hover': {
                backgroundColor: '#128C7E'
              }
            }}
            onClick={() => window.open('https://wa.me/56992646017?text=¡Hola, me comunico desde su pagina web!')}
            aria-label="Contactar por WhatsApp"
          >
            <WhatsAppIcon sx={{ fontSize: 50 }} />
          </IconButton>
        </Box>
      </Box>
      <Dialog
        open={servicesModalOpen}
        onClose={() => setServicesModalOpen(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700 }}>
          Nuestros Procesos
          <IconButton
            aria-label="close"
            onClick={() => setServicesModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={4} justifyContent="center" sx={{ pt: 2 }}>
            {processItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.title}>
                <Paper
                  elevation={4}
                  onClick={() => {
                    setServicesModalOpen(false); // Cierra el modal de servicios
                    handleOpenModal(item); // Abre el modal de detalles
                  }}
                  sx={{
                    height: '100%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={item.img}
                    alt={item.title}
                    sx={{ width: '100%', height: 220, objectFit: 'cover' }}
                  />
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, minHeight: '64px' }}>
                      {item.title}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
export default HomePage;
