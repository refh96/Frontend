import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DatosPage = () => {
  return (
    <div>
      <Header />
      <Container maxWidth="md">
        <Box
          sx={{
            mt: 4,
            mb: 4,
            p: 3,
            bgcolor: 'background.default', // Ajusta el fondo para un mejor contraste
            borderRadius: 2,
            boxShadow: 3,
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
          <Grid container spacing={3}>
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
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default DatosPage;
