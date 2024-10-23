'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { parseCookies, destroyCookie } from 'nookies';
import Header from '../components/Header';
import Footer from '../components/Footer';

function DashboardCliente() {
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [servicios, setServicios] = useState([]);
  const [tipo_vehiculos, setTipoVehiculo] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [reservation, setReservation] = useState({
    user_id: "",
    servicio_id: "",
    fecha: "",
    hora: "",
    estado: "pendiente",
    tipo_vehiculo_id: "",
  });
  const [editing, setEditing] = useState(false);
  const [editReservation, setEditReservation] = useState(null);
  const [error, setError] = useState(null);
  const [activeScreen, setActiveScreen] = useState("reservas");
  const [showForm, setShowForm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false); // Para mostrar el formulario de edición de perfil
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;
        if (!token) {
          router.push("/loginCliente");
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

        setUser(res.data.user);
        setReservation(prev => ({ ...prev, user_id: res.data.user.id }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await axios.get("https://fullwash.site/servicios");
        setServicios(res.data);
      } catch (error) {
        console.error("Error fetching services:", error.message);
      }
    };
    const fetchTipoVehiculo = async () => {
      try {
        const res = await axios.get("https://fullwash.site/tipo_vehiculos");
        setTipoVehiculo(res.data);
      } catch (error) {
        console.error("Error fetching tipoVehiculo:", error.message);
      }
    };

    const fetchReservas = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;
        if (!token) {
          return;
        }

        const res = await axios.get(
          `https://fullwash.site/reservas/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );

        if (res.data && res.data.reservas) {
          setReservas(res.data.reservas);
        } else {
          setReservas([]);
        }
      } catch (error) {
        console.error("Error fetching reservas:", error.message);
        setReservas([]);
      }
    };

    if (user.id) {
      fetchReservas();
    }

    fetchServicios();
    fetchTipoVehiculo();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const cookies = parseCookies();
      const token = cookies.token;
      if (!token) {
        router.push("/loginCliente");
        return;
      }

      await axios.post(
        "https://fullwash.site/reservas",
        reservation,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Reserva creada exitosamente");
      setReservation({
        user_id: user.id,
        servicio_id: "",
        fecha: "",
        hora: "",
        estado: "pendiente",
        tipo_vehiculo_id: "",
      });

      await fetchReservas();
      setShowForm(false);
    } catch (error) {
      console.error("Error creating reservation:", error.message);
      setError("Error al crear la reserva");
    }
  };

  const fetchReservas = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies.token;
      if (!token) {
        return;
      }

      const res = await axios.get(
        `https://fullwash.site/reservas/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (res.data && res.data.reservas) {
        setReservas(res.data.reservas);
      } else {
        setReservas([]);
      }
    } catch (error) {
      console.error("Error fetching reservas:", error.message);
      setReservas([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (reserva) => {
    setEditReservation(reserva);
    setReservation({
      user_id: reserva.user_id,
      servicio_id: reserva.servicio_id,
      fecha: reserva.fecha.slice(0, 10), // Asegura el formato YYYY-MM-DD
      hora: reserva.hora,
      estado: reserva.estado,
      tipo_vehiculo_id: reserva.tipo_vehiculo_id,
    });
    setEditing(true);
  };

  const handleUpdate = async () => {
    setError(null);
    try {
      const cookies = parseCookies();
      const token = cookies.token;
      if (!token) {
        router.push("/loginCliente");
        return;
      }

      await axios.put(
        `https://fullwash.site/reservas/${editReservation.id}`,
        reservation,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Reserva actualizada exitosamente");
      setEditing(false);
      setEditReservation(null);
      await fetchReservas();
    } catch (error) {
      console.error("Error updating reservation:", error.message);
      setError("Error al actualizar la reserva");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar la reserva?");
    if (!confirmed) {
      return;
    }

    try {
      const cookies = parseCookies();
      const token = cookies.token;

      if (!token) {
        router.push("/loginCliente");
        return;
      }

      await axios.delete(`https://fullwash.site/reservas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Reserva eliminada exitosamente");
      await fetchReservas();
    } catch (error) {
      console.error("Error deleting reservation:", error.message);
      setError("Error al eliminar la reserva");
    }
  };

  const logout = async () => {
    try {
      destroyCookie(null, 'token', { path: '/' });
      router.push("/loginCliente");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case "reservas":
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Servicio</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Tipo de Vehículo</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(reservas) && reservas.map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell>{reserva.servicio.nombre_servicio}</TableCell>
                    <TableCell>{new Date(reserva.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</TableCell>
                    <TableCell>{reserva.hora}</TableCell>
                    <TableCell>{reserva.estado}</TableCell>
                    <TableCell>{reserva.tipo_vehiculo.nombre}</TableCell>
                    <TableCell>{reserva.Total}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(reserva)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(reserva.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      case "perfil":
        return (
          <Box>
            <Typography color="black" variant="h6">Perfil</Typography>
            <Typography color="black">Nombre: {user.username}</Typography>
            <Typography color="black">Email: {user.email}</Typography>
            <Typography color="black">Teléfono: {user.numero}</Typography>
            <Button onClick={() => setShowEditProfile(true)}>Editar Perfil</Button>
            <Button onClick={logout}>Cerrar Sesión</Button>
          </Box>
        );
      default:
        return null;
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    
    // Establecer las horas, minutos, segundos y milisegundos de hoy a 0 para comparar solo la fecha
    today.setHours(0, 0, 0, 0);
  
    // Verifica si la fecha seleccionada es anterior a hoy
    if (selectedDate < today) {
      alert("No puedes seleccionar una fecha anterior a hoy.");
      // No actualizar el estado si la fecha es inválida
    } else {
      // Solo actualizar el estado si la fecha es válida
      setReservation(prev => ({ ...prev, fecha: e.target.value }));
    }
  };
  
  

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    // Ahora simplemente se actualiza la hora seleccionada sin restricciones
    setReservation(prev => ({ ...prev, hora: selectedTime }));
  };

  const handleUpdateProfile = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies.token;

      if (!token) {
        router.push("/loginCliente");
        return;
      }

      await axios.put(
        `https://fullwash.site/users/${user.id}`, // Usa el ID del usuario
        {
          username: user.username,
          email: user.email,
          numero: user.numero,
          password: user.password, // Actualiza la contraseña si se desea cambiar
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Perfil actualizado exitosamente!");
      setShowEditProfile(false); // Cierra el formulario
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Error al actualizar el perfil");
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Header */}
      <Header />

      {/* Contenido Principal */}
      <Box flex="1" p={2}>
        <Typography variant="h4" color="black">Dashboard</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={() => setShowForm(true)}>
          Nueva Reserva
        </Button>
        <Button variant="contained" onClick={() => setActiveScreen("reservas")}>
          Mis Reservas
        </Button>
        <Button variant="contained" onClick={() => setActiveScreen("perfil")}>
          Mi Perfil
        </Button>

        {/* Formulario de Nueva Reserva */}
        <Dialog open={showForm} onClose={() => setShowForm(false)}>
          <DialogTitle>Nueva Reserva</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Servicio</InputLabel>
              <Select
                name="servicio_id"
                value={reservation.servicio_id}
                onChange={handleChange}
                required
              >
                {servicios.map(servicio => (
                  <MenuItem key={servicio.id} value={servicio.id}>
                    {servicio.nombre_servicio}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="date"
              name="fecha"
              value={reservation.fecha}
              onChange={handleDateChange}
              required
              InputLabelProps={{ shrink: true }}
              sx={{ marginTop: 2 }}
            />
            <TextField
              type="time"
              name="hora"
              value={reservation.hora}
              onChange={handleTimeChange}
              required
              sx={{ marginTop: 2 }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo vehiculo</InputLabel>
              <Select
                name="tipo_vehiculo_id"
                value={reservation.tipo_vehiculo_id}
                onChange={handleChange}
                required
              >
                {tipo_vehiculos.map(tipo_vehiculo => (
                  <MenuItem key={tipo_vehiculo.id} value={tipo_vehiculo.id}>
                    {tipo_vehiculo.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </DialogActions>
        </Dialog>

        {/* Formulario de Edición de Reserva */}
        <Dialog open={editing} onClose={() => setEditing(false)}>
          <DialogTitle>Editar Reserva</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Servicio</InputLabel>
              <Select
                name="servicio_id"
                value={reservation.servicio_id}
                onChange={handleChange}
                required
              >
                {servicios.map(servicio => (
                  <MenuItem key={servicio.id} value={servicio.id}>
                    {servicio.nombre_servicio}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="date"
              name="fecha"
              value={reservation.fecha}
              onChange={handleDateChange}
              required
              InputLabelProps={{ shrink: true }}
              sx={{ marginTop: 2 }}
            />
            <TextField
              type="time"
              name="hora"
              value={reservation.hora}
              onChange={handleChange}
              required
              sx={{ marginTop: 2 }}
            />
            <TextField
              name="tipo_vehiculo_id"
              value={reservation.tipo_vehiculo_id}
              onChange={handleChange}
              label="Tipo de Vehículo"
              required
              sx={{ marginTop: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditing(false)}>Cancelar</Button>
            <Button onClick={handleUpdate}>Actualizar</Button>
          </DialogActions>
        </Dialog>

        {/* Formulario de Edición de Perfil */}
        <Dialog open={showEditProfile} onClose={() => setShowEditProfile(false)}>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogContent>
            <TextField
              label="Username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Numero"
              value={user.numero}
              onChange={(e) => setUser({ ...user, numero: e.target.value })}
              fullWidth
            />
            <TextField
              label="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowEditProfile(false)}>Cancelar</Button>
            <Button onClick={handleUpdateProfile}>Guardar</Button> {/* Llama a handleUpdateProfile */}
          </DialogActions>
        </Dialog>

        {/* Renderiza la pantalla activa */}
        {renderScreen()}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default DashboardCliente;


