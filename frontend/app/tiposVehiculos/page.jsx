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
  Alert,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, ArrowBack } from '@mui/icons-material';
import { parseCookies } from 'nookies';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

function TiposDeVehiculo() {
  const [tipoVehiculo, setTipoVehiculo] = useState({
    nombre: "",
    costo: "",
  });
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null);
  const router = useRouter();
  const formRef = useRef(null); // Referencia al formulario

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
        fetchTiposDeVehiculo();
      } catch (error) {
        console.error("Error verifying user:", error.message);
        router.push("/loginAdmin");
      }
    };

    verifyUser();
  }, [router]);

  const fetchTiposDeVehiculo = async () => {
    try {
      const res = await axios.get("https://fullwash.site/tipo_vehiculos");
      setTiposVehiculo(res.data);
    } catch (error) {
      console.error("Error fetching vehicle types:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTipoVehiculo((prev) => ({ ...prev, [name]: value }));
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
          `https://fullwash.site/tipo_vehiculos/${editingId}`,
          tipoVehiculo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          title: 'Éxito!',
          text: 'Tipo de Vehiculo Editado exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        await axios.post(
          "https://fullwash.site/tipo_vehiculos",
          tipoVehiculo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          title: 'Éxito!',
          text: 'Tipo de Vehiculo Creado exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 3000,
          timerProgressBar: true,
        });
      }

      setTipoVehiculo({ nombre: "", costo: "" });
      setEditingId(null);
      fetchTiposDeVehiculo();
    } catch (error) {
      console.error("Error submitting vehicle type:", error.message);
      setError("Error al procesar el tipo de vehículo");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este tipo de vehículo?");
    if (!confirmed) return;

    try {
      const cookies = parseCookies();
      const token = cookies.token;

      if (!token) {
        alert("Por favor, inicia sesión para continuar.");
        return;
      }

      await axios.delete(`https://fullwash.site/tipo_vehiculos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Tipo de vehículo eliminado exitosamente");
      fetchTiposDeVehiculo();
    } catch (error) {
      console.error("Error deleting vehicle type:", error.message);
      setError("Error al eliminar el tipo de vehículo");
    }
  };

  const handleEdit = (tipoVehiculo) => {
    setTipoVehiculo({
      nombre: tipoVehiculo.nombre,
      costo: tipoVehiculo.costo,
    });
    setEditingId(tipoVehiculo.id);
    formRef.current.scrollIntoView({ behavior: "smooth" }); // Mueve el scroll al formulario

  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ backgroundColor: '#f5f5f5' }}>
      <Header />
      
      {/* Container principal con padding y máximo ancho */}
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

        <Grid container spacing={4}>
          {/* Formulario */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                height: '100%',
                backgroundColor: 'white'
              }}
              ref={formRef}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'darkorange',
                  mb: 3,
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                {editingId ? 'Editar Tipo de Vehículo' : 'Nuevo Tipo de Vehículo'}
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nombre del Tipo"
                  name="nombre"
                  value={tipoVehiculo.nombre}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Costo"
                  name="costo"
                  type="number"
                  value={tipoVehiculo.costo}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{ mb: 3 }}
                />

                <Button 
                  variant="contained" 
                  type="submit" 
                  fullWidth
                  sx={{
                    backgroundColor: 'darkorange',
                    '&:hover': {
                      backgroundColor: '#ff8c00',
                    },
                    py: 1.5
                  }}
                >
                  {editingId ? 'Actualizar Tipo' : 'Crear Tipo'}
                </Button>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Paper>
          </Grid>

          {/* Tabla */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={3} 
              sx={{ 
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Box sx={{ p: 3, backgroundColor: 'white' }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'darkorange',
                    mb: 3,
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                >
                  Lista de Tipos de Vehículos
                </Typography>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Nombre</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Costo</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tiposVehiculo.map((tipo) => (
                        <TableRow 
                          key={tipo.id}
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: '#f8f8f8' 
                            }
                          }}
                        >
                          <TableCell>{tipo.id}</TableCell>
                          <TableCell>{tipo.nombre}</TableCell>
                          <TableCell>${tipo.costo}</TableCell>
                          <TableCell>
                            <IconButton 
                              onClick={() => handleEdit(tipo)}
                              sx={{ 
                                color: 'darkorange',
                                '&:hover': { 
                                  backgroundColor: 'rgba(255, 140, 0, 0.1)' 
                                }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDelete(tipo.id)}
                              sx={{ 
                                color: 'error.main',
                                '&:hover': { 
                                  backgroundColor: 'rgba(211, 47, 47, 0.1)' 
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
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
}

export default TiposDeVehiculo;
