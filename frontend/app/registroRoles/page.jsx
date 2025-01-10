'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from 'nookies';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Paper,
  Grid
} from "@mui/material";
import { ArrowBack } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

function RegistroRoles() {
  const validateEmail = (email) => {
    // Expresión regular para validar el formato de un correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const [user, setUser] = useState({
    username: "",
    numero: "",
    email: "",
    password: "",
    rol: "", // Asegúrate de que rol esté inicializado correctamente
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;

        if (!token) {
          router.push("/loginAdmin");
          return;
        }

        const res = await axios.post(
          "https://fullwash.site/profile",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userRole = res.data.user.rol;
        if (userRole !== "administrador") {
          router.push("/loginCliente");
          return;
        }

        setLoading(false); // Detener el estado de carga si es administrador
      } catch (error) {
        console.error("Error verifying user:", error.message);
        router.push("/loginAdmin");
      }
    };

    verifyUser();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones en el frontend
    if (!user.username || !user.numero || !user.email || !user.password || !user.rol) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (user.numero.length < 9) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El número debe tener al menos 9 dígitos.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (!validateEmail(user.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese un correo electrónico válido.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    try {
      const userWith = { ...user };

      const res = await axios.post("https://fullwash.site/users", userWith);

      // Verificar si la respuesta contiene un error a pesar del status 200
      if (res.status === 200) {
        // Si el backend devuelve un mensaje de error a pesar de ser un status 200
        if (res.data && res.data.length > 0 && res.data[0].message) {
          let errorMessage = res.data[0].message;

          // Personalizar el mensaje de error
          if (errorMessage.includes("unique validation failed on numero")) {
            errorMessage = "Este número ya está en uso.";
          } else if (errorMessage.includes("unique validation failed on email")) {
            errorMessage = "Este correo electrónico ya está en uso.";
          }

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonText: 'Ok',
          });
        } else {
          // Si no hay error en la respuesta, proceder con el éxito
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'Redirigiendo al login...',
            showConfirmButton: false,
            timer: 2000,
          });
          setTimeout(() => {
            router.push("/loginCliente");
          }, 2000); // Redirige después de 2 segundos para que el mensaje sea visible
        }
      }
    } catch (error) {
      // Si el backend devuelve un error, pero con un código de estado distinto, mostrar el error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error durante el registro. Inténtalo de nuevo.',
        confirmButtonText: 'Ok',
      });
      console.error("Error durante el registro:", error.message);
    }
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      minHeight="100vh" 
      sx={{ 
        backgroundColor: '#f5f5f5',
        width: '100%',
        overflowX: 'hidden' // Previene scroll horizontal
      }}
    >
      <Header />
      
      <Box 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3, md: 4 }, // Padding responsivo
          maxWidth: { xs: '100%', sm: '90%', md: 1400 },
          mx: 'auto',
          width: '100%'
        }}
      >
        <Button
          variant="contained"
          onClick={() => router.push('./dashboardAdmin')}
          startIcon={<ArrowBack />}
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
            backgroundColor: 'darkorange',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            padding: { xs: '6px 12px', sm: '8px 16px' },
            '&:hover': {
              backgroundColor: '#ff8c00',
            }
          }}
        >
          Volver al Dashboard
        </Button>

        <Grid 
          container 
          justifyContent="center"
          sx={{ 
            px: { xs: 1, sm: 2, md: 0 } // Padding horizontal responsivo
          }}
        >
          <Grid 
            item 
            xs={12} 
            sm={10} 
            md={6}
            sx={{
              transition: 'all 0.3s ease',
            }}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 2, sm: 3 }, // Padding interno responsivo
                borderRadius: { xs: 1, sm: 2 },
                backgroundColor: '#ffffff',
                transition: 'all 0.3s ease',
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'darkorange',
                  mb: { xs: 2, sm: 3 },
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                }}
              >
                Registro de Usuarios
              </Typography>

              <Box 
                component="form" 
                onSubmit={handleSubmit}
                sx={{
                  '& .MuiTextField-root, & .MuiFormControl-root': {
                    mb: { xs: 1.5, sm: 2 }, // Margen entre campos responsivo
                  }
                }}
              >
                {error && (
                  <Typography 
                    color="error" 
                    variant="body2" 
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    {error}
                  </Typography>
                )}

                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '45px', sm: '56px' },
                      '&.Mui-focused fieldset': {
                        borderColor: 'darkorange',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: 'darkorange',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    },
                  }}
                />

                <TextField
                  label="Número"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={(e) => setUser({ ...user, numero: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '45px', sm: '56px' },
                      '&.Mui-focused fieldset': {
                        borderColor: 'darkorange',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: 'darkorange',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    },
                  }}
                />

                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '45px', sm: '56px' },
                      '&.Mui-focused fieldset': {
                        borderColor: 'darkorange',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: 'darkorange',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    },
                  }}
                />

                <TextField
                  label="Contraseña"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '45px', sm: '56px' },
                      '&.Mui-focused fieldset': {
                        borderColor: 'darkorange',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: 'darkorange',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    },
                  }}
                />

                <FormControl 
                  fullWidth 
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '45px', sm: '56px' },
                      '&.Mui-focused fieldset': {
                        borderColor: 'darkorange',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: 'darkorange',
                      },
                    },
                    '& .MuiSelect-select': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    },
                  }}
                >
                  <InputLabel id="rol-label">Rol</InputLabel>
                  <Select
                    labelId="rol-label"
                    id="rol"
                    value={user.rol}
                    label="Rol"
                    onChange={(e) => setUser({ ...user, rol: e.target.value })}
                  >
                    <MenuItem value="usuario">Usuario</MenuItem>
                    <MenuItem value="administrador">Administrador</MenuItem>
                    <MenuItem value="ayudante">Ayudante</MenuItem>
                  </Select>
                </FormControl>

                <Button 
                  variant="contained" 
                  type="submit" 
                  fullWidth 
                  sx={{ 
                    mt: { xs: 2, sm: 3 },
                    height: { xs: '45px', sm: '56px' },
                    backgroundColor: 'darkorange',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#ff8c00',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Registrar Usuario
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
}

export default RegistroRoles;
