'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { TextField, Button, Typography, Paper } from '@mui/material';

const AceptarFecha = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservas_id = searchParams.get('reservas_id');
  const [reservas, setReservas] = useState([]);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Intentando login con:', { email: loginData.email });
      const response = await axios.post('https://fullwash.site/login', loginData);
      console.log('Respuesta del servidor:', response.data);

      if (response.data.res && response.data.token) {
        // Establecer la cookie con el token correcto
        setCookie(null, 'token', response.data.token.token, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
          sameSite: 'None',
          secure: true,
        });

        // Verificar que la cookie se estableció correctamente
        const cookies = parseCookies();
        const savedToken = cookies.token;

        if (savedToken) {
          console.log('Token guardado exitosamente');
          setShowLoginForm(false);
          // Esperar un momento antes de recargar las reservas
          setTimeout(() => {
            fetchReservas();
          }, 1000);
        } else {
          console.error('Error: Token no se guardó en las cookies');
          Swal.fire('Error', 'No se pudo establecer la sesión correctamente', 'error');
        }
      } else {
        console.error('Error: Respuesta del servidor no contiene token');
        Swal.fire('Error', 'Respuesta del servidor inválida', 'error');
      }
    } catch (error) {
      console.error('Error completo de login:', error);
      if (error.response) {
        console.error('Datos de error del servidor:', error.response.data);
      }
      Swal.fire('Error', 'Credenciales inválidas o error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchReservas = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies.token;

      if (!token) {
        console.log('No hay token disponible');
        setShowLoginForm(true);
        return;
      }

      const response = await axios.get('https://fullwash.site/reservas', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.res) {
        setReservas(response.data.reservas);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error al cargar las reservas:', error);
      const cookies = parseCookies();
      const token = cookies.token;
      
      if (!token) {
        console.log('Token no encontrado después del error');
        setShowLoginForm(true);
      } else if (error.response && error.response.status === 401) {
        console.log('Token inválido o expirado');
        destroyCookie(null, 'token', { path: '/' });
        setShowLoginForm(true);
        Swal.fire('Sesión expirada', 'Por favor, inicie sesión nuevamente', 'warning');
      } else {
        Swal.fire('Error', 'Error al cargar las reservas. Por favor, intente nuevamente', 'error');
      }
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  useEffect(() => {
    const cambiarEstadoReserva = async () => {
      if (!reservas_id) {
        console.error('No se encontró el parámetro reservas_id en la URL');
        Swal.fire('Error', 'El ID de la reserva es obligatorio.', 'error');
        router.push('/'); // Redirige al usuario en caso de error
        return;
      }

      console.log('Iniciando cambio de estado para reserva con ID:', reservas_id);

      const cookies = parseCookies();
      const token = cookies.token;

      if (!token) {
        console.error('No se encontró el token en las cookies');
        Swal.fire('Error', 'No estás autenticado.', 'error');
        setShowLoginForm(true);
        return;
      }

      try {
        const reservaToUpdate = reservas.find(
          reserva => reserva.id === parseInt(reservas_id, 10)
        );

        if (!reservaToUpdate) {
          console.error('Reserva con ID:', reservas_id, 'no encontrada en el listado.');
          Swal.fire('Error', 'No se encontró la reserva.', 'error');
          return;
        }

        console.log('Reserva encontrada para actualizar:', reservaToUpdate);

        const atributoIds = reservaToUpdate.atributos
          ? reservaToUpdate.atributos.map(atributo => atributo.id)
          : [];

        const response = await axios.put(
          `https://fullwash.site/reservas/${reservas_id}`,
          {
            user_id: reservaToUpdate.user_id,
            servicio_id: reservaToUpdate.servicio_id,
            fecha: reservaToUpdate.fecha.slice(0, 10),
            hora: reservaToUpdate.hora,
            estado_id: 2, // Usar el ID del estado (por ejemplo: "2" para "Aceptada")
            tipo_vehiculo_id: reservaToUpdate.tipo_vehiculo_id,
            atributo_ids: atributoIds,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Respuesta del servidor:', response);

        if (response.status === 200) {
          Swal.fire('¡Éxito!', 'La reserva ha sido aprobada.', 'success');
        } else {
          Swal.fire('Error', 'No se pudo actualizar el estado de la reserva.', 'error');
        }
      } catch (error) {
        console.error('Error al cambiar el estado de la reserva:', error);

        if (error.response && error.response.data) {
          Swal.fire('Error', error.response.data.message || 'Error desconocido', 'error');
        } else {
          Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
        }
      } finally {
        console.log('Redirigiendo al usuario...');
        router.push('/dashboardCliente'); // Cambia esta ruta según el flujo de tu aplicación
      }
    };

    if (reservas.length > 0) {
      cambiarEstadoReserva();
    }
  }, [reservas_id, reservas, router]);

  if (showLoginForm) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: '#f5f5f5'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 400,
            width: '90%'
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom>
            Iniciar Sesión para Aprobar Reserva
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
            Para aprobar la reserva, necesitas iniciar sesión primero
          </Typography>
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
            </Button>
          </form>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default AceptarFecha;
