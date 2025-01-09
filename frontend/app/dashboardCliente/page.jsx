'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import {
  Button,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Drawer,
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
  ToggleButtonGroup,
  Avatar,
  Skeleton,
  AppBar,
  Toolbar
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [servicios, setServicios] = useState([]);
  const [tipo_vehiculos, setTipoVehiculo] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [atributos, setAtributos] = useState([]); // Para almacenar los atributos
  const [selectedAtributos, setSelectedAtributos] = useState([]); // Atributos seleccionados
  const [selectedService, setSelectedService] = useState(null);
  const [total, setTotal] = useState(0); // Estado para el total
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
  const [sortCriteria, setSortCriteria] = useState({ field: "servicio.nombre_servicio", direction: "asc" });
  const router = useRouter();
  const initialReservation = {
    user_id: user.id,
    servicio_id: "",
    fecha: new Date().toISOString().split("T")[0], // Fecha actual
    hora: "",
    estado_id: estadoPendienteId || null, // ID del estado inicial (Pendiente)
    tipo_vehiculo_id: "",
    atributo_ids: [],
  };
  
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
    const params = new URLSearchParams(window.location.search);
    if (params.get('showForm') === 'true') {
      setShowForm(true);

      // Obtener el servicio_id y seleccionarlo automáticamente
      const servicioId = params.get('servicio_id');
      if (servicioId) {
        // Aquí puedes realizar la búsqueda del servicio si es necesario
        setSelectedService(servicioId); // Si tienes una lista de servicios, puedes buscarlo aquí.
        setReservation((prevReservation) => ({
          ...prevReservation,
          servicio_id: servicioId, // Establece el servicio en el formulario
        }));
      }

      // Limpia el parámetro de la URL
      router.replace('/dashboardCliente');
    }

    fetchProfile();
  }, [router]);


  useEffect(() => {
    if (user.id) {
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

      const fetchAtributos = async () => {
        try {
          const res = await axios.get("https://fullwash.site/atributos");
          setAtributos(res.data);
        } catch (error) {
          console.error("Error fetching attributes:", error.message);
        }
      };


      fetchServicios();
      fetchEstados();
      fetchTipoVehiculo();
      fetchAtributos();
      fetchReservas();
    }
  }, [user.id, reservas]); // Solo se ejecuta cuando `user.id` cambia
  
  useEffect(() => {
    if (reservation.servicio_id && servicios.length > 0) {
      const servicioSeleccionado = servicios.find((s) => s.id === parseInt(reservation.servicio_id));
      if (servicioSeleccionado) {
        setReservation((prev) => ({
          ...prev,
          servicio_id: servicioSeleccionado.id,
        }));
      }
    }
  }, [reservation.servicio_id, servicios]);
  
  

  useEffect(() => {
    if (reservation) {
      setSelectedAtributos(reservation.atributo_ids || []);
    }
  }, [reservation]);

  useEffect(() => {
    if (reservation.servicio_id && reservation.tipo_vehiculo_id) {
      const servicio = servicios.find((s) => s.id === reservation.servicio_id);
      const tipoVehiculo = tipo_vehiculos.find((t) => t.id === reservation.tipo_vehiculo_id);
      const costoAtributos = selectedAtributos.reduce((total, id) => {
        const atributo = atributos.find((a) => a.id === id);
        return total + (atributo ? atributo.costo_atributo : 0);
      }, 0);
  
      const nuevoTotal = 
        (servicio ? servicio.costo_servicio : 0) +
        (tipoVehiculo ? tipoVehiculo.costo_vehiculo : 0) +
        costoAtributos;
  
      setTotal(nuevoTotal);
    }
  }, [reservation.servicio_id, reservation.tipo_vehiculo_id, selectedAtributos, servicios, tipo_vehiculos, atributos]);
  
  useEffect(() => {
    const servicio = servicios.find((s) => s.id === reservation.servicio_id);
    const tipoVehiculo = tipo_vehiculos.find((t) => t.id === reservation.tipo_vehiculo_id);
    const atributosSeleccionados = atributos.filter((a) => selectedAtributos.includes(a.id));
  
    let nuevoTotal = 0;
  
    if (servicio && tipoVehiculo) {
      // Ajustar el costo del vehículo según el servicio
      let costoVehiculoAjustado = tipoVehiculo.costo;
  
      if (servicio.nombre_servicio === "Lavado Detailing") {
        if (tipoVehiculo.id === 2) {
          costoVehiculoAjustado += 45000;
        } else if (tipoVehiculo.id === 3) {
          costoVehiculoAjustado += 90000;
        }
      }

      if (servicio.nombre_servicio === "Lavado de Tapices") {
        if (tipoVehiculo.id === 2) {
          costoVehiculoAjustado -= 5000;
        } else if (tipoVehiculo.id === 3) {
          costoVehiculoAjustado += 10000;
        }
      }

      if (servicio.nombre_servicio === "Lavado de Alfombra") {
        if (tipoVehiculo.id === 3) {
          costoVehiculoAjustado += 5000;
        }
      }

      if (servicio.nombre_servicio === "Limpieza de Chasis") {
        if (tipoVehiculo.id === 2) {
          costoVehiculoAjustado += 5000;
        }if (tipoVehiculo.id === 3) {
          costoVehiculoAjustado += 5000;
        }
      }
      if (servicio.nombre_servicio === "Pulido Basico") {
        if (tipoVehiculo.id === 2) {
          costoVehiculoAjustado += 50000;
        }if (tipoVehiculo.id === 3) {
          costoVehiculoAjustado += 95000;
        }
      }
      if (servicio.nombre_servicio === "Pulido Avanzado") {
        if (tipoVehiculo.id === 2) {
          costoVehiculoAjustado += 45000;
        }if (tipoVehiculo.id === 3) {
          costoVehiculoAjustado += 90000;
        }
      }
  
      // Sumar costos del servicio, vehículo ajustado y atributos seleccionados
      nuevoTotal =
        servicio.precio +
        costoVehiculoAjustado +
        atributosSeleccionados.reduce((acc, atributo) => acc + atributo.costo_atributo, 0);
    }
  
    setTotal(nuevoTotal);
  }, [
    atributos,
    reservation.servicio_id,
    reservation.tipo_vehiculo_id,
    selectedAtributos,
    servicios,
    tipo_vehiculos,
  ]);
  
  const handleOpenNewReservation = () => {
    setReservation(initialReservation); // Reinicia el estado
    setShowForm(true); // Abre el formulario de nueva reserva
  };
  


  const handleAvatarClick = () => {
    setActiveScreen(activeScreen === "perfil" ? "reservas" : "perfil");
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // Validar campos obligatorios
    const { servicio_id, fecha, hora, tipo_vehiculo_id } = reservation;

    if (!servicio_id || !fecha || !hora || !tipo_vehiculo_id) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor, rellena todos los campos obligatorios antes de guardar la reserva. El campo de servicios extra es opcional.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
      return; // Detenemos el envío si falta algún campo
    }
    try {
      const cookies = parseCookies();
      const token = cookies.token;
      if (!token) {
        router.push("/loginCliente");
        return;
      }

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

      // Usa SweetAlert2 para mostrar la alerta de éxito
      Swal.fire({
        title: 'Éxito!',
        text: 'Reserva creada exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      setReservation({
        user_id: user.id,
        servicio_id: "",
        fecha: "",
        hora: "",
        estado_id: estadoPendienteId,
        tipo_vehiculo_id: "",
        atributos: selectedAtributos,
      });

      await fetchReservas();
      setShowForm(false);
    } catch (error) {
      console.error("Error creating reservation:", error.response?.data?.message || error.message);

      // Usa SweetAlert2 para mostrar la alerta de error
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || "Error al crear la reserva",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
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

  const handleAtributoToggle = (event) => {
    const { value } = event.target;
    setSelectedAtributos(value);
    setReservation((prev) => ({
      ...prev,
      atributo_ids: value,
    }));
  };




  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation((prev) => ({
      ...prev,
      [name]: value, // Actualiza el campo correspondiente de la reserva
    }));
  };


  const handleEdit = (reserva) => {
    setEditReservation(reserva);
    setReservation({
      user_id: reserva.user_id,
      servicio_id: reserva.servicio_id,
      fecha: reserva.fecha.slice(0, 10),
      hora: reserva.hora,
      estado_id: reserva.estado_id,
      tipo_vehiculo_id: reserva.tipo_vehiculo_id,
      atributo_ids: reserva.atributos.map((atributo) => atributo.id), // Extrae los IDs de los atributos
    });

    // Inicializa `selectedAtributos` con los IDs de los atributos de la reserva
    setSelectedAtributos(reserva.atributos.map((atributo) => atributo.id));
    setEditing(true);
  };

  const handleCloseNewReservation = () => {
    setShowForm(false);
    setReservation(initialReservation); // Limpia el estado al cerrar
  };
  
  const handleCloseEditReservation = () => {
    setEditing(false);
    setEditReservation(null); // Limpia el estado de edición
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

      // Asegúrate de que 'estado_id' corresponda al ID del estado "Pendiente" en tu base de datos.
      const estadoPendienteId = 1; // Cambia esto al ID correcto para el estado "Pendiente"

      const updatedReservation = {
        ...reservation,
        atributos: selectedAtributos,
        estado_id: estadoPendienteId, // Establece el estado como "Pendiente"
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

      Swal.fire({
        title: 'Éxito!',
        text: 'Reserva actualizada exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      setEditing(false);
      setEditReservation(null);
      await fetchReservas();
    } catch (error) {
      console.error("Error updating reservation:", error.response?.data?.message || error.message);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || "Error al actualizar la reserva",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };


  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: 'Confirmar',
      text: "¿Estás seguro de que deseas eliminar la reserva?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmed.isConfirmed) {
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

      Swal.fire({
        title: 'Éxito!',
        text: 'Reserva eliminada exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      await fetchReservas();
    } catch (error) {
      console.error("Error deleting reservation:", error.message);
      Swal.fire({
        title: 'Error!',
        text: "Error al eliminar la reserva",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
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
            <Typography textAlign={'center'}>Mis Reservas</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell onClick={() => handleSort("servicio.nombre_servicio")}>Servicio</TableCell>
                  <TableCell onClick={() => handleSort("fecha")}>Fecha</TableCell>
                  <TableCell onClick={() => handleSort("hora")}>Hora</TableCell>
                  <TableCell onClick={() => handleSort("estado.nombre")}>Estado</TableCell>
                  <TableCell onClick={() => handleSort("tipo_vehiculo.nombre")}>Tipo de Vehículo</TableCell>
                  <TableCell>Servicios Extras</TableCell>
                  <TableCell onClick={() => handleSort("Total")}>Total</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(reservas) && sortReservas(reservas).map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell>{reserva.servicio.nombre_servicio}</TableCell>
                    <TableCell>{new Date(reserva.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</TableCell>
                    <TableCell>{reserva.hora}</TableCell>
                    <TableCell>{reserva.estado.nombre}</TableCell>
                    <TableCell>{reserva.tipo_vehiculo.nombre}</TableCell>
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
                    <TableCell>{reserva.Total}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(reserva)}
                        disabled={!["Pendiente", "Rechazado", "Aprobado"].includes(reserva.estado.nombre)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(reserva.id)}
                        disabled={!["Pendiente", "Rechazado", "Aprobado"].includes(reserva.estado.nombre)}
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
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center">
            <Typography color="black" variant="h6">Perfil</Typography>
            <Avatar sx={{ bgcolor: 'secondary.main', marginBottom: 2 }}>
              {user.username.charAt(0)}
            </Avatar>
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


  const handleSort = (field) => {
    setSortCriteria(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };
  const sortReservas = (reservas) => {
    return reservas.sort((a, b) => {
      const fieldA = getNestedField(a, sortCriteria.field);
      const fieldB = getNestedField(b, sortCriteria.field);

      if (fieldA < fieldB) return sortCriteria.direction === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortCriteria.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Función auxiliar para obtener campos anidados, como "servicio.nombre_servicio"
  const getNestedField = (obj, path) => {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
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
      Swal.fire({
        title: 'Error!',
        text: 'No Puedes Seleccionar una fecha anterior a Hoy',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
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

      Swal.fire({
        title: '¡Éxito!',
        text: 'Perfil actualizado exitosamente!',
        icon: 'success', // Puedes usar 'success', 'error', 'warning', etc.
        confirmButtonText: 'Aceptar',
        backdrop: true, // Para oscurecer el fondo
        timer: 3000, // El alerta se cerrará automáticamente después de 3 segundos (3000 milisegundos)
        timerProgressBar: true, // Muestra una barra de progreso para el tiempo restante
        didClose: () => {
          console.log("La alerta fue cerrada automáticamente después del tiempo.");
        }
      });

      setShowEditProfile(false); // Cierra el formulario
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Error al actualizar el perfil");
    }
  };
  const generarHorasDisponibles = () => {
    const horas = [];
    const fechaSeleccionada = reservation.fecha; // Fecha seleccionada
    const horaActual = reservation.hora; // Hora actual de la reserva siendo editada
  
    // Obtener reservas que coincidan con la fecha seleccionada
    const reservasEnFecha = reservas.filter(reserva => {
      const reservaFecha = new Date(reserva.fecha).toISOString().split('T')[0];
      return reservaFecha === fechaSeleccionada;
    });
  
    for (let i = 9; i <= 18; i++) { // Horas de 9 AM a 6 PM
      const horaFormateada = `${i < 10 ? '0' : ''}${i}:00:00`;
      const horaOcupada = reservasEnFecha.some(reserva => reserva.hora === horaFormateada && reserva.hora !== horaActual);
  
      if (!horaOcupada) {
        horas.push(horaFormateada.slice(0, 5)); // Mostrar solo "HH:mm"
      }
    }
  
    return horas;
  };
  
  
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Header */}
      <Header />

      {/* Contenido Principal */}
      <Box flex="1" p={2}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" textAlign="center" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <Avatar sx={{ bgcolor: 'secondary.main' }} onClick={handleAvatarClick}>
              {user.username.charAt(0)}
            </Avatar>
          </Toolbar>
        </AppBar>

        {/* Drawer lateral */}
        <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
          <List>
            <ListItem button onClick={() => { setShowForm(true); handleDrawerToggle(); handleOpenNewReservation() }}>
              <ListItemText primary="Crear Nueva Reserva" />
            </ListItem>
            <ListItem button onClick={() => { setActiveScreen('reservas'); handleDrawerToggle(); }}>
              <ListItemText primary="Mis Reservas" />
            </ListItem>
            <ListItem button onClick={() => { setActiveScreen('perfil'); handleDrawerToggle(); }}>
              <ListItemText primary="Mi Perfil" />
            </ListItem>
            <ListItem button onClick={() => { logout() }}>
              <ListItemText primary="Cerrar sesion" />
            </ListItem>
            {/* Agrega más elementos de lista según sea necesario */}
          </List>
        </Drawer>

        {/* Formulario de Nueva Reserva */}
        <Dialog
          open={showForm}
          onClose={() => handleCloseNewReservation()}
          fullWidth
          maxWidth="sm"
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '16px',
              padding: '16px',
              backgroundColor: '#f9f9f9',
            },
          }}
        >
          <DialogTitle textAlign="center" variant="h5" gutterBottom>
            Nueva Reserva
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="subtitle1">Servicio</Typography>
                  <Select name="servicio_id" value={reservation.servicio_id} onChange={handleChange} required>
                    {Array.isArray(servicios) &&
                      servicios.map((servicio) => (
                        <MenuItem key={servicio.id} value={servicio.id}>
                          {servicio.nombre_servicio}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Typography variant="subtitle1">Fecha</Typography>
                  <TextField type="date" name="fecha" value={reservation.fecha} onChange={handleDateChange} required />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Typography variant="subtitle1">Hora</Typography>
                  <Select name="hora" value={reservation.hora} onChange={handleChange} required>
                    {generarHorasDisponibles().map((hora) => (
                      <MenuItem key={hora} value={hora}>
                        {hora}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="subtitle1">Tipo Vehículo</Typography>
                  <Select name="tipo_vehiculo_id" value={reservation.tipo_vehiculo_id} onChange={handleChange} required>
                    {tipo_vehiculos.map((tipo_vehiculo) => (
                      <MenuItem key={tipo_vehiculo.id} value={tipo_vehiculo.id}>
                        {tipo_vehiculo.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Servicios Extra (Opcional):
                </Typography>
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={selectedAtributos}
                    onChange={handleAtributoToggle}
                    renderValue={(selected) =>
                      selected
                        .map((id) => {
                          const atributo = atributos.find((a) => a.id === id);
                          return atributo ? `${atributo.nombre_atributo} - $${atributo.costo_atributo}` : '';
                        })
                        .join(', ')
                    }
                  >
                    {atributos.map((atributo) => (
                      <MenuItem key={atributo.id} value={atributo.id}>
                        {atributo.nombre_atributo} - ${atributo.costo_atributo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} textAlign="center">
                <Typography variant="h6">Total: ${total}</Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
            <Button variant="outlined" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Formulario de Edición de Reserva */}
        <Dialog
          open={editing}
          onClose={() => handleCloseNewReservation()}
          fullWidth
          maxWidth="sm"
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '16px',
              padding: '16px',
              backgroundColor: '#f9f9f9',
            },
          }}
        >
          <DialogTitle textAlign="center" variant="h5" gutterBottom>
            Editar Reserva
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="subtitle1" textAlign="center">Servicio</Typography>
                  <Select
                    name="servicio_id"
                    value={reservation.servicio_id}
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Typography variant="subtitle1" textAlign="center">Fecha</Typography>
                  <TextField
                    type="date"
                    name="fecha"
                    value={reservation.fecha}
                    onChange={handleDateChange}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Typography variant="subtitle1" textAlign="center">Hora</Typography>
                  <Select
                    name="hora"
                    value={reservation.hora ? reservation.hora.slice(0, 5) : ''}
                    onChange={handleTimeChange}
                    required
                  >
                    {generarHorasDisponibles().map((hora) => (
                      <MenuItem key={hora} value={hora}>
                        {hora}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="subtitle1" textAlign="center">Tipo Vehículo</Typography>
                  <Select
                    name="tipo_vehiculo_id"
                    value={reservation.tipo_vehiculo_id}
                    onChange={handleChange}
                    required
                  >
                    {tipo_vehiculos.map((tipo_vehiculo) => (
                      <MenuItem key={tipo_vehiculo.id} value={tipo_vehiculo.id}>
                        {tipo_vehiculo.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" textAlign="center" gutterBottom>
                  Servicios Extra:
                </Typography>
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={selectedAtributos}
                    onChange={handleAtributoToggle}
                    renderValue={(selected) =>
                      selected
                        .map((id) => {
                          const atributo = atributos.find((a) => a.id === id);
                          return atributo ? `${atributo.nombre_atributo} - $${atributo.costo_atributo}` : '';
                        })
                        .join(', ')
                    }
                  >
                    {atributos.map((atributo) => (
                      <MenuItem key={atributo.id} value={atributo.id}>
                        {atributo.nombre_atributo} - ${atributo.costo_atributo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} textAlign="center">
                <Typography variant="h6">Total: ${total}</Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
            <Button variant="outlined" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Actualizar
            </Button>
          </DialogActions>
        </Dialog>


        {/* Formulario de Edición de Perfil */}
        <Dialog open={showEditProfile} onClose={() => setShowEditProfile(false)}>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <Typography>Nombre de Usuario</Typography>
              <TextField
                name="username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography>Email</Typography>
              <TextField
                type="email"
                name="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography>Número</Typography>
              <TextField
                name="numero"
                value={user.numero}
                onChange={(e) => setUser({ ...user, numero: e.target.value })}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography>Contraseña</Typography>
              <TextField
                type="password"
                name="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowEditProfile(false)}>Cancelar</Button>
            <Button onClick={handleUpdateProfile}>Actualizar</Button>
          </DialogActions>
        </Dialog>

        {/* Render de la pantalla seleccionada */}
        {renderScreen()}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );

}

export default DashboardCliente;


