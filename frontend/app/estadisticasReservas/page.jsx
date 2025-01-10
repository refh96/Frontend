'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ArrowBack, PictureAsPdf, Print, CalendarMonth } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const EstadisticasReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState('');
  const router = useRouter();
  const reportRef = useRef(null);

  useEffect(() => {
    const verificarAcceso = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;

        if (!token) {
          Swal.fire({
            title: 'Acceso Denegado',
            text: 'Debes iniciar sesión para ver las estadísticas',
            icon: 'error',
            confirmButtonText: 'Ir al Login'
          }).then(() => {
            router.push('/loginAdmin');
          });
          return;
        }

        try {
          const profileRes = await axios.post(
            "https://fullwash.site/profile",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (profileRes.data.user.rol !== "administrador") {
            Swal.fire({
              title: 'Acceso Restringido',
              text: 'Solo los administradores pueden ver las estadísticas',
              icon: 'warning',
              confirmButtonText: 'Entendido'
            }).then(() => {
              router.push('/');
            });
            return;
          }

          const response = await axios.get('https://fullwash.site/reservas', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.res) {
            setReservas(response.data.reservas);
            // Obtener el mes actual de la primera reserva
            if (response.data.reservas.length > 0) {
              const [año, mes] = response.data.reservas[0].fecha.split('T')[0].split('-');
              const mesActual = `${año}-${mes}`;
              setMesSeleccionado(mesActual);
            }
          } else {
            setError('No se pudieron cargar las estadísticas de reservas');
          }
        } catch (authError) {
          console.error('Error al verificar autenticación:', authError);
          Swal.fire({
            title: 'Error de Autenticación',
            text: 'Por favor, inicie sesión nuevamente',
            icon: 'error',
            confirmButtonText: 'Ir al Login'
          }).then(() => {
            router.push('/loginAdmin');
          });
        }
      } catch (error) {
        console.error('Error general:', error);
        setError('Error al acceder a las estadísticas de reservas');
      } finally {
        setLoading(false);
      }
    };

    verificarAcceso();
  }, [router]);

  // Función para obtener los meses disponibles
  const obtenerMesesDisponibles = () => {
    const meses = new Set();
    reservas.forEach(reserva => {
      const [año, mes] = reserva.fecha.split('T')[0].split('-');
      const mesAno = `${año}-${mes}`;
      meses.add(mesAno);
    });
    return Array.from(meses).sort();
  };

  // Función para filtrar reservas por mes
  const filtrarReservasPorMes = (mes) => {
    return reservas.filter(reserva => {
      const [año, mesReserva] = reserva.fecha.split('T')[0].split('-');
      const mesAnoReserva = `${año}-${mesReserva}`;
      return mesAnoReserva === mes;
    });
  };

  // Función para calcular métricas del mes seleccionado
  const calcularMetricasMensuales = () => {
    const reservasMes = filtrarReservasPorMes(mesSeleccionado);
    const ingresoTotal = reservasMes.reduce((sum, reserva) => sum + reserva.Total, 0);
    const serviciosUnicos = new Set(reservasMes.map(r => r.servicio.nombre_servicio));
    const clientesUnicos = new Set(reservasMes.map(r => r.user.id));
    const promedioIngreso = reservasMes.length > 0 ? ingresoTotal / reservasMes.length : 0;

    return {
      cantidadReservas: reservasMes.length,
      ingresoTotal,
      promedioIngreso,
      serviciosUnicos: serviciosUnicos.size,
      clientesUnicos: clientesUnicos.size,
      reservasPorEstado: calcularReservasPorEstado(reservasMes),
      serviciosMasPopulares: calcularServiciosMasPopulares(reservasMes),
      reservasPorDia: calcularReservasPorDia(reservasMes)
    };
  };

  // Función para calcular reservas por estado
  const calcularReservasPorEstado = (reservasFiltradas) => {
    const estados = {};
    reservasFiltradas.forEach(reserva => {
      const estado = reserva.estado.nombre;
      estados[estado] = (estados[estado] || 0) + 1;
    });
    return estados;
  };

  // Función para calcular servicios más populares
  const calcularServiciosMasPopulares = (reservasFiltradas) => {
    const servicios = {};
    reservasFiltradas.forEach(reserva => {
      const servicio = reserva.servicio.nombre_servicio;
      servicios[servicio] = (servicios[servicio] || 0) + 1;
    });
    return Object.entries(servicios)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  // Función para calcular la distribución de reservas por día
  const calcularReservasPorDia = (reservasFiltradas) => {
    const reservasPorDia = {};
    
    reservasFiltradas.forEach(reserva => {
      // Usar la fecha de la reserva, no la fecha de creación
      const fecha = new Date(reserva.fecha);
      const dia = fecha.getUTCDate(); // Usar getUTCDate para evitar problemas de zona horaria
      reservasPorDia[dia] = (reservasPorDia[dia] || 0) + 1;
    });

    // Crear array con todos los días del mes
    const fechaBase = new Date(reservasFiltradas[0].fecha);
    const ultimoDia = new Date(
      fechaBase.getUTCFullYear(),
      fechaBase.getUTCMonth() + 1,
      0
    ).getDate();

    const distribucionCompleta = {};
    for (let i = 1; i <= ultimoDia; i++) {
      distribucionCompleta[i] = reservasPorDia[i] || 0;
    }

    return distribucionCompleta;
  };

  // Función para exportar a PDF
  const exportarPDF = async () => {
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Obtener la fecha actual formateada
      const fecha = new Date().toLocaleDateString('es-ES');
      const nombreArchivo = `Reporte_Reservas_${mesSeleccionado}_${fecha}.pdf`;
      
      pdf.save(nombreArchivo);
      
      Swal.fire({
        title: '¡Éxito!',
        text: 'El reporte se ha exportado correctamente',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo exportar el reporte',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6">Cargando estadísticas...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  const metricas = mesSeleccionado ? calcularMetricasMensuales() : null;

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ backgroundColor: '#f5f5f5' }}>
      <Box sx={{ 
        flexGrow: 1, 
        p: 3, 
        maxWidth: 1400, 
        mx: 'auto',
        width: '100%'
      }}>
        {/* Cabecera y Controles */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Button
            variant="contained"
            onClick={() => router.push('./dashboardAdmin')}
            startIcon={<ArrowBack />}
            sx={{
              backgroundColor: 'darkorange',
              '&:hover': {
                backgroundColor: '#ff8c00',
              }
            }}
          >
            Volver al Dashboard
          </Button>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Seleccionar Mes</InputLabel>
              <Select
                value={mesSeleccionado}
                label="Seleccionar Mes"
                onChange={(e) => setMesSeleccionado(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'darkorange',
                  },
                }}
              >
                {obtenerMesesDisponibles().map((mes) => {
                  const [año, mesNum] = mes.split('-');
                  const fecha = new Date(parseInt(año), parseInt(mesNum) - 1, 1);
                  return (
                    <MenuItem key={mes} value={mes}>
                      {fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <Tooltip title="Exportar a PDF">
              <IconButton 
                onClick={exportarPDF}
                sx={{ 
                  color: 'darkorange',
                  '&:hover': { backgroundColor: 'rgba(255, 140, 0, 0.1)' }
                }}
              >
                <PictureAsPdf />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Contenido del Reporte */}
        <Box ref={reportRef}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 4, 
              color: 'darkorange',
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            Reporte de Reservas - {mesSeleccionado ? 
              (() => {
                const [año, mesNum] = mesSeleccionado.split('-');
                const fecha = new Date(parseInt(año), parseInt(mesNum) - 1, 1);
                return fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
              })() : 
              'Seleccione un mes'}
          </Typography>

          {metricas && (
            <Grid container spacing={3}>
              {/* Métricas Principales */}
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ color: 'darkorange' }}>
                        Reservas del Mes
                      </Typography>
                      <Typography variant="h4">
                        {metricas.cantidadReservas}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ color: 'darkorange' }}>
                        Ingresos del Mes
                      </Typography>
                      <Typography variant="h4">
                        ${metricas.ingresoTotal.toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ color: 'darkorange' }}>
                        Clientes Únicos
                      </Typography>
                      <Typography variant="h4">
                        {metricas.clientesUnicos}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ color: 'darkorange' }}>
                        Promedio por Reserva
                      </Typography>
                      <Typography variant="h4">
                        ${Math.round(metricas.promedioIngreso).toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>

              {/* Tabla de Servicios Más Populares */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'darkorange' }}>
                    Servicios Más Solicitados
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Servicio</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Cantidad</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {metricas.serviciosMasPopulares.map(([servicio, cantidad]) => (
                          <TableRow key={servicio}>
                            <TableCell>{servicio}</TableCell>
                            <TableCell>{cantidad}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              {/* Distribución por Estado */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'darkorange' }}>
                    Estado de las Reservas
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Estado</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Cantidad</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(metricas.reservasPorEstado).map(([estado, cantidad]) => (
                          <TableRow key={estado}>
                            <TableCell>{estado}</TableCell>
                            <TableCell>{cantidad}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              {/* Distribución por Día */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'darkorange' }}>
                    Distribución de Reservas por Día del Mes
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar
                      data={{
                        labels: Object.keys(metricas.reservasPorDia).map(dia => `Día ${dia}`),
                        datasets: [{
                          label: 'Cantidad de Reservas',
                          data: Object.values(metricas.reservasPorDia),
                          backgroundColor: 'rgba(255, 140, 0, 0.6)',
                          borderColor: 'rgb(255, 140, 0)',
                          borderWidth: 1,
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1
                            },
                            title: {
                              display: true,
                              text: 'Cantidad de Reservas'
                            }
                          },
                          x: {
                            title: {
                              display: true,
                              text: 'Día del Mes'
                            }
                          }
                        },
                        plugins: {
                          tooltip: {
                            callbacks: {
                              title: (items) => {
                                if (!items.length) return '';
                                const dia = items[0].label.split(' ')[1];
                                return `Día ${dia}`;
                              },
                              label: (item) => {
                                return `${item.formattedValue} reserva${item.formattedValue !== '1' ? 's' : ''}`;
                              }
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EstadisticasReservas;
