import React from 'react';
import { Container, Typography, Box, Link as MuiLink, Grid, Button } from '@mui/material';
import NextLink from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';

const Footer = () => {
  const router = useRouter();

  const handleAdminClick = (e) => {
    e.preventDefault();
    const cookies = parseCookies();
    const token = cookies.token;
    
    if (!token) {
      router.push('/loginAdmin');
    } else {
      router.push('/dashboardAdmin');
    }
  };

  return (
    <footer>
      <Box
        sx={{
          backgroundColor: '#1a237e',
          color: 'white',
          py: 4,
          mt: 'auto',
          width: '100%',
          borderTop: '4px solid #ff6f00'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={6}>
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    color: '#ffffff'
                  }}
                >
                  Full Wash Conce
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 2,
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.95rem'
                  }}
                >
                  2024 Full Wash Conce Spa. Todos los derechos reservados.
                </Typography>
                <MuiLink component={NextLink} href="/politica-privacidad" sx={{ color: 'white', textDecoration: 'underline', display: 'block', mt: 2 }}>
                  Política de Privacidad
                </MuiLink>
                <Button
                  onClick={handleAdminClick}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    mt: 1.5,
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    '&:hover': {
                      borderColor: '#ff6f00',
                      backgroundColor: 'rgba(255, 111, 0, 0.1)',
                    },
                  }}
                >
                  Admin
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: { xs: 'center', sm: 'flex-end' },
                gap: 2
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 1,
                    color: '#ffffff'
                  }}
                >
                  Síguenos en redes sociales
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 2
                }}>
                  <MuiLink
                    href="https://www.facebook.com/FullWashconce"
                    target="_blank"
                    sx={{
                      color: '#ffffff',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#4267B2',
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <FacebookIcon sx={{ fontSize: 28, mr: 1 }} />
                    <Typography variant="body1">Facebook</Typography>
                  </MuiLink>
                  <MuiLink
                    href="https://www.instagram.com/fullwashconce/"
                    target="_blank"
                    sx={{
                      color: '#ffffff',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#E1306C',
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <InstagramIcon sx={{ fontSize: 28, mr: 1 }} />
                    <Typography variant="body1">Instagram</Typography>
                  </MuiLink>
                  <MuiLink
                    href="https://www.tiktok.com/@fullwashconce"
                    target="_blank"
                    sx={{
                      color: '#ffffff',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#69C9D0',
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <Box 
                      component="span" 
                      sx={{ 
                        fontSize: '1.75rem',
                        mr: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      🎵
                    </Box>
                    <Typography variant="body1">TikTok</Typography>
                  </MuiLink>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </footer>
  );
};

export default Footer;
