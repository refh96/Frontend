'use client';
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, ArrowBack } from '@mui/icons-material';
import { parseCookies } from 'nookies';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

function NuevoServicio() {
  const [servicio, setServicio] = useState({
    nombre_servicio: "",
    categoria: "",
    precio: "",
    tiempo_estimado: "",
    detalles_incluidos: "", // Nuevo campo
  });
  const [servicios, setServicios] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const formRef = useRef(null);

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

        setLoading(false);
        fetchServicios();
      } catch (error) {
        console.error("Error verifying user:", error.message);
        router.push("/loginAdmin");
      }
    };

    verifyUser();
  }, [router]);

  const fetchServicios = async () => {
    try {
      const res = await axios.get("https://fullwash.site/servicios");
      setServicios(res.data.data);
    } catch (error) {
      console.error("Error fetching services:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServicio((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cookies = parseCookies();
    const token = cookies.token;
    if (!token) {
      alert("Por favor, inicia sesión para continuar.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `https://fullwash.site/servicios/${editingId}`,
          {
            ...servicio,
            detalles_incluidos: servicio.detalles_incluidos,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          title: 'Éxito!',
          text: 'Servicio Editado exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        await axios.post(
          "https://fullwash.site/servicios",
          {
            ...servicio,
            detalles_incluidos: servicio.detalles_incluidos, // Envía directamente como string
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          title: 'Éxito!',
          text: 'Servicio Creado exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 3000,
          timerProgressBar: true,
        });
      }

      setServicio({
        nombre_servicio: "",
        categoria: "",
        precio: "",
        tiempo_estimado: "",
        detalles_incluidos: "",
      });
      setEditingId(null);
      fetchServicios();
    } catch (error) {
      console.error("Error submitting service:", error.message);
      // Accede al mensaje de error desde la respuesta del servidor
      const errorMessage = error.response?.data?.message || "Error al procesar el servicio";
      setError(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este servicio?");
    if (!confirmed) return;

    try {
      const cookies = parseCookies();
      const token = cookies.token;

      if (!token) {
        Swal.fire({
          title: 'Error!',
          text: 'Porfavor Inicia sesion para continuar',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          timer: 3000,
          timerProgressBar: true,
        });
        return;
      }

      await axios.delete(`https://fullwash.site/servicios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: 'Éxito!',
        text: 'Servicio Eliminado exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        timer: 3000,
        timerProgressBar: true,
      });
      fetchServicios();
    } catch (error) {
      console.error("Error deleting service:", error.message);
      setError("Error al eliminar el servicio");
    }
  };

  const handleEdit = (servicio) => {
    setServicio({
      nombre_servicio: servicio.nombre_servicio,
      categoria: servicio.categoria,
      precio: servicio.precio,
      tiempo_estimado: servicio.tiempo_estimado,
      detalles_incluidos: servicio.detalles_incluidos, // Convertimos de JSON a string
    });
    setEditingId(servicio.id);
    formRef.current.scrollIntoView({ behavior: "smooth" });
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

        <Grid container spacing={3}>
          {/* Formulario */}
          <Grid item xs={12} md={4}>
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
                {editingId ? "Editar Servicio" : "Nuevo Servicio"}
              </Typography>

              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                ref={formRef}
              >
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nombre del Servicio"
                  name="nombre_servicio"
                  value={servicio.nombre_servicio}
                  onChange={handleChange}
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
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Tiempo Estimado (en minutos)"
                  name="tiempo_estimado"
                  type="number"
                  value={servicio.tiempo_estimado}
                  onChange={handleChange}
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
                />
                <FormControl 
                  fullWidth 
                  margin="normal"
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
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={servicio.categoria}
                    name="categoria"
                    onChange={handleChange}
                    label="Categoría"
                    required
                  >
                    <MenuItem value="Lavados">Lavados</MenuItem>
                    <MenuItem value="Otros">Otros</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Precio"
                  name="precio"
                  type="number"
                  value={servicio.precio}
                  onChange={handleChange}
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
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Detalles Incluidos (separados por comas)"
                  name="detalles_incluidos"
                  value={servicio.detalles_incluidos}
                  onChange={handleChange}
                  multiline
                  rows={3}
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
                <Button 
                  variant="contained" 
                  type="submit" 
                  fullWidth 
                  sx={{ 
                    mt: 2,
                    backgroundColor: 'darkorange',
                    '&:hover': {
                      backgroundColor: '#ff8c00',
                    }
                  }}
                >
                  {editingId ? "Actualizar Servicio" : "Crear Servicio"}
                </Button>
              </Box>

              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Tabla de Servicios */}
          <Grid item xs={12} md={8}>
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
                Lista de Servicios
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Nombre del Servicio</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Categoría</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Precio</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Tiempo Estimado</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Detalles Incluidos</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {servicios.map((servicio) => (
                      <TableRow 
                        key={servicio.id}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: '#f8f8f8' 
                          }
                        }}
                      >
                        <TableCell>{servicio.id}</TableCell>
                        <TableCell>{servicio.nombre_servicio}</TableCell>
                        <TableCell>{servicio.categoria}</TableCell>
                        <TableCell>${servicio.precio}</TableCell>
                        <TableCell>{servicio.tiempo_estimado} minutos</TableCell>
                        <TableCell>{servicio.detalles_incluidos}</TableCell>
                        <TableCell>
                          <IconButton 
                            onClick={() => handleEdit(servicio)}
                            sx={{ 
                              color: 'darkorange',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 140, 0, 0.1)',
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(servicio.id)}
                            sx={{ 
                              color: '#d32f2f',
                              '&:hover': {
                                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
}

export default NuevoServicio;
