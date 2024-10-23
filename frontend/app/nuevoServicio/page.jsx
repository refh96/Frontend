'use client';

import axios from "axios";
import { useState, useEffect } from "react";
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
  IconButton
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'; // Iconos de eliminar y editar
import { parseCookies } from 'nookies';

function NuevoServicio() {
  const [servicio, setServicio] = useState({
    nombre_servicio: "",
    descripcion: "",
    categoria: "",
    precio: "",
  });

  const [servicios, setServicios] = useState([]);
  const [editingId, setEditingId] = useState(null); // Estado para manejar el modo de edición
  const [error, setError] = useState(null);
  const router = useRouter();

  // Función para cargar los servicios existentes
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await axios.get("https://fullwash.site/servicios");
        setServicios(res.data);
      } catch (error) {
        console.error("Error fetching services:", error.message);
      }
    };

    fetchServicios();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setServicio((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar la creación o edición de un servicio
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
        // Si estamos en modo edición
        await axios.put(
          `https://fullwash.site/servicios/${editingId}`,
          servicio,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Servicio editado exitosamente");
      } else {
        // Si estamos creando un nuevo servicio
        await axios.post(
          "https://fullwash.site/servicios",
          servicio,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Servicio creado exitosamente");
      }

      setServicio({
        nombre_servicio: "",
        descripcion: "",
        categoria: "",
        precio: "",
      });
      setEditingId(null); // Salimos del modo edición
      fetchServicios(); // Refrescar la lista de servicios
    } catch (error) {
      console.error("Error submitting service:", error.message);
      setError("Error al procesar el servicio");
    }
  };

  // Función para eliminar un servicio
  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este servicio?");
    if (!confirmed) return;

    try {
      const cookies = parseCookies();
      const token = cookies.token;

      if (!token) {
        alert("Por favor, inicia sesión para continuar.");
        return;
      }

      await axios.delete(`https://fullwash.site/servicios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Servicio eliminado exitosamente");
      fetchServicios(); // Refrescar la lista de servicios después de eliminar
    } catch (error) {
      console.error("Error deleting service:", error.message);
      setError("Error al eliminar el servicio");
    }
  };

  // Función para cargar los servicios nuevamente
  const fetchServicios = async () => {
    try {
      const res = await axios.get("https://fullwash.site/servicios");
      setServicios(res.data);
    } catch (error) {
      console.error("Error fetching services:", error.message);
    }
  };

  // Función para editar un servicio existente
  const handleEdit = (servicio) => {
    setServicio({
      nombre_servicio: servicio.nombre_servicio,
      descripcion: servicio.descripcion,
      categoria: servicio.categoria,
      precio: servicio.precio,
    });
    setEditingId(servicio.id); // Activar el modo edición
  };

  return (
    
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => router.push('./dashboardAdmin')}
        sx={{ mt: 2 }}
      >
        Volver
      </Button>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom>
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
                label="Descripción"
                name="descripcion"
                value={servicio.descripcion}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Categoría"
                name="categoria"
                value={servicio.categoria}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Precio"
                name="precio"
                value={servicio.precio}
                onChange={handleChange}
                required
              />
              <Button variant="contained" color="primary" type="submit" fullWidth>
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre del Servicio</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {servicios.map((servicio) => (
                  <TableRow key={servicio.id}>
                    <TableCell>{servicio.id}</TableCell>
                    <TableCell>{servicio.nombre_servicio}</TableCell>
                    <TableCell>{servicio.descripcion}</TableCell>
                    <TableCell>{servicio.categoria}</TableCell>
                    <TableCell>${servicio.precio}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(servicio)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(servicio.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default NuevoServicio;
