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
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { parseCookies } from 'nookies';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
        alert("Tipo de vehículo editado exitosamente");
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
        alert("Tipo de vehículo creado exitosamente");
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
                {editingId ? "Editar Tipo de Vehículo" : "Nuevo Tipo de Vehículo"}
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, width: '100%' }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nombre del Tipo de Vehículo"
                  name="nombre"
                  value={tipoVehiculo.nombre}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Costo"
                  name="costo"
                  value={tipoVehiculo.costo}
                  onChange={handleChange}
                  type="number"
                  required
                />

                <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
                  {editingId ? "Actualizar Tipo de Vehículo" : "Crear Tipo de Vehículo"}
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
                Lista de Tipos de Vehículo
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Costo</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tiposVehiculo.map((tipo) => (
                      <TableRow key={tipo.id}>
                        <TableCell>{tipo.id}</TableCell>
                        <TableCell>{tipo.nombre}</TableCell>
                        <TableCell>${tipo.costo}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleEdit(tipo)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(tipo.id)}>
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

export default TiposDeVehiculo;
