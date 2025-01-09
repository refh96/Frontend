'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import { parseCookies } from 'nookies';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';

const AceptarFecha = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservas_id = searchParams.get('reservas_id'); // Obtener reservas_id desde la URL
  const [reservas, setReservas] = useState([]);

  console.log('URL Parameter reservas_id:', reservas_id);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;

        console.log('Token obtenido:', token);

        const response = await axios.get('https://fullwash.site/reservas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.res) {
          console.log('Reservas obtenidas:', response.data.reservas);
          setReservas(response.data.reservas);
        } else {
          console.error('Respuesta inesperada del servidor:', response.data);
          Swal.fire('Error', 'No se pudieron cargar las reservas.', 'error');
        }
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
        Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
      }
    };

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
        router.push('/login'); // Redirige al login si no hay token
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
