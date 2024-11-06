import React from 'react';
import { Box, Container, Typography, Grid, Button, Link } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DatosPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box
          sx={{
            mt: 4,
            mb: 4,
            p: 3,
            bgcolor: 'background.default',
            borderRadius: 2,
            boxShadow: 3,
            width: '100%',
            textAlign: 'center', // Centra el contenido en el eje horizontal
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom color="text.primary">
            ¿Quiénes Somos?
          </Typography>
          <Typography variant="h5" component="h2" color="primary" gutterBottom>
            Lavado de Vehículos
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Somos expertos en la limpieza de vehículos de forma interna y externa. Nuestro compromiso es ofrecer un servicio de lavado de vehículos de excelencia, utilizando productos de alta calidad y técnicas avanzadas que garantizan la mejor limpieza y cuidado para tu vehículo.
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            En nuestro centro de lavado, contamos con un equipo de profesionales capacitados que se encargan de cada detalle, asegurando que tu auto quede impecable y protegido. Ofrecemos servicios personalizados que se adaptan a las necesidades específicas de cada cliente.
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" component="h3" color="text.primary">
                Servicios Ofrecidos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Lavado exterior completo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Limpieza interior profunda
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Detallado profesional
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Encerado y pulido
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Mecánica automotriz
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Venta de productos para vehículos
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" component="h3" color="text.primary">
                Beneficios
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Productos eco-amigables
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Equipo profesional
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Resultados garantizados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Atención al cliente excepcional
              </Typography>
              <Typography variant="h6" component="h3" color="text.primary" sx={{ mt: 2 }}>
                Métodos de Pago
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Tarjetas de crédito y débito
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Efectivo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Transferencias bancarias
              </Typography>
            </Grid>
          </Grid>

          <Box mt={4}>
            <Typography variant="h6" component="h3" color="text.primary">
              Nos Ubicamos en Las heras 1430, Concepción, Chile 
            </Typography>
            <Link
              href="https://maps.app.goo.gl/S8QvPH4RAwHtPQJg9?g_st=iw"
              target="_blank"
              rel="noopener"
              color="primary"
              underline="hover"
            >
              Ver en Google Maps
            </Link>
          </Box>

          <Box mt={4}>
            <Typography variant="h6" component="h3" color="text.primary">
              Contáctenos
            </Typography>
            <Button
              variant="contained"
              color="success"
              sx={{
                mt: 2,
                borderRadius: "20px",
                textTransform: 'none',
                fontFamily: "'Poppins', sans-serif",
                paddingX: 3,
                paddingY: 1.5,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
              href="https://wa.me/56992646017?text=Hola, me gustaría más información sobre sus servicios de lavado de vehículos."
              target="_blank"
            >
              Contactar por WhatsApp
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default DatosPage;
