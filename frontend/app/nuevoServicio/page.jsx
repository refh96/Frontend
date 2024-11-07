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
  Chip,
  OutlinedInput,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { parseCookies } from 'nookies';
import Header from '../components/Header';
import Footer from '../components/Footer';
function NuevoServicio() {
  const [servicio, setServicio] = useState({
    nombre_servicio: "",
    descripcion: "",
    categoria: "",
    atributo_ids: [],
  });
  const [servicios, setServicios] = useState([]);
  const [atributos, setAtributos] = useState([]);
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
        fetchServicios();
        fetchAtributos(); // Cargar los atributos después de verificar el rol
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

  const fetchAtributos = async () => {
    try {
      const res = await axios.get("https://fullwash.site/atributos");
      if (res.data && Array.isArray(res.data)) {
        setAtributos(res.data);
      } else {
        console.error("Formato inesperado en la respuesta de la API");
      }
    } catch (error) {
      console.error("Error fetching attributes:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServicio((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    setServicio({
      ...servicio,
      atributo_ids: typeof value === 'string' ? value.split(',') : value,
    });
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
          servicio,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Servicio editado exitosamente");
      } else {
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

      // Reset form after submission
      setServicio({
        nombre_servicio: "",
        descripcion: "",
        categoria: "",
        atributo_ids: [],
      });
      setEditingId(null);
      fetchServicios(); // Asegúrate de actualizar la lista de servicios
    } catch (error) {
      console.error("Error submitting service:", error.message);
      setError("Error al procesar el servicio");
    }
  };

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
      fetchServicios();
    } catch (error) {
      console.error("Error deleting service:", error.message);
      setError("Error al eliminar el servicio");
    }
  };

  const handleEdit = (servicio) => {
    setServicio({
      nombre_servicio: servicio.nombre_servicio,
      descripcion: servicio.descripcion,
      categoria: servicio.categoria,
      atributo_ids: servicio.atributos.map((attr) => attr.id),
    });
    setEditingId(servicio.id);
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
                <FormControl fullWidth margin="normal">
                  <InputLabel>Atributos</InputLabel>
                  <Select
                    multiple
                    value={servicio.atributo_ids}
                    onChange={handleSelectChange}
                    input={<OutlinedInput label="Atributos" />}
                    renderValue={(selected) => (
                      <div>
                        {selected.map((value) => {
                          const atributo = atributos.find(attr => attr.id === value);
                          return (
                            <Chip key={value} label={atributo ? `${atributo.nombre_atributo} - $${atributo.costo_atributo}` : value} />
                          );
                        })}
                      </div>
                    )}
                  >
                    {atributos.map((atributo) => (
                      <MenuItem key={atributo.id} value={atributo.id}>
                        {atributo.nombre_atributo} - ${atributo.costo_atributo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
                {editingId ? "Lista Servicio" : "Lista Servicios"}
              </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre del Servicio</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Atributos</TableCell>
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
                      <TableCell>{servicio.precio}</TableCell>
                      <TableCell>
                        {servicio.atributos.map(attr => attr.nombre_atributo).join(', ')}
                      </TableCell>
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
