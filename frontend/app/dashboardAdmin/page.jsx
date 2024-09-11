'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from '@mui/icons-material'; // Icono de eliminar
import { parseCookies, destroyCookie } from 'nookies';

function Dashboard() {
  const [user, setUser] = useState({
    username: "",
    email: "",
  });
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [estadoReservas, setEstadoReservas] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const cookies = parseCookies(); // Obtener cookies
        const token = cookies.token; // Obtener token de cookies
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

        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const cookies = parseCookies(); // Obtener cookies
        const token = cookies.token; // Obtener token de cookies
        if (!token) {
          return;
        }

        const res = await axios.get(
          "https://fullwash.site/reservas",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReservas(res.data);
        setLoadingReservas(false);
      } catch (error) {
        console.error("Error fetching reservas:", error.message);
      }
    };

    fetchReservas();
  }, [router]);

  const handleEstadoChange = async (id, newEstado) => {
    try {
      const cookies = parseCookies(); // Obtener cookies
      const token = cookies.token; // Obtener token de cookies

      await axios.put(
        `https://fullwash.site/reservas/${id}`,
        { estado: newEstado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar estado local
      setReservas(reservas.map(reserva => 
        reserva.id === id ? { ...reserva, estado: newEstado } : reserva
      ));
    } catch (error) {
      console.error("Error updating estado:", error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta reserva?");
    if (!confirmed) return;

    try {
      const cookies = parseCookies(); // Obtener cookies
      const token = cookies.token; // Obtener token de cookies

      await axios.delete(`https://fullwash.site/reservas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Reserva eliminada exitosamente");
      // Actualizar la lista de reservas después de eliminar
      setReservas(reservas.filter(reserva => reserva.id !== id));
    } catch (error) {
      console.error("Error deleting reserva:", error.message);
    }
  };

  const logout = async () => {
    try {
      destroyCookie(null, 'token', { path: '/' });
      router.push("/loginAdmin");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  if (loading || loadingReservas) return <p>Loading...</p>;

  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">Email: {user.email}</Typography>
          <Typography variant="body1">Username: {user.username}</Typography>
        </Box>
        <Button variant="contained" color="secondary" onClick={logout} sx={{ mt: 2 }}>
          Logout
        </Button>
        <Button variant="contained" color="primary" onClick={() => router.push("../registroRoles")} sx={{ mt: 2 }}>
          Registro de Usuarios con Roles
        </Button>
        <Button variant="contained" color="primary" onClick={() => router.push("../nuevoServicio")} sx={{ mt: 2 }}>
          Crear Nuevo Servicio
        </Button>

        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Servicio</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservas.map((reserva) => (
                <TableRow key={reserva.id}>
                  <TableCell>{reserva.id}</TableCell>
                  <TableCell>{reserva.user.username}</TableCell>
                  <TableCell>{reserva.servicio.nombre_servicio}</TableCell>
                  <TableCell>{new Date(reserva.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select
                      value={reserva.estado}
                      onChange={(e) => handleEstadoChange(reserva.id, e.target.value)}
                    >
                      <MenuItem value="pendiente">Pendiente</MenuItem>
                      <MenuItem value="confirmado">Confirmado</MenuItem>
                      <MenuItem value="completado">En proceso</MenuItem>
                      <MenuItem value="cancelado">Completado</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
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
      </Box>
    </div>
  );
}

export default Dashboard;
