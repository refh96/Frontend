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
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
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
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Button
        variant="contained"
        color="secondary"
        onClick={() => router.push('./dashboardAdmin')}
        sx={{ mt: 2, alignSelf: 'flex-start', fontSize: '0.75rem', padding: '4px 8px' }}
      >
        Volver
      </Button>

      <Box sx={{ flexGrow: 1, mt: 4 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box ref={formRef} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h4" color="darkorange" gutterBottom>
                {editingId ? "Editar Servicio" : "Nuevo Servicio"}
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, width: '100%' }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nombre del Servicio"
                  name="nombre_servicio"
                  value={servicio.nombre_servicio}
                  onChange={handleChange}
                  required
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
                />
                <FormControl fullWidth margin="normal">
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
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Detalles Incluidos (separados por comas)"
                  name="detalles_incluidos"
                  value={servicio.detalles_incluidos}
                  onChange={handleChange}
                />
                <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
                  {editingId ? "Actualizar Servicio" : "Crear Servicio"}
                </Button>
              </Box>

              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h4" color="darkorange" gutterBottom>
                Lista de Servicios
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Nombre del Servicio</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell>Tiempo Estimado</TableCell>
                      <TableCell>Detalles Incluidos</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {servicios.map((servicio) => (
                      <TableRow key={servicio.id}>
                        <TableCell>{servicio.id}</TableCell>
                        <TableCell>{servicio.nombre_servicio}</TableCell>
                        <TableCell>{servicio.categoria}</TableCell>
                        <TableCell>{servicio.precio}</TableCell>
                        <TableCell>{servicio.tiempo_estimado} minutos</TableCell>
                        <TableCell>{servicio.detalles_incluidos}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleEdit(servicio)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(servicio.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
}

export default NuevoServicio;
