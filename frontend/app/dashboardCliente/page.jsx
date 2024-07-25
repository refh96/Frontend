'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { parseCookies, destroyCookie } from 'nookies';

function DashboardCliente() {
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [servicios, setServicios] = useState([]);
  const [reservation, setReservation] = useState({
    user_id: "",
    servicio_id: "",
    fecha: "",
    estado: "pendiente",
    tipo_vehiculo: "",
  });

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
          "http://127.0.0.1:3333/profile",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setUser(res.data.user); // Acceder al objeto de usuario dentro de res.data
        setReservation(prev => ({ ...prev, user_id: res.data.user.id }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    const fetchServicios = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:3333/servicios");
        setServicios(res.data);
      } catch (error) {
        console.error("Error fetching services:", error.message);
      }
    };

    fetchProfile();
    fetchServicios();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cookies = parseCookies();
      const token = cookies.token;
      if (!token) {
        router.push("/loginCliente");
        return;
      }

      await axios.post(
        "http://127.0.0.1:3333/reservas",
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
        estado: "pendiente",
        tipo_vehiculo: "",
      });
    } catch (error) {
      console.error("Error creating reservation:", error.message);
      alert("Error al crear la reserva");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation(prev => ({ ...prev, [name]: value }));
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

  // Obtener la fecha actual en formato yyyy-mm-dd
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Typography variant="body1">Email: {user.email}</Typography>
        <Typography variant="body1">Username: {user.username}</Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, width: '300px' }}>
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
              min: today, // Restringir la selección de fechas al día de hoy y adelante
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

        <Button variant="contained" color="secondary" onClick={logout} sx={{ mt: 2 }}>
          Logout
        </Button>
      </Box>
    </div>
  );
}

export default DashboardCliente;

