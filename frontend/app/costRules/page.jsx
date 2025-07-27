'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Snackbar,
  Alert,
  Typography,
  Box,
  Container,
  Tooltip,
  Divider
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';

export default function CostRules() {
  const router = useRouter();
  const cookies = parseCookies();
  const token = cookies.token;

  const [costRules, setCostRules] = useState([]);
  const [services, setServices] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    servicio_id: '',
    tipo_vehiculo_id: '',
    costo_adicional: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (!token) {
      router.push('/loginAdmin');
      return;
    }
    fetchCostRules();
    fetchServices();
    fetchVehicleTypes();
  }, []);

  const fetchCostRules = async () => {
    try {
      const response = await axios.get('https://fullwash.online/cost-rules', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCostRules(response.data.data);
    } catch (error) {
      showSnackbar('Error al cargar las reglas de costo', 'error');
      if (error.response?.status === 401) {
        router.push('/loginAdmin');
      }
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('https://fullwash.online/servicios', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setServices(response.data.data);
    } catch (error) {
      showSnackbar('Error al cargar los servicios', 'error');
      if (error.response?.status === 401) {
        router.push('/loginAdmin');
      }
    }
  };

  const fetchVehicleTypes = async () => {
    try {
      const response = await axios.get('https://fullwash.online/tipo_vehiculos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setVehicleTypes(response.data);
    } catch (error) {
      showSnackbar('Error al cargar los tipos de vehículos', 'error');
      if (error.response?.status === 401) {
        router.push('/loginAdmin');
      }
    }
  };

  const showModal = (record = null) => {
    if (record) {
      setEditingId(record.id);
      setFormData({
        servicio_id: record.servicio_id,
        tipo_vehiculo_id: record.tipo_vehiculo_id,
        costo_adicional: record.costo_adicional,
      });
    } else {
      setEditingId(null);
      setFormData({
        servicio_id: '',
        tipo_vehiculo_id: '',
        costo_adicional: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`https://fullwash.online/cost-rules/${editingId}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        showSnackbar('Regla de costo actualizada exitosamente', 'success');
      } else {
        await axios.post('https://fullwash.online/cost-rules', formData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        showSnackbar('Regla de costo creada exitosamente', 'success');
      }
      handleClose();
      fetchCostRules();
    } catch (error) {
      showSnackbar('Error al guardar la regla de costo', 'error');
      if (error.response?.status === 401) {
        router.push('/loginAdmin');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://fullwash.online/cost-rules/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      showSnackbar('Regla de costo eliminada exitosamente', 'success');
      fetchCostRules();
    } catch (error) {
      showSnackbar('Error al eliminar la regla de costo', 'error');
      if (error.response?.status === 401) {
        router.push('/loginAdmin');
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/dashboardAdmin')}
            variant="contained"
            sx={{ backgroundColor: '#1a237e' }}
          >
            Volver al Dashboard
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => showModal()}
            sx={{ backgroundColor: '#1a237e' }}
          >
            Agregar Regla de Costo
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Servicio</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo de Vehículo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Costo Base</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Costo Adicional</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Costo Total</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {costRules.map((rule, index) => {
                const costoBase = (rule.servicio?.precio || 0) + (rule.tipoVehiculo?.costo || 0);
                const costoTotal = costoBase + rule.costo_adicional;
                return (
                  <TableRow 
                    key={rule.id}
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                      '&:hover': { backgroundColor: 'action.selected' }
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>{rule.servicio?.nombre_servicio}</TableCell>
                    <TableCell>{rule.tipoVehiculo?.nombre}</TableCell>
                    <TableCell>
                      <Typography>
                        ${costoBase.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        (Servicio: ${rule.servicio?.precio.toLocaleString()} + Vehículo: ${rule.tipoVehiculo?.costo.toLocaleString()})
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        sx={{ 
                          color: rule.costo_adicional >= 0 ? 'success.main' : 'error.main',
                          fontWeight: 'medium'
                        }}
                      >
                        ${rule.costo_adicional.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        sx={{ 
                          fontWeight: 'bold',
                          color: 'primary.main'
                        }}
                      >
                        ${costoTotal.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Editar regla">
                        <IconButton 
                          onClick={() => showModal(rule)} 
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar regla">
                        <IconButton 
                          onClick={() => handleDelete(rule.id)} 
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Dialog 
        open={isModalOpen} 
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: '400px'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: 'primary.main',
          color: 'white'
        }}>
          {editingId ? "Editar Regla de Costo" : "Nueva Regla de Costo"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Servicio</InputLabel>
            <Select
              name="servicio_id"
              value={formData.servicio_id}
              onChange={handleInputChange}
              label="Servicio"
            >
              {services.map(service => (
                <MenuItem key={service.id} value={service.id}>
                  {service.nombre_servicio} - ${service.precio.toLocaleString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tipo de Vehículo</InputLabel>
            <Select
              name="tipo_vehiculo_id"
              value={formData.tipo_vehiculo_id}
              onChange={handleInputChange}
              label="Tipo de Vehículo"
            >
              {vehicleTypes.map(type => (
                <MenuItem key={type.id} value={type.id}>
                  {type.nombre} {type.costo > 0 ? `- $${type.costo.toLocaleString()}` : '(Sin costo adicional)'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Costo Adicional"
            type="number"
            name="costo_adicional"
            value={formData.costo_adicional}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
            }}
            sx={{ mb: 2 }}
          />

          {formData.servicio_id && formData.tipo_vehiculo_id && (
            <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Resumen de Costos
              </Typography>
              {(() => {
                const selectedService = services.find(s => s.id === parseInt(formData.servicio_id));
                const selectedVehicle = vehicleTypes.find(v => v.id === parseInt(formData.tipo_vehiculo_id));
                const costoBase = (selectedService?.precio || 0) + (selectedVehicle?.costo || 0);
                const costoAdicional = parseFloat(formData.costo_adicional) || 0;
                const costoTotal = costoBase + costoAdicional;

                return (
                  <>
                    <Typography variant="body2">
                      Costo del Servicio: ${selectedService?.precio.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      Costo del Vehículo: {selectedVehicle?.costo > 0 ? `$${selectedVehicle.costo.toLocaleString()}` : 'Sin costo adicional'}
                    </Typography>
                    <Typography variant="body2">
                      Costo Adicional: ${costoAdicional.toLocaleString()}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                      Costo Total: ${costoTotal.toLocaleString()}
                    </Typography>
                  </>
                );
              })()}
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={handleClose}
            sx={{ 
              textTransform: 'none',
              color: 'text.secondary'
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ 
              textTransform: 'none',
              px: 3
            }}
          >
            {editingId ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Footer />
    </Box>
  );
}
