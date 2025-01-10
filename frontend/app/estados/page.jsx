'use client';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, ArrowBack } from '@mui/icons-material';
import { parseCookies } from 'nookies';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

function Estados() {
  const [estado, setEstado] = useState({
    nombre: '',
    mensaje: '',
  });
  const [estados, setEstados] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();
  const formRef = useRef(null); // Referencia al formulario
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

        const role = res.data.user.rol;
        setUserRole(role);
        if (role !== "administrador" && role !== "ayudante") {
          router.push("/loginCliente");
          return;
        }

        setLoading(false); // Detener el estado de carga si es administrador
        fetchEstados();
      } catch (error) {
        console.error("Error verifying user:", error.message);
        router.push("/loginAdmin");
      }
    };

    verifyUser();
  }, [router]);

  const fetchEstados = async () => {
    try {
      const res = await axios.get('https://fullwash.site/estados');
      setEstados(res.data);
    } catch (error) {
      console.error('Error fetching states:', error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEstado((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cookies = parseCookies();
    const token = cookies.token;
    if (!token) {
      alert('Por favor, inicia sesión para continuar.');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`https://fullwash.site/estados/${editingId}`, estado, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          title: 'Éxito!',
          text: 'Estado Editado exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        await axios.post('https://fullwash.site/estados', estado, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          title: 'Éxito!',
          text: 'Estado Creado exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 3000,
          timerProgressBar: true,
        });
      }

      setEstado({ nombre: '', mensaje: '' });
      setEditingId(null);
      fetchEstados();
    } catch (error) {
      console.error('Error submitting state:', error.message);
      setError('Error al procesar el estado');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este estado?');
    if (!confirmed) return;

    try {
      const cookies = parseCookies();
      const token = cookies.token;
      if (!token) {
        alert('Por favor, inicia sesión para continuar.');
        return;
      }

      await axios.delete(`https://fullwash.site/estados/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Estado eliminado exitosamente');
      fetchEstados();
    } catch (error) {
      console.error('Error deleting state:', error.message);
      setError('Error al eliminar el estado');
    }
  };

  const handleEdit = (estado) => {
    setEstado({
      nombre: estado.nombre,
      mensaje: estado.mensaje,
    });
    setEditingId(estado.id);
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
          onClick={() => {
            if (userRole === "administrador") {
              router.push('/dashboardAdmin');
            } else if (userRole === "ayudante") {
              router.push('/dashboardAyudante');
            }
          }}
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
                {editingId ? 'Editar Estado' : 'Nuevo Estado'}
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nombre del Estado"
                  name="nombre"
                  value={estado.nombre}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Mensaje"
                  name="mensaje"
                  value={estado.mensaje}
                  onChange={handleChange}
                  multiline
                  rows={4}
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
                  {editingId ? 'Actualizar Estado' : 'Crear Estado'}
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
                  Lista de Estados
                </Typography>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Nombre</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Mensaje</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {estados.map((estado) => (
                        <TableRow
                          key={estado.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#f8f8f8'
                            }
                          }}
                        >
                          <TableCell>{estado.id}</TableCell>
                          <TableCell>{estado.nombre}</TableCell>
                          <TableCell>{estado.mensaje}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleEdit(estado)}
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
                              onClick={() => handleDelete(estado.id)}
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

export default Estados;
