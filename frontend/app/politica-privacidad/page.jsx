'use client';

import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PoliticaPrivacidad = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Header />
      <Container component="main" sx={{ my: 4, flexGrow: 1 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, backgroundColor: 'white' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
            Política de Privacidad
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'black' }}>
            En Full Wash Conce, accesible desde fullwashconce.cl, una de nuestras principales prioridades es la privacidad de nuestros visitantes. Este documento de Política de Privacidad contiene tipos de información que se recopilan y registran por Full Wash Conce y cómo la usamos.
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'black', mt: 3 }}>
            Archivos de Registro
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'black' }}>
            Full Wash Conce sigue un procedimiento estándar de uso de archivos de registro. Estos archivos registran a los visitantes cuando visitan sitios web. Todas las empresas de alojamiento hacen esto y forman parte de los análisis de los servicios de alojamiento. La información recopilada por los archivos de registro incluye direcciones de protocolo de Internet (IP), tipo de navegador, proveedor de servicios de Internet (ISP), marca de fecha y hora, páginas de referencia/salida y, posiblemente, el número de clics. Estos no están vinculados a ninguna información que sea de identificación personal. El propósito de la información es analizar tendencias, administrar el sitio, rastrear el movimiento de los usuarios en el sitio web y recopilar información demográfica.
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'black', mt: 3 }}>
            Políticas de Privacidad de Terceros
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'black' }}>
            La Política de Privacidad de Full Wash Conce no se aplica a otros anunciantes o sitios web. Por lo tanto, le recomendamos que consulte las respectivas Políticas de Privacidad de estos servidores de anuncios de terceros para obtener información más detallada. Puede incluir sus prácticas e instrucciones sobre cómo optar por no participar en ciertas opciones.
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'black', mt: 3 }}>
            Google DoubleClick DART Cookie
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'black' }}>
            Google es uno de los proveedores de terceros en nuestro sitio. También utiliza cookies, conocidas como cookies DART, para publicar anuncios a los visitantes de nuestro sitio en función de su visita a www.website.com y otros sitios en Internet. Sin embargo, los visitantes pueden optar por rechazar el uso de cookies DART visitando la Política de privacidad de la red de contenido y anuncios de Google en la siguiente URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'black', mt: 3 }}>
            Nuestros Socios Publicitarios
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'black' }}>
            Algunos de los anunciantes de nuestro sitio pueden utilizar cookies y balizas web. Nuestros socios publicitarios se enumeran a continuación. Cada uno de nuestros socios publicitarios tiene su propia Política de Privacidad para sus políticas sobre los datos del usuario. Para facilitar el acceso, hemos hipervinculado a sus Políticas de Privacidad a continuación.
          </Typography>
          <ul>
            <li>
              <Typography sx={{ color: 'black' }}>
                Google: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>
              </Typography>
            </li>
          </ul>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'black', mt: 3 }}>
            Consentimiento
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'black' }}>
            Al utilizar nuestro sitio web, usted acepta nuestra Política de Privacidad y acepta sus términos.
          </Typography>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default PoliticaPrivacidad;
