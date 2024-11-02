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
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { parseCookies } from 'nookies';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Atributos() {
  const [atributo, setAtributo] = useState({
    nombre_atributo: "",
    costo_atributo: "",
  });
  const [atributos, setAtributos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchAtributos();
  }, []);

  const fetchAtributos = async () => {
    try {
      const res = await axios.get("https://fullwash.site/atributos");
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
          `https://fullwash.site/atributos/${editingId}`,
          atributo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Atributo editado exitosamente");
      } else {
        await axios.post(
          "https://fullwash.site/atributos",
          atributo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Atributo creado exitosamente");
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

      await axios.delete(`https://fullwash.site/atributos/${id}`, {
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h4" color="darkorange" gutterBottom>
                {editingId ? "Editar Atributo" : "Nuevo Atributo"}
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, width: '100%' }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nombre del Atributo"
                  name="nombre_atributo"
                  value={atributo.nombre_atributo}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Costo del Atributo"
                  name="costo_atributo"
                  value={atributo.costo_atributo}
                  onChange={handleChange}
                  type="number"
                  required
                />

                <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
                  {editingId ? "Actualizar Atributo" : "Crear Atributo"}
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
                Lista de Atributos
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Nombre del Atributo</TableCell>
                      <TableCell>Costo del Atributo</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {atributos.map((atributo) => (
                      <TableRow key={atributo.id}>
                        <TableCell>{atributo.id}</TableCell>
                        <TableCell>{atributo.nombre_atributo}</TableCell>
                        <TableCell>${atributo.costo_atributo}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleEdit(atributo)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(atributo.id)}>
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

export default Atributos;
