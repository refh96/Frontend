'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge } from "@mui/material";
import {
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  List,
  ListItem,
  ListItemText,
  TextField,
  Drawer,
  Avatar,
  AppBar,
  Toolbar
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { parseCookies, destroyCookie } from 'nookies';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

function Dashboard() {
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [estados, setEstados] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeScreen, setActiveScreen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false); // Para mostrar el formulario de edición de perfil
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);  // Para llevar el conteo de notificaciones no leídas
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);
  const [drawerNotificationsOpen, setDrawerNotificationsOpen] = useState(false);
  const [isAppBarOpen, setIsAppBarOpen] = useState(false); // Estado para controlar el AppBar de notificaciones
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Fecha por defecto: hoy
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentReserva, setCurrentReserva] = useState(null);
  const router = useRouter();
  const cookies = parseCookies();


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token; // Asegúrate de obtener el token de cookies
        const { data } = await axios.get('https://fullwash.site/notifications/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(data);

        // Contamos las notificaciones no leídas
        const unread = data.filter(notification => !notification.is_read).length;
        setUnreadCount(unread);

        // Si hay nuevas notificaciones no leídas, muestra una alerta
        const unreadNotifications = data.filter(notification => !notification.is_read);
        if (unreadNotifications.length > 0) {
          const latestNotification = unreadNotifications[0]; // La última notificación no leída

          // Muestra la alerta con el mensaje de la notificación
          Swal.fire({
            title: 'Nuevas notificaciones',
            text: 'Revisa tu seccion de notificaciones', //latestNotification.message,
            icon: 'info',
            confirmButtonText: 'Ok',
          });
        }

      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
    // Reemplaza este intervalo con la función real que actualiza las notificaciones
    const interval = setInterval(fetchNotifications, 30000); // Revisa cada 10 segundos
    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonte
  }, [notifications.length]);

  const handleNotificationClick = async () => {
    // Abrir el Drawer de notificaciones
    setDrawerNotificationsOpen(true);

    // Filtrar las notificaciones no leídas
    const unreadNotifications = notifications.filter(notification => !notification.is_read);
    const unreadNotificationIds = unreadNotifications.map(notification => notification.id);

    // Si hay notificaciones no leídas, marcar como leídas
    if (unreadNotificationIds.length > 0) {
      const cookies = parseCookies();
      const token = cookies.token; // Asegúrate de obtener el token de cookies
      try {
        await axios.post(
          'https://fullwash.site/notifications/mark-as-read',  // Ruta para marcar como leídas
          { ids: unreadNotificationIds },  // Enviar los IDs de las notificaciones no leídas
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Actualizar el estado de las notificaciones a leídas
        setNotifications(prevNotifications =>
          prevNotifications.map(notification => ({
            ...notification,
            is_read: true
          }))
        );
        setUnreadCount(0); // Resetea el contador a 0 después de marcar todas como leídas
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
  };

  useEffect(() => {
    const filtered = notifications.filter(notification =>
      new Date(notification.created_at).toISOString().split("T")[0] === selectedDate
    );
    setFilteredNotifications(filtered);
  }, [notifications, selectedDate]);



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;
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

        // Comprobar si el usuario tiene rol de administrador
        const userRole = res.data.user.rol;  // Asumiendo que el rol se encuentra en res.data.user.role
        if (userRole !== "administrador") {
          // Si no es administrador, redirigir al dashboard de cliente
          router.push("/dashboardCliente");
          return;
        }

        setUser(res.data.user);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching profile:", error.message);
        router.push("/loginAdmin"); // Si ocurre un error, también redirigir al login de admin
      }
    };


    fetchProfile();
  }, [router]);


  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;
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

        setReservas(res.data.reservas);
        setLoadingReservas(false);
      } catch (error) {
        console.error("Error fetching reservas:", error.message);
      }
    };

    const fetchEstados = async () => {
      try {
        const res = await axios.get("https://fullwash.site/estados");
        setEstados(res.data); // Guardar los estados obtenidos
      } catch (error) {
        console.error("Error fetching estados:", error.message);
      }
    };

    // Ejecutar la carga de reservas cada vez que el estado de reservas cambie
    fetchReservas();
    fetchEstados();
  }, [reservas]); // Dependencia de reservas para actualizar siempre que cambien



  const handleAvatarClick = () => {
    setActiveScreen(activeScreen === 'perfil' ? null : 'perfil');
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleEstadoChange = async (id, newEstado) => {
    try {
      const cookies = parseCookies();
      const token = cookies.token;

      // Busca la reserva específica para obtener el resto de los datos
      const reservaToUpdate = reservas.find(reserva => reserva.id === id);

      if (!reservaToUpdate) {
        console.error("Reserva no encontrada");
        return;
      }
      const atributoIds = reservaToUpdate.atributos
        ? reservaToUpdate.atributos.map(atributo => atributo.id)
        : [];

      // Envía todos los campos necesarios
      await axios.put(
        `https://fullwash.site/reservas/${id}`,
        {
          user_id: reservaToUpdate.user_id,
          servicio_id: reservaToUpdate.servicio_id,
          fecha: reservaToUpdate.fecha.slice(0, 10),
          hora: reservaToUpdate.hora,
          estado_id: newEstado, // Usar el ID del estado
          tipo_vehiculo_id: reservaToUpdate.tipo_vehiculo_id,
          atributo_ids: atributoIds
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReservas(reservas.map(reserva =>
        reserva.id === id ? { ...reserva, estado_id: newEstado } : reserva
      ));
    } catch (error) {
      console.error("Error updating estado:", error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta reserva?");
    if (!confirmed) return;

    try {
      const cookies = parseCookies();
      const token = cookies.token;

      await axios.delete(`https://fullwash.site/reservas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Reserva eliminada exitosamente");
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


  const renderScreen = () => {
    switch (activeScreen) {
      case "perfil":
        return (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign={"center"}>
            <Typography color="black" variant="h6">Perfil</Typography>
            <Avatar sx={{ bgcolor: 'secondary.main', marginBottom: 2, alignItems: 'center' }}>
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
      });
      setShowEditProfile(false); // Cierra el formulario
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Error al actualizar el perfil");
    }
  };
  const groupNotificationsByDate = (notifications) => {
    return notifications.reduce((grouped, notification) => {
      const date = new Date(notification.created_at).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(notification);
      return grouped;
    }, {});
  };

  const handleEditClick = (reserva) => {
    setCurrentReserva(reserva);
    setEditDialogOpen(true);
  };

  const handleSaveChanges = async (updatedReserva) => {
    try {
      const cookies = parseCookies();
      const token = cookies.token;

      await axios.put(
        `https://fullwash.site/reservas/${updatedReserva.id}`,
        {
          user_id: updatedReserva.user_id,
          servicio_id: updatedReserva.servicio_id,
          fecha: updatedReserva.fecha,
          hora: updatedReserva.hora,
          estado_id: updatedReserva.estado_id,
          tipo_vehiculo_id: updatedReserva.tipo_vehiculo_id,
          atributo_ids: updatedReserva.atributo_ids,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualiza la lista de reservas en el estado
      setReservas((prevReservas) =>
        prevReservas.map((reserva) =>
          reserva.id === updatedReserva.id ? updatedReserva : reserva
        )
      );

      setEditDialogOpen(false); // Cierra el diálogo
      Swal.fire("¡Éxito!", "Reserva actualizada correctamente.", "success");
    } catch (error) {
      console.error("Error actualizando reserva:", error.message);
      Swal.fire("Error", "No se pudo actualizar la reserva.", "error");
    }
  };




  if (loading || loadingReservas) return <p>Loading...</p>;


  return (
    <div>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Box flex="1" p={2}>

          {/* Barra de navegación */}
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" textAlign="center" sx={{ flexGrow: 1 }}>
                Dashboard Administrativo
              </Typography>
              {/* Icono de notificación con badge */}
              <IconButton color="inherit" onClick={handleNotificationClick}>
                <NotificationsIcon />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', borderRadius: '50%', padding: '0 6px', fontSize: '12px' }}>
                    {unreadCount}
                  </span>
                )}
              </IconButton>

              <Avatar
                sx={{ bgcolor: "secondary.main" }}
                onClick={handleAvatarClick}
              >
                {user.username.charAt(0)}
              </Avatar>
            </Toolbar>
          </AppBar>
          {/* Drawer de notificaciones */}
          <Drawer
            anchor="right"
            open={drawerNotificationsOpen}
            onClose={() => setDrawerNotificationsOpen(false)}
          >
            <Box p={2} width="300px">
              <Typography variant="h6" gutterBottom>
                Notificaciones
              </Typography>

              {/* Selector de Fecha */}
              <TextField
                label="Seleccionar Fecha"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              {/* Lista de Notificaciones Filtradas */}
              {filteredNotifications.length === 0 ? (
                <Typography>No hay notificaciones para esta fecha.</Typography>
              ) : (
                <List>
                  {Object.entries(groupNotificationsByDate(filteredNotifications)).map(
                    ([date, notifications]) => (
                      <Box key={date} mb={2}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold", mt: 2 }}
                        >
                          {date}
                        </Typography>
                        {notifications.map((notification, index) => (
                          <ListItem
                            key={index}
                            style={{
                              backgroundColor: notification.is_read
                                ? '#f0f0f0'
                                : '#e0e0e0',
                              borderLeft: notification.is_read
                                ? 'none'
                                : '4px solid red',
                            }}
                          >
                            <ListItemText
                              primary={notification.message}
                              secondary={new Date(
                                notification.created_at
                              ).toLocaleTimeString()}
                            />
                          </ListItem>
                        ))}
                      </Box>
                    )
                  )}
                </List>
              )}
            </Box>
          </Drawer>


          {/* Drawer lateral */}
          <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
            <List>
              <ListItem button onClick={() => router.push("../registroRoles")}>
                <ListItemText primary="Registro con Roles" />
              </ListItem>
              <ListItem button onClick={() => router.push("../nuevoServicio")}>
                <ListItemText primary="Administrar Servicios" />
              </ListItem>
              <ListItem button onClick={() => router.push("../estados")}>
                <ListItemText primary="Administrar Estados" />
              </ListItem>
              <ListItem button onClick={() => router.push("../atributos")}>
                <ListItemText primary="Administrar Servicios Extra" />
              </ListItem>
              <ListItem button onClick={() => router.push("../tiposVehiculos")}>
                <ListItemText primary="Administrar Tipos de Vehículo" />
              </ListItem>
              <ListItem button onClick={() => router.push("../usuarios")}>
                <ListItemText primary="Administrar Clientes" />
              </ListItem>
              <ListItem button onClick={logout}>
                <ListItemText primary="Cerrar Sesión" />
              </ListItem>
            </List>
          </Drawer>

          {/* Tabla de reservas */}
          {activeScreen !== "perfil" && (
            <TableContainer component={Paper} sx={{ mt: 4, color: "black" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Servicio</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell>Tipo de Vehículo</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Servicios Extras</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservas.map((reserva) => (
                    <TableRow key={reserva.id}>
                      <TableCell>
                        {reserva.user ? reserva.user.username : "N/A"}
                      </TableCell>
                      <TableCell>
                        {reserva.servicio?.nombre_servicio || "N/A"} - $
                        {reserva.servicio?.precio || "N/A"}
                      </TableCell>
                      <TableCell>
                        {new Date(reserva.fecha).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{reserva.hora}</TableCell>
                      <TableCell>
                        {reserva.tipo_vehiculo?.nombre || "N/A"} - $
                        {reserva.tipo_vehiculo?.costo || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={reserva.estado_id}
                          onChange={(e) =>
                            handleEstadoChange(reserva.id, e.target.value)
                          }
                        >
                          {estados.map((estado) => (
                            <MenuItem key={estado.id} value={estado.id}>
                              {estado.nombre}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        {reserva.atributos?.length ? (
                          reserva.atributos.map((atributo) => (
                            <Typography key={atributo.id}>
                              {atributo.nombre_atributo} - $
                              {atributo.costo_atributo}
                            </Typography>
                          ))
                        ) : (
                          <Typography>No hay atributos</Typography>
                        )}
                      </TableCell>
                      <TableCell>{reserva.Total}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleEditClick(reserva)}
                          variant="contained"
                          color="primary"
                          size="small"
                        >
                          Editar
                        </Button>
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
          )}

          {/* Formulario de edición de perfil */}
          <Dialog open={showEditProfile} onClose={() => setShowEditProfile(false)}>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <Typography>Nombre de Usuario</Typography>
                <TextField
                  name="username"
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  required
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <Typography>Email</Typography>
                <TextField
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                  required
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <Typography>Número</Typography>
                <TextField
                  name="numero"
                  value={user.numero}
                  onChange={(e) =>
                    setUser({ ...user, numero: e.target.value })
                  }
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <Typography>Contraseña</Typography>
                <TextField
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowEditProfile(false)}>Cancelar</Button>
              <Button onClick={handleUpdateProfile}>Actualizar</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
            <DialogTitle>Editar Reserva</DialogTitle>
            <DialogContent>
              {currentReserva && (
                <>
                  <TextField
                    label="Fecha"
                    type="date"
                    fullWidth
                    margin="normal"
                    value={currentReserva.fecha.slice(0, 10)} // Mostrar solo la fecha
                    onChange={(e) =>
                      setCurrentReserva({
                        ...currentReserva,
                        fecha: e.target.value.slice(0, 10), // Guardar solo la fecha
                      })
                    }
                  />
                  <TextField
                    label="Hora"
                    type="time"
                    fullWidth
                    margin="normal"
                    value={currentReserva.hora}
                    onChange={(e) =>
                      setCurrentReserva({ ...currentReserva, hora: e.target.value })
                    }
                  />
                  <FormControl fullWidth margin="normal">
                    <Select
                      value={currentReserva.estado_id}
                      onChange={(e) =>
                        setCurrentReserva({ ...currentReserva, estado_id: e.target.value })
                      }
                    >
                      {estados.map((estado) => (
                        <MenuItem key={estado.id} value={estado.id}>
                          {estado.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
              <Button
                onClick={() => handleSaveChanges(currentReserva)}
                color="primary"
                variant="contained"
              >
                Guardar
              </Button>
            </DialogActions>
          </Dialog>


          {/* Muestra pantalla activa */}
          {renderScreen()}
        </Box>
        <Footer />
      </Box>
    </div>
  );
}

export default Dashboard;
