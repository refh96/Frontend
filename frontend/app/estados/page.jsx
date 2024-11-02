'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { parseCookies } from 'nookies';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Estados() {
  const [estado, setEstado] = useState({
    nombre: '',
    mensaje: '',
  });
  const [estados, setEstados] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchEstados();
  }, []);

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
        alert('Estado editado exitosamente');
      } else {
        await axios.post('https://fullwash.site/estados', estado, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Estado creado exitosamente');
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
                {editingId ? 'Editar Estado' : 'Nuevo Estado'}
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, width: '100%' }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nombre del Estado"
                  name="nombre"
                  value={estado.nombre}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Mensaje"
                  name="mensaje"
                  value={estado.mensaje}
                  onChange={handleChange}
                  multiline
                  required
                />

                <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
                  {editingId ? 'Actualizar Estado' : 'Crear Estado'}
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
                Lista de Estados
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Mensaje</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {estados.map((estado) => (
                      <TableRow key={estado.id}>
                        <TableCell>{estado.id}</TableCell>
                        <TableCell>{estado.nombre}</TableCell>
                        <TableCell>{estado.mensaje}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleEdit(estado)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(estado.id)}>
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

export default Estados;
