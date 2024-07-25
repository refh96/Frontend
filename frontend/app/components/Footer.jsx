import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';

const Footer = () => {
  return (
    <footer>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, alignItems: 'right', color:'black' }}>
          <Typography variant="body1" align='center'>
            © 2024 Full Wash Conce Spa. Todos los derechos reservados.
          </Typography>
          <Link  href="https://www.facebook.com/FullWashconce" target="_blank" sx={{ color: 'black', mx: 1 }}>
            <FacebookIcon />
          </Link>
          <Link href="https://www.tiktok.com/@fullwashconce" target="_blank" sx={{ color: 'black', mx: 1 }}>
          <p>visita nuestro TikTok</p>
          </Link>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer;