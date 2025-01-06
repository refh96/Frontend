'use client';
import React, { useState, useEffect } from 'react';
import { Box, Paper, Skeleton, Typography, Grid, Container, Button, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import Header from './components/Header';
import Footer from './components/Footer';
import { useRouter } from 'next/navigation';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import NextImage  from 'next/image';
function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
  useEffect(() => {
    items.forEach((item) => {
      const img = new window.Image();
      img.src = item.img;
    });
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
              height: '500px',  // Hace que el Paper ocupe todo el alto del contenedor
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              boxShadow: 'none',
              borderRadius: '20px',  // Aplica el borderRadius al Paper
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
    <Paper
      style={{
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#f5f5f5',
        boxShadow: 'none',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h6" style={{ textAlign: 'center' }}>
        {`Bienvenido a Full Wash – El mejor cuidado para tu vehículo

En Full Wash, nos especializamos en ofrecer un servicio de lavado de vehículos de alta calidad, garantizando que tu automóvil reciba el tratamiento que se merece. Nuestro equipo de expertos utiliza productos de alta gama y técnicas de limpieza avanzadas para asegurar que tu vehículo quede impecable, tanto por dentro como por fuera. Ya sea que necesites un lavado rápido, detallado o un tratamiento especializado para tu coche, estamos aquí para satisfacer todas tus necesidades. Además, nuestra comodidad y atención al cliente son nuestra prioridad, ofreciendo un servicio eficiente y conveniente para que tu experiencia sea rápida y sin complicaciones. Confía en Full Wash para mantener tu vehículo en su mejor estado, con un acabado que te hará sentir como si fuera nuevo. ¡Visítanos hoy y descubre por qué somos la opción preferida para el cuidado de tu coche! `.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < 2 && <br />}
                </React.Fragment>
              ))}
      </Typography>
    </Paper>
  </Grid>
</Grid>

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
              sx={{
                my: 4,
                color: '#F05B3C',
                fontFamily: 'Baloo, sans-serif',
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '5px 8px 4px rgba(0, 0, 0, 0.4)',
                fontWeight: 'bold',
                boxSizing: 'border-box', // Asegura que el padding y margin no causen desbordamiento
                paddingLeft: { xs: 2, sm: 4 }, // Ajusta el padding según el tamaño de pantalla
                paddingRight: { xs: 2, sm: 4 },
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
                animation: 'bounce 1.5s ease-in-out infinite',
              }}
            >
              {`REGISTRATE Y RESERVA TU SERVICIO\n CALIDAD GARANTIZADA `.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < 2 && <br />}
                </React.Fragment>
              ))}
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
              Agendar Servicio
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
          sx={{
            marginY: 4,
            paddingX: 3,
            paddingY: 4,
            backgroundColor: '#f5f5f5',
            borderRadius: '10px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: '2rem', // Ajusta el tamaño según lo que necesites
              textTransform: 'uppercase', // Para hacerlo más destacado
              letterSpacing: 1.5, // Espaciado entre letras
              boxShadow: 2, // Sombra sutil
            }}
          >
            RECOMENDACION DE CLIENTES
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
