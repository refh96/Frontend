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

function DashboardCliente() {
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [servicios, setServicios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [reservation, setReservation] = useState({
    user_id: "",
    servicio_id: "",
    fecha: "",
    hora: "",
    estado: "pendiente",
    tipo_vehiculo: "",
  });
  const [editing, setEditing] = useState(false);
  const [editReservation, setEditReservation] = useState(null);
  const [error, setError] = useState(null);
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
        tipo_vehiculo: "",
      });

      await fetchReservas();
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
      tipo_vehiculo: reserva.tipo_vehiculo,
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
      return; // Si el usuario cancela, no se procede con la eliminación
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
      await fetchReservas(); // Refrescar la lista de reservas después de eliminar
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

  if (loading) return <p>Loading...</p>;

  const today = new Date().toISOString().split('T')[0];

  return (
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom>Dashboard</Typography>
            <Typography variant="body1">Email: {user.email}</Typography>
            <Typography variant="body1">Username: {user.username}</Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, width: '100%' }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="servicio-label">Servicio</InputLabel>
                <Select
                  labelId="servicio-label"
                  id="servicio_id"
                  name="servicio_id"
                  value={reservation.servicio_id}
                  label="Servicio"
                  onChange={handleChange}
                  required
                >
                  {servicios.map((servicio) => (
                    <MenuItem key={servicio.id} value={servicio.id}>
                      {servicio.nombre_servicio}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                type="date"
                name="fecha"
                value={reservation.fecha}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: today,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                type="time"
                name="hora"
                value={reservation.hora}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Tipo de Vehículo"
                name="tipo_vehiculo"
                value={reservation.tipo_vehiculo}
                onChange={handleChange}
                required
              />
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Crear Reserva
              </Button>
            </Box>

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            <Button variant="contained" color="secondary" onClick={logout} sx={{ mt: 2 }}>
              Logout
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Servicio</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Tipo de Vehículo</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(reservas) && reservas.map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell>{reserva.id}</TableCell>
                    <TableCell>{reserva.servicio.nombre_servicio}</TableCell>
                    <TableCell>{new Date(reserva.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>{reserva.hora}</TableCell>
                    <TableCell>{reserva.estado}</TableCell>
                    <TableCell>{reserva.tipo_vehiculo}</TableCell>
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
        </Grid>
      </Grid>

      {/* Dialogo para editar reserva */}
      <Dialog open={editing} onClose={() => setEditing(false)}>
        <DialogTitle>Editar Reserva</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }} noValidate>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="edit-servicio-label">Servicio</InputLabel>
              <Select
                labelId="edit-servicio-label"
                id="edit-servicio_id"
                name="servicio_id"
                value={reservation.servicio_id}
                label="Servicio"
                onChange={handleChange}
                required
              >
                {servicios.map((servicio) => (
                  <MenuItem key={servicio.id} value={servicio.id}>
                    {servicio.nombre_servicio}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              type="date"
              name="fecha"
              value={reservation.fecha}
              onChange={handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: today,
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              type="time"
              name="hora"
              value={reservation.hora}
              onChange={handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Tipo de Vehículo"
              name="tipo_vehiculo"
              value={reservation.tipo_vehiculo}
              onChange={handleChange}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DashboardCliente;


