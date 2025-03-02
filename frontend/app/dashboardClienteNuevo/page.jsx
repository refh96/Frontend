'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { destroyCookie } from 'nookies';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import {
  CssBaseline,
  Box,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Grid,
  Paper,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputLabel,
  Chip,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  ListItem,
  Badge,
  Menu,
  Avatar,
  Checkbox,
} from '@mui/material';

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  ExitToApp as LogoutIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ListAlt as ListAltIcon,
  CheckCircle as CheckCircleIcon,
  CarRepair as CarRepairIcon,
} from '@mui/icons-material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import { parseCookies } from 'nookies';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const drawerWidth = 240;

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export default function DashboardClienteNuevo() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [anchorElServicios, setAnchorElServicios] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editReservation, setEditReservation] = useState(null);
  const [selectedAtributos, setSelectedAtributos] = useState([]); // Para los atributos seleccionados
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
  });
  const [servicios, setServicios] = useState([]);
  const [tipo_vehiculos, setTipoVehiculo] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [atributos, setAtributos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProfileData, setEditProfileData] = useState({
    username: '',
    email: '',
    numero: '',
    password: '',
    password_confirmation: ''
  });

  const [serviciosLavados, setServiciosLavados] = useState([]);
  const [serviciosOtros, setServiciosOtros] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [activeScreen, setActiveScreen] = useState('reservas');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [estadoPendienteId, setEstadoPendienteId] = useState('');
  const [total, setTotal] = useState(0);
  const [sortCriteria, setSortCriteria] = useState({ field: "servicio.nombre_servicio", direction: "asc" });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservedDates, setReservedDates] = useState([]);
  const [selectedDateReservations, setSelectedDateReservations] = useState([]);
  const [showReservationSelector, setShowReservationSelector] = useState(false);
  const [showMisReservas, setShowMisReservas] = useState(false);

  const [shouldRefreshReservas, setShouldRefreshReservas] = useState(false);

  const [showStepper, setShowStepper] = useState(false);

  const [costRules, setCostRules] = useState([]);

  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'warning';
      case 'aprobado':
        return 'info';
      case 'completado':
        return 'success';
      case 'cancelado':
        return 'error';
      case 'reagendada':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getEstadoMensaje = (estadoNombre) => {
    const mensajes = {
      'Pendiente': 'Su reserva está proceso para su revisión por parte de la empresa, se le notificará cuando su estado cambie',
      'Aprobado': 'Su reserva ha sido aprobada para ser realizada en la fecha y hora seleccionadas. Lo esperamos para realizar su servicio en nuestro Local',
      'En proceso': 'Su servicio se encuentra en proceso en este momento. Se le notificará cuando esté completado',
      'Completado': 'Su servicio ha sido completado satisfactoriamente. Puede acercarse al local para revisar su vehículo y pagar por su servicio',
      'Finalizado': 'Su servicio fue realizado y pagado satisfactoriamente. Gracias Por Preferirnos',
      'Rechazado': 'Debido a la saturación de pedidos, ese horario y fecha no se encuentra disponible. Por favor, edite su reserva si desea continuar',
      'Recalendarizado': 'Su Reserva fue re-calendarizada a una fecha y hora disponible'
    };
    return mensajes[estadoNombre] || '';
  };

  const getStepNumber = (estado) => {
    const estados = ['Pendiente', 'Aprobado', 'Completado'];
    return estados.indexOf(estado);
  };

  const mainStates = ['Pendiente', 'Aprobado', 'Completado'];
  const alternativeStates = ['Cancelado', 'Reagendada'];

  const getReservasStats = () => {
    const total = reservas.length;
    const pendientes = reservas.filter(r => r.estado_id === 1).length;
    const aprobadas = reservas.filter(r => r.estado_id === 2).length;
    const rechazadas = reservas.filter(r => r.estado_id === 3).length;
    const enProceso = reservas.filter(r => r.estado_id === 4).length;
    const completadas = reservas.filter(r => r.estado_id === 5).length;
    const finalizadas = reservas.filter(r => r.estado_id === 6).length;
    const recalendarizadas = reservas.filter(r => r.estado_id === 7).length;

    return {
      total,
      pendientes,
      aprobadas,
      rechazadas,
      enProceso,
      completadas,
      finalizadas,
      recalendarizadas
    };
  };

  const getProximasReservas = () => {
    const hoy = new Date();
    return reservas
      .filter(reserva => {
        const fechaReserva = new Date(reserva.fecha);
        return fechaReserva >= hoy && 
               (reserva.estado.nombre === "Pendiente" || 
                reserva.estado.nombre === "Aprobado");
      })
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .slice(0, 3);
  };

  // Verificar el token y obtener datos del usuario al cargar
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;
        if (!token) {
          router.push('/loginCliente');
          return;
        }

        const res = await axios.post(
          'https://fullwash.site/profile',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data && res.data.user) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        router.push('/loginCliente');
      }
    };

    fetchProfile();
  }, [router]);

  // Efecto para obtener el estado "Pendiente" al cargar el componente
  useEffect(() => {
    const fetchEstadoPendiente = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;
        const response = await axios.get('https://fullwash.site/estados', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const estadoPendiente = response.data.find(estado => estado.nombre === 'Pendiente');
        if (estadoPendiente) {
          setEstadoPendienteId(estadoPendiente.id);
          console.log('Estado pendiente encontrado:', estadoPendiente.id);
        }
      } catch (error) {
        console.error('Error al obtener estados:', error);
      }
    };

    fetchEstadoPendiente();
  }, []);

  // Efecto para inicializar la reserva con el user_id cuando se obtiene el usuario
  useEffect(() => {
    if (user?.id) {
      console.log('Usuario encontrado:', user.id);
    }
  }, [user]);

  // Efecto adicional para asegurar que tanto user_id como estado_id estén establecidos
  useEffect(() => {
    if (user?.id && estadoPendienteId) {
      console.log('Actualizando reservation con user_id y estado_id:', { user_id: user.id, estado_id: estadoPendienteId });
    }
  }, [user?.id, estadoPendienteId]);

  const getInitialReservation = () => ({
    user_id: user?.id || '',
    servicio_id: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '',
    estado_id: estadoPendienteId || '',
    tipo_vehiculo_id: '',
    atributo_ids: [],
  });

  const [reservation, setReservation] = useState(getInitialReservation());

  const fetchInitialData = async () => {
    if (!user.id) return;

    try {
      setIsLoading(true);
      const fetchServicios = async () => {
        try {
          const res = await axios.get("https://fullwash.site/servicios");
          setServicios(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (error) {
          console.error("Error fetching services:", error.message);
          setServicios([]);
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

      const fetchServiciosLavados = async () => {
        try {
          const res = await axios.get('https://fullwash.site/servicios?txtBuscar=lavados');
          setServiciosLavados(res.data.data || []);
        } catch (error) {
          console.error('Error fetching servicios lavados:', error);
        }
      };

      const fetchServiciosOtros = async () => {
        try {
          const res = await axios.get('https://fullwash.site/servicios?txtBuscar=otros');
          setServiciosOtros(res.data.data || []);
        } catch (error) {
          console.error('Error fetching servicios otros:', error);
        }
      };

      const fetchCostRules = async () => {
        try {
          const res = await axios.get("https://fullwash.site/cost-rules");
          setCostRules(res.data.data);
        } catch (error) {
          console.error("Error fetching cost rules:", error.message);
        }
      };

      await Promise.all([
        fetchServicios(),
        fetchTipoVehiculo(),
        fetchAtributos(),
        fetchReservas(),
        fetchServiciosLavados(),
        fetchServiciosOtros(),
        fetchCostRules()
      ]);

      setError(null);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Error al cargar los datos. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para cargar datos iniciales cuando el usuario está disponible
  useEffect(() => {
    if (user.id) {
      fetchInitialData();
    }
  }, [user.id]);

  // Efecto para mantener actualizadas las reservas y otros datos
  useEffect(() => {
    if (user?.id) {
      const fetchReservas = async () => {
        try {
          const token = parseCookies().token;
          if (!token) return;

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

      // Ejecutar fetchReservas inmediatamente
      fetchReservas();

      // Configurar el intervalo para actualizar cada 5 segundos
      const interval = setInterval(fetchReservas, 5000);

      // Limpiar el intervalo cuando el componente se desmonte
      return () => clearInterval(interval);
    }
  }, [user?.id]); // Solo depende de user.id

  // Efecto para actualizar las reservas cuando shouldRefreshReservas cambia
  useEffect(() => {
    const refreshReservas = async () => {
      if (!shouldRefreshReservas || !user?.id) return;

      try {
        const token = parseCookies().token;
        if (!token) return;

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
        console.error("Error refreshing reservas:", error.message);
      } finally {
        setShouldRefreshReservas(false);
      }
    };

    refreshReservas();
  }, [shouldRefreshReservas, user?.id]);

  // Efecto para sincronizar atributos con la reserva
  useEffect(() => {
    if (selectedAtributos.length > 0) {
      setReservation(prev => ({
        ...prev,
        atributo_ids: selectedAtributos
      }));
    }
  }, [selectedAtributos]);

  // Efecto para calcular el total
  useEffect(() => {
    if (reservation.servicio_id && reservation.tipo_vehiculo_id) {
      const servicio = servicios.find((s) => s.id === parseInt(reservation.servicio_id));
      const tipoVehiculo = tipo_vehiculos.find((t) => t.id === parseInt(reservation.tipo_vehiculo_id));
      const atributosSeleccionados = atributos.filter((a) => selectedAtributos.includes(a.id));

      let nuevoTotal = 0;

      if (servicio && tipoVehiculo) {
        // Buscar si existe una regla de costo específica
        const costRule = costRules.find(
          rule => rule.servicio_id === parseInt(reservation.servicio_id) && 
                 rule.tipo_vehiculo_id === parseInt(reservation.tipo_vehiculo_id)
        );

        // Calcular el costo base
        let costoVehiculoAjustado = tipoVehiculo.costo;

        // Aplicar el costo adicional de la regla si existe
        if (costRule) {
          costoVehiculoAjustado += costRule.costo_adicional;
        }

        // Calcular el total final
        nuevoTotal =
          servicio.precio +
          costoVehiculoAjustado +
          atributosSeleccionados.reduce((acc, atributo) => acc + atributo.costo_atributo, 0);

        // Actualizar el total en el estado de la reserva
        setReservation(prev => ({
          ...prev,
          Total: nuevoTotal
        }));
      }

      setTotal(nuevoTotal);
    }
  }, [
    atributos,
    reservation.servicio_id,
    reservation.tipo_vehiculo_id,
    selectedAtributos,
    servicios,
    tipo_vehiculos,
    costRules,
  ]);

  const handleAtributoToggle = (event) => {
    const value = event.target.value;
    setSelectedAtributos(value);
    
    // Actualizar también los atributos en la reservación
    setReservation(prev => ({
      ...prev,
      atributo_ids: value
    }));
  };

  // Sistema de notificaciones local
  const fetchNotificaciones = () => {
    try {
      const storedNotifications = localStorage.getItem(`notifications_${user?.id}`);
      const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
      setNotificaciones(notifications);
      const noLeidas = notifications.filter(notif => !notif.leida).length;
      setNotifCount(noLeidas);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      setNotificaciones([]);
      setNotifCount(0);
    }
  };

  const saveNotificaciones = (notifications) => {
    try {
      localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error al guardar notificaciones:', error);
    }
  };

  const crearNotificacion = (mensaje) => {
    if (!user?.id) return;

    const nuevaNotificacion = {
      id: Date.now(),
      mensaje,
      leida: false,
      fecha: new Date().toISOString()
    };

    const notificacionesActualizadas = [nuevaNotificacion, ...notificaciones];
    setNotificaciones(notificacionesActualizadas);
    setNotifCount(prev => prev + 1);
    saveNotificaciones(notificacionesActualizadas);
  };

  const markNotificationAsRead = (notificationId) => {
    const notificacionesActualizadas = notificaciones.map(notif =>
      notif.id === notificationId ? { ...notif, leida: true } : notif
    );
    setNotificaciones(notificacionesActualizadas);
    setNotifCount(prev => Math.max(0, prev - 1));
    saveNotificaciones(notificacionesActualizadas);
  };

  // Efectos para notificaciones
  useEffect(() => {
    if (user?.id) {
      fetchNotificaciones();
    }
  }, [user?.id]);

  useEffect(() => {
    // Obtener los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const showFormParam = params.get('showForm');
    const servicioId = params.get('servicio_id');
  
    if (showFormParam === 'true' && servicioId) {
      // Buscar el servicio en la lista de servicios
      const servicio = servicios.find(s => s.id.toString() === servicioId);
      if (servicio) {
        setSelectedService(servicio);
        setShowForm(true);
        // Actualizar la reservación con el servicio seleccionado
        setReservation(prev => ({
          ...prev,
          servicio_id: servicioId
        }));
      }
    }
  }, [servicios]); // Se ejecuta cuando la lista de servicios está disponible

  const handleLogout = async () => {
    try {
      destroyCookie(null, 'token');
      router.push('/loginCliente');
    } catch (error) {
      console.error('Error during logout:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al cerrar sesión',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileOptionClick = (option) => {
    handleProfileMenuClose();
    if (option === 'profile') {
      setActiveScreen('perfil');
    } else if (option === 'logout') {
      handleLogout();
    }
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNotificationClick = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorElNotif(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validar campos obligatorios
    const { servicio_id, fecha, hora, tipo_vehiculo_id, user_id, estado_id } = reservation;

    // Asegurarse de que la hora tenga el formato correcto para la base de datos
    const horaCompleta = hora.length === 5 ? hora + ':00' : hora;

    // Validar campos obligatorios
    if (!servicio_id || !fecha || !hora || !tipo_vehiculo_id || !user_id || !estado_id) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor, rellena todos los campos obligatorios antes de guardar la reserva. El campo de servicios extra es opcional.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    try {
      const cookies = parseCookies();
      const token = cookies.token;
      if (!token) {
        router.push("/loginCliente");
        return;
      }

      // Crear el objeto de reserva con los atributos seleccionados y el total calculado
      const nuevaReserva = {
        ...reservation,
        user_id: parseInt(user_id),
        servicio_id: parseInt(servicio_id),
        tipo_vehiculo_id: parseInt(tipo_vehiculo_id),
        estado_id: parseInt(estado_id),
        atributos: selectedAtributos,
        Total: total
      };

      const response = await axios.post(
        'https://fullwash.site/reservas',
        nuevaReserva,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        const servicioNombre = servicios.find(s => s.id === parseInt(servicio_id))?.nombre_servicio || 'Servicio';
        crearNotificacion(
          `Se ha creado tu reserva para el servicio de ${servicioNombre} y está pendiente de confirmación.`
        );

        Swal.fire({
          title: '¡Éxito!',
          text: 'Reserva creada exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        setShouldRefreshReservas(true);
        handleCloseNewReservation();
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Error al crear la reserva',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleUpdate = async () => {
    setError(null);

    // Validar campos obligatorios
    const { servicio_id, fecha, hora, tipo_vehiculo_id } = reservation;

    if (!servicio_id || !fecha || !hora || !tipo_vehiculo_id) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor, rellena todos los campos obligatorios antes de actualizar la reserva. El campo de servicios extra es opcional.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    try {
      const cookies = parseCookies();
      const token = cookies.token;
      if (!token) {
        router.push("/loginCliente");
        return;
      }

      const { fecha_inicio, hora_inicio } = reservation;
      const fechaHora = `${fecha_inicio}T${hora_inicio}`;
      
      const requestData = {
        ...reservation,
        fecha_hora: fechaHora,
        estado_id: 1, // Establecer estado como Pendiente
        atributo_ids: selectedAtributos
      };

      const response = await axios.put(
        `https://fullwash.site/reservas/${editReservation.id}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        const servicioNombre = servicios.find(s => s.id === parseInt(servicio_id))?.nombre_servicio || editReservation.servicio.nombre_servicio || 'Servicio';
        crearNotificacion(
          `Tu reserva del servicio ${servicioNombre} ha sido actualizada exitosamente y está pendiente de aprobación.`
        );

        Swal.fire({
          title: 'Éxito!',
          text: 'Reserva actualizada exitosamente y está pendiente de aprobación',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        setShouldRefreshReservas(true);
        handleCloseEditReservation();
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Error al actualizar la reserva',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const selectedDateString = e.target.value;

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
      // Resetear la hora cuando se cambia la fecha
      setReservation(prev => ({ ...prev, hora: "" }));
    }
  };

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    setReservation(prev => ({ ...prev, hora: selectedTime }));
  };

  const handleEditReservation = (reserva) => {
    setEditing(true);
    setReservation({
      ...reserva,
      servicio_id: reserva.servicio.id,
      tipo_vehiculo_id: reserva.tipo_vehiculo.id,
      fecha: new Date(reserva.fecha).toISOString().split('T')[0], // Formatear la fecha correctamente
      hora: reserva.hora.slice(0, 5) // Convertir de "HH:mm:ss" a "HH:mm"
    });
    setSelectedAtributos(reserva.atributos.map(attr => attr.id));
    setEditReservation(reserva);
    setShowForm(true);
  };

  const handleCloseEditReservation = () => {
    setEditing(false);
    setShowForm(false);
    setReservation(getInitialReservation());
    setSelectedAtributos([]);
    setTotal(0);
  };

  const handleOpenNewReservation = () => {
    setReservation(getInitialReservation());
    setShowForm(true);
    setEditing(false);
    setSelectedAtributos([]);
    setTotal(0);
  };


  const handleCloseNewReservation = () => {
    setShowForm(false);
    setSelectedService(null);
    setReservation(getInitialReservation());
    setSelectedAtributos([]);
    setTotal(0);
    // Limpiar la URL
    const newUrl = window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  };

  const handleDeleteReservation = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        const cookies = parseCookies();
        const token = cookies.token;
        
        await axios.delete(`https://fullwash.site/reservas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setShouldRefreshReservas(true); // Trigger para actualizar las reservas

        Swal.fire(
          'Eliminada!',
          'La reserva ha sido eliminada.',
          'success'
        );
      }
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al eliminar la reserva',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const calculateTotal = (service, atributos) => {
    if (!service) return;
    
    let total = service.precio_base || 0;
    
    // Sumar el precio de los atributos seleccionados
    if (Array.isArray(atributos) && atributos.length > 0) {
      const atributosSeleccionados = Array.isArray(atributos) ? atributos : [];
      atributosSeleccionados.forEach(atributoId => {
        const atributo = atributos.find(a => a.id === atributoId);
        if (atributo) {
          total += atributo.precio || 0;
        }
      });
    }
    
    setTotal(total);
  };

  // Función para generar las horas disponibles
  const generarHorasDisponibles = () => {
    const horas = [];
    const fechaSeleccionada = reservation.fecha;
    const horaActual = reservation.hora;
  
    // Obtener reservas que coincidan con la fecha seleccionada
    const reservasEnFecha = reservas.filter(reserva => {
      const reservaFecha = new Date(reserva.fecha).toISOString().split('T')[0];
      return reservaFecha === fechaSeleccionada && 
             reserva.estado.nombre !== 'Cancelada' && // No considerar reservas canceladas
             reserva.estado.nombre !== 'Rechazado' && // No considerar reservas rechazadas
             (!editing || reserva.id !== editReservation?.id); // No filtrar la hora actual si estamos editando
    });
  
    for (let i = 9; i <= 18; i++) { // Horas de 9 AM a 6 PM
      const hora = `${i < 10 ? '0' : ''}${i}:00`;
      const horaCompleta = `${hora}:00`; // Formato HH:mm:ss para comparar con la base de datos
      
      const horaOcupada = reservasEnFecha.some(reserva => 
        reserva.hora === horaCompleta
      );
  
      // Incluir la hora si está disponible o si es la hora actual de la reserva que se está editando
      if (!horaOcupada || (editing && horaCompleta === editReservation?.hora)) {
        horas.push(hora); // Usar formato HH:mm para el select
      }
    }
  
    return horas;
  };

  // Función para obtener las fechas con reservas
  useEffect(() => {
    if (!reservas?.length) return;
    
    try {
      const dates = reservas
        .map(reserva => {
          const fecha = new Date(reserva.fecha);
          if (isNaN(fecha.getTime())) {
            console.error('Fecha inválida:', reserva.fecha);
            return null;
          }
          // Ajustar por la zona horaria
          fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
          return format(fecha, 'yyyy-MM-dd');
        })
        .filter(Boolean); // Eliminar fechas nulas
      
      const uniqueDates = [...new Set(dates)];
      setReservedDates(uniqueDates);
    } catch (error) {
      console.error('Error procesando fechas:', error);
    }
  }, [reservas]);

  // Función para manejar la selección de fecha en el calendario
  const handleDateSelect = (date) => {
    try {
      const adjustedDate = new Date(date);
      adjustedDate.setMinutes(adjustedDate.getMinutes() + adjustedDate.getTimezoneOffset());
      const formattedDate = format(adjustedDate, 'yyyy-MM-dd');
      
      const reservasEnFecha = reservas.filter(reserva => {
        try {
          const fechaReserva = new Date(reserva.fecha);
          fechaReserva.setMinutes(fechaReserva.getMinutes() + fechaReserva.getTimezoneOffset());
          return format(fechaReserva, 'yyyy-MM-dd') === formattedDate;
        } catch (error) {
          console.error('Error procesando fecha de reserva:', reserva.fecha, error);
          return false;
        }
      });

      if (reservasEnFecha.length > 1) {
        setSelectedDateReservations(reservasEnFecha);
        setShowReservationSelector(true);
      } else if (reservasEnFecha.length === 1) {
        setSelectedReservation(reservasEnFecha[0]);
        setShowReservationSelector(false);
      }
      setSelectedDate(date);
      setShowStepper(true);
    } catch (error) {
      console.error('Error en handleDateSelect:', error);
    }
  };

  const ReservationStepper = ({ reserva }) => {
    if (!reserva || !reserva.estado) return null;

    const estados = ['Pendiente', 'Aprobado', 'En proceso', 'Completado', 'Finalizado'];
    let currentStep = estados.indexOf(reserva.estado.nombre);
    
    // Si el estado es Rechazado o Recalendarizado, mostramos un mensaje especial
    if (reserva.estado.nombre === 'Rechazado' || reserva.estado.nombre === 'Recalendarizado') {
      return (
        <Box sx={{ width: '100%', mt: 2 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Estado: {reserva.estado.nombre}
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="body1" color="text.secondary">
              {getEstadoMensaje(reserva.estado.nombre)}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setShowStepper(false)}
              sx={{ mt: 2 }}
            >
              Ocultar Seguimiento
            </Button>
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <Stepper activeStep={currentStep} orientation="vertical" sx={{ mt: 2 }}>
          {estados.map((estadoNombre) => (
            <Step key={estadoNombre}>
              <StepLabel>
                <Typography variant="subtitle1">{estadoNombre}</Typography>
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                  {getEstadoMensaje(estadoNombre)}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Button
          variant="outlined"
          onClick={() => setShowStepper(false)}
          sx={{ mt: 2 }}
        >
          Ocultar Seguimiento
        </Button>
      </Box>
    );
  };

  // Selector de reserva cuando hay múltiples en un día
  const ReservationSelector = () => (
    <Dialog open={showReservationSelector} onClose={() => setShowReservationSelector(false)}>
      <DialogTitle>Seleccionar Reserva</DialogTitle>
      <DialogContent>
        <List>
          {selectedDateReservations.map((reserva) => (
            <ListItem
              button
              key={reserva.id}
              onClick={() => {
                setSelectedReservation(reserva);
                setShowReservationSelector(false);
              }}
            >
              <ListItemText
                primary={`${reserva.servicio.nombre_servicio} - ${reserva.hora}`}
                secondary={`Estado: ${reserva.estado.nombre}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );

  // Vista de Mis Reservas
  const MisReservasView = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Mis Reservas
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Servicio</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservas.map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell>{reserva.servicio.nombre_servicio}</TableCell>
                    <TableCell>{format(new Date(reserva.fecha), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{reserva.hora}</TableCell>
                    <TableCell>
                      <Chip
                        label={reserva.estado.nombre}
                        color={getEstadoColor(reserva.estado.nombre)}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setSelectedReservation(reserva);
                          setSelectedDate(new Date(reserva.fecha));
                          setShowMisReservas(false);
                          setActiveScreen('calendar');
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );

  const handleUpdateProfile = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies.token;

      if (!token) {
        router.push("/loginCliente");
        return;
      }

      await axios.put(
        `https://fullwash.site/users/${user.id}`,
        {
          username: user.username,
          email: user.email,
          numero: user.numero,
          password: user.password,
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
        icon: 'success',
        confirmButtonText: 'Aceptar',
        backdrop: true,
        timer: 3000,
        timerProgressBar: true,
      });

      setShowEditProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error.message);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || "Error al actualizar el perfil",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleServiciosClick = (event) => {
    setAnchorElServicios(event.currentTarget);
  };

  const handleServiciosClose = () => {
    setAnchorElServicios(null);
  };

  const handleServiceSelect = (servicio) => {
    setSelectedService(servicio);
    handleServiciosClose();
    setReservation(prev => ({ ...prev, servicio_id: servicio.id }));
    setShowForm(true);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} horas ${remainingMinutes} minutos`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('handleChange:', { name, value });
    
    setReservation(prev => {
      const newReservation = {
        ...prev,
        [name]: value,
        user_id: prev.user_id || user?.id || "",
        estado_id: prev.estado_id || estadoPendienteId || "",
        atributo_ids: selectedAtributos
      };

      // Si el cambio es en tipo_vehiculo_id, resetear los atributos seleccionados
      if (name === 'tipo_vehiculo_id') {
        setSelectedAtributos([]);
      }

      console.log('Nueva reserva después de handleChange:', newReservation);
      return newReservation;
    });
  };

  const canEditReservation = (reserva) => {
    const estadosNoEditables = [4, 5, 6]; // IDs de En Proceso, Completado, Finalizado
    return !estadosNoEditables.includes(reserva.estado_id);
  };

  const ReservationSummary = ({ reservation, total, servicios, tipo_vehiculos, atributos }) => {
    const servicio = servicios.find(s => s.id === parseInt(reservation.servicio_id));
    const tipoVehiculo = tipo_vehiculos.find(t => t.id === parseInt(reservation.tipo_vehiculo_id));
    const atributosSeleccionados = atributos.filter(a => reservation.atributo_ids?.includes(a.id));

    // Encontrar la regla de costo específica si existe
    const costRule = costRules.find(
      rule => rule.servicio_id === parseInt(reservation.servicio_id) && 
              rule.tipo_vehiculo_id === parseInt(reservation.tipo_vehiculo_id)
    );

    // Calcular el costo del vehículo
    const costoVehiculo = tipoVehiculo ? (
      tipoVehiculo.costo + (costRule ? costRule.costo_adicional : 0)
    ) : 0;

    return (
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mt: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6" align="center" gutterBottom sx={{ color: '#1976d2', borderBottom: '1px solid #1976d2', pb: 1 }}>
              Resumen de tu Reserva
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              {servicio && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body1">
                    <strong>Servicio:</strong> {servicio.nombre_servicio}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#1976d2' }}>
                    ${servicio.precio.toLocaleString('es-CL')}
                  </Typography>
                </Box>
              )}
              
              {tipoVehiculo && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body1">
                    <strong>Tipo de Vehículo:</strong> {tipoVehiculo.nombre}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#1976d2' }}>
                    ${costoVehiculo.toLocaleString('es-CL')}
                  </Typography>
                </Box>
              )}
              
              {reservation.fecha && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body1">
                    <strong>Fecha:</strong> {(() => {
                      const fecha = new Date(reservation.fecha);
                      fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
                      return format(fecha, 'dd/MM/yyyy');
                    })()}
                  </Typography>
                </Box>
              )}
              
              {reservation.hora && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body1">
                    <strong>Hora:</strong> {reservation.hora.substring(0, 5)} hrs
                  </Typography>
                </Box>
              )}
              
              {atributosSeleccionados.length > 0 && (
                <>
                  <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                    <strong>Servicios Adicionales:</strong>
                  </Typography>
                  <Box sx={{ backgroundColor: '#fff', p: 2, borderRadius: 1 }}>
                    {atributosSeleccionados.map(atributo => (
                      <Box key={atributo.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          <strong>Servicio Extra:</strong> {atributo.nombre_atributo || atributo.nombre}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1976d2' }}>
                          ${atributo.costo_atributo.toLocaleString('es-CL')}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 3,
                pt: 2,
                borderTop: '2px solid #1976d2'
              }}>
                <Typography variant="h6">
                  <strong>Total:</strong>
                </Typography>
                <Typography variant="h6" sx={{ color: '#1976d2' }}>
                  ${total.toLocaleString('es-CL')}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  if (isLoading) {
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
  }

  if (!user) {
    router.push('/loginCliente');
    return null;
  }

  // Función para filtrar atributos según el tipo de vehículo
  const getAtributosFiltrados = (tipoVehiculoId) => {
    if (!tipoVehiculoId || !atributos) return [];
    
    const tipoVehiculo = tipo_vehiculos.find(tv => tv.id === parseInt(tipoVehiculoId));
    if (!tipoVehiculo) return [];

    // Obtener el código del tipo de vehículo (C1, C2 o C3)
    const codigoVehiculo = tipoVehiculo.nombre.split(':')[0].trim();

    return atributos.filter(atributo => {
      const nombreAtributo = atributo.nombre_atributo.toUpperCase();
      
      // Casos especiales para SUV 7 asientos (C3)
      if (codigoVehiculo === 'C3') {
        return nombreAtributo.includes('C3') || 
               nombreAtributo.includes('SUV 7') ||
               nombreAtributo.includes('PLASTICOS C2 Y C3');
      }
      
      // Casos especiales para C2
      if (codigoVehiculo === 'C2') {
        return nombreAtributo.includes('C2') || 
               nombreAtributo.includes('CAMIONETAS XL') ||
               nombreAtributo.includes('PLASTICOS C2') ||
               (nombreAtributo.includes('DESCONTAMINADO DE VIDRIOS') && !nombreAtributo.includes('SUV 7'));
      }
      
      // Casos para C1
      if (codigoVehiculo === 'C1') {
        return nombreAtributo.includes('C1') ||
               (nombreAtributo.includes('DESCONTAMINADO DE VIDRIOS') && !nombreAtributo.includes('SUV 7')) ||
               nombreAtributo.includes('PULIDO DE FOCOS');
      }

      return false;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <StyledAppBar position="absolute" open={open}>
          <Toolbar 
            sx={{ 
              pr: '24px',
              background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
              boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Avatar
                src="https://i.ibb.co/7CYX4zX/logo-full-wash.jpg"
                alt="Full Wash Logo"
                sx={{ 
                  width: 40, 
                  height: 40,
                  marginRight: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}
                onClick={() => router.push('/')}
              />
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ 
                  flexGrow: 1,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Panel de Control
              </Typography>
            </Box>

            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Box>
                <Button
                  color="inherit"
                  onClick={handleServiciosClick}
                  startIcon={<CarRepairIcon />}
                  sx={{
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    '& .MuiButton-startIcon': {
                      marginRight: { xs: 0, sm: 1 }
                    },
                    '& .MuiButton-label': {
                      display: { xs: 'none', sm: 'block' }
                    },
                    minWidth: { xs: 40, sm: 'auto' },
                    padding: { xs: 1, sm: '6px 16px' },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Servicios
                </Button>
                <Menu
                  anchorEl={anchorElServicios}
                  open={Boolean(anchorElServicios)}
                  onClose={handleServiciosClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      width: 400,
                      maxHeight: '80vh', // Limita la altura al 80% de la ventana
                      overflowY: 'auto', // Habilita el scroll vertical
                      borderRadius: 2,
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    {[
                      { title: 'Lavados de Vehículos', servicios: serviciosLavados },
                      { title: 'Otros Servicios', servicios: serviciosOtros }
                    ].map((categoria, index) => (
                      <Box key={index} sx={{ mb: index === 0 ? 3 : 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#1a237e',
                            fontWeight: 600,
                            borderBottom: '2px solid #1a237e',
                            pb: 1,
                            mb: 2
                          }}
                        >
                          {categoria.title}
                        </Typography>
                        {categoria.servicios.map((servicio) => (
                          <Box
                            key={servicio.id}
                            onClick={() => handleServiceSelect(servicio)}
                            sx={{
                              p: 2,
                              mb: 2,
                              borderRadius: 2,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: '#e3f2fd',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}
                            >
                              {servicio.nombre_servicio}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              Tiempo estimado: {formatTime(servicio.tiempo_estimado)}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: '#1a237e', fontWeight: 500 }}
                            >
                              Desde ${servicio.precio}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Box>
                </Menu>
              </Box>
              <Box>
                <IconButton 
                  color="inherit" 
                  onClick={handleNotificationClick}
                  id="notificationIcon"
                  sx={{
                    padding: { xs: 1, sm: 1.5 },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <Badge 
                    badgeContent={notifCount} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#ff5722',
                        color: 'white'
                      }
                    }}
                  >
                    <NotificationsIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                  </Badge>
                </IconButton>
                <Menu
                  anchorEl={anchorElNotif}
                  open={Boolean(anchorElNotif)}
                  onClose={handleNotificationClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      width: 350,
                      maxHeight: 400,
                      borderRadius: 2,
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ 
                        color: '#1a237e',
                        fontWeight: 600,
                        borderBottom: '2px solid #1a237e',
                        pb: 1
                      }}
                    >
                      Notificaciones
                    </Typography>
                    {notificaciones.length > 0 ? (
                      notificaciones.map((notif) => (
                        <Box
                          key={notif.id}
                          sx={{
                            p: 1.5,
                            mb: 1,
                            borderRadius: 1,
                            backgroundColor: notif.leida ? 'grey.100' : 'primary.light',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }
                          }}
                          onClick={() => !notif.leida && markNotificationAsRead(notif.id)}
                        >
                          <Typography 
                            variant="subtitle2" 
                            color="text.primary"
                            sx={{ fontWeight: notif.leida ? 'normal' : 'bold' }}
                          >
                            {notif.mensaje}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            {new Date(notif.fecha).toLocaleString()}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography 
                        color="textSecondary"
                        sx={{ 
                          textAlign: 'center',
                          py: 2,
                          fontStyle: 'italic'
                        }}
                      >
                        No hay notificaciones nuevas
                      </Typography>
                    )}
                  </Box>
                </Menu>
              </Box>

              <Box>
                <IconButton 
                  color="inherit" 
                  onClick={handleProfileClick}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: '#ff5722',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    {user?.username ? user.username[0].toUpperCase() : '?'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 180,
                      borderRadius: 2,
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <MenuItem 
                    onClick={() => handleProfileOptionClick('profile')}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(26, 35, 126, 0.08)'
                      }
                    }}
                  >
                    <PersonIcon sx={{ mr: 2, color: '#1a237e' }} />
                    Mi Perfil
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleProfileOptionClick('logout')}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.08)'
                      }
                    }}
                  >
                    <LogoutIcon sx={{ mr: 2, color: '#f44336' }} />
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </StyledAppBar>

        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItemButton
              selected={activeScreen === 'reservas'}
              onClick={() => setActiveScreen('reservas')}
            >
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Mis Reservas" />
            </ListItemButton>
            <ListItemButton
              selected={activeScreen === 'perfil'}
              onClick={() => setActiveScreen('perfil')}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Mi Perfil" />
            </ListItemButton>
            <ListItemButton onClick={handleOpenNewReservation}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Nueva Reserva" />
            </ListItemButton>
            <Divider sx={{ my: 1 }} />
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItemButton>
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            marginLeft: 0,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            transition: theme =>
              theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {activeScreen === 'reservas' ? (
              <Grid container spacing={3}>
                {/* Contenido actual de reservas */}
                <Grid item xs={12} md={4}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      flexDirection: 'column',
                      height: 'auto',
                      minHeight: 240,
                      overflow: 'hidden'
                    }}
                  >
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                      Resumen de Reservas
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Total</Typography>
                      <Typography>{getReservasStats().total}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Pendientes</Typography>
                      <Typography color="warning.main">{getReservasStats().pendientes}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Aprobadas</Typography>
                      <Typography color="info.main">{getReservasStats().aprobadas}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Rechazadas</Typography>
                      <Typography color="error.main">{getReservasStats().rechazadas}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">En Proceso</Typography>
                      <Typography color="info.main">{getReservasStats().enProceso}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Completadas</Typography>
                      <Typography color="success.main">{getReservasStats().completadas}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Finalizadas</Typography>
                      <Typography color="success.main">{getReservasStats().finalizadas}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Recalendarizadas</Typography>
                      <Typography color="warning.main">{getReservasStats().recalendarizadas}</Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Paper 
                    sx={{ 
                      p: { xs: 1, sm: 2 }, 
                      display: 'flex', 
                      flexDirection: 'column',
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography component="h2" variant="h6" color="primary">
                        Seguimiento de Reservas
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenNewReservation}
                        sx={{
                          display: { xs: 'none', sm: 'flex' }
                        }}
                      >
                        Nueva Reserva
                      </Button>
                      <IconButton
                        color="primary"
                        onClick={handleOpenNewReservation}
                        sx={{
                          display: { xs: 'flex', sm: 'none' }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ 
                      flex: 1,
                      width: '100%',
                      overflow: 'auto'
                    }}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DateCalendar
                          value={selectedDate}
                          onChange={handleDateSelect}
                          shouldDisableDate={(date) => {
                            try {
                              const formattedDate = format(date, 'yyyy-MM-dd');
                              return !reservedDates.includes(formattedDate);
                            } catch (error) {
                              console.error('Error en shouldDisableDate:', error);
                              return true;
                            }
                          }}
                          sx={{
                            width: '100%',
                            maxWidth: '100%',
                            '& .MuiPickersCalendarHeader-root': {
                              padding: { xs: '0 8px', sm: '0 16px' },
                              '& .MuiPickersArrowSwitcher-root': {
                                gap: { xs: 0.5, sm: 1 }
                              }
                            },
                            '& .MuiDayCalendar-header': {
                              display: 'flex',
                              justifyContent: 'space-around',
                              padding: '0 6px',
                              '& .MuiDayCalendar-weekDayLabel': {
                                width: { xs: 28, sm: 36, md: 40 },
                                height: { xs: 28, sm: 36, md: 40 },
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                margin: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }
                            },
                            '& .MuiDayCalendar-weekContainer': {
                              justifyContent: 'space-around',
                              margin: { xs: '2px 0', sm: '4px 0' }
                            },
                            '& .MuiPickersDay-root': {
                              width: { xs: 28, sm: 36, md: 40 },
                              height: { xs: 28, sm: 36, md: 40 },
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              margin: '0',
                              '&.Mui-selected': {
                                backgroundColor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'primary.dark',
                                },
                              }
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Box>
                    {selectedReservation && showStepper && (
                      <Box sx={{ mt: 2 }}>
                        <ReservationStepper reserva={selectedReservation} />
                      </Box>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ width: '100%', mt: 3 }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Servicio</TableCell>
                              <TableCell>Fecha</TableCell>
                              <TableCell>Hora</TableCell>
                              <TableCell>Estado</TableCell>
                              <TableCell>Tipo de Vehículo</TableCell>
                              <TableCell>Atributos</TableCell>
                              <TableCell>Total</TableCell>
                              <TableCell>Acciones</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {reservas
                              .sort((a, b) => {
                                const field = sortCriteria.field.split('.');
                                let aValue = a;
                                let bValue = b;
                                
                                field.forEach(prop => {
                                  aValue = aValue[prop];
                                  bValue = bValue[prop];
                                });
                                
                                if (sortCriteria.direction === 'asc') {
                                  return aValue < bValue ? -1 : 1;
                                } else {
                                  return aValue > bValue ? -1 : 1;
                                }
                              })
                              .slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
                              .map((reserva) => (
                                <TableRow key={reserva.id}>
                                  <TableCell>{reserva.servicio.nombre_servicio}</TableCell>
                                  <TableCell>
                                    {(() => {
                                      // Crear una fecha UTC y ajustarla a la zona horaria local
                                      const fecha = new Date(reserva.fecha);
                                      fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
                                      return format(fecha, 'dd/MM/yyyy');
                                    })()}
                                  </TableCell>
                                  <TableCell>{reserva.hora}</TableCell>
                                  <TableCell>
                                    <Box
                                      sx={{
                                        backgroundColor: getEstadoColor(reserva.estado.nombre),
                                        color: '#000000',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        display: 'inline-block',
                                        fontWeight: 'bold'
                                      }}
                                    >
                                      {reserva.estado.nombre}
                                    </Box>
                                  </TableCell>
                                  <TableCell>{reserva.tipo_vehiculo.nombre}</TableCell>
                                  <TableCell>
                                    {reserva.atributos && reserva.atributos.map((atributo, index) => (
                                      <Chip
                                        key={atributo.id}
                                        label={atributo.nombre_atributo || atributo.nombre}
                                        size="small"
                                        sx={{ mr: 0.5, mb: 0.5 }}
                                      />
                                    ))}
                                  </TableCell>
                                  <TableCell>
                                    {reserva.Total ? `$${new Intl.NumberFormat('es-CL').format(reserva.Total)}` : '$0'}
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                      {reserva.estado.nombre === 'Recalendarizado' && (
                                        <Button
                                          variant="contained"
                                          color="success"
                                          size="small"
                                          onClick={() => router.push(`/aceptarFecha?reservas_id=${reserva.id}`)}
                                          startIcon={<CheckCircleIcon />}
                                        >
                                          Aprobar
                                        </Button>
                                      )}
                                      <IconButton
                                        color="primary"
                                        onClick={() => handleEditReservation(reserva)}
                                        disabled={!canEditReservation(reserva)}
                                      >
                                        <EditIcon />
                                      </IconButton>
                                      <IconButton
                                        color="error"
                                        onClick={() => handleDeleteReservation(reserva.id)}
                                        disabled={!canEditReservation(reserva)}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={reservas.length}
                        rowsPerPage={rowsPerPage}
                        page={currentPage}
                        onPageChange={(event, newPage) => setCurrentPage(newPage)}
                        onRowsPerPageChange={(event) => {
                          setRowsPerPage(parseInt(event.target.value, 10));
                          setCurrentPage(0);
                        }}
                        labelDisplayedRows={({ from, to, count }) =>
                          `${from}-${to} de ${count}`
                        }
                        labelRowsPerPage="Filas por página:"
                      />
                    </Paper>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} md={8} lg={6}>
                  <Paper
                    sx={{
                      p: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      sx={{
                        m: 1,
                        bgcolor: 'primary.main',
                        width: 80,
                        height: 80,
                        fontSize: '2rem',
                      }}
                    >
                      {user.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
                      Mi Perfil
                    </Typography>
                    {!showEditProfile ? (
                      <>
                        <Box sx={{ mt: 3, width: '100%' }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography variant="subtitle1" color="text.secondary">
                                Nombre de Usuario
                              </Typography>
                              <Typography variant="h6">{user.username}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="subtitle1" color="text.secondary">
                                Correo Electrónico
                              </Typography>
                              <Typography variant="h6">{user.email}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="subtitle1" color="text.secondary">
                                Número de Teléfono
                              </Typography>
                              <Typography variant="h6">{user.numero || 'No especificado'}</Typography>
                            </Grid>
                          </Grid>
                          <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3 }}
                            onClick={() => setShowEditProfile(true)}
                          >
                            Editar Perfil
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box component="form" sx={{ mt: 3, width: '100%' }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Nombre de Usuario"
                                value={user.username}
                                onChange={(e) => setUser({ ...user, username: e.target.value })}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Correo Electrónico"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Número de Teléfono"
                                value={user.numero || ''}
                                onChange={(e) => setUser({ ...user, numero: e.target.value })}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                type="password"
                                label="Nueva Contraseña (opcional)"
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                              />
                            </Grid>
                          </Grid>
                          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <Button
                              fullWidth
                              variant="outlined"
                              onClick={() => setShowEditProfile(false)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={handleUpdateProfile}
                            >
                              Guardar Cambios
                            </Button>
                          </Box>
                        </Box>
                      </>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Container>
        </Box>
      </Box>

      {/* Formulario de Nueva Reserva */}
      <Dialog
        open={showForm && !editing}
        onClose={handleCloseNewReservation}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Nueva Reserva</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Servicio</InputLabel>
                <Select
                  name="servicio_id"
                  value={reservation.servicio_id}
                  onChange={handleChange}
                  label="Servicio"
                >
                  {servicios.map((servicio) => (
                    <MenuItem key={servicio.id} value={servicio.id}>
                      {servicio.nombre_servicio}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Vehículo</InputLabel>
                <Select
                  name="tipo_vehiculo_id"
                  value={reservation.tipo_vehiculo_id}
                  onChange={handleChange}
                  label="Tipo de Vehículo"
                >
                  {tipo_vehiculos.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="atributos-label">Servicios Extra</InputLabel>
                <Select
                  labelId="atributos-label"
                  id="atributos"
                  multiple
                  value={selectedAtributos}
                  onChange={handleAtributoToggle}
                  label="Servicios Extra"
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return "Ninguno seleccionado";
                    }
                    return selected
                      .map((id) => {
                        const atributo = atributos.find((a) => a.id === id);
                        return atributo ? `${atributo.nombre_atributo || atributo.nombre} - $${new Intl.NumberFormat('es-CL').format(atributo.costo_atributo)}` : '';
                      })
                      .filter(Boolean)
                      .join(", ");
                  }}
                >
                  {getAtributosFiltrados(reservation.tipo_vehiculo_id).map((atributo) => (
                    <MenuItem key={atributo.id} value={atributo.id}>
                      {atributo.nombre_atributo || atributo.nombre} - ${new Intl.NumberFormat('es-CL').format(atributo.costo_atributo)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="fecha"
                label="Fecha"
                value={reservation.fecha}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Hora</InputLabel>
                <Select
                  name="hora"
                  value={reservation.hora}
                  onChange={handleTimeChange}
                  label="Hora"
                >
                  {generarHorasDisponibles().map((hora) => (
                    <MenuItem key={hora} value={hora}>
                      {hora}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {(reservation.servicio_id || reservation.tipo_vehiculo_id || reservation.fecha || reservation.hora || selectedAtributos.length > 0) && (
              <Grid item xs={12}>
                <ReservationSummary
                  reservation={reservation}
                  total={total}
                  servicios={servicios}
                  tipo_vehiculos={tipo_vehiculos}
                  atributos={atributos}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewReservation}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Crear Reserva
          </Button>
        </DialogActions>
      </Dialog>

      {/* Formulario de Editar Reserva */}
      <Dialog
        open={editing}
        onClose={handleCloseEditReservation}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar Reserva</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Servicio</InputLabel>
                <Select
                  name="servicio_id"
                  value={reservation.servicio_id}
                  onChange={handleChange}
                  label="Servicio"
                >
                  {servicios.map((servicio) => (
                    <MenuItem key={servicio.id} value={servicio.id}>
                      {servicio.nombre_servicio}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Vehículo</InputLabel>
                <Select
                  name="tipo_vehiculo_id"
                  value={reservation.tipo_vehiculo_id}
                  onChange={handleChange}
                  label="Tipo de Vehículo"
                >
                  {tipo_vehiculos.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="atributos-label">Servicios Extra</InputLabel>
                <Select
                  labelId="atributos-label"
                  id="atributos"
                  multiple
                  value={selectedAtributos}
                  onChange={handleAtributoToggle}
                  label="Servicios Extra"
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return "Ninguno seleccionado";
                    }
                    return selected
                      .map((id) => {
                        const atributo = atributos.find((a) => a.id === id);
                        return atributo ? `${atributo.nombre_atributo || atributo.nombre} - $${new Intl.NumberFormat('es-CL').format(atributo.costo_atributo)}` : '';
                      })
                      .filter(Boolean)
                      .join(", ");
                  }}
                >
                  {getAtributosFiltrados(reservation.tipo_vehiculo_id).map((atributo) => (
                    <MenuItem key={atributo.id} value={atributo.id}>
                      {atributo.nombre_atributo || atributo.nombre} - ${new Intl.NumberFormat('es-CL').format(atributo.costo_atributo)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="fecha"
                label="Fecha"
                value={reservation.fecha}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Hora</InputLabel>
                <Select
                  name="hora"
                  value={reservation.hora}
                  onChange={handleTimeChange}
                  label="Hora"
                >
                  {generarHorasDisponibles().map((hora) => (
                    <MenuItem key={hora} value={hora}>
                      {hora}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {(reservation.servicio_id || reservation.tipo_vehiculo_id || reservation.fecha || reservation.hora || selectedAtributos.length > 0) && (
              <Grid item xs={12}>
                <ReservationSummary
                  reservation={reservation}
                  total={total}
                  servicios={servicios}
                  tipo_vehiculos={tipo_vehiculos}
                  atributos={atributos}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditReservation}>Cancelar</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Actualizar Reserva
          </Button>
        </DialogActions>
      </Dialog>

      <ReservationSelector />
    </ThemeProvider>
  );
}