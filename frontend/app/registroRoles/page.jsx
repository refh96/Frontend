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
    <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ backgroundColor: '#f5f5f5' }}>
      <Header />
      
      <Box sx={{ 
        flexGrow: 1, 
        p: 3, 
        maxWidth: 1400, 
        mx: 'auto',
        width: '100%'
      }}>
        {/* Botón de regreso con mejor diseño */}
        <Button
          variant="contained"
          onClick={() => router.push('./dashboardAdmin')}
          startIcon={<ArrowBack />}
          sx={{
            mb: 4,
            backgroundColor: 'darkorange',
            '&:hover': {
              backgroundColor: '#ff8c00',
            }
          }}
        >
          Volver al Dashboard
        </Button>

        <Grid container justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'darkorange',
                  mb: 3,
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                Registro de Usuarios
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                {error && (
                  <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}

                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'darkorange',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'darkorange',
                    },
                  }}
                />

                <TextField
                  label="Número"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  onChange={(e) => setUser({ ...user, numero: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'darkorange',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'darkorange',
                    },
                  }}
                />

                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'darkorange',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'darkorange',
                    },
                  }}
                />

                <TextField
                  label="Contraseña"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'darkorange',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'darkorange',
                    },
                  }}
                />

                <FormControl 
                  fullWidth 
                  margin="normal"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'darkorange',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'darkorange',
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
                    mt: 3,
                    backgroundColor: 'darkorange',
                    '&:hover': {
                      backgroundColor: '#ff8c00',
                    }
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
