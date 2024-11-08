'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const [activeScreen, setActiveScreen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false); // Para mostrar el formulario de edición de perfil
  const [loading, setLoading] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const router = useRouter();
  

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
          // Si no es administrador, redirigir al login de cliente
          router.push("/loginCliente");
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

    fetchReservas();
    fetchEstados();
  }, [router]);
  

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
            <Avatar sx={{ bgcolor: 'secondary.main', marginBottom: 2, alignItems:'center' }}>
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


  if (loading || loadingReservas)  return <p>Loading...</p>;


  return (
    <div>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Box flex="1" p={2}>
          <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" textAlign="center" sx={{ flexGrow: 1 }}>
              Dashboard Adminstrativo
            </Typography>
            <Avatar sx={{ bgcolor: 'secondary.main' }} onClick={handleAvatarClick}>
              {user.username.charAt(0)}
            </Avatar>
          </Toolbar>
        </AppBar>

        {/* Drawer lateral */}
        <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
          <List>
          <ListItem button onClick={() => router.push("../registroRoles")}>
              <ListItemText primary="regitro Con Roles" />
            </ListItem>
          <ListItem button onClick={() => router.push("../nuevoServicio")}>
              <ListItemText primary="Administrar servicios" />
            </ListItem>
            <ListItem button onClick={() => router.push("../estados")}>
              <ListItemText primary="Administrar estados" />
            </ListItem>
            <ListItem button onClick={() => router.push("../atributos")}>
              <ListItemText primary="Administrar atributos" />
            </ListItem>
            <ListItem button onClick={() => router.push("../tiposVehiculos")}>
              <ListItemText primary="Administrar tipos de vehiculo" />
            </ListItem>
            <ListItem button onClick={() => router.push("../usuarios")}>
              <ListItemText primary="Adminisitrar Clientes" />
            </ListItem>
            <ListItem button onClick={() => { logout()}}>
              <ListItemText primary="Cerrar sesion" />
            </ListItem>
            {/* Agrega más elementos de lista según sea necesario */}
          </List>
        </Drawer>

          <TableContainer component={Paper} sx={{ mt: 4, color: 'black' }}>
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
                    <TableCell>{reserva.user ? reserva.user.username : "N/A"}</TableCell>
                    <TableCell>  {reserva.servicio ? reserva.servicio.nombre_servicio : "N/A"} - ${reserva.servicio ? reserva.servicio.precio : "N/A"}</TableCell>
                    <TableCell>{new Date(reserva.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>{reserva.hora}</TableCell>
                    <TableCell>{reserva.tipo_vehiculo ? reserva.tipo_vehiculo.nombre : "N/A"} - ${reserva.tipo_vehiculo ? reserva.tipo_vehiculo.costo : "N/A"}</TableCell>
                    <TableCell>
                      <Select
                        value={reserva.estado_id}
                        onChange={(e) => handleEstadoChange(reserva.id, e.target.value)}
                      >
                        {estados.map((estado) => (
                          <MenuItem key={estado.id} value={estado.id}>
                            {estado.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
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

        {renderScreen()}
        </Box>
        <Footer />
      </Box>
    </div>
  );
}

export default Dashboard;
