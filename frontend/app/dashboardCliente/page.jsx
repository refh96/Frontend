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
  DialogTitle,
  ToggleButton,
  ToggleButtonGroup
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
  const [atributos, setAtributos] = useState([]); // Para almacenar los atributos
  const [selectedAtributos, setSelectedAtributos] = useState([]); // Atributos seleccionados
  const [reservation, setReservation] = useState({
    user_id: "",
    servicio_id: "",
    fecha: new Date().toISOString().split('T')[0],
    hora: "",
    estado: "",
    tipo_vehiculo_id: "",
    atributo_ids: [],
  });
  const [editing, setEditing] = useState(false);
  const [editReservation, setEditReservation] = useState(null);
  const [estadoPendienteId, setEstadoPendienteId] = useState(null);
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
        setServicios(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (error) {
        console.error("Error fetching services:", error.message);
        setServicios([]);
      }
    };
    const fetchEstados = async () => {
      try {
        const res = await axios.get("https://fullwash.site/estados");
        const estadoPendiente = res.data.find(estado => estado.nombre === "Pendiente");
        if (estadoPendiente) {
          setEstadoPendienteId(estadoPendiente.id);
          setReservation(prev => ({ ...prev, estado_id: estadoPendiente.id }));
        }
      } catch (error) {
        console.error("Error fetching estados:", error.message);
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
    const fetchAtributos = async () => {
      try {
        const res = await axios.get("https://fullwash.site/atributos");
        setAtributos(res.data);
      } catch (error) {
        console.error("Error fetching attributes:", error.message);
      }
    };

    fetchServicios();
    fetchTipoVehiculo();
    fetchAtributos();
    fetchEstados();
  }, [user.id]);

  const handleAtributoToggle = (event, newAtributos) => {
    if (newAtributos.length > 0) {
      setSelectedAtributos(newAtributos);
      setReservation(prev => ({ ...prev, atributo_ids: newAtributos }));
    } else {
      // Si no hay atributos seleccionados, restablece la lista
      setSelectedAtributos([]);
      setReservation(prev => ({ ...prev, atributo_ids: [] }));
    }
  };


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

      // Añadir estado_id antes de enviar la solicitud
      const nuevaReserva = {
        ...reservation,
        estado_id: estadoPendienteId,
        atributos: selectedAtributos,
      };

      await axios.post(
        "https://fullwash.site/reservas",
        nuevaReserva,
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
        estado_id: estadoPendienteId, // Se asegura de restablecer con estado pendiente
        tipo_vehiculo_id: "",
        atributo_ids: selectedAtributos,
      });

      await fetchReservas();
      setShowForm(false);
    } catch (error) {
      console.error("Error creating reservation:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "Error al crear la reserva");
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
      estado_id: reserva.estado_id,
      tipo_vehiculo_id: reserva.tipo_vehiculo_id,
      atributo_ids: reserva.atributo_ids,
    });

    // Establece los atributos seleccionados
    setSelectedAtributos(reserva.atributo_ids);

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

      const updatedReservation = {
        ...reservation,
        atributo_ids: selectedAtributos,
      };

      await axios.put(
        `https://fullwash.site/reservas/${editReservation.id}`,
        updatedReservation,
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
      console.error("Error updating reservation:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "Error al actualizar la reserva");
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

  // Mantiene el resto de tus imports y estados

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
                  <TableCell>Servicios Extras</TableCell> {/* Nueva columna */}
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(reservas) && reservas.map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell>{reserva.servicio.nombre_servicio}</TableCell>
                    <TableCell>{new Date(reserva.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</TableCell>
                    <TableCell>{reserva.hora}</TableCell>
                    <TableCell>{reserva.estado.nombre}</TableCell> {/* Estado actualizado */}
                    <TableCell>{reserva.tipo_vehiculo.nombre}</TableCell>
                    <TableCell>{reserva.Total}</TableCell>
                    <TableCell>
                      {reserva.atributos && reserva.atributos.length > 0 ? (
                        reserva.atributos.map(atributo => (
                          <Typography key={atributo.id}>
                            {atributo.nombre_atributo} - ${atributo.costo_atributo}
                          </Typography>
                        ))
                      ) : (
                        <Typography>No hay atributos</Typography>
                      )}
                    </TableCell>
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
    const selectedDateString = e.target.value; // Obtener el valor del input
    const [year, month, day] = selectedDateString.split('-').map(Number); // Separar año, mes y día
    const selectedDate = new Date(Date.UTC(year, month - 1, day)); // Crear la fecha seleccionada
    const today = new Date(); // Obtener la fecha actual
    
    // Establecer horas, minutos, segundos y milisegundos de hoy a 0
    today.setHours(0, 0, 0, 0);
    
    // Crear una fecha para ayer
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Restar un día
  
    // Establecer horas, minutos, segundos y milisegundos de ayer a 0
    yesterday.setHours(0, 0, 0, 0);
  
    console.log("Selected Date:", selectedDate);
    console.log("Today Date:", today);
    console.log("Yesterday Date:", yesterday);
  
    // Verifica si la fecha seleccionada es anterior a ayer
    if (selectedDate < yesterday) {
      alert("No puedes seleccionar una fecha anterior a ayer.");
    } else {
      // Solo actualizar el estado si la fecha es válida
      setReservation(prev => ({ ...prev, fecha: selectedDateString }));
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
  const generarHorasDisponibles = () => {
    const horas = [];
    for (let i = 9; i <= 18; i++) { // 18 es 6 PM
      const horaFormateada = `${i < 10 ? '0' : ''}${i}:00`;
      horas.push(horaFormateada);
    }
    return horas;
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
              <Typography>Servicio</Typography>
              <Select
                name="servicio_id"
                value={reservation.servicio_id}
                onChange={handleChange}
                required
              >
                {Array.isArray(servicios) && servicios.map(servicio => (
                  <MenuItem key={servicio.id} value={servicio.id}>
                    {servicio.nombre_servicio}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
            <Typography>Fecha</Typography>
            <TextField
              type="date"
              name="fecha"
              value={reservation.fecha}
              onChange={handleDateChange}
              required
              InputLabelProps={{ shrink: true }}
              sx={{ marginTop: 2 }}
            />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography id="hora-label">Hora</Typography>
              <Select
                labelId="hora-label"
                name="hora"
                value={reservation.hora}
                onChange={handleChange}
                required
              >
                {generarHorasDisponibles().map((hora) => (
                  <MenuItem key={hora} value={hora}>
                    {hora}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography>Tipo vehiculo</Typography>
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
            <Typography variant="h6" margin="normal">Servicios Extras:</Typography>
            <ToggleButtonGroup
              value={selectedAtributos}
              onChange={handleAtributoToggle}
              aria-label="atributos"
            >
              {atributos.map((atributo) => (
                <ToggleButton key={atributo.id} value={atributo.id} aria-label={atributo.nombre_atributo}>
                  {atributo.nombre_atributo} - ${atributo.costo_atributo}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
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
              onChange={handleTimeChange} // Cambiado para usar la función correcta
              required
              sx={{ marginTop: 2 }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo Vehículo</InputLabel>
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
            <Typography variant="h6" margin="normal">Selecciona los Atributos:</Typography>
            <ToggleButtonGroup
              value={selectedAtributos}
              onChange={handleAtributoToggle}
              aria-label="atributos"
            >
              {atributos.map((atributo) => (
                <ToggleButton key={atributo.id} value={atributo.id} aria-label={atributo.nombre_atributo}>
                  {atributo.nombre_atributo}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
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
            <Button onClick={handleUpdateProfile}>Guardar</Button>
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


