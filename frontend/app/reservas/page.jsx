'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Container,
  TablePagination,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

const GestionReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const verificarAcceso = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;

        if (!token) {
          router.push('/loginAdmin');
          return;
        }

        const profileRes = await axios.post(
          "https://fullwash.site/profile",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const role = profileRes.data.user.rol;
        setUserRole(role);
        if (role !== "administrador" && role !== "ayudante") {
          Swal.fire({
            title: 'Acceso Denegado',
            text: 'No tienes permisos para ver esta página',
            icon: 'error',
            confirmButtonText: 'Ok'
          }).then(() => {
            router.push('/loginAdmin');
          });
          return;
        }

        await Promise.all([fetchReservas(), fetchEstados()]);
        setLoading(false);
      } catch (error) {
        console.error("Error verificando usuario:", error);
        router.push('/loginAdmin');
      }
    };

    verificarAcceso();
  }, [router]);

  const fetchReservas = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies.token;
      const response = await axios.get('https://fullwash.site/reservas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Respuesta de reservas:', response.data.reservas[0]); // Para ver la estructura
      setReservas(response.data.reservas);
    } catch (error) {
      console.error('Error obteniendo reservas:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las reservas',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  const fetchEstados = async () => {
    try {
      const response = await axios.get('https://fullwash.site/estados');
      setEstados(response.data);
    } catch (error) {
      console.error('Error obteniendo estados:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los estados',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  const handleEstadoChange = async (reservaId, newEstadoId) => {
    try {
      // Encontrar el estado seleccionado para mostrar su mensaje
      const estadoSeleccionado = estados.find(estado => estado.id === newEstadoId);
      if (!estadoSeleccionado) {
        console.error("Estado no encontrado");
        return;
      }

      // Mostrar el mensaje del estado y pedir confirmación
      const result = await Swal.fire({
        title: `Cambiar estado a "${estadoSeleccionado.nombre}"`,
        text: estadoSeleccionado.mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cambiar estado',
        cancelButtonText: 'Cancelar'
      });

      // Si el usuario no confirma, salir de la función
      if (!result.isConfirmed) {
        return;
      }

      const cookies = parseCookies();
      const token = cookies.token;
      const reservaToUpdate = reservas.find(r => r.id === reservaId);

      if (!reservaToUpdate) {
        console.error("Reserva no encontrada");
        return;
      }

      const atributoIds = reservaToUpdate.atributos
        ? reservaToUpdate.atributos.map(atributo => atributo.id)
        : [];

      await axios.put(
        `https://fullwash.site/reservas/${reservaId}`,
        {
          user_id: reservaToUpdate.user_id,
          servicio_id: reservaToUpdate.servicio_id,
          fecha: reservaToUpdate.fecha.slice(0, 10),
          hora: reservaToUpdate.hora,
          estado_id: newEstadoId,
          tipo_vehiculo_id: reservaToUpdate.tipo_vehiculo_id,
          atributo_ids: atributoIds
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: 'Éxito',
        text: 'Estado actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Ok'
      });

      // Actualizar la lista de reservas
      await fetchReservas();
    } catch (error) {
      console.error("Error actualizando estado:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el estado',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress sx={{ color: 'darkorange' }} />
        <Typography>Cargando reservas...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container sx={{ flexGrow: 1, py: 4 }}>
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

        <Typography variant="h4" component="h1" sx={{ mb: 4, color: 'darkorange' }}>
          Gestión de Reservas
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Cliente</TableCell>
                <TableCell>Servicio</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Tipo de Vehículo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((reserva) => (
                  <TableRow key={reserva.id} hover>
                    <TableCell>{reserva.user?.username || 'Usuario Desconocido'}</TableCell>
                    <TableCell>{reserva.servicio?.nombre_servicio || 'Servicio No Disponible'}</TableCell>
                    <TableCell>{formatDate(reserva.fecha)}</TableCell>
                    <TableCell>{reserva.hora}</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <Select
                          value={reserva.estado_id}
                          onChange={(e) => handleEstadoChange(reserva.id, e.target.value)}
                          size="small"
                        >
                          {estados.map((estado) => (
                            <MenuItem key={estado.id} value={estado.id}>
                              {estado.nombre}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>{reserva.tipo_vehiculo?.nombre || 'No especificado'}</TableCell>
                    <TableCell>
                      {reserva.estado?.nombre}
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={reservas.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count}`
          }
          sx={{
            '.MuiTablePagination-select': {
              backgroundColor: '#f5f5f5',
            }
          }}
        />
      </Container>
      <Footer />
    </Box>
  );
};

export default GestionReservas;
