import React from 'react';
import { Container, Typography, Box, Link, Grid } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
const Footer = () => {
  return (
    <footer>
      <Box
        sx={{
          backgroundColor: '#00bcd4', // Color calipso
          color: 'white',
          py: 3,
          mt: 4,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                © 2024 Full Wash Conce Spa. Todos los derechos reservados.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
              <Link
                href="https://www.facebook.com/FullWashconce"
                target="_blank"
                sx={{ color: 'white', mx: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <FacebookIcon fontSize="large" sx={{ marginRight: '8px' }} />
                <Typography variant="body1">Visita nuestro Facebook</Typography>
              </Link>
              <Link
                href="https://www.instagram.com/fullwashconce/"
                target="_blank"
                sx={{ color: 'white', mx: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <InstagramIcon fontSize="large" sx={{ marginRight: '8px' }} />
                <Typography variant="body1">Visita nuestro Instagram</Typography>
              </Link>
              <Link
                href="https://www.tiktok.com/@fullwashconce"
                target="_blank"
                sx={{ color: 'white', display: 'block', ml: 2 }}
              >
                <Typography variant="body1">Visita nuestro TikTok</Typography>
              </Link>

            </Grid>
          </Grid>
        </Container>
      </Box>
    </footer>
  );
};

export default Footer;
