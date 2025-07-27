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
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, ArrowBack } from '@mui/icons-material';
import { parseCookies } from 'nookies';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

function Atributos() {
  const [atributo, setAtributo] = useState({
    nombre_atributo: "",
    costo_atributo: "",
  });
  
  const [atributos, setAtributos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
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
          "https://fullwash.online/profile",
          {} ,
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
        fetchAtributos(); // Cargar los atributos después de verificar el rol
      } catch (error) {
        console.error("Error verifying user:", error.message);
        router.push("/loginAdmin");
      }
    };

    verifyUser();
  }, [router]);

  const fetchAtributos = async () => {
    try {
      const res = await axios.get("https://fullwash.online/atributos");
      setAtributos(res.data);
    } catch (error) {
      console.error("Error fetching attributes:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAtributo((prev) => ({ ...prev, [name]: value }));
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
          `https://fullwash.online/atributos/${editingId}`,
          atributo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          title: 'Éxito!',
          text: 'Atributo Editado exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        await axios.post(
          "https://fullwash.online/atributos",
          atributo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          title: 'Éxito!',
          text: 'Atributo Creado exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 3000,
          timerProgressBar: true,
        });
      }

      setAtributo({ nombre_atributo: "", costo_atributo: "" });
      setEditingId(null);
      fetchAtributos();
    } catch (error) {
      console.error("Error submitting attribute:", error.message);
      setError("Error al procesar el atributo");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este atributo?");
    if (!confirmed) return;

    try {
      const cookies = parseCookies();
      const token = cookies.token;

      if (!token) {
        alert("Por favor, inicia sesión para continuar.");
        return;
      }

      await axios.delete(`https://fullwash.online/atributos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Atributo eliminado exitosamente");
      fetchAtributos();
    } catch (error) {
      console.error("Error deleting attribute:", error.message);
      setError("Error al eliminar el atributo");
    }
  };

  const handleEdit = (atributo) => {
    setAtributo({
      nombre_atributo: atributo.nombre_atributo,
      costo_atributo: atributo.costo_atributo,
    });
    setEditingId(atributo.id);
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) return <p>Loading...</p>; // Mostrar mensaje de carga mientras se verifica el rol

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
                {editingId ? "Editar Atributo" : "Nuevo Atributo"}
              </Typography>

              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                ref={formRef}
              >
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nombre del Atributo"
                  name="nombre_atributo"
                  value={atributo.nombre_atributo}
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
                  label="Costo del Atributo"
                  name="costo_atributo"
                  type="number"
                  value={atributo.costo_atributo}
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
                  {editingId ? "Actualizar Atributo" : "Crear Atributo"}
                </Button>
              </Box>

              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Tabla de Atributos */}
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
                Lista de Atributos
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Nombre del Atributo</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Costo</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {atributos.map((atributo) => (
                      <TableRow 
                        key={atributo.id}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: '#f8f8f8' 
                          }
                        }}
                      >
                        <TableCell>{atributo.id}</TableCell>
                        <TableCell>{atributo.nombre_atributo}</TableCell>
                        <TableCell>${atributo.costo_atributo}</TableCell>
                        <TableCell>
                          <IconButton 
                            onClick={() => handleEdit(atributo)}
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
                            onClick={() => handleDelete(atributo.id)}
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

export default Atributos;
